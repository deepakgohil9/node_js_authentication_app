const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const cookie_parser = require("cookie-parser")
const morgan = require("morgan")
const fs = require("fs")

const auth_router = require("./routes/auth")

dotenv.config()
let log_stream = fs.createWriteStream("./access.log", { flags: "a" })
const PORT = process.env.PORT || 3000
const app = express()
const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected to the database!")
        })
        .catch((err) => {
            console.log(err)
            throw new Error(err)
        })
}

// middlewares
app.use(cors())
app.use(express.json())
app.use(cookie_parser())
app.use(morgan("combined", { stream: log_stream }))

app.use("/auth", auth_router)
app.get("/", (req, res) => {
    res.send("hello, welcome to sneat backend")
})

// global error handler
app.use((req, res) => {
    if (req.err) {
        console.log(req.err)
        res.status(400).send({ status: "error occured", error: req.err })
    }
    else {
        res.status(404).send({ status: "error occured", error: "404 page not found" })
    }
})


app.listen(PORT, () => {
    connect()
    console.log("server started !")
})