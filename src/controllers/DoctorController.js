const DoctorService = require('../services/DoctorService')
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let doctors = await DoctorService.getTopDoctor(+limit);
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }

}

let getAllDoctors = async(req, res)=>{
    try {
        let doctors = await DoctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let postInfoDoctor = async(req,res)=>{
    try {
        let response = await DoctorService.postInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getDetailDoctorById = async(req,res)=>{
    try {
        let response = await DoctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let bulkCreateSchedule = async(req,res)=>{
    try {
        let response = await DoctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getScheduleByDate = async(req,res)=>{
    try {
        let response = await DoctorService.getScheduleByDateService(req.query.doctorId,req.query.date);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getExtraInforById = async(req,res)=>{
    try {
        let response = await DoctorService.getExtraInforByIdService(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getProfileById = async(req,res)=>{
    try {
        let response = await DoctorService.getProfileByIdService(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getListPatient = async(req,res)=>{
    try {
        let response = await DoctorService.getListPatientService(req.query);
        return res.status(200).json(response);
    } catch (error) {

        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let confirmSchedule = async(req,res)=>{
    try {
        let response = await DoctorService.confirmScheduleService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    postInfoDoctor:postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforById: getExtraInforById,
    getProfileById:getProfileById,
    getListPatient: getListPatient,
    confirmSchedule: confirmSchedule,
}