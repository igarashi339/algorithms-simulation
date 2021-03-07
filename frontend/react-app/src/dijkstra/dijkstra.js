import { assoc, pipe, range, splitEvery, update } from 'ramda';

export const parseDijkstraResponse = (response, setResult, setControl) => {
  if (response.data.status === 'OK') {

    // 基本のグラフ
    const graphSize = response.data.search_info.graph_size;
    const costMatrix = response.data.search_info.cost_matrix;
    const parsedMatrix = splitEvery(graphSize, costMatrix);
    const nodes = range(0, graphSize).map(index => {
      return pipe(
        assoc('id', index),
        assoc('label', String(index))
      )({})
    });
    const edges = [];
    parsedMatrix.forEach((row, rIndex) => {
      row.forEach((cost, cIndex) => {
        if (cost > 0) {
          edges.push({
            from: rIndex,
            to: cIndex,
            label: String(cost),
            arrows: 'to'
          })
        }
      })
    })

    // 各ステップの表
    const initialStep = range(0, graphSize).map(index => {
      return pipe(
        assoc('id', index),
        assoc('fixed', false),
        assoc('label', -1),
        assoc('prevNode', -1)
      )({})
    });
    const steps = response.data.search_info.steps.reduce((acc, cur) => {

      // コスト最小のノードを更新
      const minCostNode = cur.min_cost_node;
      const last = acc.slice(-1)[0];
      const updateLabel = update(
        minCostNode,
        assoc('fixed', true, last[minCostNode]),
        last
      );
      acc.push(updateLabel);

      // ラベルとひとつ前のノードを更新
      const updatePrevNode = updateLabel.map((row, index) => {
        return pipe(
          assoc('label', cur.updated_labels[index]),
          assoc('prevNode', cur.updated_prev_node[index])
        )(row)
      })
      acc.push(updatePrevNode)

      return acc
    }, [initialStep])
    const currentStep = 0;
    setResult({ nodes, edges, steps, currentStep })
    setControl(2)
  }

  // エラーの場合はなんかする
  else {
    setResult(response.data.error_message)
    setControl(3)
  }
}