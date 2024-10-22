const User = require("../models/UserModel");
const UserModel = require("../models/UserModel");

const getUsers = async (req, res) => {
    try {
        const response = await UserModel.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const getUserByID = async (req, res) => {
    try {
        const response = await UserModel.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createUser = async (req, res) => {
    try {
        await User.create(req.body)
        res.status(201).json({msg: "User Created"});
    } catch (error) {
        console.log(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        await User.update(req.body, {
            where:{
                id: req.params.id
            }
        })
        res.status(201).json({msg: "User Updated"});
    } catch (error) {
        console.log(error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where:{
                id: req.params.id
            }
        })
        res.status(201).json({msg: "User Deleted"});
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { getUsers, getUserByID, createUser, updateUser, deleteUser };
