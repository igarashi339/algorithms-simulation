import { Box, Breadcrumbs, makeStyles, Typography } from '@material-ui/core'
import { deepPurple } from '@material-ui/core/colors';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from './routes'

const useStyles = makeStyles(() => ({
  link: {
    '&:hover': {
      color: deepPurple[500]
    }
  }
}));

export const Header = () => {
  const classes = useStyles();
  const location = useLocation();
  const path = location.pathname;
  const route = routes.find(route => route.path === path)
  const paths = path.split('/').filter(path => path)
  const names = ['ホーム'].concat(route.name.split(' | ').filter(name => name));

  useEffect(() => {
    if (route.name) {
      document.title = 'Algorithms Simulator | ' + route.name
    }
    else {
      document.title = 'Algorithms Simulator'
    }
  }, [route])

  return (
    <Breadcrumbs aria-label="breadcrumb" separator="›">
      {['ホーム'].concat(paths).map((path, index) => <Box key={index}>
        {index !== paths.length && <Link to={'/' + paths.slice(0, index).join('/')}><Typography color="textSecondary" className={classes.link}>{names[index]}</Typography></Link>}
        {index === paths.length && <Typography color="textPrimary">{names[index]}</Typography>}
      </Box>
      )}
    </Breadcrumbs>
  )
}