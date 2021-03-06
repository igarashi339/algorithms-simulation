import { TextField, makeStyles, Box, Button, CircularProgress } from '@material-ui/core';
import { assoc, update } from 'ramda';
import { useEffect, useState } from 'react';
import { drawDijkstraGraph, dijkstraParser } from './dijkstra';
import { DijkstraStepper } from './DijkstraStepper';
import { DijkstraTable } from './DijkstraTable';
import { dijkstraInputs } from './inputs';
import { useGetResponse } from '../hooks'

const useStyles = makeStyles(() => ({
  root: {
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
  const { control, result, execute, setResult } = useGetResponse('dijkstra', dijkstraParser);

  // インプットフィールド制御
  const onChange = index => event => {
    const value = event.target.value;
    setInputs(update(index, assoc('value', value, inputs[index]), inputs))
  }

  const setCurrentStep = (currentStep) => {
    setResult(assoc('currentStep', currentStep, result))
  }

  const onClick = () => {
    execute(inputs)
  }

  useEffect(() => {
    if (control === 2) {
      drawDijkstraGraph('dijkstra', result.graphs, result.currentStep)
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