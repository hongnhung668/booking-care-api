import db from "../models";
import bcrypt, { compareSync } from "bcryptjs";

let handleUserLogin = (email, password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist){
                //user already exist
                let user = await db.User.findOne({
                    where: { email: email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true,
                });
                if(user){
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = 'success';
                        delete user.password;
                        userData.user = user;
                    }else{
                        userData.errCode = 3;
                        userData.errMessage = 'wrong password';
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
                
            }else{
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Plz try other email`;
            }
            resolve(userData);

        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise( async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            });
            if(user){
                resolve(true);
            }else{
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
}