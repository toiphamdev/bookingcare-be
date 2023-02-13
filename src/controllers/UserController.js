const res = require('express/lib/response');
const userService = require('../services/userService')

let handleLogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: 'Missing inputs parameter',

            })
        }
        let userData = await userService.handleUserLogin(email, password);
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
        })
    } catch (e) {
        console.log(e);
    }
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requires parameters',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'oke',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.editUser(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requires parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)
}

let getAllCodes = async (req, res) => {
    try {
        let data = await userService.getAllCodesService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log("get allcode error: ", e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from sever"
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCodes: getAllCodes,
};