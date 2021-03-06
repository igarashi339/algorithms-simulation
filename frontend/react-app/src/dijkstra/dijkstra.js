import { assoc, pipe, range, splitEvery } from 'ramda';

export const parseDijkstraResponse = (response, setResult, setControl) => {
  if (response.data.status === 'OK') {
    const graphSize = response.data.search_info.graph_size;
    const costMatrix = response.data.search_info.cost_matrix;
    const parsedMatrix = splitEvery(graphSize, costMatrix);
    const nodes = range(0, graphSize).map(index => {
      return pipe(
        assoc('id', index),
        assoc('label', String(index + 1))
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
    setResult({ nodes, edges })
    setControl(2)
  }
  
  // エラーの場合はなんかする
  else {
    setResult(response.data.error_message)
    setControl(3)
  }
}