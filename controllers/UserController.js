const UserModel = require("../models/UserModel");
const { verifyJWT } = require("./AuthController");
const bcrypt = require('bcrypt');


const getUsers = async (req, res) => {
  try {
    // Call verifyJWT middleware before accessing data
    verifyJWT(req, res, async () => {
      const users = await UserModel.findAll();
      res.status(200).json(users);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserByID = async (req, res) => {
  try {
    // Call verifyJWT middleware before accessing data
    verifyJWT(req, res, async () => {
      const userId = req.params.id;
      const response = await UserModel.findOne({ where: { id: userId } });
      res.status(200).json(response);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createDump = async (req, res) => {
    try {
      const { name, username, email, gender, password } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const newUser = await UserModel.create({
          name: name ||"Superadmin",
          username: username|| 'admin',
          email:email || "admin@admin.com",
          gender: gender|| "Male",
          password: hashedPassword
        });
        res.status(201).json({ message: "User Created", user: newUser });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

const createUser = async (req, res) => {
  try {
    verifyJWT(req, res, async () => {
      const { name, username, email, gender, password } = req.body;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({
        name,
        username,
        email,
        gender,
        password: hashedPassword
      });

      res.status(201).json({ message: "User Created", user: newUser });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    verifyJWT(req, res, async () => {
      const userId = req.params.id;
      const { name, username, email, gender, password } = req.body;

      const user = await UserModel.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (password) {
        const isPasswordMatch = await bcrypt.compare(req.body.password, UserModel.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Incorrect password' });
        }

        const salt = await bcrypt.genSalt();
        const newHashedPassword = await bcrypt.hash(password, salt);
        UserModel.password = newHashedPassword;
      }

      await UserModel.save();

      res.status(200).json({ message: 'User updated successfully' });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
    try {
        verifyJWT(req, res, async () => {
            await UserModel.destroy({
                where:{
                    id: req.params.id
                }
            })
        })
        res.status(201).json({msg: "User Deleted"});
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { createDump, getUsers, getUserByID, createUser, updateUser, deleteUser };