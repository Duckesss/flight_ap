import mongoose, { Schema, model, Document } from 'mongoose'
import { Request } from 'express'

interface LoginInterface{
  username: string;
  password: string;
}

interface MyFlightsInterface{
  myFlights: string[] | string;
  token: string;
}
interface bodyMyFlights{
  body:MyFlightsInterface
}
type MyFlightsRequest = bodyMyFlights & Request
interface LoginRequest extends Request{
  body:LoginInterface
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: false
  },
  myFlights: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aeroporto',
    required: false
  }]
}, {
  timestamps: true
})
type LoginModel = Document<LoginInterface>
export default model<LoginModel>('User', UserSchema)
export { LoginRequest, MyFlightsRequest }
