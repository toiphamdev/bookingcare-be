
const db = require('../models/index');
const _ = require('lodash');

const EmailService = require('./EmailService')
require('dotenv').config();

const NUMBER_OF_PATIENT = process.env.NUMBER_OF_SCHEDULE;

let getTopDoctor = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                where: {
                    roleId: 'R2'
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.DoctorInfor,
                        attributes: ['specialtyId'],
                        include:[
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                        ]
                    },
                ],
                nest: true,
                raw: true
            });
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctors = ()=>{
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                attributes: {
                    exclude: ['password','image']
                },
                where: {
                    roleId: 'R2'
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                nest: true,
                raw: true
            });
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let checkValidateInput = (data)=>{
    let arrValidate = ['doctorId','contentHTML','contentMarkdown',
    'priceId','provinceId','paymentId','addressClinic','nameClinic','specialtyId','clinicId'];
    let element = '';
    let isEmpty = false;

    for(let i=0;i<arrValidate.length;i++){
        if(!data[arrValidate[i]]){
            element=arrValidate[i];
            isEmpty=true
        }
    }
    return{
        isEmpty: isEmpty,
        element: element
    }
}

let postInfoDoctor = (data)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let validate = checkValidateInput(data);
            if(validate.isEmpty===true){
                resolve({
                    errMessage:`Missing required parameters ${validate.element}`,
                    errCode: 1
                })
            }else{
                let isSaveMarkdown = false;
                let isSaveDoctorInfo = false;
                //markdown
                let doctor = await db.Markdown.findOne({
                    where:{
                        doctorId:data.doctorId
                    }
                });
                // doctor info
                let doctorInfoExist = await db.DoctorInfor.findOne({
                    where:{
                        doctorId:data.doctorId
                    }
                });
                if(doctorInfoExist){
                    await db.DoctorInfor.update(
                        {
                            priceId: data.priceId,
                            provinceId: data.provinceId,
                            paymentId: data.paymentId, 
                            addressClinic: data.addressClinic,
                            nameClinic: data.nameClinic,
                            note: data.note,
                            specialtyId: data.specialtyId,
                            clinicId:data.clinicId
                        },
                        {
                            where:{
                                doctorId: data.doctorId
                            }
                        }
                    );
                    isSaveDoctorInfo = true;
                }else{
                    
                    await db.DoctorInfor.create(
                        {
                            priceId: data.priceId,
                            provinceId: data.provinceId,
                            paymentId: data.paymentId, 
                            addressClinic: data.addressClinic,
                            nameClinic: data.nameClinic,
                            note: data.note,
                            doctorId: data.doctorId,
                            specialtyId: data.specialtyId,
                            clinicId:data.clinicId
                        }
                    )
                    isSaveDoctorInfo = true;
                }    
                if(doctor){
                    await db.Markdown.update(
                        {
                            contentHTML: data.contentHTML,
                            contentMarkdown	: data.contentMarkdown,
                            description	: data.description, 
                        },
                        {
                            where:{
                                doctorId: data.doctorId
                            }
                        }
                    );

                    isSaveMarkdown = true;
                }else{
                    
                    await db.Markdown.create(
                        {
                            contentHTML: data.contentHTML,
                            contentMarkdown	: data.contentMarkdown,
                            description	: data.description,
                            doctorId:data.doctorId
                        }
                    )
                    isSaveMarkdown = true;
                }

                if(isSaveDoctorInfo && isSaveMarkdown){
                    resolve({
                        errCode: 0,
                        errMessage: "You have been create informations this account!"
                    });
                }else{
                    resolve({
                        errCode: -2,
                        errMessage: "This is error from service"
                    });
                }
                
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorById = (inputId)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                })
            }else{
                let data = await db.User.findOne({
                    where:{
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include:[
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML','contentMarkdown']
                        },
                        {
                            model: db.DoctorInfor,
                            attributes: {
                                exclude: ['id','doctorId','updatedAt','createdAt']
                            },
                            include:[
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi','keyMap'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi','keyMap'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi','keyMap'] },
                                { model: db.Specialty, as: 'specialtyData', attributes: ['name','id'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['name','id'] },
                            ]
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    nest: true,
                    raw: false
                });
                if(data && data.image){
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data){
                    data = {}
                }
                resolve({
                    errCode:0,
                    data: data
                })
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

let bulkCreateScheduleService = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {

            if(!data.arrSchedule || !data.doctorId || !data.date){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                });
            }else{
                let schedule = [...data.arrSchedule];
                if(schedule && schedule.length){
                    schedule = schedule.map((item)=>{
                        return ({
                            ...item,
                            maxNumber : NUMBER_OF_PATIENT
                        })
                    })
                }
                let existing = await db.Schedule.findAll({
                    where:{
                        doctorId: data.doctorId,
                        date: data.date
                    },
                    attributes:['doctorId','date','timeType','currentNumber']
                })
                if(existing && existing.length>0){
                    existing = existing.map(item=>{
                        return({
                            ...item,
                            date:new Date(item.date).getTime()
                        })
                    })
                }
                const createBulk = _.differenceBy(schedule,existing,'timeType');
                await db.Schedule.bulkCreate(createBulk);
                resolve({
                    errCode:0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getScheduleByDateService = (inputId,inputDate)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId || !inputDate){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                });
            }else{
                let date = new Date(+inputDate);
                let data = await db.Schedule.findAll({
                    where:{
                        doctorId: inputId,
                        date: date
                    },
                    include:[
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['lastName', 'firstName'] },
                    ],
                    nest: true,
                    raw:false
                })
                if(!data){
                    data = []
                };
                resolve({
                    errCode:0,
                    errMessage: 'oke',
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getExtraInforByIdService = (inputId)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                });
            }else{
                let data = await db.DoctorInfor.findOne({
                    where:{
                        doctorId: inputId,
                    },
                     attributes: {
                        exclude: ['id','updatedAt','createdAt','priceId','paymentId','provinceId']
                    },
                    include:[
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    nest: true,
                    raw:false
                })
                if(!data){
                    data = {}
                };
                resolve({
                    errCode:0,
                    errMessage: 'oke',
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getProfileByIdService = (inputId)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                });
            }else{
                let data = await db.User.findOne({
                    where:{
                        id: inputId,
                    },
                     attributes: {
                        exclude: ['password']
                    },
                    include:[
                        {
                            model: db.DoctorInfor,
                            attributes: {
                                exclude: ['id','updatedAt','createdAt']
                            },
                            include:[
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi','keyMap'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi','keyMap'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi','keyMap'] },
                            ]
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML','contentMarkdown']
                        },
                    ],
                    nest: true,
                    raw:false
                })
                if(data && data.image){
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data){
                    data = {}
                }
                resolve({
                    errCode:0,
                    errMessage: 'oke',
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListPatientService = (inputData)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            if(!inputData.doctorId && !inputData.date){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                });
            }else{
                let res  = await db.Booking.findAll({
                    where:{
                        doctorId: inputData.doctorId,
                        date:new Date(+inputData.date),
                        statusId:'S2'
                    },
                    include:[
                        { 
                            model: db.User, as: 'patientData', 
                            attributes: ['id','email','firstName','lastName','address','phonenumber'],
                            include:[
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ] 
                        },
                        { model: db.Allcode, as: 'timeTypeBookingData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw:false
                })
                resolve({
                    errCode:0,
                    errMessage:'ok',
                    data:res
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let confirmScheduleService = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputData.doctorId){
                resolve({
                    errMessage:"Missing required parameters",
                    errCode: 1
                });
            }else{
                let res = await db.Booking.update(
                    {
                        statusId:'S3'
                    },
                    {
                        where:{
                            doctorId:  inputData.doctorId,
                            patientId: inputData.patientId,
                            date: new Date(+inputData.date),
                            timeType: inputData.timeType,
                            statusId:'S2'
                        }
                    }
                )
                let sendEmail = await EmailService.sendAttactment(inputData);

                if(res[0]===0){
                    resolve({
                        errCode:2,
                        errMessage:'Schedule not found',
                    })
                }else{
                    resolve({
                        errCode:0,
                        errMessage:'ok',
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctors: getAllDoctors,
    postInfoDoctor:postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateScheduleService:bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraInforByIdService: getExtraInforByIdService,
    getProfileByIdService: getProfileByIdService,
    getListPatientService: getListPatientService,
    confirmScheduleService: confirmScheduleService,
}