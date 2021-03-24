import { assoc } from 'ramda'
import { Dijkstra } from './dijkstra/Dijkstra';
import { Home } from './Home';

const home = {
  path: '/',
  component: <Home />
}
export const categories = [
  {
    name: '最短経路問題',
    path: '/shortest-path-problem',
    contents: [
      {
        name: 'ダイクストラ法',
        path: '/dijkstra',
        component: <Dijkstra />

      },
      {
        name: 'ダミーコンテンツ',
        path: '/dummy'
      },
    ],
  },
  {
    name: 'ダミーカテゴリ',
    path: '/dummy',
    contents: [
      {
        name: 'ダミーコンテンツ',
        path: '/dummy'
      }
    ]
  }
]

export const routes = categories.reduce((categoryAcc, categoryCur) => {
  const route = categoryCur.contents.reduce((contentAcc, contentCur) => {
    if (contentCur.component) {
      const route = assoc('path', categoryCur.path + contentCur.path, contentCur)
      contentAcc.push(route)
    }
    return contentAcc
  }, categoryAcc)
  return route;
}, [home])