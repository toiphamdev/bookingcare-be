const PatientService = require('../services/PaitientService')
let bookingSchedule = async (req,res)=>{
    try {
        let response = await PatientService.bookingScheduleService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let bookingScheduleConfirm = async (req,res)=>{
    try {
        let response = await PatientService.bookingScheduleConfirmService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let search = async (req,res)=>{
    try {
        let response = await PatientService.searchService(req.query);
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
    bookingSchedule:bookingSchedule,
    bookingScheduleConfirm: bookingScheduleConfirm,
    search:search,
}