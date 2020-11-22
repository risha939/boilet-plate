const {User} = require("../models/user");

let auth = (req, res, next) => {
    //인증처리를 하는 곳

    //1. 클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;
    //2. 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        //index에서 사용하려고 유저, 토큰 정보를 req에 넣어준것
        req.token = token;
        req.user = user;
        next()
    })
    //3. 유저가 있으면 인증 ㅇㅋ

    //4. 유저가 없으면 인증 ㅈㅈ
}

module.exports = { auth };