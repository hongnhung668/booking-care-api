import db from "../models";
import CRUDSevice from "../services/CRUDSevice";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homepage.ejs",{
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

let getCRUD = (req, res) => {
    try {
        return res.render('crud.ejs');
    } catch (error) {
        console.log(error);
    }
}

let postCRUD = async (req, res) => {
    try {
        let message = await CRUDSevice.createNewUser(req.body);
        return res.send(message)
    } catch (error) {
        console.log(error);
    }
}

let dispalyGetCRUD = async (req,res) => {
    try {
        let data = await CRUDSevice.getAllUser();
        return res.render('displayCRUD.ejs',{
            data: data,
        })

    } catch (error) {
        console.log(error);
    }
} 

let getEditCRUD = async (req,res) => {
    try {
        let userId = req.query.id;
        if(userId){
            let data = await CRUDSevice.getUserInfoById(userId);
            return res.render('editCRUD.ejs',{
                data: data,
            })
        }else{
            return res.send('user not found');
        }

    } catch (error) {
        console.log(error);
    }
} 

let putCRUD = async (req,res) => {
    try {
        let data = req.body;
        let allUsers = await CRUDSevice.updateUserData(data);
        return res.render('displayCRUD.ejs',{
            data: allUsers,
        })
    } catch (error) {
        console.log(error);
    }
} 

let deleteCRUD = async (req,res) => {
    try {
        let userId = req.query.id;
        if(userId){
            let data = await CRUDSevice.deleteUserById(userId);
            return res.send('delete success');
        }else{
            return res.send('user not found');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    dispalyGetCRUD:dispalyGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}