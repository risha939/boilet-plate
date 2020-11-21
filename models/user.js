//유저모델

//mongoose 모듈 가져옴
const mongoose = require('mongoose');

//유저 데이터 제한사항
const userSchema = mongoose.Schema({
    name: {
        type: 'String',
        maxlength: 50
    },
    email: {
        type: String,
        //trim : 이메일을 다듬는 기능 (ex) park danbi@naver.com <- 공백을 지워줌
        trim: true,
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
    //관리자/유저 판단 정보
    role: {
        type: Number,
        default: 0
    },
    image: String,
    //유효성 관리
    token: {
        type: String
    },
    //토큰 유효기간
    tokenExp: {
        type: Number
    }
})

//스키마를 감싸는 모델 지정('모델이름', 스키마이름)
const User = mongoose.model('User', userSchema)

//다른곳에서 사용할수 있게 exports 지정
module.exports = {User}