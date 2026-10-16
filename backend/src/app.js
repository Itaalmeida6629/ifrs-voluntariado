const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(userRoutes)
app.use(eventRoutes)
app.use(errorMiddleware)

module.exports = app
