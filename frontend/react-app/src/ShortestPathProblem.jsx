import { Typography, Box, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Graphs from "./img/graphs.PNG"
import CostMatrix from "./img/cost_matrix.png"

const useStyles = makeStyles(() => ({
    textWrap: {
        paddingBottom: "20px"
    },
    imageWrap: {
        textAlign: "center"
    },
    graphImage: {
        width : "40%",
        minWidth: '250px'
    },
    costMatrixImage: {
        width : "30%",
        minWidth: '200px'
    }
}));

export const ShortestPathProblem = () => {
    const classes = useStyles()
  return (
      <Box>
        <Typography variant="h5" gutterBottom>
            最短経路問題
        </Typography>
        <Box className={classes.textWrap}>
            <Typography variant="body1" gutterBottom>
                グラフ中のスタートとゴールをつなぐ経路のうち、最もコストが小さいものを求める問題を最短経路問題と呼びます。
            </Typography>
            <Typography variant="body1" gutterBottom>
                グラフはノードをリンクでつないだデータ構造です。道路ネットワークやSNS上の人間関係を表現したりするのに用いられます。
            </Typography>
            <Typography variant="body1" gutterBottom>
                グラフ、およびそのグラフ上の最短経路の例を図1に示します。最短経路は0 → 1 → 2 → 3 → 4, 最短経路のコストは12です。
            </Typography>
            <figure className={classes.imageWrap}>
                <img src={Graphs} alt="graph" className={classes.graphImage}/>
                <figcaption>図1. グラフおよび最短経路の例</figcaption>
            </figure>         
            <Typography variant="body1" gutterBottom>
                グラフの表現としてはコスト行列を用いることが一般的です。図1のグラフのコスト行列を図2に示します。
            </Typography>
            <Typography variant="body1" gutterBottom>
                コスト行列のi行j列はリンクijのコストを表しています。
                ノードiからノードjへのリンクが存在しない場合、コスト行列のi行j列には無効値(∞ や -1など)が格納されます。
                このWebサイトではコスト行列の無効値として-1を用いています。
            </Typography>
            <figure className={classes.imageWrap}>
                <img src={CostMatrix} alt="graph" className={classes.costMatrixImage}/>
                <figcaption>図2. コスト行列の例</figcaption>
            </figure>    
            <Typography variant="body1" gutterBottom>
                図1のグラフはノード番号が0から始まるので、図2のコスト行列も行番号・列番号が0から始まることに注意してください。
            </Typography>
            <Typography variant="body1" gutterBottom>
                コスト行列の0行2列は8です。これは、グラフにおいてノード0から2のコストが8であることに対応しています。
            </Typography>
            <Typography variant="body1" gutterBottom>
                コスト行列の0行3列は-1です。これは、グラフにおいてノード0から3へのリンクが存在しないことに対応しています。
            </Typography>
            <Typography variant="body1" gutterBottom>
                コスト行列の対角要素はすべて-1です。これは、グラフ中に自分自身に戻ってくるリンクが存在しないことに対応しています。
            </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
            アルゴリズム
        </Typography>
        <Box className={classes.textWrap}>
            <Typography variant="body1" gutterBottom>
                最短経路問題に対するアルゴリズムとしては、ダイクストラ法、ワーシャル・フロイド法、ベルマンフォード法などが有名です。
            </Typography>
            <Typography variant="body1" gutterBottom>
                このWebサイトでは<Link to="/shortest-path-problem/dijkstra">ダイクストラ法のシミュレーション</Link>ができるので理解を深めたい方は活用してみてください。
            </Typography>
        </Box>
      </Box>
  )
}