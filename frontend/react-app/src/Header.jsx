import { Box, Breadcrumbs, makeStyles, Typography } from '@material-ui/core'
import { deepPurple } from '@material-ui/core/colors';
import { Link, useLocation } from 'react-router-dom';
import { useHeader } from './hooks'

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
  const { names, paths, status } = useHeader(location);

  return (<>
    {status &&
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        {['ホーム'].concat(paths).map((path, index) => <Box key={index}>
          {index !== paths.length && <Link to={'/' + paths.slice(0, index).join('/')}><Typography color="textSecondary" className={classes.link}>{names[index]}</Typography></Link>}
          {index === paths.length && <Typography color="textPrimary">{names[index]}</Typography>}
        </Box>
        )}
      </Breadcrumbs>
    }
    {!status &&
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        <Typography color="textPrimary">{"ページが存在しません"}</Typography>
      </Breadcrumbs>
    }
  </>)
}