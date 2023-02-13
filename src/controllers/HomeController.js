const db = require('../models');
const CRUDservice = require('../services/CRUDservice')

let getHomePage = async (req, res) => {
    try {

        // let data = await db.User.findAll()
        return res.render('homePage.ejs');
    }
    catch (e) {
        console.log(e);
    }
}

let getCRUD = (req, res) => {
    return res.render('CRUD.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    console.log(message)
    res.send('end');
}

let displayCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    res.render('displayCRUD', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        res.render('editCRUD.ejs', {
            user: userData
        });
    } else {

        res.send('user not found');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDservice.updateUserData(data);
    res.send('update user success');
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    await CRUDservice.deleteUserById(id);
    return res.send('delete user success');
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,

}