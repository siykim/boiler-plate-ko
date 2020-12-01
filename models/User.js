// MongoDB Model & Schema
const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema)

// 다른곳에서 쓸 수 있게 User
module.exports = {User}