const express = require('express') //모듈을 require로 불러옴
const app = express() // express를 이용한 app 이름을 가진 서버를 만듬
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require("./middleware/auth");
const { User } = require("./models/user");
//application/x-www-form-urlencoded - 데이터분석하여 가져올수 있게 함
app.use(bodyParser.urlencoded({ extended: true }));
//application/json - 데이터분석하여 가져올수 있게 함
app.use(bodyParser.json());
app.use(cookieParser());

/**
 MongoDB ODM 중 가장 유명한 라이브러리입니다.
 데이터베이스 연결, 스키마 정의, 스키마에서 모델로 변환, 모델을 이용해 데이터를 다룸
 프로미스와 콜백 사용가능
*/
const mongoose = require('mongoose');
const user = require('./models/user');
mongoose.connect(config.mongoURL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! : )')
})

//엔드포인트 /register
app.post('/api/users/register', (req, res) => {
  //회원가입 할때 필요한 정보들을 client에서 가져오면 DB에 넣어준다

  //req.body 에 json 형식으로 데이터가 들어감 (body-parser 이용하는것)
  const user = new User(req.body)

  //save 는 mongoDB 메서드 임
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 DB에서 잇는지 찾는다 (findOne : 몽고DB 메서드)
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다"
      })
    }
    //요청된 이메일이 DB에 있다면, 비번이 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" })

      //비번까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에??(쿠키, 로컬스토리지, 세션..등)
        //cookie
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는것은 Authentication 이 true 라는 것
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})