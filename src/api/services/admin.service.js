const { saltHashPassword } = require('../utils/crypto-util');
const { sequelize } = require('../models');
const Admin = require('../models/Admin/Admin');
const AdminSalt = require('../models/Admin/AdminSalt');

const signUp = async (email, password, nickname) => {
    const secretData = saltHashPassword(password);
    const adminHashedPassword = secretData.hashedPassword;
    const adminSalt = secretData.salt;
    let newAdminId;

    let transaction;
    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // Admin 테이블에 INSERT
        newAdminId = (
            await Admin.create(
                {
                    ADMIN_EMAIL: email,
                    ADMIN_NICKNAME: nickname,
                    ADMIN_PASSWORD: adminHashedPassword
                },
                { transaction }
            )
        ).dataValues.IDX;

        // // AdminSalt 테이블에 INSERT
        await AdminSalt.create(
            {
                ADMIN_IDX: newAdminId,
                SALT: adminSalt
            },
            { transaction }
        );

        await transaction.commit();
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }

    return {
        newAdminId,
        email,
        nickname
    };
};

module.exports = {
    signUp
};
