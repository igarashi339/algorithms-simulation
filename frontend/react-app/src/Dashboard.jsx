import { Box, Typography, makeStyles } from '@material-ui/core'
import { amber, grey } from '@material-ui/core/colors';
import { Link, useLocation } from 'react-router-dom';
import { categories } from './routes'

const useStyles = makeStyles(() => ({
  title: {
    padding: '24px',
    backgroundColor: amber[200],
  },
  category: {
    padding: '24px'
  },
  content: {
    padding: '24px 24px 24px 48px',
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
      {categories.map((category, index) => (
        <Box key={index}>
          <Typography className={classes.category} color="textSecondary">{category.name}</Typography>
          {category.contents.map((content, index) => (
            <Link key={index} to={category.path + content.path}>
              <Box className={classes.content}>
                <Typography color={path === category.path + content.path ? 'secondary' : 'textSecondary'}>{content.name}</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )
      )}
    </Box>
  )
}