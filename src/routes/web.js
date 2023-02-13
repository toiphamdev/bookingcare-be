const express = require('express');
const homeController = require('../controllers/HomeController');
const userController = require('../controllers/UserController');
const DoctorController = require('../controllers/DoctorController');
const PatientController = require('../controllers/PatientController');
const SpecialtyController = require('../controllers/SpecialtyController');
const ClinicController = require('../controllers/ClinicController');


let router = express.Router();
let initWebRoutes = (app) => {

    router.get('/CRUD', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/get-allcodes', userController.getAllCodes);
    router.get('/api/top-doctor-home', DoctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', DoctorController.getAllDoctors);
    router.post('/api/save-info-doctor', DoctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', DoctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', DoctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', DoctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-by-id', DoctorController.getExtraInforById);
    router.get('/api/get-profile-by-id', DoctorController.getProfileById);
    router.get('/api/get-listpatients-for-doctor', DoctorController.getListPatient);
    router.post('/api/confirm-schedule-for-doctor',DoctorController.confirmSchedule)


    router.post('/api/booking-schedule', PatientController.bookingSchedule);
    router.post('/api/verify-booking-schedule', PatientController.bookingScheduleConfirm);

    router.post('/api/create-new-specialty', SpecialtyController.createNewSpecialty);
    router.get('/api/get-all-specialty', SpecialtyController.getAllSpecialty);
    router.get('/api/get-specialty-by-id', SpecialtyController.getSpecialtyById);
    router.get('/api/get-specialty', SpecialtyController.getSpecialty);
    router.get('/api/delete-specialty',SpecialtyController.deleteSpecialty)

    router.post('/api/create-new-clinic', ClinicController.createNewClinic);
    router.get('/api/get-all-clinic', ClinicController.getAllClinic);
    router.get('/api/get-clinic-by-id', ClinicController.getClinicById);
    router.get('/api/delete-clinic',ClinicController.deleteClinic)

    router.get('/api/search',PatientController.search);

    router.get('/', homeController.getHomePage);
    app.use('/', router);
}

module.exports = initWebRoutes;