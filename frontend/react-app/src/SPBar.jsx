import { AppBar, Box, Drawer, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { Dashboard } from './Dashboard';
import { useState } from 'react'
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  appbar: {
    height: '64px'
  },
  toolbar: {
    height: '64px',
    padding: '0 16px'
  },
  link: {
    position: 'absolute',
    left: '46%',
    transform: 'translate(-46%, 0)'
  },
  title: {
    color: 'white',
  },
  dashboard: {
    width: '200px'
  }
}))

export const SPBar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const toggleDrawer = (open) => (event) => {
    setOpen(open)
  }
  return (<>
    <AppBar position="fixed" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Link to="/" className={classes.link}><Typography className={classes.title}>Algorithms Simulation</Typography></Link>
      </Toolbar>
    </AppBar>
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box className={classes.dashboard}>
        <Dashboard toggleDrawer={toggleDrawer} />
      </Box>
    </Drawer>
  </>)
}