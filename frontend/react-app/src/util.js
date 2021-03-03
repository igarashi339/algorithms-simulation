import { assoc } from 'ramda';

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
    return row.type === 'number' ? assoc('value', Number(row.value), row) : row;
  })

  // 配列からオブジェクトに変換
  const obj = result.reduce((acc, cur) => {
    return assoc(cur.key, cur.value, acc)
  }, {})

  // スネークケースに変換
  return toSnakeCaseObject(obj)
}