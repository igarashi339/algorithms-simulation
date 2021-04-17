export const dijkstraInputs = [
  {
    key: 'startNode',
    value: 0,
    label: '開始ノード',
    type: 'number'
  },
  {
    key: 'goalNode',
    value: 4,
    label: '終了ノード',
    type: 'number'
  },
  {
    key: 'nodeNum',
    value: '5',
    label: 'ノード数',
    type: 'number'
  },
  {
    key: 'costMatrix',
    value: `-1 5 8 -1 -1 \n-1 -1 1 3 10 \n3 -1 -1 1 7 \n-1 4 -1 -1 5 \n-1 -1 -1 -1 -1`,
    label: 'コスト行列',
    type: 'string',
    multiline: true
  }
];