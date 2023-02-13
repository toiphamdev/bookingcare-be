const ClinicService = require('../services/ClinicService')
let createNewClinic = async (req,res)=>{
    try {
        let response = await ClinicService.createNewClinicService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getClinicById =  async (req,res)=>{
    try {
        let response = await ClinicService.getClinicByIdService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}


let getAllClinic = async (req,res)=>{
    try {
        let response = await ClinicService.getAllClinicService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let deleteClinic = async (req,res)=>{
    try {
        let response = await ClinicService.deleteClinicService(req.query.id);
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
    createNewClinic,
    getAllClinic,
    getClinicById,
    deleteClinic
}
