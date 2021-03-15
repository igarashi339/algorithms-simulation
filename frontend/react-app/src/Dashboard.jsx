import { Box, Typography, makeStyles } from '@material-ui/core'
import { amber, grey } from '@material-ui/core/colors';
import { Link, useLocation } from 'react-router-dom';

const contents = [
  {
    name: 'ダイクストラ法',
    path: '/dijkstra'
  },
  {
    name: 'ダミー',
    path: '/dummy'
  },
]

const useStyles = makeStyles(() => ({
  title: {
    padding: '24px',
    backgroundColor: amber[200],
  },
  content: {
    padding: '24px',
    transition: '0.5s',
    '&:hover': {
      backgroundColor: grey[200],
      transition: '0.5s'
    }
  },
  current: {
    color: amber[200]
  }
}));

export const Dashboard = () => {
  const classes = useStyles();
  const location = useLocation();
  const path = location.pathname;

  return (
    <Box>
      <Box className={classes.title}>
        <Link to="/"><Typography color="textSecondary">Algorithms Simulation</Typography></Link>
      </Box>
      {contents.map((content, index) => (
        <Link key={index} to={content.path}>
          <Box className={classes.content}>
            <Typography color={path === content.path ? 'secondary' : 'textSecondary'}>{content.name}</Typography>
          </Box>
        </Link>
      )
      )}
    </Box>
  )
}