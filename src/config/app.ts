import express from 'express'
import routes from './routes'
import cors from 'cors'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config({
  path: './.env'
})

class App {
    public express: express.Application
    constructor () {
      this.express = express()
      this.middlewares()
      this.database()
      this.routes()
    }

    private middlewares () {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private database () {
      const strConnection = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ejos5.gcp.mongodb.net/flight_ap?retryWrites=true&w=majority`
      mongoose.connect(strConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }

    private routes () {
      this.express.use(routes)
    }
}

export default new App().express
