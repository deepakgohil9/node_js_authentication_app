const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const register = async (req, res, next) => {
    try {
        let salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)

        let user_data = new User(req.body)
        await user_data.save()

        res.send({ status: "registered successfully !" })
    } catch (error) {
        req.err = error
        next()
    }
}

const login = async (req, res, next) => {
    try {
        let user_data = await User.findOne({ email: req.body.email })
        if (!user_data) {
            res.send({ status: "no user found" })
            return
        }

        is_valid = await bcrypt.compare(req.body.password, user_data.password)
        if (!is_valid) {
            res.send({ status: "invalid password" })
            return
        }

        let token = jwt.sign({ username: req.body.username, email: req.body.email }, process.env.JWT)
        res.cookie("access_token", token, { httpOnly: true }).send({ status: "logged in successfully !" })
    } catch (error) {
        req.err = error
        next()
    }
}

module.exports = { register, login }




