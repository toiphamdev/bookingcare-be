'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DoctorInfor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DoctorInfor.belongsTo(models.User, { foreignKey:'doctorId'});
            DoctorInfor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceData' });
            DoctorInfor.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceData' });
            DoctorInfor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' });
            DoctorInfor.belongsTo(models.Specialty, { foreignKey: 'specialtyId', targetKey: 'id', as: 'specialtyData' });
            DoctorInfor.belongsTo(models.Clinic, { foreignKey: 'clinicId',targetKey: 'id', as: 'clinicData' });
        }
    };
    DoctorInfor.init({
        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressClinic:DataTypes.STRING,
        nameClinic:DataTypes.STRING,
        note:DataTypes.STRING,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'DoctorInfor',
    });
    return DoctorInfor;
};