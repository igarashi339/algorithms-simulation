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
    return;
  }

  const initialGraph = getInitialGraph(response)

  // 各ステップのグラフと表を作成
  const steps = calcSteps(response, initialGraph)
  const graphs = steps.map(step => step.graph);
  const tables = steps.map(step => step.table);

  // 開始ノード、終了ノード、最短経路を色付け
  const startNode = response.data.search_info.start_node;
  const goalNode = response.data.search_info.goal_node;
  const shortestPath = response.data.search_info.shortest_path;
  const coloredGraph = calcColoredGraph(initialGraph, graphs, startNode, goalNode, shortestPath)

  setResult({ graphs: coloredGraph, tables, currentStep: 0 })
  setControl(2)
}

const getInitialGraph = (response) => {
  const graphSize = response.data.search_info.graph_size;
  const costMatrix = response.data.search_info.cost_matrix;
  const parsedMatrix = splitEvery(graphSize, costMatrix);
  const nodes = range(0, graphSize).map(index => ({
    id: index,
    label: String(index)
  }));
  const edges = parsedMatrix.reduce((acc, cur, index) => {
    cur.forEach((cost, cIndex) => {
      if (cost > 0) {
        acc.push({
          from: index,
          to: cIndex,
          label: String(cost),
          arrows: 'to'
        })
      }
    })
    return acc;
  }, [])
  return {
    nodes: nodes,
    edges: edges
  };
}

const calcSteps = (response, graph) => {
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
    const costUpdatedGraph = assoc('nodes', update(minCostNode, assoc('color', 'yellow', graph.nodes[minCostNode]), graph.nodes), graph);
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

const calcColoredGraph = (initialGraph, graphs, startNode, goalNode, shortestPath) => {
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

