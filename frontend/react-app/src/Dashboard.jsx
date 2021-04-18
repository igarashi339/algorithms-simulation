import { Box, Typography, makeStyles } from '@material-ui/core'
import { amber, grey } from '@material-ui/core/colors';
import { Link, useLocation } from 'react-router-dom';
import { categories } from './routes'
import Logo from "./img/logo.png"
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles(() => ({
  title: {
    padding: '24px',
  },
  logo: {
    width: '100%',
  },
  link: {
    transition: '0.5s',
    '&:hover': {
      backgroundColor: grey[200],
      transition: '0.5s'
    }
  },
  categories: {
    margin: '24px 0 0'
  },
  category: {
    padding: '16px 24px'
  },
  algorithm: {
    padding: '16px 24px 16px 48px',
  },
  content: {
    padding: '16px 24px 16px 72px',
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
    padding: '16px 24px'
  },
  icon: {
    display: 'flex'
  }
}));

export const Dashboard = ({ toggleDrawer }) => {
  const classes = useStyles();
  const location = useLocation();
  const path = location.pathname;

  const onClick = () => {
    return toggleDrawer ? toggleDrawer(false) : () => { }
  }

  return (
    <Box>
      <Box className={classes.title}>
        <Link to="/" onClick={onClick()}>
          <img src={Logo} alt="algorithms simulation" className={classes.logo} />
        </Link>
      </Box>
      {categories.map((category, index) => (
        <Box key={index}>
          <Link to={category.path} onClick={onClick()}>
            <Typography className={classes.category + ' ' + classes.link} color={path === category.path ? 'secondary' : 'textSecondary'}>{category.name}</Typography>
          </Link>
          {category.algorithms.map((algorithm, index) => (
            <Box key={index}>
              <Link to={category.path + algorithm.path} onClick={onClick()}>
                <Typography className={classes.algorithm + ' ' + classes.link} color={path === category.path + algorithm.path ? 'secondary' : 'textSecondary'}>{algorithm.name}</Typography>
              </Link>
            </Box>
          ))}
        </Box>
      ))}
      <Box className={classes.contactUs + ' ' + classes.link} >
        <Link to="/contact-us" onClick={onClick()}>
          <Typography color={path === '/contact-us' ? 'secondary' : 'textSecondary'} className={classes.icon}>
            <InfoOutlinedIcon />お問い合わせ
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}