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
import { caesar, vigenere } from '@jabez007/cryptotron.js'
import CipherOutput from '@/components/CipherOutput.vue'

const isReady = ref(false)

const nodes = ref<Node[]>([])

const edges = ref<Edge[]>([])

const {
  addEdges,
  getEdges,
  getNodes,
  onConnect,
  onEdgeDoubleClick,
  onEdgeUpdate,
  onNodeClick,
  removeEdges,
  updateEdge,
} = useVueFlow()

onMounted(() => {
  setTimeout(async () => {
    nodes.value.push(
      ...[
        {
          id: '1',
          label: 'Caesar',
          data: {
            encryptAlgorithm: caesar.encrypt,
            decryptAlgorithm: caesar.decrypt,
            cipherKey: { shift: 3 },
          },
          position: { x: 250, y: 5 },
        },
        {
          id: '2',
          label: 'Vigenère',
          data: {
            encryptAlgorithm: vigenere.encrypt,
            decryptAlgorithm: vigenere.decrypt,
            cipherKey: { keyword: 'foobar' },
          },
          position: { x: 100, y: 100 },
        },
        { id: '3', label: 'Node 3', position: { x: 400, y: 100 } },
        { id: '4', label: 'Node 4', position: { x: 400, y: 200 } },
      ],
    )
    edges.value.push(
      ...[
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          updatable: true,
          animated: true,
          markerEnd: MarkerType.Arrow,
        },
      ],
    )
    await nextTick()
    isReady.value = true
  }, 100)
})

onNodeClick(({ event, node }) => {
  console.debug('On Node Click', event, node)
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

onEdgeDoubleClick(({ edge, event }) => {
  console.debug('One Edge Double Click', event, edge)
  removeEdges(edge)
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
</style>
