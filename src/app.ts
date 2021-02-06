import express from 'express'
import routes from './routes'
import Database from './database'
import cors from 'cors'
import * as dotenv from 'dotenv'
dotenv.config({
  path: './.env'
})

class App {
    private database
    public express: express.Application
    constructor () {
      this.express = express()
      this.middlewares()
      this.database = new Database()
      this.routes()
    }

    private middlewares () {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private routes () {
      this.express.use(routes)
    }
}

export default new App().express
