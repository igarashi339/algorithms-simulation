import { TextField, makeStyles, Box, Button } from '@material-ui/core';
import axios from 'axios';
import { assoc, update } from 'ramda';
import { useState } from 'react';
import { dijkstraInput } from './data'
import { createRequestBody } from './util'

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
  }
}))

export const Dijkstra = () => {
  const classes = useStyles();

  // 入力
  const [inputs, setInputs] = useState(dijkstraInput);

  // レスポンス
  const [response, setResponse] = useState(null);


  // インプットフィールド制御
  const onChange = index => event => {
    const value = event.target.value;
    setInputs(update(index, assoc('value', value, inputs[index]), inputs))
  }

  // リクエスト送信
  const onClick = async () => {
    const result = await axios.post(API_URL + '/dijkstra/', createRequestBody(inputs))
    setResponse(result)
  }

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
      {response &&
        <Box>
          {JSON.stringify(response.data)}
        </Box>
      }
    </Box>

  )
}