import { Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const ListItemLink = (props) => {
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