const express = require('express');
require('express-group-routes');

const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const router = express.Router()

// Add Here
router.post("/login", AuthController.loginUser);
router.get("/logout", AuthController.logoutUser);

router.group("/users", (route) => {
    route.get("/", UserController.getUsers);
    route.get("/:id", UserController.getUserByID);
    route.post("", UserController.createUser);
    route.post("/createDump", UserController.createDump);
    route.patch("/:id", UserController.updateUser);
    route.delete("/:id", UserController.deleteUser);
});

module.exports = router;