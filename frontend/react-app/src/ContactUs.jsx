
import React, { useState } from "react";
import { Typography, Box, makeStyles, Button } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import axios from "axios";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  textField: {
    marginBottom: '10px'
  },
  button: {
    width: '100%'
  }
}));

export const ContactUs = () => {
  const [name, setName] = useState("")
  const [message, setMessage]  = useState("")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const classes = useStyles();

  const resetForm = () => {
    setName("")
    setMessage("")
    setEmail("")
  
    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  const formSubmit = () => {
    const data = new FormData();
    data.append("token", process.env.REACT_APP_SLACK_USER_TOKEN)
    data.append("channel", process.env.REACT_APP_SLACK_CHANNEL)
    data.append("text", "name: " + name + "\nemail: " + email + "\nmessage: " + message)

    try {
      axios.post("https://slack.com/api/chat.postMessage", data);
      resetForm()
    } catch (error) {
      console.log(error);
    }
    alert("メッセージを送信しました。")
  };

  const handleChangeEmail = (e) => {
    if (
      !e.target.value.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setEmail(e.target.value)
      setEmailError(true)
  
      if (email === "") {
        // check if the input is empty
        setEmailError( false );
      }
    } else {
      setEmail(e.target.value)
      setEmailError(false)
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        ご意見・お問い合わせ
      </Typography>
      <Typography variant="body1" gutterBottom>
        このwebサイトへのご意見・ご要望をお寄せください。
      </Typography>
      <Typography variant="body1" gutterBottom>
      （例：〇〇というアルゴリズムのシミュレーションを実装してほしい、アルゴリズムの挙動が間違っている等）
      </Typography>
      <Typography variant="body1" gutterBottom>
        返信をご希望の方はメールアドレスを記載ください。
      </Typography>
      <Box className={classes.root}>
        <TextField
          className={classes.textField}
          label="お名前"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          fullWidth
        />

        <TextField
          className={classes.textField}
          label="メールアドレス"
          placeholder="xxxx@example.com"
          variant="outlined"
          value={email}
          onChange={(e) => handleChangeEmail(e)}
          error={emailError}
          type="email"
          fullWidth
        />

        <TextField
          className={classes.textField}
          label="メッセージ"
          variant="outlined"
          multiline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          type="text"
          fullWidth
        /> 
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.button}
          onClick={formSubmit}
        >
          送信する
        </Button>
      </Box>
    </Box>
  );
}