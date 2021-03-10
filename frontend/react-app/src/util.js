import { assoc } from 'ramda';
import * as vis from 'vis';

export const toSnakeCase = (str) => {
  return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

export const toSnakeCaseObject = (obj) => {
  return Object.keys(obj).reduce((acc, cur) => {
    return assoc(toSnakeCase(cur), obj[cur], acc)
  }, {})
}

export const createRequestBody = (arr) => {

  // 入力の期待値が数値のものを数値に変換
  const result = arr.map(row => {
    return row.type === 'number' ? assoc('value', parseInt(row.value), row) : row;
  })

  // 配列からオブジェクトに変換
  const obj = result.reduce((acc, cur) => {
    return assoc(cur.key, cur.value, acc)
  }, {})

  // スネークケースに変換
  return toSnakeCaseObject(obj)
}

export const drawGraph = (id, graphs, currentStep) => {
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