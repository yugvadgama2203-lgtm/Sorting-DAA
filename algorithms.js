/* ==========================================================================
   DAA Algorithms Step-Generator Module
   Sorting (with live pointers low, high, mid, pivot, i, j) & Greedy Graph Algorithms
   ========================================================================== */

const Algorithms = {

  // --------------------------------------------------------------------------
  // BUBBLE SORT (with pointers i, j)
  // --------------------------------------------------------------------------
  bubbleSort: function* (arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      yield {
        type: 'line',
        line: 1,
        explanation: `Starting Pass i = ${i + 1}.`,
        array: [...a],
        comparisons, swaps,
        pointers: { i }
      };

      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        yield {
          type: 'compare',
          indices: [j, j + 1],
          line: 2,
          explanation: `Comparing adjacent elements a[j] (${a[j]}) and a[j+1] (${a[j + 1]}).`,
          array: [...a],
          comparisons, swaps,
          pointers: { i, j, 'j+1': j + 1 }
        };

        if (a[j] > a[j + 1]) {
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          swaps++;
          swapped = true;

          yield {
            type: 'swap',
            indices: [j, j + 1],
            line: 3,
            explanation: `${a[j + 1]} > ${a[j]} is true! Swapping a[${j}] and a[${j + 1}].`,
            array: [...a],
            comparisons, swaps,
            pointers: { i, j, 'j+1': j + 1 }
          };
        }
      }

      yield {
        type: 'sorted',
        indices: [n - i - 1],
        line: 4,
        explanation: `Element at index ${n - i - 1} (${a[n - i - 1]}) is now in its final position.`,
        array: [...a],
        comparisons, swaps,
        pointers: { i }
      };

      if (!swapped) break;
    }

    yield {
      type: 'all-sorted',
      indices: Array.from({ length: n }, (_, k) => k),
      line: 5,
      explanation: `Bubble Sort Complete! Comparisons: ${comparisons}, Swaps: ${swaps}.`,
      array: [...a],
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // SELECTION SORT (with pointers i, j, minIdx)
  // --------------------------------------------------------------------------
  selectionSort: function* (arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      yield {
        type: 'pivot',
        indices: [i],
        line: 1,
        explanation: `Assuming index i = ${i} (value ${a[i]}) is the minimum.`,
        array: [...a],
        comparisons, swaps,
        pointers: { i, min: minIdx }
      };

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        yield {
          type: 'compare',
          indices: [j, minIdx],
          line: 2,
          explanation: `Comparing candidate a[j] (${a[j]}) with min a[min] (${a[minIdx]}).`,
          array: [...a],
          comparisons, swaps,
          pointers: { i, j, min: minIdx }
        };

        if (a[j] < a[minIdx]) {
          minIdx = j;
          yield {
            type: 'pivot',
            indices: [minIdx],
            line: 3,
            explanation: `Found new minimum at index ${minIdx} (value ${a[minIdx]}).`,
            array: [...a],
            comparisons, swaps,
            pointers: { i, j, min: minIdx }
          };
        }
      }

      if (minIdx !== i) {
        const temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;
        swaps++;

        yield {
          type: 'swap',
          indices: [i, minIdx],
          line: 4,
          explanation: `Swapping minimum element ${a[i]} into position index i = ${i}.`,
          array: [...a],
          comparisons, swaps,
          pointers: { i, min: minIdx }
        };
      }

      yield {
        type: 'sorted',
        indices: [i],
        line: 5,
        explanation: `Index i = ${i} is now permanently sorted.`,
        array: [...a],
        comparisons, swaps,
        pointers: { i }
      };
    }

    yield {
      type: 'all-sorted',
      indices: Array.from({ length: n }, (_, k) => k),
      line: 5,
      explanation: `Selection Sort Complete! Comparisons: ${comparisons}, Swaps: ${swaps}.`,
      array: [...a],
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // INSERTION SORT (with pointers i, j, key)
  // --------------------------------------------------------------------------
  insertionSort: function* (arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 1; i < n; i++) {
      let key = a[i];
      let j = i - 1;

      yield {
        type: 'pivot',
        indices: [i],
        line: 1,
        explanation: `Selected key = ${key} at index i = ${i} to insert into sorted subarray.`,
        array: [...a],
        comparisons, swaps,
        pointers: { i, key: i }
      };

      while (j >= 0) {
        comparisons++;
        yield {
          type: 'compare',
          indices: [j, j + 1],
          line: 2,
          explanation: `Comparing key (${key}) with sorted element a[j] (${a[j]}).`,
          array: [...a],
          comparisons, swaps,
          pointers: { i, j, key: i }
        };

        if (a[j] > key) {
          a[j + 1] = a[j];
          swaps++;
          yield {
            type: 'overwrite',
            indices: [j + 1],
            line: 3,
            explanation: `${a[j]} > ${key}. Shifting ${a[j]} right to index ${j + 1}.`,
            array: [...a],
            comparisons, swaps,
            pointers: { i, j, key: i }
          };
          j--;
        } else {
          break;
        }
      }

      a[j + 1] = key;
      swaps++;
      yield {
        type: 'swap',
        indices: [j + 1],
        line: 4,
        explanation: `Inserted key (${key}) at target position index ${j + 1}.`,
        array: [...a],
        comparisons, swaps,
        pointers: { i, j: j + 1 }
      };
    }

    yield {
      type: 'all-sorted',
      indices: Array.from({ length: n }, (_, k) => k),
      line: 5,
      explanation: `Insertion Sort Complete! Comparisons: ${comparisons}, Swaps: ${swaps}.`,
      array: [...a],
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // QUICK SORT (with pointers low, high, mid, pivot, i, j)
  // --------------------------------------------------------------------------
  quickSort: function* (arr) {
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;

    function* partition(low, high) {
      const pivot = a[high];
      const mid = Math.floor((low + high) / 2);

      yield {
        type: 'pivot',
        indices: [high],
        line: 1,
        explanation: `Chosen Pivot = ${pivot} at high = ${high}. Subarray bounds: [low=${low}, high=${high}, mid=${mid}].`,
        array: [...a],
        comparisons, swaps,
        pointers: { low, high, mid, pivot: high }
      };

      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        yield {
          type: 'compare',
          indices: [j, high],
          line: 2,
          explanation: `Comparing element a[j=${j}] (${a[j]}) with Pivot (${pivot}).`,
          array: [...a],
          comparisons, swaps,
          pointers: { low, high, mid, pivot: high, i: Math.max(0, i), j }
        };

        if (a[j] < pivot) {
          i++;
          if (i !== j) {
            const temp = a[i];
            a[i] = a[j];
            a[j] = temp;
            swaps++;

            yield {
              type: 'swap',
              indices: [i, j],
              line: 3,
              explanation: `${a[j]} < pivot (${pivot}). Swapping a[i=${i}] and a[j=${j}].`,
              array: [...a],
              comparisons, swaps,
              pointers: { low, high, mid, pivot: high, i, j }
            };
          }
        }
      }

      // Move pivot to final position
      const temp = a[i + 1];
      a[i + 1] = a[high];
      a[high] = temp;
      swaps++;

      yield {
        type: 'swap',
        indices: [i + 1, high],
        line: 4,
        explanation: `Placing Pivot ${pivot} into final sorted position at index ${i + 1}.`,
        array: [...a],
        comparisons, swaps,
        pointers: { low, high, pivot: i + 1, i: i + 1 }
      };

      yield {
        type: 'sorted',
        indices: [i + 1],
        line: 4,
        explanation: `Pivot at index ${i + 1} is now correctly placed.`,
        array: [...a],
        comparisons, swaps,
        pointers: { pivot: i + 1 }
      };

      return i + 1;
    }

    function* qsort(low, high) {
      if (low < high) {
        const pIdx = yield* partition(low, high);
        yield* qsort(low, pIdx - 1);
        yield* qsort(pIdx + 1, high);
      } else if (low === high) {
        yield {
          type: 'sorted',
          indices: [low],
          line: 5,
          explanation: `Single element subarray at low=high=${low} is sorted.`,
          array: [...a],
          comparisons, swaps,
          pointers: { low, high }
        };
      }
    }

    yield* qsort(0, a.length - 1);

    yield {
      type: 'all-sorted',
      indices: Array.from({ length: a.length }, (_, k) => k),
      line: 5,
      explanation: `Quick Sort Complete! Comparisons: ${comparisons}, Swaps: ${swaps}.`,
      array: [...a],
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // MERGE SORT (with pointers low, mid, high, i, j)
  // --------------------------------------------------------------------------
  mergeSort: function* (arr) {
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;

    function* merge(low, mid, high) {
      const left = a.slice(low, mid + 1);
      const right = a.slice(mid + 1, high + 1);

      yield {
        type: 'line',
        line: 1,
        explanation: `Merging left [low=${low}..mid=${mid}] and right [mid+1=${mid + 1}..high=${high}].`,
        array: [...a],
        comparisons, swaps,
        pointers: { low, mid, high }
      };

      let i = 0, j = 0, k = low;

      while (i < left.length && j < right.length) {
        comparisons++;
        const currLeftIdx = low + i;
        const currRightIdx = mid + 1 + j;

        yield {
          type: 'compare',
          indices: [currLeftIdx, currRightIdx],
          line: 2,
          explanation: `Comparing left element ${left[i]} with right element ${right[j]}.`,
          array: [...a],
          comparisons, swaps,
          pointers: { low, mid, high, i: currLeftIdx, j: currRightIdx }
        };

        if (left[i] <= right[j]) {
          a[k] = left[i];
          i++;
        } else {
          a[k] = right[j];
          j++;
        }
        swaps++;

        yield {
          type: 'overwrite',
          indices: [k],
          line: 3,
          explanation: `Writing ${a[k]} to index k=${k}.`,
          array: [...a],
          comparisons, swaps,
          pointers: { low, mid, high, k }
        };
        k++;
      }

      while (i < left.length) {
        a[k] = left[i];
        i++;
        swaps++;
        yield {
          type: 'overwrite',
          indices: [k],
          line: 4,
          explanation: `Copying remaining left element ${a[k]} to index k=${k}.`,
          array: [...a],
          comparisons, swaps,
          pointers: { low, mid, high, k }
        };
        k++;
      }

      while (j < right.length) {
        a[k] = right[j];
        j++;
        swaps++;
        yield {
          type: 'overwrite',
          indices: [k],
          line: 4,
          explanation: `Copying remaining right element ${a[k]} to index k=${k}.`,
          array: [...a],
          comparisons, swaps,
          pointers: { low, mid, high, k }
        };
        k++;
      }
    }

    function* msort(low, high) {
      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        yield* msort(low, mid);
        yield* msort(mid + 1, high);
        yield* merge(low, mid, high);
      }
    }

    yield* msort(0, a.length - 1);

    yield {
      type: 'all-sorted',
      indices: Array.from({ length: a.length }, (_, k) => k),
      line: 5,
      explanation: `Merge Sort Complete! Comparisons: ${comparisons}, Writes: ${swaps}.`,
      array: [...a],
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // HEAP SORT (with pointers root, left, right, largest)
  // --------------------------------------------------------------------------
  heapSort: function* (arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0;
    let swaps = 0;

    function* heapify(size, i) {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < size) {
        comparisons++;
        yield {
          type: 'compare',
          indices: [left, largest],
          line: 1,
          explanation: `Comparing left child a[left=${left}] (${a[left]}) with largest root a[${largest}] (${a[largest]}).`,
          array: [...a],
          comparisons, swaps,
          pointers: { root: i, left, largest }
        };
        if (a[left] > a[largest]) largest = left;
      }

      if (right < size) {
        comparisons++;
        yield {
          type: 'compare',
          indices: [right, largest],
          line: 2,
          explanation: `Comparing right child a[right=${right}] (${a[right]}) with largest a[${largest}] (${a[largest]}).`,
          array: [...a],
          comparisons, swaps,
          pointers: { root: i, right, largest }
        };
        if (a[right] > a[largest]) largest = right;
      }

      if (largest !== i) {
        const temp = a[i];
        a[i] = a[largest];
        a[largest] = temp;
        swaps++;

        yield {
          type: 'swap',
          indices: [i, largest],
          line: 3,
          explanation: `Swapping root a[i=${i}] with largest child a[${largest}].`,
          array: [...a],
          comparisons, swaps,
          pointers: { root: i, largest }
        };

        yield* heapify(size, largest);
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      const temp = a[0];
      a[0] = a[i];
      a[i] = temp;
      swaps++;

      yield {
        type: 'swap',
        indices: [0, i],
        line: 4,
        explanation: `Extracted Max Element (${temp}) from heap root to index i=${i}.`,
        array: [...a],
        comparisons, swaps,
        pointers: { root: 0, high: i }
      };

      yield {
        type: 'sorted',
        indices: [i],
        line: 4,
        explanation: `Index ${i} is now sorted. Re-heapifying root.`,
        array: [...a],
        comparisons, swaps,
        pointers: { high: i }
      };

      yield* heapify(i, 0);
    }

    yield {
      type: 'all-sorted',
      indices: Array.from({ length: n }, (_, k) => k),
      line: 5,
      explanation: `Heap Sort Complete! Comparisons: ${comparisons}, Swaps: ${swaps}.`,
      array: [...a],
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // DIJKSTRA'S SHORTEST PATH ALGORITHM (DAA Graph)
  // --------------------------------------------------------------------------
  dijkstra: function* (graphData) {
    const graph = graphData || getDefaultGraph();
    const V = graph.nodes.length;
    const source = 0;
    
    let dist = new Array(V).fill(Infinity);
    let visited = new Array(V).fill(false);
    let parent = new Array(V).fill(-1);

    dist[source] = 0;
    let comparisons = 0;
    let swaps = 0;

    yield {
      type: 'graph-step',
      line: 1,
      explanation: `Initialized Dijkstra's algorithm from Source Node 0. Distance to 0 is 0, all others \u221E.`,
      graph: { ...graph, dist: [...dist], visited: [...visited], parent: [...parent] },
      activeNode: source,
      comparisons, swaps,
      pointers: { source: 0 }
    };

    for (let i = 0; i < V - 1; i++) {
      // Find min distance unvisited node
      let minDist = Infinity;
      let u = -1;

      for (let v = 0; v < V; v++) {
        comparisons++;
        if (!visited[v] && dist[v] <= minDist) {
          minDist = dist[v];
          u = v;
        }
      }

      if (u === -1 || dist[u] === Infinity) break;

      visited[u] = true;

      yield {
        type: 'graph-step',
        line: 2,
        explanation: `Selected minimum distance unvisited Node u = ${u} with dist[u] = ${dist[u]}.`,
        graph: { ...graph, dist: [...dist], visited: [...visited], parent: [...parent] },
        activeNode: u,
        comparisons, swaps,
        pointers: { u, dist: u }
      };

      // Relax neighbors
      const neighbors = graph.edges.filter(e => e.u === u || e.v === u);

      for (const edge of neighbors) {
        const v = edge.u === u ? edge.v : edge.u;
        const weight = edge.w;

        if (!visited[v]) {
          comparisons++;
          yield {
            type: 'graph-step',
            line: 3,
            explanation: `Checking edge (${u} - ${v}) with weight ${weight}. dist[${u}] (${dist[u]}) + ${weight} vs dist[${v}] (${dist[v] === Infinity ? '\u221E' : dist[v]}).`,
            graph: { ...graph, dist: [...dist], visited: [...visited], parent: [...parent] },
            activeNode: u,
            targetNode: v,
            activeEdge: edge,
            comparisons, swaps,
            pointers: { u, v }
          };

          if (dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight;
            parent[v] = u;
            swaps++;

            yield {
              type: 'graph-step',
              line: 4,
              explanation: `Relaxed edge! Updated dist[${v}] = ${dist[v]}. Parent of ${v} is ${u}.`,
              graph: { ...graph, dist: [...dist], visited: [...visited], parent: [...parent] },
              activeNode: u,
              targetNode: v,
              activeEdge: edge,
              comparisons, swaps,
              pointers: { u, v }
            };
          }
        }
      }
    }

    yield {
      type: 'all-sorted',
      line: 5,
      explanation: `Dijkstra's Algorithm Complete! Computed Shortest Paths from Source Node 0.`,
      graph: { ...graph, dist: [...dist], visited: [...visited], parent: [...parent] },
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // PRIM'S MINIMUM SPANNING TREE (MST) ALGORITHM (DAA Graph)
  // --------------------------------------------------------------------------
  prims: function* (graphData) {
    const graph = graphData || getDefaultGraph();
    const V = graph.nodes.length;
    const key = new Array(V).fill(Infinity);
    const inMST = new Array(V).fill(false);
    const parent = new Array(V).fill(-1);

    key[0] = 0;
    let comparisons = 0;
    let swaps = 0;

    yield {
      type: 'graph-step',
      line: 1,
      explanation: `Starting Prim's MST from Node 0. Set key[0] = 0, all other keys = \u221E.`,
      graph: { ...graph, dist: [...key], visited: [...inMST], parent: [...parent] },
      activeNode: 0,
      comparisons, swaps,
      pointers: { root: 0 }
    };

    for (let count = 0; count < V - 1; count++) {
      let minKey = Infinity;
      let u = -1;

      for (let v = 0; v < V; v++) {
        comparisons++;
        if (!inMST[v] && key[v] < minKey) {
          minKey = key[v];
          u = v;
        }
      }

      if (u === -1) break;
      inMST[u] = true;

      yield {
        type: 'graph-step',
        line: 2,
        explanation: `Picked minimum key vertex u = ${u} (key = ${key[u]}) to add into MST.`,
        graph: { ...graph, dist: [...key], visited: [...inMST], parent: [...parent] },
        activeNode: u,
        comparisons, swaps,
        pointers: { u }
      };

      const neighbors = graph.edges.filter(e => e.u === u || e.v === u);

      for (const edge of neighbors) {
        const v = edge.u === u ? edge.v : edge.u;
        const weight = edge.w;

        if (!inMST[v]) {
          comparisons++;
          yield {
            type: 'graph-step',
            line: 3,
            explanation: `Inspecting edge (${u} - ${v}) of weight ${weight}. Comparing with key[${v}] (${key[v] === Infinity ? '\u221E' : key[v]}).`,
            graph: { ...graph, dist: [...key], visited: [...inMST], parent: [...parent] },
            activeNode: u,
            targetNode: v,
            activeEdge: edge,
            comparisons, swaps,
            pointers: { u, v }
          };

          if (weight < key[v]) {
            key[v] = weight;
            parent[v] = u;
            swaps++;

            yield {
              type: 'graph-step',
              line: 4,
              explanation: `Updated key[${v}] = ${weight}. Set MST edge parent[${v}] = ${u}.`,
              graph: { ...graph, dist: [...key], visited: [...inMST], parent: [...parent] },
              activeNode: u,
              targetNode: v,
              activeEdge: edge,
              comparisons, swaps,
              pointers: { u, v }
            };
          }
        }
      }
    }

    yield {
      type: 'all-sorted',
      line: 5,
      explanation: `Prim's MST Construction Complete! Total MST edges formed.`,
      graph: { ...graph, dist: [...key], visited: [...inMST], parent: [...parent] },
      comparisons, swaps,
      pointers: {}
    };
  },

  // --------------------------------------------------------------------------
  // KRUSKAL'S MST ALGORITHM (Edge Sorting + DSU)
  // --------------------------------------------------------------------------
  kruskal: function* (graphData) {
    const graph = graphData || getDefaultGraph();
    const V = graph.nodes.length;

    // 1. Sort edges by weight
    const sortedEdges = [...graph.edges].sort((a, b) => a.w - b.w);
    let comparisons = sortedEdges.length * Math.log2(sortedEdges.length);
    let swaps = 0;

    const parentDSU = Array.from({ length: V }, (_, i) => i);

    function find(i) {
      if (parentDSU[i] === i) return i;
      return parentDSU[i] = find(parentDSU[i]);
    }

    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parentDSU[rootI] = rootJ;
        return true;
      }
      return false;
    }

    const mstEdges = [];
    const mstParent = new Array(V).fill(-1);

    yield {
      type: 'graph-step',
      line: 1,
      explanation: `Kruskal Step 1: Sorted all ${sortedEdges.length} graph edges by weight using O(E log E) sort.`,
      graph: { ...graph, dist: new Array(V).fill(0), visited: new Array(V).fill(false), parent: [...mstParent] },
      sortedEdges,
      comparisons, swaps,
      pointers: {}
    };

    for (let i = 0; i < sortedEdges.length; i++) {
      const edge = sortedEdges[i];
      const rootU = find(edge.u);
      const rootV = find(edge.v);

      yield {
        type: 'graph-step',
        line: 2,
        explanation: `Considering smallest edge #${i + 1}: (${edge.u} - ${edge.v}) weight=${edge.w}. Check if roots match: Find(${edge.u})=${rootU}, Find(${edge.v})=${rootV}.`,
        graph: { ...graph, dist: new Array(V).fill(0), visited: new Array(V).fill(false), parent: [...mstParent] },
        activeEdge: edge,
        sortedEdges,
        comparisons, swaps,
        pointers: { u: edge.u, v: edge.v }
      };

      if (rootU !== rootV) {
        union(edge.u, edge.v);
        mstEdges.push(edge);
        mstParent[edge.v] = edge.u;
        swaps++;

        yield {
          type: 'graph-step',
          line: 3,
          explanation: `No cycle formed! Added edge (${edge.u} - ${edge.v}) [weight=${edge.w}] into MST.`,
          graph: { ...graph, dist: new Array(V).fill(0), visited: new Array(V).fill(false), parent: [...mstParent], mstEdges },
          activeEdge: edge,
          sortedEdges,
          comparisons, swaps,
          pointers: { u: edge.u, v: edge.v }
        };

        if (mstEdges.length === V - 1) break;
      } else {
        yield {
          type: 'graph-step',
          line: 4,
          explanation: `Cycle detected! Discarded edge (${edge.u} - ${edge.v}) [weight=${edge.w}].`,
          graph: { ...graph, dist: new Array(V).fill(0), visited: new Array(V).fill(false), parent: [...mstParent], mstEdges },
          activeEdge: edge,
          rejectedEdge: edge,
          sortedEdges,
          comparisons, swaps,
          pointers: { u: edge.u, v: edge.v }
        };
      }
    }

    yield {
      type: 'all-sorted',
      line: 5,
      explanation: `Kruskal's MST Complete! Total MST Edges: ${mstEdges.length}.`,
      graph: { ...graph, dist: new Array(V).fill(0), visited: new Array(V).fill(true), parent: [...mstParent], mstEdges },
      comparisons, swaps,
      pointers: {}
    };
  }
};

function getDefaultGraph() {
  return {
    nodes: [
      { id: 0, label: '0', x: 0.18, y: 0.3 },
      { id: 1, label: '1', x: 0.45, y: 0.15 },
      { id: 2, label: '2', x: 0.82, y: 0.3 },
      { id: 3, label: '3', x: 0.25, y: 0.75 },
      { id: 4, label: '4', x: 0.65, y: 0.8 },
      { id: 5, label: '5', x: 0.5, y: 0.5 }
    ],
    edges: [
      { u: 0, v: 1, w: 4 },
      { u: 0, v: 3, w: 8 },
      { u: 1, v: 2, w: 8 },
      { u: 1, v: 3, w: 11 },
      { u: 1, v: 5, w: 7 },
      { u: 2, v: 4, w: 9 },
      { u: 2, v: 5, w: 4 },
      { u: 3, v: 4, w: 7 },
      { u: 3, v: 5, w: 1 },
      { u: 4, v: 5, w: 2 }
    ]
  };
}

window.Algorithms = Algorithms;
window.getDefaultGraph = getDefaultGraph;
