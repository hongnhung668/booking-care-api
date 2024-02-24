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

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //All, id
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        });
    }
    let users = await userSevice.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'success',
        users
    });
}

let handleCreateNewUser = async (req, res) => {
    let message = await userSevice.createNewUser(req.body);
    return res.status(200).json(message);
}
let handleEditUser = async (req, res) => {
    
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: "missing required parameters"
        });
    }
    let message = await userSevice.deleteUser(req.body.id);
    return res.status(200).json(message);
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser:handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
}