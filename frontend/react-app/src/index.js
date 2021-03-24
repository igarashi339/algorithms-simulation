import { Box, createMuiTheme, Divider, makeStyles, ThemeProvider } from '@material-ui/core';
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
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh'
  },
  dashboard: {
    flexBasis: '240px',
    height: '100%',
    minWidth: '240px'
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