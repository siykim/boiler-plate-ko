const express = require('express')
const app = express()
const port = 5000

// bodyParser을 통해 client로부터 정보를 받을 수 있음.
const bodyParser = require('body-parser');
const { User } = require("./models/User");

// 비밀설정 정보관리
const config = require('./config/key');
const cookieParser = require('cookie-parser');


// bodyParser option.

//application/x-www-form-urlencoded된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.urlencoded({extended: true}));

//application/json된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json());
// cookieParser
app.use(cookieParser());


// mongoose 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

  app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))

// 회원가입을 위한 라우트: register route. POST method 이용.
app.post('/api/users/register', (req, res) => {

  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.

  // User.js을 이용.
  // bodyParser을 통해 req.body를 사용가능.
  const user = new User(req.body) // 제이슨 형식으로 들어있음. 


  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }) // 에러가 있으면 제이슨 형식으로 에러메세지와 함께 성공하지 못했다 전달.
    return res.status(200).json({
      success: true
    })
  })

})

// 로그인 라우트
app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 있는 지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      }) 
    }
      // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch ) => {
      if(!isMatch) // 비밀번호가 틀리면
       return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
  
      // 비밀번호까지 같다면, 유저 토큰 생성.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 저장한다. 어디에 ? 쿠키 , 로컬스토리지 등. 여기선 쿠키에 저장.
        res.cookie("x_auth", user.token)
        .status(200) // 성공표시
        .json({ loginSuccess: true, userId: user._id })

      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

