import { range } from "ramda"
import { getInitialGraph, calcSteps, calcColoredGraph } from "./dijkstra.js"

let coloredGraph
let tables
const stepNum = 11
const nodeNum = 5
const edgeNum = 10

beforeEach(() => {
  const response = getTargetResponse()
  const initialGraph = getInitialGraph(response)
  const steps = calcSteps(response, initialGraph)
  const graphs = steps.map(step => step.graph)
  tables = steps.map(step => step.table)
  const startNode = response.data.search_info.start_node
  const goalNode = response.data.search_info.goal_node
  const shortestPath = response.data.search_info.shortest_path
  coloredGraph = calcColoredGraph(initialGraph, graphs, startNode, goalNode, shortestPath)
})

test(
  "graphSizeTest", () => {
    expect(coloredGraph.length).toBe(stepNum)
    coloredGraph.forEach(graph => {
      const nodes = graph.nodes
      const edges = graph.edges
      expect(nodes.length).toBe(nodeNum)
      expect(edges.length).toBe(edgeNum)
    });
  }
)

test(
  "tableSizeTest", () => {
    expect(tables.length).toBe(stepNum)
    // すべてのステップについて、表の中にすべてのノードが存在することを確認
    tables.forEach( table => {
      range(0, nodeNum).forEach( nodeId => {
        expect(table.find( row => row.id === nodeId)).not.toBe(undefined)
      })
    })
  }
)

// test.each(
//   [
//     [0, 1, "5"],
//     [1, 2, "1"],
//     [1, 4, "10"],
//     [3, 4, "5"]
//   ]
//   )("getInitialGraphTest: checkLabel: from=%i, to=%i, label=%s", (from, to, label) => {
//     expect(initialGraph.edges.find(
//       link => link.from === from && link.to === to )["label"]).toBe(label)
//   }
// )

// test(
//   "calcStepsTest: checkSize", () => {
//     const graphs = steps.map(step => step.graph)
//     const tables = steps.map(step => step.table)
//     expect(graphs.length).toBe(11)
//     expect(tables.length).toBe(11)
//   }
// )

// test.each(
//   [
//     [1, 0, "yellow", true, -1, -1],
//   ]
// )

// test.each(
//   [
//     [1, 0, "yellow"],
//     [2, 1, "lightgreen"],
//     [2, 2, "lightgreen"],
//     [3, 1, "yellow"],
//     [4, 2, "lightgreen"],
//     [4, 3, "lightgreen"],
//     [4, 4, "lightgreen"],
//     [7, 3, "yellow"],
//     [8, 1, "lightgreen"],
//     [8, 4, "lightgreen"]
//   ]
// )(
//   "calcStepTest: checkNodeColor: step=%i, node=%i, color=%s", (stepIndex, nodeIndex, color) => {
//     const graphs = steps.map(step => step.graph)
//     const graph = graphs[stepIndex]
//     const targetNode = graph.nodes.find(node => node.id === nodeIndex)
//     expect(targetNode.color).toBe(color)
//   }
// )

// test.each(
//   [
//     [0, 0, false, -1, -1],
//     [0, 1, false, -1, -1],
//     [0, 2, false, -1, -1],
//     [0, 3, false, -1, -1],
//     [0, 4, false, -1, -1],
//     [1, 0, true, -1, -1],
//     [1, 1, false, -1, -1],
//     [1, 2, false, -1, -1],
//     [1, 3, false, -1, -1],
//     [1, 4, false, -1, -1],
//     [2, 0, true, 0, -1],
//     [2, 1, false, 5, 0],
//     [2, 2, false, 8, 0],
//     [2, 3, false, -1, -1],
//     [2, 4, false, -1, -1],
//     [3, 0, true, 0, -1],
//     [3, 1, true, 5, 0],
//     [3, 2, false, 8, 0],
//     [3, 3, false, -1, -1],
//     [3, 4, false, -1, -1],
//     [4, 0, true, 0, -1],
//     [4, 1, true, 5, 0],
//     [4, 2, false, 6, 1],
//     [4, 3, false, 8, 1],
//     [4, 4, false, 15, 1],
//   ]
// )(
//   "calcStepTest: checkTable: step=%i, node=%i, fixed=%i, prevNode=%i", (step, nodeIndex, fixed, prevNode) => {
//     const table = steps.map(step => step.table)[step]
//     const targetNode = table.find(node => node.id === nodeIndex)
//     expect(targetNode.fixed).toBe(fixed)
//     expect(targetNode.prevNode).toBe(prevNode)
//   }
// )

// test(
//   "calcColoredGraphTest", () => {

//   }
// );

const getTargetResponse = () => {
    return { "data" : {
        "status": "OK",
        "search_info": {
          "graph_size": 5,
          "cost_matrix": [
            -1, 5.0, 8.0, -1, -1,
            -1, -1, 1.0, 3.0, 10.0,
            3.0, -1, -1, 1.0, 7.0,
            -1, 4.0, -1, -1, 5.0,
            -1, -1, -1, -1, -1
          ],
          "start_node": 0,
          "goal_node": 4,
          "shortest_path": [
            0, 1, 2, 3, 4
          ],
          "shortest_path_cost": 12.0,
          "steps": [
            {
              "min_cost_node": 0,
              "adjacent_nodes": [
                1, 2
              ],
              "cost_fixed_nodes": [
                0
              ],
              "updated_labels": [
                0, 5.0, 8.0, -1, -1
              ],
              "updated_prev_node": [
                -1, 0, 0, -1, -1
              ]
            },
            {
              "min_cost_node": 1,
              "adjacent_nodes": [
                2, 3, 4
              ],
              "cost_fixed_nodes": [
                0, 1
              ],
              "updated_labels": [
                0, 5.0, 6.0, 8.0, 15.0
              ],
              "updated_prev_node": [
                -1, 0, 1, 1, 1
              ]
            },
            {
              "min_cost_node": 2,
              "adjacent_nodes": [
                0, 3, 4
              ],
              "cost_fixed_nodes": [
                0, 1, 2
              ],
              "updated_labels": [
                0, 5.0, 6.0, 7.0, 13.0
              ],
              "updated_prev_node": [
                -1, 0, 1, 2, 2
              ]
            },
            {
              "min_cost_node": 3,
              "adjacent_nodes": [
                1, 4
              ],
              "cost_fixed_nodes": [
                0, 1, 2, 3
              ],
              "updated_labels": [
                0, 5.0, 6.0, 7.0, 12.0
              ],
              "updated_prev_node": [
                -1, 0, 1, 2, 3
              ]
            },
            {
              "min_cost_node": 4,
              "adjacent_nodes": [],
              "cost_fixed_nodes": [
                0, 1, 2, 3, 4
              ],
              "updated_labels": [
                0, 5.0, 6.0, 7.0, 12.0
              ],
              "updated_prev_node": [
                -1, 0, 1, 2, 3
              ]
            }
          ]
        }
      }
    };
}