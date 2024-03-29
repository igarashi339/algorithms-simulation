import { aperture, assoc, pipe, range, splitEvery, update } from 'ramda';
import * as vis from 'vis';

export const dijkstraParser = (response, setControl, setResult) => {
  if (response.data.status === 'NG') {
    setResult(response.data.error_message)
    setControl(3)
    return;
  }

  if (response.data.status !== 'OK') {
    // todo: OKでもNGでもないためシステムエラー処理を追加する
    setControl(4)
    return;
  }

  const descriptions = makeDescriptions(response)
  const graphs = makeGraphs(response)
  const tables = makeTables(response)

  setResult(
    { 
      descriptions: descriptions, 
      graphs: graphs, 
      tables: tables, 
      currentStep: 0 
    })
  setControl(2)
}

/**
 * レスポンスから初期グラフを生成する。
 * 
 * @param {*} response レスポンスオブジェクト
 * @returns グラフオブジェクトの初期値
 */
const getInitialGraph= (response) => {
  const graphSize = response.data.search_info.graph_size;
  const costMatrix = response.data.search_info.cost_matrix;
  const parsedMatrix = splitEvery(graphSize, costMatrix);
  const nodes = range(0, graphSize).map(index => ({
    id: index,
    label: String(index),
    fixed: {
      x: true,
      y: true
    },
    color: {
      background: 'white',
    }
  }));
  
  const edges = parsedMatrix.reduce((acc, cur, index) => {
    cur.forEach((cost, cIndex) => {
      if (cost <= 0) {
        return;
      }
      acc.push({
        from: index,
        to: cIndex,
        label: String(cost),
        arrows: 'to'
      })
    })
    return acc;
  }, [])
  return {
    nodes: nodes,
    edges: edges
  };
}
/**
 * ノードのみ彩色されたグラフのリストを構築する。
 * 
 * @param {*} response レスポンスオブジェクト
 * @param {*} graph グラフオブジェクトの初期値
 * @returns ノードのみ彩色されたグラフオブジェクトのリスト
 */
const makeNodeColoredGraphs = (response, graph)  => {
  const minCostNodeColor = 'yellow'
  const labelUpdateNodeColor = 'lightgreen'
  const shortestPathColor = 'salmon'
  const startNodeColor = 'salmon'
  const goalNodeColor = 'salmon'
  const costFixedNodeColor = 'yellow'

  const updateGraph = (nodeId, color) => (graph) => {
    const updatedNode = assoc('color', {background: color} , graph.nodes[nodeId])
    const updatedNodes = update(nodeId, updatedNode, graph.nodes)
    return assoc('nodes', updatedNodes, graph)
  }

  const steps = response.data.search_info.steps;
  const coloredGraphs = steps.reduce((acc, cur) => {
    // コスト確定済ノードの色を更新
    const costFixedNodeColoredGraph = cur.cost_fixed_nodes.reduce((acc, cur) => {
      return updateGraph(cur, costFixedNodeColor)(acc)
    }, graph)
    // コスト最小ノードの色を更新
    const mincostNodeColoredGraph = updateGraph(cur.min_cost_node, minCostNodeColor)(costFixedNodeColoredGraph)
    acc.push(mincostNodeColoredGraph)

    // コスト確定済ノードの色を更新
    const costFixedNodeColoredGraph2 = cur.cost_fixed_nodes.reduce((acc, cur) => {
      return updateGraph(cur, costFixedNodeColor)(acc)
    }, graph)
    // ラベル更新対象ノードの色を更新
    const labelUpdateNodeColoredGraph = cur.adjacent_nodes.reduce((acc, cur) => {
      return updateGraph(cur, labelUpdateNodeColor)(acc)
    }, costFixedNodeColoredGraph2)
    acc.push(labelUpdateNodeColoredGraph)
    return acc
  }, [graph])

  // goalNodeのコストが確定した後のラベル更新処理はカットする
  const slicedGraphs = coloredGraphs.slice(0, -1)
  
  // shortest path上のノードの色を更新
  const shortestPath = response.data.search_info.shortest_path
  const shortestPathColoredGraph = shortestPath.reduce((acc, cur) => {
    return updateGraph(cur, shortestPathColor)(acc)
  }, graph)

  // startNode, goalNodeの色を更新
  const startNode = response.data.search_info.start_node
  const goalNode = response.data.search_info.goal_node
  const finalGraph = pipe(
    updateGraph(startNode, startNodeColor),
    updateGraph(goalNode, goalNodeColor)
  )(shortestPathColoredGraph)
  slicedGraphs.push(finalGraph)

  return slicedGraphs
}

/**
 * グラフリストを受け取りエッジを彩色する。
 * 
 * @param {*} response レスポンスオブジェクト
 * @param {*} graphs グラフオブジェクトのリスト
 * @returns エッジの彩色されたグラフのリスト
 */
const paintEdges = (response, graphs) => {
  const shortestPathEdgeColor = 'red'
  const labelUpdateTargetColor = 'lightgreen'

  const updateGraph = (from, to, color) => (graph) => {
    const targetEdgeIndex = graph.edges.findIndex(edge => edge.from === from && edge.to === to)
    const updatedEdge = assoc('color', {'color': color}, graph.edges[targetEdgeIndex])
    const updatedEdges = update(targetEdgeIndex, updatedEdge, graph.edges)
    return assoc('edges', updatedEdges, graph)
  }

  // ラベル更新対象ノードへの入りリンクを彩色
  const steps = response.data.search_info.steps;
  let graphsIndex = 0
  const labelUpdateTargetColoredGraph = steps.reduce((acc, cur) => {
    if (graphsIndex === 0) {
      acc.push(graphs[graphsIndex])
      graphsIndex += 1
    }

    acc.push(graphs[graphsIndex])
    graphsIndex += 1

    const targetNodeId = cur.min_cost_node
    const edgeUpdateGraph = cur.adjacent_nodes.reduce((acc_, cur_) => {
      return updateGraph(targetNodeId, cur_, labelUpdateTargetColor)(acc_)
    }, graphs[graphsIndex])
    graphsIndex += 1
    acc.push(edgeUpdateGraph)
    return acc
  }, [])

  // 最短経路を彩色
  const shortestPath = response.data.search_info.shortest_path
  const shortestPathUpdatedGraph = aperture(2, shortestPath).reduce((acc, cur) => {
    const prevNode = cur[0]
    const nextNode = cur[1]
    return updateGraph(prevNode, nextNode, shortestPathEdgeColor)(acc)
  }, labelUpdateTargetColoredGraph.slice(-1)[0])
  return update(-1, shortestPathUpdatedGraph, labelUpdateTargetColoredGraph)
}

export const makeGraphs = (response) => {
  const initialGraph = getInitialGraph(response)
  const nodeColoredGraphs = makeNodeColoredGraphs(response, initialGraph)
  return paintEdges(response, nodeColoredGraphs)
}

/**
 * テーブルリストを作成する。
 * 
 * @param {*} response レスポンスオブジェクト
 * @returns テーブルオブジェクトのリスト
 */
const makeInitialTables = (response) => {
    // 初期テーブル作成
    const graphSize = response.data.search_info.graph_size

    const initialTable = range(0, graphSize).map(index => ({
      id: index,
      fixed: false,
      label: -1,
      prevNode: -1
    }));
    const steps = response.data.search_info.steps
    return steps.reduce((acc, cur) => {
      // コスト最小のノードを更新
      const minCostNode = cur.min_cost_node;
      const lastTable = acc.slice(-1)[0]
      const costUpdatedTable = update(
        minCostNode,
        assoc('fixed', true, lastTable[minCostNode]),
        lastTable
      );
      acc.push(costUpdatedTable)

      // ラベルとひとつ前のノードを更新
      const labelUpdatedTable = costUpdatedTable.map((row, index) => {
        return pipe(
          assoc('label', cur.updated_labels[index]),
          assoc('prevNode', cur.updated_prev_node[index])
        )(row)
      })
      acc.push(labelUpdatedTable)
      return acc
    }, [initialTable])
}

const paintTables = (response, tables) => {
  const minCostNodeColor = 'yellow'
  const costFixedcNodeColor = 'yellow'
  const costUpdateTargetNodeColor = 'lightgreen'

  const updateTable = (nodeId, color) => (table) => {
    const updatedRow = assoc('color', color, table[nodeId])
    return update(nodeId, updatedRow, table)
  }

  let tablesIndex = 0
  const steps = response.data.search_info.steps
  return steps.reduce((acc, cur) => {
    if (tablesIndex === 0) {
      acc.push(tables[tablesIndex])
      tablesIndex += 1
    }

    // コスト確定済ノードの表を彩色
    const costFixedNodeColoredTable = cur.cost_fixed_nodes.reduce((acc, cur) => {
      return updateTable(cur, costFixedcNodeColor)(acc)
    }, tables[tablesIndex])

    // コスト最小ノードの表を彩色
    const minCostNodeIndex = cur.min_cost_node
    const minCostUpdatedTable = updateTable(minCostNodeIndex, minCostNodeColor)(costFixedNodeColoredTable)
    acc.push(minCostUpdatedTable)

    tablesIndex += 1

    // コスト確定済ノードの表を彩色
    const costFixedNodeColoredGraph2 = cur.cost_fixed_nodes.reduce((acc, cur) => {
      return updateTable(cur, costFixedcNodeColor)(acc)
    }, tables[tablesIndex])

    // ラベル更新対象ノードの表を彩色
    const labelUpdateTargetColoredTable = cur.adjacent_nodes.reduce((acc, cur) => {
      return updateTable(cur, costUpdateTargetNodeColor)(acc)
    }, costFixedNodeColoredGraph2)
    acc.push(labelUpdateTargetColoredTable)

    tablesIndex += 1

    return acc
  }, [])
}

export const makeTables = (response) => {
  const initialTables = makeInitialTables(response)
  return paintTables(response, initialTables)
}

export const makeDescriptions = (response) => {
  const steps = response.data.search_info.steps
  let descriptions = [ "Step1 すべてのノードのラベルを無限大(∞)で初期化します。" ]
  let stepNum = 2
  descriptions = steps.reduce((acc, cur) => {
    // ラベル最小ノードを追加
    const minCostNodeStr = "Step" + String(stepNum) + " ラベル未確定ノードのうち, ラベルが最も小さいノード" + cur.min_cost_node + "のラベルを確定します。"
    stepNum += 1
    acc.push(minCostNodeStr)

    // ラベル更新対象ノードを追加
    const labelUpdateNodeStr = "Step" + String(stepNum) + " ノード" + cur.min_cost_node + "に隣接するノード" +  cur.adjacent_nodes.join(",") + "のラベルを更新します。"
    stepNum += 1
    acc.push(labelUpdateNodeStr)

    return acc
  }, descriptions)

  descriptions = descriptions.slice(0, -1)
  const shortestPath = response.data.search_info.shortest_path
  const shortestPathCost = response.data.search_info.shortest_path_cost
  descriptions.push("ゴールノードのラベルが確定したのでアルゴリズム終了です。最短経路は" + shortestPath.join("→") + ", 最短経路のコストは" + shortestPathCost + "です。")
  return descriptions
}

export const drawDijkstraGraph = (id, graphs, currentStep) => {
  const container = document.getElementById(id);
  const data = graphs[currentStep];
  const options = {
    edges: {
      chosen: false,
    },
    // todo: ここをうまいこといじると、リンクの重複を解消できそう
    // 要ドキュメントよみこみ https://visjs.github.io/vis-network/docs/network/
    // physics: {
    //   enabled: true,
    //   hierarchicalRepulsion: {
    //     centralGravity: 0.0,
    //     springLength: 500,
    //     springConstant: 0.01,
    //     nodeDistance: 100,
    //     damping: 0.09
    //   },
    //   solver: 'hierarchicalRepulsion'
    // },
    interaction: {
      dragView: false,
      zoomView: false
    },
    layout: {
      randomSeed: 0
    },
    nodes: {
      chosen: false,
      shape: 'circle',
      margin: {
        left: 11,
        top: 12,
      }
    },
  };
  new vis.Network(container, data, options);
}
