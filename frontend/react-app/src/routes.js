import { assoc, pipe } from 'ramda'
import { Dijkstra } from './dijkstra/Dijkstra';
import { Home } from './Home';
import { InProgress } from './InProgress';

const home = {
  path: '/',
  component: <Home />
}

// todo: もっといけてる書き方にできる気がする
export const categories = [
  {
    name: '最短経路問題',
    path: '/shortest-path-problem',
    algorithms: [
      {
        name: 'ダイクストラ法',
        path: '/dijkstra',
        contents: [
          {
            name: 'シミュレーション',
            path: '/simulation',
            component: <Dijkstra />
          },
          {
            name: '解説',
            path: '/description',
            component: <InProgress />
          }
        ]
      },
      {
        name: 'ダミーアルゴリズム',
        path: '/dummy-algorithm',
        contents: [
          {
            name: 'シミュレーション',
            path: '/simulation',
          },
          {
            name: '解説',
            path: '/description',
          }
        ]

      },
    ],
  },
  {
    name: 'ダミーカテゴリ',
    path: '/dummy-category',
    algorithms: [
      {
        name: 'ダミーアルゴリズム2',
        path: '/dummy-algorithm2',
        contents: [
          {
            name: 'シミュレーション',
            path: '/simulation',
          },
          {
            name: '解説',
            path: '/description',
          }
        ]
      },
    ],
  },
]

export const routes = categories.reduce((categoryAcc, categoryCur) => {
  const route = categoryCur.algorithms.reduce((algorithmAcc, algorithmCur) => {
    const route = algorithmCur.contents.reduce((contentAcc, contentCur) => {
      if (contentCur.component) {
        const route = assoc('path', categoryCur.path + algorithmCur.path + contentCur.path, contentCur)
        contentAcc.push(route)
      }
      return contentAcc
    }, algorithmAcc)
    return route
  }, categoryAcc)
  return route;
}, [home])