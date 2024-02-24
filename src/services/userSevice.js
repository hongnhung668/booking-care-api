import db from "../models";
import bcrypt, { compareSync } from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hasUserPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
}

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

let getAllUsers = (userId) => {
    return new Promise ( async (resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL'){
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: { id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let createNewUser = (data) => {
    return new Promise (async (resolve, reject) => {
        try {
            //check email exists ???
            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                    errCode: 1,
                    messager: 'your email is already in used, plz try other email'
                });
            }else{
                let hashPasswordFromBcrypt = await hasUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,

                })
                resolve({
                    errCode: 0,
                    messager: 'success'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise ( async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: {id: userId}
        })
        if(!foundUser){
            resolve({
                errCode: 2,
                errMessage: `the user isn't exists`
            })
        }

        await db.User.destroy({
            where: {id: userId}
        });

        resolve({
            errCode: 0,
            errMessage: 'the user deleted'
        })
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
}