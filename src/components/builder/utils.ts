import { type Connection, type Edge } from '@vue-flow/core'

/*
 * The Union-Find structure keeps track of connected components.
 */
export class UnionFind {
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

export function willCreateCycle(edges: Edge[], newEdge: Connection): boolean {
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

export class GraphAnalyzer {
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
