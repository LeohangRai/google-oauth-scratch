require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const protectedTestRouter = require('./routes/test')

const app = express()
const PORT = process.env.PORT|| 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Google Oauth implementation from scratch"
    })
})

app.use(authRouter);
app.use(protectedTestRouter);

app.listen(PORT, () => {
    console.log("Server is up and running at PORT:", PORT);
})