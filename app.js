var require
const winston = require('winston');
const express = require('express')
const cors = require('cors')
const app = express()

const constituencies = require('./routes/constituencies')
const results = require('./routes/results')
const users = require('./routes/users')
const candidates = require('./routes/candidates')

const bodyparser = require('body-parser')

app.use(cors({origin: '*'}))
app.use(bodyparser.urlencoded({ extended: false }))


app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

app.post('/api/v1/users', users.register)
app.get('/api/v1/users/user_name/:user_name', users.getUser)
app.put('/api/v1/users/user_name/:user_name', users.updateUser)
app.delete('/api/v1/users/user_name/:user_name', users.deleteByUsername)

//Starts up the actual application server
app.listen(process.env.PORT, function () {
    console.log('Running api on port: ' + process.env.PORT + '!')
})
