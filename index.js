const express = require('express') //모듈을 require로 불러옴
const app = express() // express를 이용한 app 이름을 가진 서버를 만듬
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://risha:risha9310_!@project1.izky4.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! : )')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})