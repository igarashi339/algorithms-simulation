import { Box, Card, createMuiTheme, Divider, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from './Dashboard'
import { NotFound } from './NotFound'
import { routes } from './routes'
import { Header } from './Header'
import { grey } from '@material-ui/core/colors';
import { useGetLayout } from './hooks';
import { SPBar } from './SPBar'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
  },
})

const useStyles = makeStyles(() => ({
  dashboard: {
    position: 'fixed',
    width: '240px',
    height: '100%',
    overflow: 'auto',
    borderRight: '1px solid lightgray'
  },
  wrap: {
    position: 'absolute',
    left: '240px',
    width: 'calc(100% - 240px)',
    height: '100%',
    overflowY: 'scroll',
    backgroundColor: grey[100]
  },
  header: {
    width: 'calc(80% + 80px)',
    margin: '40px auto 0',
    maxWidth: '1080px'
  },
  content: {
    margin: '20px auto 40px',
    width: '80%',
    minHeight: 'calc(100% - 140px - 24px - 40px)',
    maxWidth: '1000px',
    padding: '40px',
  },
  wrapSP: {
    position: 'relative',
    top: '64px',
  },
  headerSP: {
    padding: '8px 0',
    width: '90%',
    margin: 'auto'
  },
  contentSP: {
    margin: 'auto',
    padding: '32px 0',
    width: '90%',
  },

}))

const Routes = () => {
  return (
    <Switch>
      {routes.map((route, index) => (
        <Route exact key={index} path={route.path}>
          {route.component}
        </Route>
      ))}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}

const App = () => {
  const classes = useStyles();
  const layout = useGetLayout();

  return (
    <Router>
      {layout === 'pc' && <>
        <Box className={classes.dashboard}>
          <Dashboard />
        </Box>
        <Box className={classes.wrap}>
          <Box className={classes.header}>
            <Header />
          </Box>
          <Card className={classes.content}>
            <Routes />
          </Card>
        </Box>
      </>}
      {layout === 'sp' && <>
        <SPBar />
        <Box className={classes.wrapSP}>
          <Box className={classes.headerSP}>
            <Header />
          </Box>
          <Divider />
          <Box className={classes.contentSP}>
            <Routes />
          </Box>
        </Box>
      </>}
    </Router>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);