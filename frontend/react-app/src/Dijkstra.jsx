import { TextField, makeStyles, Box, Button, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { assoc, pipe, range, splitEvery, update } from 'ramda';
import { useEffect, useState } from 'react';
import { dijkstraInputs } from './data'
import { createRequestBody } from './util'
import * as vis from 'vis';

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles(() => ({
  root: {
    width: 'calc(100% - 80px)',
    maxWidth: '600px',
    height: 'calc(100% - 80px)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    marginBottom: '20px'
  },
  circular: {
    margin: '24px auto'
  },
  network: {
    width: '100%',
    height: '400px'
  }
}))

export const Dijkstra = () => {
  const classes = useStyles();

  // 入力
  const [inputs, setInputs] = useState(dijkstraInputs);

  // 結果
  const [result, setResult] = useState(null);

  // 画面制御
  // 0: 初期状態, 1: ロード中, 2: 正常, 3: 異常
  const [control, setControl] = useState(0)

  // インプットフィールド制御
  const onChange = index => event => {
    const value = event.target.value;
    setInputs(update(index, assoc('value', value, inputs[index]), inputs))
  }

  // リクエスト送信
  const onClick = async () => {
    setControl(1);
    const response = await axios.post(API_URL + '/dijkstra/', createRequestBody(inputs))

    // レスポンスを整形する
    if (response.data.status === 'OK') {
      const graphSize = response.data.search_info.graph_size;
      const costMatrix = response.data.search_info.cost_matrix;
      const parsedMatrix = splitEvery(graphSize, costMatrix);
      const nodes = range(0, graphSize).map(index => {
        return pipe(
          assoc('id', index),
          assoc('label', String(index + 1))
        )({})
      });
      const edges = [];
      parsedMatrix.forEach((row, rIndex) => {
        row.forEach((cost, cIndex) => {
          if (cost > 0) {
            edges.push({
              from: rIndex,
              to: cIndex,
              label: String(cost),
              arrows: 'to'
            })
          }
        })
      })
      setResult({ nodes, edges })
      setControl(2)
    }
    // エラーの場合はなんかする
    else {
      setResult(response.data.error_message)
      setControl(3)
    }
  }

  const drawGraph = (nodes, edges) => {
    const container = document.getElementById('network');
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {
      edges: {
        chosen: false
      },
      interaction: {
        dragView: false,
        zoomView: false
      },
      layout: {
        randomSeed: 0
      },
      nodes: {
        chosen: false
      },
    };
    new vis.Network(container, data, options);
  }

  useEffect(() => {
    if (control === 2) {
      drawGraph(result.nodes, result.edges)
    }
  }, [control, result])

  return (
    <Box className={classes.root}>
      {inputs.map((row, index) =>
        <TextField
          key={index}
          className={classes.textField}
          variant="outlined"
          type={row.type}
          label={row.label}
          value={row.value}
          onChange={onChange(index)}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
      >
        {'シミュレーション開始'}
      </Button>
      {control === 1 && <CircularProgress className={classes.circular} />}
      {control === 2 && <Box id="network" className={classes.network} />}
      {control === 3 && <Box>{result}</Box>}
    </Box>
  )
}