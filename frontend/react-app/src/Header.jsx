import { Box, Breadcrumbs, makeStyles, Typography } from '@material-ui/core'
import { deepPurple } from '@material-ui/core/colors';
import { Link, useLocation } from 'react-router-dom';

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
  const paths = path.split('/').filter(path => path);

  return (
    <Breadcrumbs aria-label="breadcrumb" separator="›">
      {['home'].concat(paths).map((path, index) => <Box key={index}>
        {index !== paths.length && <Link to={'/' + paths.slice(0, index).join('/')}><Typography color="textSecondary" className={classes.link}>{path}</Typography></Link>}
        {index === paths.length && <Typography color="textPrimary">{path}</Typography>}
      </Box>
      )}
    </Breadcrumbs>
  )
}