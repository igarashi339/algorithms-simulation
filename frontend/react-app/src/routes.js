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
    component: <InProgress />,
    algorithms: [
      {
        name: 'ダイクストラ法',
        path: '/dijkstra',
        component: <Dijkstra />,
        contents: [
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
        const content = pipe(
          assoc('path', categoryCur.path + algorithmCur.path + contentCur.path),
          assoc('name', categoryCur.name + algorithmCur.name + contentCur.name)
        )(contentCur)
        contentAcc.push(content)
      }
      return contentAcc
    }, algorithmAcc)
    if (algorithmCur.component) {
      const algorithm = pipe(
        assoc('path', categoryCur.path + algorithmCur.path),
        assoc('name', categoryCur.name + algorithmCur.name)
      )(algorithmCur)
      route.push(algorithm)
    }
    return route
  }, categoryAcc)
  if (categoryCur.component) {
    route.push(categoryCur)
  }
  return route;
}, [home])