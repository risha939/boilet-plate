//유저모델

//mongoose 모듈 가져옴
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

//유저 데이터 제한사항
const userSchema = mongoose.Schema({
    name: {
        type: String,
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

//비밀번호 암호화(유저 정보를 받아와 save 하기전 = pre(몽구스 메소드))
userSchema.pre('save', function (next) {
    //this = userSchema
    var user = this;

    //비밀번호 이외의 변경사항에도 비밀번호를 중복 암호화 하지 않기 위한 조건문
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        //salt 만들기
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        //next() 는 pre 된 정보를 save로 보내는 것
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    //jwt을 이용하여 토큰 생성
    var user = this;
    //user._id + 'secretToken' = token
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    //토큰을 디코드 한다
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용하여 유저를 찾고, 클라에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

//스키마를 감싸는 모델 지정('모델이름', 스키마이름)
const User = mongoose.model('User', userSchema)

//다른곳에서 사용할수 있게 exports 지정
module.exports = { User }