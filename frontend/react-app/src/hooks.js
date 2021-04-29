import { useMediaQuery } from '@material-ui/core';
import axios from 'axios'
import { useEffect, useState } from 'react';
import { createRequestBody } from './util'
import { routes } from './routes'

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

export const useHeader = (location) => {
  const [names, setNames] = useState();
  const [paths, setPaths] = useState();
  const [status, setStatus] = useState(false);
  const path = location.pathname === '/' ? location.pathname : location.pathname.endsWith('/') ? location.pathname.substr(0, location.pathname.length - 1) : location.pathname;
  const route = routes.find(route => route.path === path)

  useEffect(() => {
    if (route) {
      setStatus(true)
      setPaths(path.split('/').filter(path => path))
      setNames(['ホーム'].concat(route.name.split(' | ').filter(name => name)))
      if (route.name) {
        document.title = route.name + ' | Algorithms Simulation'
      }
      else {
        document.title = 'Algorithms Simulation'
      }
    }
    else {
      setStatus(false)
      document.title = '404 Page Not Found | Algorithms Simulation'
    }
  }, [path, route])

  return {
    names: names,
    paths: paths,
    status: status
  }
}