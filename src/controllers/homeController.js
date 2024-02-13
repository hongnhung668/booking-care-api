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

module.exports = {
    getHomePage: getHomePage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
}