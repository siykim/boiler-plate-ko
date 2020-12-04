// MongoDB Model & Schema
const mongoose = require('mongoose');
// bcrypt
const bcrypt = require('bcrypt');
// salt의 길이
const saltRounds = 10;
// jsonwebtoken
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // true로하면 스페이스 공백을 없애주는 역할을 함.
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  // 유효성 관리
  token: {
    type: String
  },
  // 토큰 유효기간
  tokenExp: {
    type: Number
  }
})

// 몽구스에서 가져온 메쏘드
// save가 실행되기 전에 무엇을 하고 이게 끝나면 save가 실행.
userSchema.pre('save', function (next) {
  var user = this; // 위에 userSchema를 가르킴

  if(user.isModified('password')) {

  //비밀번호를 암호화 시킴.
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err)
  // user.password에는 plainpassword, 즉 postman에 넣은 "!234567"이고, "hash"가 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
      next()
  }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {

  // plainPassword: 1234567 암호화된 비밀번호: $2b$10$yQJE88lIQn.gIx7rT/YHSeChVciWa4XzIEzv16CGUjv1jrYGjRSS6
  // plain을 다시 암호화해서 맞는지 비교.
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
      cb(null, isMatch)
  })
}

// jsonwebtoken
userSchema.methods.generateToken = function (cb) {
  var user = this;
  // console.log('user._id', user._id)

  // jsonwebtoken을 이용해서 token을 생성하기 
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  // user._id + 'secretToken' = token 
  // -> 
  // 'secretToken' -> user._id

  user.token = token
  user.save(function (err, user) {
      if (err) return cb(err)
      cb(null, user)
  })
}



const User = mongoose.model('User', userSchema)

// 다른곳에서 쓸 수 있게 User
module.exports = {User}