import userSevice from "../services/userSevice";


let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: "messing inputs parameter!"
        });
    }

    let userData = await userSevice.handleUserLogin(email, password);
    
    //check email exist
    //compare password
    //return user info
    //access_token: JWT
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : [],
    })
}

module.exports = {
    handleLogin: handleLogin,
}