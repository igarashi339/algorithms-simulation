import { getInitialGraph, calcSteps, calcColoredGraph } from "./dijkstra.js"

let targetResponse
let initialGraph
let steps

beforeEach(() => {
  targetResponse = getTargetResponse()
  initialGraph = getInitialGraph(targetResponse)
  steps = calcSteps(targetResponse, initialGraph)
})

test(
  "getInitialGraphTest: checkGraphSize", () => {
    expect(initialGraph.nodes.length).toBe(5)
    expect(initialGraph.edges.length).toBe(10)
  }
)

test.each(
  [
    [0, 1, "5"],
    [1, 2, "1"],
    [1, 4, "10"],
    [3, 4, "5"]
  ]
  )("getInitialGraphTest: from=%i, to=%i, label=%s", (from, to, label) => {
    expect(initialGraph.edges.find(
      link => link.from === from && link.to === to )["label"]).toBe(label)
  }
)

test(
  "calcStepsTest: checkSize", () => {
    const graphs = steps.map(step => step.graph)
    const tables = steps.map(step => step.table)
    expect(graphs.length).toBe(11)
    expect(tables.length).toBe(11)
  }
)

test(
  "calcColoredGraphTest", () => {

  }
);

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