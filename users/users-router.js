const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("./users-model")

const router = express.Router()

// middleware to validate user and password
function restricted() {
    const authErr = {
        message: `Invalid credentials!`
    }
    return async (req, res, next) => {
        try {
            const{ username, password } = req.headers
            
            if(!username || !password) {
                return res.status(401).json(authErr)
            }

            const user = usersModel.findBy({ username }).first()
            if(!user) {
                return res.status(401).json(authErr)
            }

            const passwordValid = await bcrypt.compare(password, user.password)
            if(!passwordValid) {
                return res.status(401).json(authErr)
            }
            next()
        } 

        catch (err) {
            next(err)
        }
    }
}

router.get("/users", restricted(), async(req, res, next) => {
    try{
        const users = await usersModel.find()
        res.json(users)
    } 
    catch(err) {
        next(err)
    }
})

router.post("/register", async(req, res, next) => {
    try{
        const newUser = await usersModel.add(req.body)
        res.status(201).json(newUser)
    } 
    catch (err) {
        next(err)
    }
})

router.post("/login", async(req, res, next) => {
    try{
        const { username, password } = req.body
        const user = await usersModel.findBy({ username }).first()
        const passwordValid = await bcrypt.compare(password, user.password)

        if(user && passwordValid) {
            res.status(201).json({ message: `Welcome ${user.username}!`})
        } else {
            res.status(401).json({ message: `Invalid credentials!`})
        }
    }
    catch (err) {
        next(err)
    }
})

module.exports = router