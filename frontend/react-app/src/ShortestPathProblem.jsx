import { Typography, Box, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import GraphImage from "./img/graph.PNG"
import ShortestPathImage from "./img/shortest_path.PNG"
import Graphs from "./img/graphs.PNG"

const useStyles = makeStyles(() => ({
    graphImage: {
        width : "50%",
        minWidth: '250px',
    }
}));

export const ShortestPathProblem = () => {
    const classes = useStyles()
  return (
      <Box>
        <Typography variant="h5" gutterBottom>
            概要
        </Typography>
        <Box paddingBottom="20px">
            <Typography variant="body1" gutterBottom>
                グラフ中のスタートとゴールをつなぐ経路のうち、最もコストが小さいものを求める問題を最短経路問題と呼びます。
            </Typography>
            <Typography variant="body1" gutterBottom>
                グラフはノードをリンクでつないだデータ構造です。道路ネットワークやSNS上の人間関係を表現したりするのに用いられます。
            </Typography>
            <img src={Graphs} alt="graph" className={classes.graphImage}/>
            <Typography variant="body1" gutterBottom>
                グラフの表現としてはコスト行列を用いることが一般的です。コスト行列のi行j列はリンクijのコストを表しています。
                ノードiからノードjへのリンクが存在しない場合、コスト行列のi行j列には無効値(∞, -1など)が格納されます。
            </Typography>
            <Typography variant="body1" gutterBottom>
                例えば、下の図の左のグラフに対応するコスト行列は右の行列になります。
            </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
            アルゴリズム
        </Typography>
        <Typography>
            最短経路問題に対するアルゴリズムとしては、ダイクストラ法、ワーシャル・フロイド法、ベルマンフォード法などが有名です。
        </Typography>
      </Box>
  )
}