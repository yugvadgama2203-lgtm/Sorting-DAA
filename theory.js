/* ==========================================================================
   DAA Theory & Pseudocode Metadata Module
   Includes Sorting & Greedy Graph Algorithms (Dijkstra, Prim's, Kruskal's)
   ========================================================================== */

const TheoryData = {
  quick: {
    name: "Quick Sort (Lomuto)",
    complexity: "O(n log n)",
    space: "O(log n)",
    stable: false,
    pseudocode: [
      "pivot = arr[high]; i = low - 1",
      "for j = low to high-1 do",
      "  if arr[j] < pivot then",
      "    i++; swap(arr[i], arr[j])",
      "swap(arr[i+1], arr[high]); return i+1"
    ]
  },
  merge: {
    name: "Merge Sort",
    complexity: "O(n log n)",
    space: "O(n)",
    stable: true,
    pseudocode: [
      "mid = (low + high) / 2",
      "MergeSort(low, mid)",
      "MergeSort(mid+1, high)",
      "Merge(leftSubarray, rightSubarray)",
      "Copy merged output back to arr"
    ]
  },
  heap: {
    name: "Heap Sort",
    complexity: "O(n log n)",
    space: "O(1)",
    stable: false,
    pseudocode: [
      "BuildMaxHeap(arr)",
      "for i = n-1 down to 1 do",
      "  swap(arr[0], arr[i])",
      "  Heapify(arr, size=i, root=0)",
      "Return sorted arr"
    ]
  },
  bubble: {
    name: "Bubble Sort",
    complexity: "O(n²)",
    space: "O(1)",
    stable: true,
    pseudocode: [
      "for i = 0 to n-2 do",
      "  for j = 0 to n-i-2 do",
      "    if arr[j] > arr[j+1] then",
      "      swap(arr[j], arr[j+1])",
      "  if no swaps occurred break"
    ]
  },
  selection: {
    name: "Selection Sort",
    complexity: "O(n²)",
    space: "O(1)",
    stable: false,
    pseudocode: [
      "for i = 0 to n-2 do",
      "  minIdx = i",
      "  for j = i+1 to n-1 do",
      "    if arr[j] < arr[minIdx] minIdx = j",
      "  swap(arr[i], arr[minIdx])"
    ]
  },
  insertion: {
    name: "Insertion Sort",
    complexity: "O(n²)",
    space: "O(1)",
    stable: true,
    pseudocode: [
      "for i = 1 to n-1 do",
      "  key = arr[i]; j = i - 1",
      "  while j >= 0 and arr[j] > key do",
      "    arr[j+1] = arr[j]; j--",
      "  arr[j+1] = key"
    ]
  },
  dijkstra: {
    name: "Dijkstra's Shortest Path",
    complexity: "O((V+E) log V)",
    space: "O(V)",
    stable: true,
    pseudocode: [
      "dist[src] = 0; all others = INF",
      "for count = 0 to V-1 do",
      "  u = vertex with min dist[u]",
      "  visited[u] = true",
      "  for each neighbor v: if dist[u]+w < dist[v] update dist[v]"
    ]
  },
  prims: {
    name: "Prim's MST Algorithm",
    complexity: "O(E log V)",
    space: "O(V + E)",
    stable: true,
    pseudocode: [
      "key[0] = 0; inMST = false",
      "for count = 0 to V-1 do",
      "  u = vertex with min key[u] not in MST",
      "  inMST[u] = true",
      "  for each neighbor v: if weight(u,v) < key[v] update key[v]"
    ]
  },
  kruskal: {
    name: "Kruskal's MST Algorithm",
    complexity: "O(E log E)",
    space: "O(V + E)",
    stable: true,
    pseudocode: [
      "Sort all edges E in non-decreasing order by weight",
      "Initialize Disjoint Set Union (DSU) for V vertices",
      "for each edge (u, v) in sorted list do",
      "  if Find(u) != Find(v) then",
      "    Add edge (u, v) to MST; Union(u, v)"
    ]
  }
};

function renderPseudocode(algoKey) {
  const container = document.getElementById('pseudocode-box');
  if (!container) return;

  const data = TheoryData[algoKey] || TheoryData.quick;
  container.innerHTML = data.pseudocode.map((line, idx) => `
    <div class="code-line" id="code-line-${idx + 1}">${idx + 1}.  ${escapeHtml(line)}</div>
  `).join('');
}

function highlightCodeLine(lineNum) {
  document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
  if (lineNum) {
    const activeLine = document.getElementById(`code-line-${lineNum}`);
    if (activeLine) activeLine.classList.add('active');
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

window.TheoryData = TheoryData;
window.renderPseudocode = renderPseudocode;
window.highlightCodeLine = highlightCodeLine;
