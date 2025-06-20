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
import {
  availableCiphers,
  cipherLookup,
  defaultEdges,
  defaultNodes,
} from '@/components/builder/constants'
import { willCreateCycle, GraphAnalyzer } from '@/components/builder/utils'
import AddNodeModal from '@/components/builder/ModalAddNode.vue'
import EditNodeModal from '@/components/builder/ModalEditNode.vue'
import SaveGraphModal from '@/components/builder/ModalSaveGraph.vue'
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
      label,
      type: nodeData.type,
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

// Save/Load functionality
const showSaveModal = ref(false)

const handleSaveGraph = (cipherName: string) => {
  console.debug('Handling "save-graph" event, received named for cipher', cipherName)

  const cipherGraph = {
    nodes: getNodes.value.map((n) => ({
      id: n.id,
      label: n.label ?? n.data.label,
      data: {
        label: n.data.label ?? n.label,
        type: n.data.type ?? 'foobar',
        cipherKey: { ...n.data.cipherKey },
      },
      position: { ...n.position },
    })),
    edges: getEdges.value.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  }
  console.debug('JSON of cipher graph', cipherGraph)

  // Convert JSON to string with pretty-printing (2-space indent)
  const cipherGraphStr = JSON.stringify(cipherGraph, null, 2)

  // Create a Blob with the JSON data
  const cipherGraphBlob = new Blob([cipherGraphStr], { type: 'application/json' })

  // Create a download link
  const url = URL.createObjectURL(cipherGraphBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${cipherName}.json`

  // Trigger the download
  document.body.appendChild(a)
  a.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 10)
}

const handleLoadGraph = (cipherFile: File) => {
  console.debug('Loading cipher graph from', cipherFile.name)

  // Validate file type using MIME type and extension
  const allowedMimeTypes = ['text/plain', 'application/json', 'text/json']
  const allowedTypes = ['.txt', '.json', '.cipher']
  const fileExtension = '.' + cipherFile.name.split('.').pop()?.toLowerCase()

  if (
    !allowedTypes.includes(fileExtension) ||
    (!allowedMimeTypes.includes(cipherFile.type) && cipherFile.type !== '')
  ) {
    console.error('Invalid file type. Only .txt, .json, and .cipher files are allowed.')
    alert('Invalid file type. Please select a .txt, .json, or .cipher file.')
    return
  }

  // Read and process file content
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    console.log('Cipher graph content:', content)
    try {
      const graphData: { nodes: Node[]; edges: Edge[] } = JSON.parse(content)
      // Validate the structure
      if (
        !graphData.nodes ||
        !Array.isArray(graphData.nodes) ||
        !graphData.edges ||
        !Array.isArray(graphData.edges)
      ) {
        throw new Error('Invalid graph structure')
      }
      /* Process cipher graph content here:
       * 1. Update node objects with functions and component
       *    - encryptAlgorithm
       *    - decryptAlgorithm
       *    - cipherKeyComponent
       * 2. Update edge objects
       *    - animated
       *    - updatable
       *    - arrow markerEnd
       * 3. Splice in to nodes and edges bindings
       */
      const enhancedNodes = graphData.nodes.map((node) => {
        const cipherData = cipherLookup.get(node.data.type)

        if (!cipherData) {
          console.warn(`Unknown cipher type: ${node.data.type}`)
          return node // Return original node if cipher type not found
        }

        return {
          ...node,
          data: {
            ...node.data,
            encryptAlgorithm: cipherData.encryptAlgorithm,
            decryptAlgorithm: cipherData.decryptAlgorithm,
            cipherKeyComponent: cipherData.cipherKeyComponent,
          },
        }
      })
      console.debug('Enhanced nodes from cipher file data', enhancedNodes)

      const enhancedEdges = graphData.edges.map((edge) => {
        return {
          ...edge,
          updatable: true,
          animated: true,
          markerEnd: MarkerType.Arrow,
        }
      })
      console.debug('Enhanced edges from cipher file data', enhancedEdges)

      nodes.value = [...enhancedNodes]
      edges.value = [...enhancedEdges]
      setTimeout(async () => {
        await nextTick()
        fitView()
      }, 100)
    } catch (err) {
      console.error('Error loading graph:', err)
      // TODO: Show user-friendly error message
      alert('Failed to load cipher graph. Please check the file format and try again.')
    }
  }
  reader.onerror = () => {
    console.error('Error reading file')
    // TODO: Show user-friendly error message
    alert('Failed to read the selected file. Please try again.')
  }
  reader.readAsText(cipherFile)
}

const isDragging = ref(false)

const handleDropGraph = (e: DragEvent) => {
  console.debug('Handling file drop', e.dataTransfer?.files)
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) {
    console.debug('Received file for cipher', file)
    handleLoadGraph(file)
  }
}

const handleSelectGraph = (e: Event) => {
  console.debug('Handling "load-graph" event')
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    console.debug('Received file for cipher', file)
    handleLoadGraph(file)
  }
}

const cipherUpload = ref<HTMLElement | null>(null)

const triggerCipherUpload = () => {
  cipherUpload.value?.click()
}

/* */
const inputText = ref('')
const outputText = ref('')

const clear = () => {
  inputText.value = ''
  outputText.value = ''
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
    <div
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      :class="['drop-zone', { 'drag-active': isDragging }]"
      @drop.prevent="handleDropGraph"
    >
      <VueFlow
        v-if="isReady"
        class="dark basic-flow"
        :nodes="nodes"
        :edges="edges"
        :connection-radius="53"
        :edge-updater-radius="23"
        fit-view-on-init
      >
        <Background />
        <Controls position="top-left"></Controls>

        <!-- Floating Add Node Button -->
        <div class="add-node-button" @click="openAddNodeModal">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- Save/Load Controls -->
        <div class="save-load-controls">
          <button class="control-btn save-btn" @click="showSaveModal = true" title="Save Cipher">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2" />
              <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>

          <button class="control-btn load-btn" title="Load Cipher" @click="triggerCipherUpload">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" />
              <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
      </VueFlow>
    </div>

    <div class="cipher-practice">
      <h2 class="section-title">Encrypt/Decrypt Messages</h2>
      <div class="control-group">
        <slot name="cipherKey"></slot>
      </div>

      <div class="control-group">
        <label class="control-label">Input Text:</label>
        <textarea
          class="cipher-textarea"
          v-model="inputText"
          placeholder="Enter text to encrypt/decrypt..."
        ></textarea>
      </div>

      <div class="button-group">
        <button class="cipher-button" @click="encrypt">Encrypt</button>
        <button class="cipher-button" @click="decrypt">Decrypt</button>
        <button class="cipher-button" @click="clear">Clear</button>
      </div>

      <CipherOutput label="Output" :text="outputText" />
    </div>

    <AddNodeModal :isOpen="showAddNodeModal" @close="closeAddNodeModal" @add-node="handleAddNode" />

    <EditNodeModal
      v-if="selectedNode"
      :isOpen="showNodeModal"
      :node="selectedNode"
      @close="closeNodeModal"
      @update-node="handleUpdateNode"
    />

    <SaveGraphModal
      :isOpen="showSaveModal"
      @close="showSaveModal = false"
      @save-graph="handleSaveGraph"
    />

    <!-- Hidden file input -->
    <input
      ref="cipherUpload"
      style="display: none"
      type="file"
      accept=".txt,.json,.cipher"
      @change="handleSelectGraph"
    />
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

.drop-zone {
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.drag-active {
  background-color: var(--neon-cyan);
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
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.2), rgba(255, 0, 255, 0.1));
  border: 1px solid var(--neon-magenta);
  border-radius: 50%;
  box-shadow:
    0 0 10px rgba(255, 0, 255, 0.3),
    inset 0 1px 0 rgba(255, 0, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  color: var(--neon-magenta);
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
  overflow: hidden;
}

.add-node-button:hover {
  transform: scale(1.1);
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.3), rgba(255, 0, 255, 0.2));
  box-shadow:
    0 0 20px rgba(255, 0, 255, 0.6),
    0 0 30px rgba(255, 0, 255, 0.4),
    inset 0 1px 0 rgba(255, 0, 255, 0.3);
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
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

/* Save/Load Controls */
.save-load-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 100;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.save-btn {
  background: linear-gradient(45deg, rgba(0, 255, 65, 0.2), rgba(0, 255, 65, 0.1));
  border: 1px solid var(--neon-green);
  box-shadow:
    0 0 10px rgba(0, 255, 65, 0.3),
    inset 0 1px 0 rgba(0, 255, 65, 0.2);
  color: var(--neon-green);
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(45deg, rgba(0, 255, 65, 0.3), rgba(0, 255, 65, 0.2));
  box-shadow:
    0 0 20px rgba(0, 255, 65, 0.6),
    0 0 30px rgba(0, 255, 65, 0.4),
    inset 0 1px 0 rgba(0, 255, 65, 0.3);
  transform: translateY(-2px);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}

.load-btn {
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1));
  border: 1px solid var(--neon-cyan);
  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.3),
    inset 0 1px 0 rgba(0, 255, 255, 0.2);
  color: var(--neon-cyan);
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.load-btn:hover {
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(0, 255, 255, 0.2));
  box-shadow:
    0 0 20px rgba(0, 255, 255, 0.6),
    0 0 30px rgba(0, 255, 255, 0.4),
    inset 0 1px 0 rgba(0, 255, 255, 0.3);
  transform: translateY(-2px);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.clear-btn {
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.15));
  border: 1px solid rgba(255, 0, 0, 0.8);
  box-shadow:
    0 0 10px rgba(255, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 0, 0, 0.2);
  color: #ff4444;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.25), rgba(0, 255, 255, 0.25));
  box-shadow:
    0 0 20px rgba(255, 0, 0, 0.6),
    0 0 30px rgba(255, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 0, 0, 0.3);
  transform: translateY(-2px);
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}
</style>
