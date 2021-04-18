
import React, { useState } from "react";
import { Typography, Box, makeStyles, Button } from '@material-ui/core';
import axios from "axios";
import TextField from "@material-ui/core/TextField";

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
  const [subject, setSubject] = useState("")
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const classes = useStyles();

  const resetForm = () => {
    setName("")
    setMessage("")
    setEmail("")
    setSubject("")
  
    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  const formSubmit = (e) => {
    e.preventDefault();
  
    let data = {
      name: name,
      email: email,
      message: message,
      subject: subject,
    };

    resetForm()
  
    // メール送信
    // try {
    //   await axios.post("http://localhost:8000", data);
    //   this.setState({ sent: true }, this.resetForm());
    // } catch (error) {
    //   console.log(error);
    // }
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
        返信をご希望の方はメールアドレスを記載ください。
      </Typography>
      <form onSubmit={(e) => formSubmit(e)} className={classes.root}>
        <TextField
          className={classes.textField}
          label="お名前"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
        <button 
          variant="contained" 
          color="primary" 
          className={classes.button}
          onClick>
          送信する
        </button>
      </form>
    </Box>
  );
}