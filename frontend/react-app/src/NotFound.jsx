import { Box, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ErrorOutline } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center'
  },
  img: {
    width: '30%',
    height: 'auto'
  },
  link: {
    paddingTop: '40px'
  }
}))

export const NotFound = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <ErrorOutline className={classes.img} />
      <Typography>Page Not Found</Typography>
      <Link className={classes.link} to="/"><Typography>ホームに戻る</Typography></Link>
    </Box>
  )
}