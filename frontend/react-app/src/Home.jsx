import { Typography, Box } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export const Home = () => {
  return (
    <Box>
      <Typography variant="body1" gutterBottom>
          いろいろなアルゴリズムをシミュレーションできるWebアプリです。
      </Typography>
      <Typography variant="body1" gutterBottom>
          大学や専門学校の情報科で扱うアルゴリズムのうち、特につまずきがちなものを扱っています。
      </Typography>
      <Typography variant="body1" gutterBottom>
          アルゴリズムのイメージをつかむ練習や学校の課題の答え合わせに使ってみてください。
      </Typography>
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItemLink href="/shortest-path-problem/dijkstra">
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText primary="ダイクストラ法" />
        </ListItemLink>
      </List>
    </Box>
  )
}