import { Box, createMuiTheme, Divider, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from './Dashboard'
import { NotFound } from './NotFound'
import { Dijkstra } from './dijkstra/Dijkstra';
import { Home } from './Home';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
  },
})

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh'
  },
  dashboard: {
    flexBasis: '220px',
    height: '100%',
    minWidth: '220px'
  },
  content: {
    flexGrow: '1',
    width: 'calc(100% - 80px)',
    height: 'calc(100% - 80px)',
    padding: '40px',
    overflow: 'auto'
  }
}))

const App = () => {
  const classes = useStyles();
  
  return (
    <Router>
      <Box className={classes.root}>
        <Box className={classes.dashboard}>
          <Dashboard />
        </Box>
        <Divider orientation="vertical" />
        <Box className={classes.content}>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/dijkstra'>
              <Dijkstra />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Box>
      </Box>
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