<script setup lang="ts">
import { onMounted, nextTick, ref } from 'vue'
import {
  MarkerType,
  useVueFlow,
  VueFlow,
  type Connection,
  type Edge,
  type Node,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { availableCiphers, defaultEdges, defaultNodes } from '@/components/builder/constants'
import AddNodeModal from '@/components/builder/ModalAddNode.vue'
import EditNodeModal from '@/components/builder/ModalEditNode.vue'
import CipherOutput from '@/components/CipherOutput.vue'

const isReady = ref(false)

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

const {
  addEdges,
  addNodes,
  fitView,
  getEdges,
  getNodes,
  onConnect,
  onEdgeDoubleClick,
  onEdgeUpdate,
  onNodeClick,
  onNodeDoubleClick,
  removeEdges,
  removeNodes,
  updateEdge,
  updateNodeData,
} = useVueFlow()

onMounted(() => {
  setTimeout(async () => {
    nodes.value.push(...defaultNodes)
    edges.value.push(...defaultEdges)
    await nextTick()
    isReady.value = true
  }, 100)
})

const showAddNodeModal = ref(false)
const newNodeData = ref({
  label: '',
  type: 'caesar',
})

// Add node modal functions
const openAddNodeModal = () => {
  newNodeData.value = {
    label: '',
    type: 'caesar',
  }
  showAddNodeModal.value = true
}

const closeAddNodeModal = () => {
  showAddNodeModal.value = false
  newNodeData.value = {
    label: '',
    type: 'caesar',
  }
}

const handleAddNode = (nodeData: { label: string; type: string }) => {
  const selectedCipher = availableCiphers.find((c) => c.type === nodeData.type)
  if (!selectedCipher) return

  const nodeId = `node-${Date.now()}`
  const label = nodeData.label || selectedCipher.label

  const existingNodes = getNodes.value
  const maxY = existingNodes.length > 0 ? Math.max(...existingNodes.map((n) => n.position.y)) : 0

  const newNode = {
    id: nodeId,
    label,
    data: {
      encryptAlgorithm: selectedCipher.encryptAlgorithm,
      decryptAlgorithm: selectedCipher.decryptAlgorithm,
      cipherKey: { ...selectedCipher.defaultKey },
      cipherKeyComponent: selectedCipher.cipherKeyComponent,
    },
    position: {
      x: 50 + (existingNodes.length % 4) * 150,
      y: maxY + 120,
    },
  }

  addNodes([newNode])
  setTimeout(async () => {
    await nextTick()
    fitView()
  }, 100)
  // closeAddNodeModal()
}

const showNodeModal = ref(false)
const selectedNode = ref<Node | null>(null)

// Modal key editing functionality
const openNodeModal = (node: Node) => {
  selectedNode.value = { ...node }
  setTimeout(async () => {
    await nextTick()
    showNodeModal.value = true
  }, 20)
}

const closeNodeModal = () => {
  showNodeModal.value = false
  selectedNode.value = null
}

const handleUpdateNode = () => {
  if (selectedNode.value) {
    updateNodeData(selectedNode.value.id, {
      data: selectedNode.value.data,
    })
    // closeNodeModal()
  }
}

let clickTimeout: ReturnType<typeof setTimeout> | null = null

onNodeClick(({ event, node }) => {
  console.debug('On Node Click', event, node)

  // Clear any existing timeout
  if (clickTimeout) {
    clearTimeout(clickTimeout)
    clickTimeout = null
  }

  // Only open modal for nodes with cipher data
  if (node.data && (node.data.encryptAlgorithm || node.data.decryptAlgorithm)) {
    clickTimeout = setTimeout(() => {
      openNodeModal(node)
      clickTimeout = null
    }, 200) // 200ms delay to allow double-click detection
  }
})

onNodeDoubleClick(({ event, node }) => {
  console.debug('On Node Double-Click', event, node)

  // Clear the single-click timeout since we have a double-click
  if (clickTimeout) {
    clearTimeout(clickTimeout)
    clickTimeout = null
  }

  removeNodes(node)
  setTimeout(async () => {
    await nextTick()
    fitView()
  }, 100)
})

/*
 * The Union-Find structure keeps track of connected components.
 */
class UnionFind {
  private parent: Record<string, string>
  private rank: Record<string, number>
  private nodes: Set<string>

  constructor() {
    this.parent = {}
    this.rank = {}
    this.nodes = new Set()
  }

  makeSet(x: string): void {
    if (!this.nodes.has(x)) {
      this.parent[x] = x
      this.rank[x] = 0
      this.nodes.add(x)
    }
  }

  find(x: string): string {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]) // Path compression
    }
    return this.parent[x]
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x)
    const rootY = this.find(y)

    if (rootX === rootY) {
      return false // Already in the same set
    }

    // Union by rank
    if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX
    } else if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY
    } else {
      this.parent[rootY] = rootX
      this.rank[rootX]++
    }
    return true
  }

  // New method to find root nodes
  getRootNodes(): string[] {
    const roots = new Set<string>()
    for (const node of this.nodes) {
      roots.add(this.find(node))
    }
    return Array.from(roots)
  }
}

const validateNewEdge = (
  existingEdges: Edge[],
  newEdge: Connection,
  oldEdge: Partial<Edge> = { source: '', target: '' },
): boolean => {
  console.debug('Validating new edge', newEdge, oldEdge)
  /* */
  if (existingEdges.some((e) => e.source === newEdge.source)) {
    if (oldEdge.source !== newEdge.source) {
      console.warn(`Node ${newEdge.source} already has an edge from it`)
      return false
    }
  }
  if (existingEdges.some((e) => e.target === newEdge.target)) {
    if (oldEdge.target !== newEdge.target) {
      console.warn(`Node ${newEdge.target} already has an edge to it`)
      return false
    }
  }
  /* */
  function willCreateCycle(edges: Edge[], newEdge: Connection): boolean {
    const uf = new UnionFind()

    // Add all nodes to the Union-Find structure
    for (const edge of edges) {
      uf.makeSet(edge.source)
      uf.makeSet(edge.target)
    }
    uf.makeSet(newEdge.source)
    uf.makeSet(newEdge.target)

    // Union existing edges
    for (const edge of edges) {
      uf.union(edge.source, edge.target)
    }

    // Check if the new edge connects already connected components
    return uf.find(newEdge.source) === uf.find(newEdge.target)
  }

  if (willCreateCycle(existingEdges, newEdge)) {
    console.warn(`Connecting Node ${newEdge.source} to Node ${newEdge.target} will create a loop`)
    return false
  }
  /* */
  return true
}

onConnect((connection) => {
  console.debug('On Connect', connection)
  /* */
  const existing = getEdges.value
  console.debug('Existing edges', existing)
  if (!validateNewEdge(existing, connection)) {
    return
  }
  /* */
  addEdges({
    ...connection,
    updatable: true,
    animated: true,
    markerEnd: MarkerType.Arrow,
  })
})

onEdgeUpdate(({ connection, edge }) => {
  console.debug('On Edge Update', connection, edge)
  /* */
  const existing = getEdges.value
  console.debug('Existing edges', existing)
  if (!validateNewEdge(existing, connection, edge)) {
    return
  }
  /* */
  updateEdge(edge, connection)
})

onEdgeDoubleClick(({ edge, event }) => {
  console.debug('One Edge Double-Click', event, edge)
  removeEdges(edge)
})

/* */
const inputText = ref('')
const outputText = ref('')

const clear = () => {
  inputText.value = ''
  outputText.value = ''
}

class GraphAnalyzer {
  private unionFind = new UnionFind()
  private adjacencyList: Record<string, string[]> = {}
  private rootNodes: string[] = []

  constructor(edges: Edge[]) {
    // Build adjacency list and union find structure
    for (const edge of edges) {
      this.unionFind.makeSet(edge.source)
      this.unionFind.makeSet(edge.target)
      this.unionFind.union(edge.source, edge.target)

      if (!this.adjacencyList[edge.source]) {
        this.adjacencyList[edge.source] = []
      }
      this.adjacencyList[edge.source].push(edge.target)

      // For undirected graph, add reverse connection
      if (!this.adjacencyList[edge.target]) {
        this.adjacencyList[edge.target] = []
      }
      this.adjacencyList[edge.target].push(edge.source)
    }

    this.rootNodes = this.unionFind.getRootNodes()
  }

  getRootNodes(): string[] {
    return this.rootNodes
  }

  getConnectedNodes(root?: string): string[] {
    const startNode = root || this.rootNodes[0]
    if (!startNode) return []

    const visited = new Set<string>()
    const result: string[] = []

    // Depth-First Search to traverse connections
    const dfs = (node: string) => {
      visited.add(node)
      result.push(node)

      for (const neighbor of this.adjacencyList[node] || []) {
        if (!visited.has(neighbor)) {
          dfs(neighbor)
        }
      }
    }

    dfs(startNode)
    return result
  }

  getAllConnectedComponents(): string[][] {
    return this.rootNodes.map((root) => this.getConnectedNodes(root))
  }
}

const getTraversedNodedata = () => {
  const currentEdges = getEdges.value
  const currentNodes = getNodes.value
  console.debug('Current edges', currentEdges)
  console.debug('Current nodes', currentNodes)

  const graph = new GraphAnalyzer(currentEdges)
  console.log('Found root nodes', graph.getRootNodes())

  if (graph.getRootNodes().length > 1) {
    console.warn('More than 1 root node found')
    return
  }
  if (graph.getRootNodes().length < 1) {
    console.warn('No root node found')
    return
  }

  const traversal = graph.getConnectedNodes()
  console.debug('Encryption traversal', traversal)

  const traversedNodeData = traversal.map((id) => currentNodes.find((node) => node.id === id)?.data)
  console.debug('Traversed node data', traversedNodeData)

  return traversedNodeData
}

const encrypt = () => {
  console.debug('Encrypting message')

  const encryptionData = getTraversedNodedata()

  if (encryptionData) {
    outputText.value = encryptionData.reduce(
      (acc, curr) => curr.encryptAlgorithm(curr.cipherKey)(acc),
      inputText.value,
    )
  }
}

const decrypt = () => {
  console.debug('Decrypting message')

  const decryptionData = getTraversedNodedata()

  if (decryptionData) {
    outputText.value = decryptionData.reduceRight(
      (acc, curr) => curr.decryptAlgorithm(curr.cipherKey)(acc),
      inputText.value,
    )
  }
}
</script>

<template>
  <div class="builder-container">
    <VueFlow v-if="isReady" class="dark basic-flow" :nodes="nodes" :edges="edges" :connection-radius="53"
      :edge-updater-radius="23" fit-view-on-init>
      <Background />
      <Controls position="top-left"></Controls>

      <!-- Floating Add Node Button -->
      <div class="add-node-button" @click="openAddNodeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
    </VueFlow>

    <div class="cipher-practice">
      <h2 class="section-title">Encrypt/Decrypt Messages</h2>
      <div class="control-group">
        <slot name="cipherKey"></slot>
      </div>

      <div class="control-group">
        <label class="control-label">Input Text:</label>
        <textarea class="cipher-textarea" v-model="inputText" placeholder="Enter text to encrypt/decrypt..."></textarea>
      </div>

      <div class="button-group">
        <button class="cipher-button" @click="encrypt">Encrypt</button>
        <button class="cipher-button" @click="decrypt">Decrypt</button>
        <button class="cipher-button" @click="clear">Clear</button>
      </div>

      <CipherOutput label="Output" :text="outputText" />
    </div>

    <AddNodeModal :isOpen="showAddNodeModal" @close="closeAddNodeModal" @add-node="handleAddNode" />

    <EditNodeModal v-if="selectedNode" :isOpen="showNodeModal" :node="selectedNode" @close="closeNodeModal"
      @update-node="handleUpdateNode" />
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';

.basic-flow.dark {
  background: var(--cryptotron-darker-bg);
  color: var(--cryptotron-text-primary);
}

/* nodes */
.basic-flow.dark .vue-flow__node {
  background: var(--cryptotron-dark-bg);
  color: var(--cryptotron-text-primary);
  box-sizing: border-box;
}

.basic-flow.dark .vue-flow__node.selected {
  background: var(--cryptotron-card-bg);
  border: 1px solid var(--cryptotron-border-glow);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* edges */
.basic-flow.dark .vue_flow__edge-textbg {
  fill: #292524;
}

.basic-flow.dark .vue-flow__edge-text {
  fill: #fffffb;
}

/* controls */
.basic-flow.dark .vue-flow__controls {
  border: none;
  border-radius: 12px;
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button {
  border: 1px solid var(--cryptotron-border-glow);
  background: #333;
  fill: var(--cryptotron-text-secondary);
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button:first-child {
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button:last-child {
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button:hover {
  background: #4d4d4d;
}
</style>

<style scoped>
@import '@/assets/cipher-card.css';

.builder-container {
  height: 100%;
  width: 100%;
}

.vue-flow {
  height: 33vh;
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 12px;
}

/* Add Node Button */
.add-node-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(74, 158, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  color: white;
  overflow: hidden;
}

.add-node-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(74, 158, 255, 0.4);
}

.add-node-button:active {
  transform: scale(0.95);
}

.add-node-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.add-node-button:hover::before {
  left: 100%;
}
</style>
