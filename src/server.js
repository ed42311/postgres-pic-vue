const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')

let app = express()

app.use(cors())
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

let sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

let Test = sequelize.define('tests', {
  image: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

epilogue.initialize({
  app,
  sequelize
})

// Create the dynamic REST resource for our Share model
let shareResource = epilogue.resource({
  model: Test,
  endpoints: ['/tests', '/tests/:id',]
})

shareResource.list.complete((req, res, context) => {
  console.log(context)
  return context.continue;
})

// Resets the database and launches the express app on :8081
sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(8081, () => {
      console.log('listening to port localhost:8081')
    })
  })
