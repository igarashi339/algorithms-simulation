import { TextField, makeStyles, Box, Button, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { assoc, update } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { dijkstraInputs } from '../data';
import { createRequestBody, drawGraph } from '../util';
import { parseDijkstraResponse } from './dijkstra';
import { DijkstraStepper } from './DijkstraStepper';
import { DijkstraTable } from './DijkstraTable';

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles(() => ({
  root: {
    width: 'calc(100% - 80px)',
    maxWidth: '1000px',
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
  content: {
    display: 'flex'
  },
  graph: {
    flexBasis: '50%',
    height: '400px'
  },
  table: {
    flexBasis: '50%'
  },
  stepper: {
    width: '100%'
  }
}))

export const Dijkstra = () => {
  const classes = useStyles();

  // 入力
  const [inputs, setInputs] = useState(dijkstraInputs);

  // 結果
  const [result, setResult] = useState(null);

  // 画面制御
  // 0: 初期状態, 1: ロード中, 2: 正常(経路探索成功), 3: 正常(経路探索失敗), 4: 異常
  const [control, setControl] = useState(0)

  // インプットフィールド制御
  const onChange = index => event => {
    const value = event.target.value;
    setInputs(update(index, assoc('value', value, inputs[index]), inputs))
  }

  const setCurrentStep = useCallback((currentStep) => {
    setResult(assoc('currentStep', currentStep, result))
  }, [result])

  // リクエスト送信
  const onClick = async () => {
    setControl(1);
    try {
      const response = await axios.post(API_URL + '/dijkstra/', createRequestBody(inputs))

      // レスポンスを整形する
      parseDijkstraResponse(response, setResult, setControl)
    }
    // エラーの時はなんかする
    catch (error) {
      console.log(error)
      setResult('何らかのエラー')
      setControl(4);
    }
  }

  useEffect(() => {
    if (control === 2) {
      drawGraph('dijkstra', result.graphs, result.currentStep)
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
      {control === 2 && <>
        <Box className={classes.content}>
          {/* グラフ */}
          <Box id="dijkstra" className={classes.graph} />
          {/* 表 */}
          <Box className={classes.table}>
            <DijkstraTable steps={result.tables[result.currentStep]} />
          </Box>
        </Box>
        {/* ステッパー */}
        <DijkstraStepper
          className={classes.stepper}
          currentStep={result.currentStep}
          length={result.tables.length}
          setCurrentStep={setCurrentStep}
        />
      </>}
      {control === 3 && <Box>{result}</Box>}
      {control === 4 && <Box>{result}</Box>}
    </Box>
  )
}