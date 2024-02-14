import bcrypt from 'bcryptjs';
import db from '../models';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve('create success');
        } catch (error) {
            reject(error);
        }
    });
    
}

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

let getAllUser = () => {
    return new Promise( async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
}

let getUserInfoById = (userId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let users = db.User.findOne({
                where: {id: userId},
                raw: true,
            });
            if(users){
                resolve(users);
            }else{
                resolve([]);
            }
        } catch (error) {
            reject(error);
        }
    });
}

let updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id},
            });
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);

            }else{
                resolve('not found user');

            }
            
        } catch (error) {
            reject(error);
        }
    });
    
}

let deleteUserById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id},
            });
            if(user){
                user.destroy();
                resolve();
            }else{
                resolve('not found user');
            }
        } catch (error) {
            reject(error);
        }
    });
    
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}