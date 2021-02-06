
import mongoose from 'mongoose'

class Database {
  constructor () {
    this.mongoConnect()
  }

  private mongoConnect () {
    const strConnection = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ejos5.gcp.mongodb.net/flight_ap?retryWrites=true&w=majority`
    mongoose.connect(strConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}
export default Database
