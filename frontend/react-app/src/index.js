import { Box, Card, createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from './Dashboard'
import { NotFound } from './NotFound'
import { routes } from './routes'
import { grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
  },
})

const useStyles = makeStyles(() => ({
  dashboard: {
    position: 'fixed',
    width: '280px',
    height: '100%',
    overflow: 'auto',
    borderRight: '1px solid lightgray'
  },
  wrap: {
    position: 'absolute',
    left: '280px',
    width: 'calc(100% - 280px)',
    height: '100%',
    overflowY: 'scroll',
    backgroundColor: grey[50]
  },
  content: {
    margin: '40px auto',
    width: 'calc(80%)',
    minHeight: 'calc(100% - 160px)',
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
        <Card className={classes.content}>
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
        </Card>
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