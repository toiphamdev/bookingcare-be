const db = require('../models/index');
const emailService = require('./EmailService');
const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
require('dotenv').config();
const _ =  require('lodash')

const Op = Sequelize.Op;

let bookingUrlEmail = (doctorId,token)=>{
    let result = `${process.env.URL_REACT}/verify-booking-schedule?token=${token}&doctorId=${doctorId}`
    return result;
}

function unique(arr) {
    let newArr = arr.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.id === item.id 
        ))
    );
    return newArr;
}

let bookingScheduleService = (data)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            if(data.email || data.date || data.timeType || data.doctorId || data.statusId){
                let isExistUser = await db.User.findOne({
                    where:{
                        email: data.email
                    }
                });
                let patientId = isExistUser.id;
                let res = await db.Booking.findOne({
                    where:{
                        patientId:patientId,
                        date: data.date,
                        timeType: data.timeType,
                        doctorId: data.doctorId,

                    },
                })
                if(!res){
                    let token = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
                    let sendEmail = await emailService.sendSimpleEmail({
                        receiverEmail:data.email,
                        fullName: data.fullName,
                        redirectLink:bookingUrlEmail(data.doctorId,token),
                        doctorName: data.doctorName,
                        time: data.timeString,
                        language: data.language
                    });
                    await db.Booking.create({
                        patientId:patientId,
                        date: data.date,
                        timeType: data.timeType,
                        doctorId: data.doctorId,
                        statusId:'S1',
                        token:token
                    })
                    resolve({
                        errCode:0,
                        errMessage:'ok'
                    })
                }else{
                    resolve({
                        errCode:0,
                        errMessage:'You already booked this'
                    })
                }
            }else{
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bookingScheduleConfirmService = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!data.token && ! data.doctorId){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters'
                })
            }else{
                let apointment = await db.Booking.findOne({
                    where:{
                        token:data.token,
                        doctorId:data.doctorId,
                        statusId:'S1'
                    },
                    raw:false
                })
                if(apointment){
                    await db.Booking.update(
                        {
                            statusId:'S2'
                        },
                        {
                            where:{
                                doctorId:data.doctorId,
                                token: data.token,
                                statusId:'S1'
                            }
                        }
                    )
                    resolve({
                        errCode:0,
                        errMessage:'Your apointment status is confirm.'
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'Your apointment status already confirm or not exist.'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let searchService = (data)=>{
    return new Promise( async(resolve,reject)=>{
        try {
            if(data.q && data.type){
                let limit = 0;
                switch (data.type) {
                    case 'less':
                        limit= 5;
                        break;
                
                    default:
                        limit= 10;
                        break;
                }
                let query = data.q.split(' ');
                let resultClinic= [];
                let resultSpecialty = [];
                
                let resClinic = await db.Clinic.findAll({
                    limit: limit,
                    attributes:['id','name','image'],
                    where:{
                        name:{[Op.iLike]: '%' + data.q + '%'},
                    }
                });
                let resSpecialty = await db.Specialty.findAll({
                    limit: limit,
                    attributes:['id','name','image'],
                    where:{
                        name:{[Op.iLike]: '%' + data.q + '%'},
                    }
                })

                resultClinic.push(...resClinic);
                resultSpecialty.push(...resSpecialty);
                if(_.isEmpty(resultClinic) && _.isEmpty(resultSpecialty)){
                    for(let i = 0; i<query.length;i++){
                    let resCli = await db.Clinic.findAll({
                        limit: limit,
                        attributes:['id','name','image'],
                        where:{
                            name:{[Op.iLike]: '%' + query[i] + '%'},
                        }
                    });
                    let resSpec = await db.Specialty.findAll({
                        limit: limit,
                        attributes:['id','name','image'],
                        where:{
                            name:{[Op.iLike]: '%' + query[i] + '%'},
                        }
                    });
                    resultClinic.push(...resCli);
                    resultSpecialty.push(...resSpec);
                }
                }

                
                if(resultClinic.length > 0 || resultSpecialty.length > 0){
                    let dataClinic = unique(resultClinic);
                    let dataSpecialty = unique(resultSpecialty);
                    if(dataClinic.length > 0){
                        dataClinic.map((item)=>{
                            if(item.image){
                                item.image =Buffer.from(item.image, 'base64').toString('binary');
                            }
                            return item;

                        })
                    }
                    if(dataSpecialty.length > 0){
                        dataSpecialty.map((item)=>{
                            if(item.image){
                                item.image =Buffer.from(item.image, 'base64').toString('binary');
                            }
                            return item;

                        })
                    }

                    resolve({
                        errCode:0,
                        errMessage:'oke',
                        dataClinic: dataClinic,
                        dataSpecialty:dataSpecialty
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'Can not find',
                    })
                }

            
            }else{
                resolve({
                        errCode:1,
                        errMessage:'Missing required parameters',
                    })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    bookingScheduleService: bookingScheduleService,
    bookingScheduleConfirmService : bookingScheduleConfirmService,
    searchService:searchService,
}