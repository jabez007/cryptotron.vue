<script setup lang="ts">
import { onMounted, nextTick, ref } from 'vue'
import { MarkerType, useVueFlow, VueFlow, type Edge, type Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'

const isReady = ref(false)

const nodes = ref<Node[]>([])

const edges = ref<Edge[]>([])

const {
  addEdges,
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
        { id: '1', label: 'Node 1', position: { x: 250, y: 5 } },
        { id: '2', label: 'Node 2', position: { x: 100, y: 100 } },
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
        { id: 'e1-3', source: '1', target: '3' },
      ],
    )
    await nextTick()
    isReady.value = true
  }, 100)
})

onNodeClick(({ event, node }) => {
  console.debug('On Node Click', event, node)
})

onConnect((connection) => {
  console.debug('On Connect', connection)
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
  updateEdge(edge, connection)
})
</script>

<template>
  <div class="builder-container">
    <VueFlow v-if="isReady" class="dark basic-flow" :nodes="nodes" :edges="edges" :connection-radius="53"
      :edge-updater-radius="23" fit-view-on-init>
      <Background />
      <Controls position="top-left"></Controls>
    </VueFlow>
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
.builder-container {
  height: 100%;
  width: 100%;
}

.vue-flow {
  height: 400px;
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 12px;
}
</style>
