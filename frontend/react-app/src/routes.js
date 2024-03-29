import { assoc, pipe } from 'ramda'
import { Dijkstra } from './dijkstra/Dijkstra';
import { Home } from './Home';
import { InProgress } from './InProgress';
import { ShortestPathProblem } from './ShortestPathProblem';
import { ContactUs } from './ContactUs';

const home = {
  name: '',
  path: '/',
  component: <Home />
}

const contactUs = {
  name: 'お問い合わせ',
  path: '/contact-us',
  component: <ContactUs />
}

// todo: もっといけてる書き方にできる気がする
export const categories = [
  {
    name: '最短経路問題',
    path: '/shortest-path-problem',
    component: <ShortestPathProblem />,
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
      }
    ],
  }
]

export const routes = categories.reduce((categoryAcc, categoryCur) => {
  const route = categoryCur.algorithms.reduce((algorithmAcc, algorithmCur) => {
    const route = algorithmCur.contents.reduce((contentAcc, contentCur) => {
      if (contentCur.component) {
        const content = pipe(
          assoc('path', categoryCur.path + algorithmCur.path + contentCur.path),
          assoc('name', contentCur.name + ' | ' + algorithmCur.name + ' | ' + categoryCur.name)
        )(contentCur)
        contentAcc.push(content)
      }
      return contentAcc
    }, algorithmAcc)
    if (algorithmCur.component) {
      const algorithm = pipe(
        assoc('path', categoryCur.path + algorithmCur.path),
        assoc('name', algorithmCur.name + ' | ' + categoryCur.name)
      )(algorithmCur)
      route.push(algorithm)
    }
    return route
  }, categoryAcc)
  if (categoryCur.component) {
    route.push(categoryCur)
  }
  return route;
}, [contactUs, home])