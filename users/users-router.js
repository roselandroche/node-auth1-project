const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("./users-model")

const router = express.Router()

// functions

module.exports = router