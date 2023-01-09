const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class UsersRepository {
    #userModel;
    constructor(UserModel) {
        this.#userModel = UserModel;
    }

    createUser = async (email, userName, password, phoneNumber, profileImg) => {
        const createUser = await this.#userModel.create({
            email,
            userName,
            password,
            phoneNumber,
            profileImg,
        });
        return createUser;
    };

    findOneUserByEmail = async (email) => {
        return await this.#userModel.findOne({
            where: { email },
            attributes: { exclude: ['password'] },
        });
    };
    findOneUserByUserName = async (userName) => {
        return await this.#userModel.findOne({
            where: { userName },
            attributes: { exclude: ['password'] },
        });
    };
    findUserByAuth = async (email, password) => {
        const findUser = await this.#userModel.findOne({
            where: { [Op.and]: [{ email }, { password }] },
            attributes: { exclude: ['password'] },
        });
        return findUser;
    };

    updateRefreshToken = async (token, email) => {
        await this.#userModel.update({ token }, { where: { email: email } });
    };

    findOneUser = async (userId) => {
        return await this.#userModel.findOne({
            where: { userId },
        });
    };

    updateUser = async (userId, userName, phoneNumber, profileImg) => {
        return await this.#userModel.update(
            { userName, phoneNumber, profileImg },
            { where: { userId } }
        );
    };

    deleteUser = async (userId) => {
        /* await this.#userModel.delete({
            where: { userId },
        }); */

        const query = `DELETE FROM Users WHERE userId=$userId`;
        await sequelize.query(query, {
            bind: { userId },
            type: sequelize.QueryTypes.DELETE,
        });
    };

    findBooksListByUser = async (userId) => {
        const query = `SELECT * FROM Books WHERE userId = :userId`;
        console.log(typeof userId);
        const bookList = await sequelize.query(query, {
            replacements: { userId: userId },
            type: sequelize.QueryTypes.SELECT,
        });
        /* const campList = await this.#CampsModel.findAll({
            where: { hostId },
        }); */

        return bookList;
    };
}

module.exports = UsersRepository;
