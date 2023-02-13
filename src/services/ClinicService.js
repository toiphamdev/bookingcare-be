const { reject } = require("lodash");
const db = require("../models");

let createNewClinicService = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                let res = '';
                if(data.id){
                    res = await db.Clinic.findOne({
                        where: {
                            id: data.id
                        }
                    })
                }
                if(res){
                    await db.Clinic.update(
                        {
                            name: data.name,
                            image: data.image,
                            address: data.address,
                            descriptionHTML: data.descriptionHTML,
                            descriptionMarkdown: data.descriptionMarkdown

                        },
                        {
                            where: {
                                id: data.id
                            }
                        }
                    );
                    resolve({
                        errCode:0,
                        errMessage:'Update clinic success'
                    })
                }else{

                    await db.Clinic.create({
                        name: data.name,
                        image: data.image,
                        address: data.address,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown
                    })
                    resolve({
                        errCode:0,
                        errMessage:'Create a clinic success'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getClinicByIdService = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputData.id ){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{

                let data = await db.Clinic.findOne({
                    where:{
                        id: inputData.id,
                    },
                    attributes: ['id','name','image','address','descriptionHTML','descriptionMarkdown'],
                    include: [
                        {   model: db.DoctorInfor, as:'clinicData',attributes: ['doctorId']},
                    ],
                    raw:false
                });
                 if(data && data.image){
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if(data){

                    resolve({
                        errCode:0,
                        errMessage:'oke',
                        data: data
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'No data from clinic id',
                    })
                }
                
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllClinicService = ()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let data = await db.Clinic.findAll({
                limit: 10,
                order: [["createdAt", "DESC"]],
                attributes: ['id','name','image'],
            });
            if(data && data.length > 0){
                data.map((item)=>{
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode:0,
                errMessage:'oke',
                data: data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let deleteClinicService = (id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!id){
                 resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                await db.Clinic.destroy({
                    where:{
                        id : id
                    }
                })

                 resolve({
                    errCode:0,
                    errMessage:'Delete clinic success'
                })
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewClinicService,
    getClinicByIdService,
    getAllClinicService,
    deleteClinicService
}