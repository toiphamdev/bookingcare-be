
const { reject } = require("lodash");
const db = require("../models");

let createNewSpecialtyService = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!data.name || !data.image || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                let res = '';
                if(data.id){
                    res = await db.Specialty.findOne({
                        where: {
                            id: data.id
                        }
                    })
                }
                if(res){
                    await db.Specialty.update(
                        {
                            name: data.name,
                            image: data.image,
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
                        errMessage:'Update specialty success'
                    })
                }else{

                    await db.Specialty.create({
                        name: data.name,
                        image: data.image,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown
                    })
                    resolve({
                        errCode:0,
                        errMessage:'Create a specialty success'
                    })
                }
              
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialtyService = ()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let data = await db.Specialty.findAll({
                limit: 10,
                order: [["createdAt", "DESC"]],
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

let getSpecialtyByIdService = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputData.id || !inputData.provinceId ){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                let data = {};

                let specialtyData = await db.Specialty.findOne({
                    where:{
                        id: inputData.id,
                    },
                    attributes:['descriptionHTML','descriptionMarkdown'],
                });
                let arrDoctorId = [];
                if(inputData.provinceId === 'ALL'){
                    arrDoctorId = await db.DoctorInfor.findAll({
                    where:{
                        specialtyId: inputData.id
                    },
                    attributes:['doctorId','provinceId'],
                    })
                }else{
                    arrDoctorId = await db.DoctorInfor.findAll({
                    where:{
                        specialtyId: inputData.id,
                        provinceId: inputData.provinceId
                    },
                    attributes:['doctorId','provinceId'],
                    })
                }
                if(specialtyData){
                    data.specialtyData = specialtyData;
                }
                if(arrDoctorId){
                    data.arrDoctorId = arrDoctorId;
                }
                resolve({
                    errCode:0,
                    errMessage:'oke',
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getSpecialtyService = (id)=>{
    return new Promise( async(resolve,reject)=>{
        try {
            if(!id){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                let res = await db.Specialty.findOne({
                    where:{
                        id:id
                    },
                    attributes:['id','name','image','descriptionHTML','descriptionMarkdown']
                });

                if(res && res.image){
                    res.image = Buffer.from(res.image, 'base64').toString('binary');
                }

                if(res){
                    resolve({
                        errCode:0,
                        errMessage:'oke',
                        data: res
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'No data from specialty id',
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteSpecialtyService = (id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!id){
                 resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                await db.Specialty.destroy({
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
    createNewSpecialtyService: createNewSpecialtyService,
    getAllSpecialtyService: getAllSpecialtyService,
    getSpecialtyByIdService: getSpecialtyByIdService,
    getSpecialtyService,deleteSpecialtyService
}