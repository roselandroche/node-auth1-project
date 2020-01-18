const express = require("express")

const session = require("express-session")

const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(express.json())
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "I am no man.",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60,
        secure: false,
    }
}))

server.use("/api", usersRouter)

server.use((err, req, res, next) => {
    console.log(`Error:`, err)

    res.status(500).json({ message: `Something went wrong!`})
})

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})