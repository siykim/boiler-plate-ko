const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');

// bodyParser option.

//application/x-www-form-urlencoded된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.urlencoded({extended: true}));

//application/json된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json());



// mongoose 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 회원가입을 위한 라우트
app.post('/register', (req, res) => {

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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

