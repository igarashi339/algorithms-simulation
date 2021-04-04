import { Box, Typography, makeStyles } from '@material-ui/core'
import { amber, grey } from '@material-ui/core/colors';
import { ClassRounded } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { categories } from './routes'

const useStyles = makeStyles(() => ({
  title: {
    padding: '24px',
    backgroundColor: amber[200],
  },
  categories: {
    margin: '24px 0 0'
  },
  category: {
    padding: '8px 24px'
  },
  algorithm: {
    padding: '8px 24px 8px 48px',
  },
  content: {
    padding: '8px 24px 8px 72px',
    transition: '0.5s',
    '&:hover': {
      backgroundColor: grey[200],
      transition: '0.5s'
    }
  },
  current: {
    color: amber[200]
  },
  contactUs: {
    padding: '24px',
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
        <Box key={index} className={classes.categories}>
          <Typography className={classes.category} color="textSecondary">{category.name}</Typography>
          {category.algorithms.map((algorithm, index) => (
            <Box key={index}>
              <Typography className={classes.algorithm} color="textSecondary">{algorithm.name}</Typography>
              {algorithm.contents.map((content, index) => (
                <Link key={index} to={category.path + algorithm.path + content.path}>
                  <Box className={classes.content}>
                    <Typography color={path === category.path + algorithm.path + content.path ? 'secondary' : 'textSecondary'}>{content.name}</Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          ))}
        </Box>
      ))}
      <Box className={classes.contactUs}>
        <Link to="/contact-us">ご意見・お問い合わせ</Link>
      </Box>
    </Box>
  )
}