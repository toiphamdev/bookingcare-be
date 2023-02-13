const SpecialtyService = require('../services/SpecialtyService');
let createNewSpecialty = async (req,res)=>{
    try {
        let response = await SpecialtyService.createNewSpecialtyService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getAllSpecialty = async (req,res)=>{
    try {
        let response = await SpecialtyService.getAllSpecialtyService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getSpecialtyById = async (req,res)=>{
    try {
        let response = await SpecialtyService.getSpecialtyByIdService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let getSpecialty = async (req,res)=>{
    try {
        let response = await SpecialtyService.getSpecialtyService(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server'
        })
    }
}

let deleteSpecialty = async (req,res)=>{
    try {
        let response = await SpecialtyService.deleteSpecialtyService(req.query.id);
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
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getSpecialtyById:getSpecialtyById,
    getSpecialty,deleteSpecialty
}