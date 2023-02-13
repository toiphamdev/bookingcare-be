const db = require('../models/index');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {
            };
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exit
                let user = await db.User.findOne({
                    where: {
                        email: email
                    },
                    raw: true,
                    attributes: ['id','email', 'roleId', 'password', 'firstName', 'lastName'],
                })

                if(user.roleId){
                    let hashRoleId = await bcrypt.hashSync(user.roleId, salt);
                    user.roleId = hashRoleId;
                }
                if (user) {

                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'No err';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errCode = `User not found`;
                }
                resolve(userData);
            } else {
                // return err
                userData.errCode = 1;
                userData.errMessage = `This email isn's exist in ours system.Please try again!`;
                resolve(userData);
            }
        } catch (e) {
            reject(e);
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e)
        }
    })
}


let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check user email
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'This email already exist.Please try another email',
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar,

                });
                resolve({
                    errCode: 0,
                    message: 'ok',
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `This account isn's exist.`
                })
            }
            await db.User.destroy({
                where: {
                    id: userId
                }
            });
            resolve({
                errCode: 0,
                message: 'This account had been deleted!'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.role || !data.position || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: {
                    id: data.id
                }
            })
            if (user) {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phonenumber: data.phoneNumber,
                        gender: data.gender,
                        roleId: data.role,
                        positionId: data.position,
                        image: data.avatar,


                    },
                    {
                        where: {
                            id: data.id
                        }
                    }
                )
                resolve({
                    errCode: 0,
                    errMessage: "You have been change informations this account!"
                });
            } else {

                resolve({
                    errCode: 1,
                    errMessage: "User's not found!"
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodesService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeInput) {
                let res = {}
                let allcodes = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.data = allcodes;
                resolve(res)
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser,
    getAllCodesService: getAllCodesService
};