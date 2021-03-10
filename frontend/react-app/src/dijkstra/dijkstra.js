import { aperture, assoc, pipe, range, splitEvery, update } from 'ramda';

export const parseDijkstraResponse = (response, setResult, setControl) => {
  if (response.data.status === 'OK') {

    // グラフの素
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
    const initialGraph = {
      nodes: nodes,
      edges: edges
    };

    // 表の素
    const initialTable = range(0, graphSize).map(index => ({
      id: index,
      fixed: false,
      label: -1,
      prevNode: -1
    }));

    // 各ステップのグラフと表を作成
    const steps = response.data.search_info.steps.reduce((acc, cur) => {

      // コスト最小のノードを更新
      const minCostNode = cur.min_cost_node;
      const last = acc.slice(-1)[0];
      const lastTable = last.table;
      const costUpdatedTable = update(
        minCostNode,
        assoc('fixed', true, lastTable[minCostNode]),
        lastTable
      );
      const costUpdatedGraph = assoc('nodes', update(minCostNode, assoc('color', 'yellow', nodes[minCostNode]), nodes), initialGraph);
      acc.push({ graph: costUpdatedGraph, table: costUpdatedTable });

      // ラベルとひとつ前のノードを更新
      const labelUpdatedTable = costUpdatedTable.map((row, index) => {
        return pipe(
          assoc('label', cur.updated_labels[index]),
          assoc('prevNode', cur.updated_prev_node[index])
        )(row)
      })

      // todo: 隣接するノードを色付け
      const labelUpdatedGraph = initialGraph;
      acc.push({ graph: labelUpdatedGraph, table: labelUpdatedTable })

      return acc;
    }, [{ graph: initialGraph, table: initialTable }])

    const graphs = steps.map(step => step.graph);
    const tables = steps.map(step => step.table);

    // 開始ノード、終了ノード、最短経路を色付け
    const colordedEdges = edges.map(edge => {
      if (aperture(2, response.data.search_info.shortest_path).some(([from, to]) => (edge.from === from && edge.to === to))) {
        return assoc('color', { color: 'red' }, edge)
      }
      else {
        return pipe(assoc('color', { opacity: '0.3' }), assoc('font', {color: 'lightgray'}))(edge)
      }
    })
    const coloredNodes = pipe(
      update(response.data.search_info.start_node, assoc('color', 'red', nodes[response.data.search_info.start_node])),
      update(response.data.search_info.goal_node, assoc('color', 'red', nodes[response.data.search_info.goal_node]))
    )(nodes.map(node => response.data.search_info.shortest_path.includes(node.id) ? assoc('color', 'salmon', node) : node));
    const coloredGraph = update(
      graphs.length - 1,
      pipe(
        assoc('edges', colordedEdges),
        assoc('nodes', coloredNodes)
      )(graphs.slice(-1)[0]),
      graphs
    );

    setResult({ graphs: coloredGraph, tables, currentStep: 0 })
    setControl(2)
  }

  // エラーの場合はなんかする
  else {
    setResult(response.data.error_message)
    setControl(3)
  }
}