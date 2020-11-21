const express = require('express') //모듈을 require로 불러옴
const app = express() // express를 이용한 app 이름을 가진 서버를 만듬
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./models/user");
//application/x-www-form-urlencoded - 데이터분석하여 가져올수 있게 함
app.use(bodyParser.urlencoded({ extended: true }));
//application/json - 데이터분석하여 가져올수 있게 함
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! : )')
})

//엔드포인트 /register
app.post('/register', (req, res) => {
  //회원가입 할때 필요한 정보들을 client에서 가져오면 DB에 넣어준다

  //req.body 에 json 형식으로 데이터가 들어감 (body-parser 이용하는것)
  const user = new User(req.body)

  //save 는 mongoDB 메서드 임
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})