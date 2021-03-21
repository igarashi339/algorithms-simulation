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

  const initialGraph = getInitialGraph(response)
  const coloredGraph = makeColoredGraphs(response, initialGraph)

  // 各ステップのグラフと表を作成
  const steps = calcSteps(response, initialGraph)
  const tables = steps.map(step => step.table);

  setResult({ graphs: coloredGraph, tables, currentStep: 0 })
  setControl(2)
}

export const getInitialGraph= (response) => {
  const graphSize = response.data.search_info.graph_size;
  const costMatrix = response.data.search_info.cost_matrix;
  const parsedMatrix = splitEvery(graphSize, costMatrix);
  const nodes = range(0, graphSize).map(index => ({
    id: index,
    label: String(index),
    color: undefined
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

// ベースになるgraphsを作成 -> ndoeを着色 -> edgeを着色
// という流れにしたほうが見通しがよい
export const makeColoredGraphs = (response, graph)  => {
  const minCostNodeColor = 'yellow'
  const labelUpdateNodeColor = 'lightgreen'
  const shortestPathColor = 'salmon'
  const startNodeColor = 'red'
  const goalNodeColor = 'red'

  const updateGraph = (nodeId, color) => (graph) => {
    const updatedNode = assoc('color', color, graph.nodes[nodeId])
    const updatedNodes = update(nodeId, updatedNode, graph.nodes)
    return assoc('nodes', updatedNodes, graph)
  }

  const steps = response.data.search_info.steps;
  const coloredGraphs = steps.reduce((acc, cur) => {
    // コスト最小ノードの色を更新
    const mincostNodeColoredGraph = updateGraph(cur.min_cost_node, minCostNodeColor)(graph)
    acc.push(mincostNodeColoredGraph)
    // ラベル更新対象ノードの色を更新
    const labelUpdateNodeColoredGraph = cur.adjacent_nodes.reduce((acc, cur) => {
      return updateGraph(cur, labelUpdateNodeColor)(acc)
    }, graph)
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

export const calcSteps = (response, graph) => {
  // 初期テーブル作成
  const graphSize = response.data.search_info.graph_size;
  const initialTable = range(0, graphSize).map(index => ({
    id: index,
    fixed: false,
    label: -1,
    prevNode: -1
  }));

  return response.data.search_info.steps.reduce((acc, cur) => {
    // コスト最小のノードを更新
    const minCostNode = cur.min_cost_node;
    const last = acc.slice(-1)[0];
    const lastTable = last.table;
    const costUpdatedTable = update(
      minCostNode,
      assoc('fixed', true, lastTable[minCostNode]),
      lastTable
    );
    const costUpdatedGraph = assoc('nodes', 
                                   update(minCostNode, assoc('color', 'yellow', graph.nodes[minCostNode]), graph.nodes), graph);
    acc.push({ graph: costUpdatedGraph, table: costUpdatedTable });

    // ラベルとひとつ前のノードを更新
    const labelUpdatedTable = costUpdatedTable.map((row, index) => {
      return pipe(
        assoc('label', cur.updated_labels[index]),
        assoc('prevNode', cur.updated_prev_node[index])
      )(row)
    })

    // 隣接するノードを色付け
    const labelUpdatedGraph = cur.adjacent_nodes.reduce((acc, cur) => {
      return assoc('nodes', update(cur, assoc('color', 'lightgreen', acc.nodes[cur]), acc.nodes), acc)
    }, graph)
    acc.push({ graph: labelUpdatedGraph, table: labelUpdatedTable })

    return acc;
  }, [{ graph: graph, table: initialTable }])
}

export const calcColoredGraph = (initialGraph, graphs, startNode, goalNode, shortestPath) => {
  const colordedEdges = initialGraph.edges.map(edge => {
    if (aperture(2, shortestPath).some(([from, to]) => (edge.from === from && edge.to === to))) {
      return assoc('color', { color: 'red' }, edge)
    }
    else {
      return pipe(assoc('color', { opacity: '0.3' }), assoc('font', {color: 'lightgray'}))(edge)
    }
  })

  const coloredNodes = pipe(
    update(startNode, assoc('color', 'red', initialGraph.nodes[startNode])),
    update(goalNode, assoc('color', 'red', initialGraph.nodes[goalNode]))
  )(initialGraph.nodes.map(node => shortestPath.includes(node.id) ? assoc('color', 'salmon', node) : node));
  
  return update(
    graphs.length - 1,
    pipe(
      assoc('edges', colordedEdges),
      assoc('nodes', coloredNodes)
    )(graphs.slice(-1)[0]),
    graphs
  );
}

export const drawDijkstraGraph = (id, graphs, currentStep) => {
  const container = document.getElementById(id);
  const data = graphs[currentStep];
  const options = {
    edges: {
      chosen: false,
      color: {
        color: '#848484'
      }
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
      chosen: false
    },
  };
  new vis.Network(container, data, options);
}

