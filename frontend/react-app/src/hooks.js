import { useMediaQuery } from '@material-ui/core';
import axios from 'axios'
import { useState } from 'react';
import { createRequestBody } from './util'

const API_URL = process.env.REACT_APP_API_URL;

export const useGetResponse = (alg, parser) => {

  // 結果
  const [result, setResult] = useState(null);

  // 画面制御
  // 0: 初期状態, 1: ロード中, 2: 正常(経路探索成功), 3: 正常(経路探索失敗), 4: 異常
  const [control, setControl] = useState(0);

  const execute = async (inputs) => {
    setControl(1);
    try {
      const response = await axios.post(API_URL + `/${alg}/`, createRequestBody(inputs))

      // レスポンスを整形する
      parser(response, setControl, setResult)
    }

    // エラーの時はなんかする
    catch (error) {
      console.log(error)
      setResult('何らかのエラー')
      setControl(4);
    }
  }

  return {
    control: control,
    result: result,
    execute: execute,
    setResult: setResult
  }
}

export const useGetLayout = () => {
  return useMediaQuery(theme => theme.breakpoints.up('md')) ? 'pc' : 'sp';
}