import { Box, createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from './Dashboard'
import { NotFound } from './NotFound'
import { routes } from './routes'

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
    position: 'relative',
    left: '240px',
    width: 'calc(100% - 240px)',
    height: 'calc(100% - 80px)',
    overflow: 'auto'
  },
  content: {
    position: 'relative',
    margin: 'auto',
    width: 'calc(100% - 80px)',
    height: '100%',
    maxWidth: '1000px',
    padding: '40px',
  }
}))

const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <Box className={classes.dashboard}>
        <Dashboard />
      </Box>
      <Box className={classes.wrap}>
        <Box className={classes.content}>
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