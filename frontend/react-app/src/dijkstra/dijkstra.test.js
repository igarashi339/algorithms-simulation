import { range } from "ramda"
import { makeGraphs, makeTables } from "./dijkstra.js"

let coloredGraphs
let tables
const stepNum = 11
const nodeNum = 5
const edgeNum = 10

beforeEach(() => {
  const response = getTargetResponse()
  tables = makeTables(response)
  coloredGraphs = makeGraphs(response)
})

test(
  "graphSizeTest", () => {
    expect(coloredGraphs.length).toBe(stepNum)
    coloredGraphs.forEach(graph => {
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

test.each(
  [
    [0, 1, "5"],
    [0, 2, "8"],
    [1, 2, "1"],
    [1, 3, "3"],
    [1, 4, "10"],
    [2, 0, "3"],
    [2, 3, "1"],
    [2, 4, "7"],
    [3, 1, "4"],
    [3, 4, "5"],
  ]
) (
  "edgeCostTest: from=%i, to=%i, cost=%s", (from, to, cost) => {
    coloredGraphs.forEach( graph => {
      const targetEdge = graph.edges.find(edge => edge.from === from && edge.to === to)
      expect(targetEdge.label).toBe(cost)
    })
  }
)

test.each(
  [
    [0, 0, "white"],
    [0, 1, "white"],
    [0, 2, "white"],
    [0, 3, "white"],
    [0, 4, "white"],
    [1, 0, "yellow"],
    [1, 1, "white"],
    [1, 2, "white"],
    [1, 3, "white"],
    [1, 4, "white"],
    [2, 0, "white"],
    [2, 1, "lightgreen"],
    [2, 2, "lightgreen"],
    [2, 3, "white"],
    [2, 4, "white"],
    [10, 0, "red"],
    [10, 1, "salmon"],
    [10, 2, "salmon"],
    [10, 3, "salmon"],
    [10, 4, "red"],
  ]
)(
  "nodeColorTest: step=%i, node=%i, color=%s", (step, nodeId, color) => {
    const targetGraph = coloredGraphs[step]
    const targetNode = targetGraph.nodes.find(node => node.id === nodeId)
    expect(targetNode.color.background).toBe(color)
  }
)

test.each(
  [
    [2, 0, 2, "lightgreen"],
    [2, 0, 1, "lightgreen"],
    [10, 0, 1, "red"],
    [10, 1, 2, "red"],
    [10, 2, 3, "red"],
    [10, 3, 4, "red"],
  ]
)(
  "edgeColorTest: step=%i, from=%i, to=%i, color=%s", (step, from, to, color) => {
    const targetGraph = coloredGraphs[step]
    const targetEdge = targetGraph.edges.find(edge => edge.from === from && edge.to === to)
    expect(targetEdge.color.color).toBe(color)
  }
)

test.each(
  [
    [0, 0, false, -1, -1],
    [0, 1, false, -1, -1],
    [0, 2, false, -1, -1],
    [0, 3, false, -1, -1],
    [0, 4, false, -1, -1],
    [1, 0, true, -1, -1],
    [1, 1, false, -1, -1],
    [1, 2, false, -1, -1],
    [1, 3, false, -1, -1],
    [1, 4, false, -1, -1],
    [2, 0, true, 0, -1],
    [2, 1, false, 5, 0],
    [2, 2, false, 8, 0],
    [2, 3, false, -1, -1],
    [2, 4, false, -1, -1],
    [3, 0, true, 0, -1],
    [3, 1, true, 5, 0],
    [3, 2, false, 8, 0],
    [3, 3, false, -1, -1],
    [3, 4, false, -1, -1],
    [4, 0, true, 0, -1],
    [4, 1, true, 5, 0],
    [4, 2, false, 6, 1],
    [4, 3, false, 8, 1],
    [4, 4, false, 15, 1],
  ]
)(
  "tableTest: step=%i, node=%i, fixed=%s, label=%i, prevNode=%i", (step, nodeIndex, fixed, label, prevNode) => {
    const table = tables[step]
    const targetRow = table.find(row => row.id === nodeIndex)
    expect(targetRow.fixed).toBe(fixed)
    expect(targetRow.label).toBe(label)
    expect(targetRow.prevNode).toBe(prevNode)
  }
)

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