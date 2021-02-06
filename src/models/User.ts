import mongoose, { Schema, model, Document } from 'mongoose'
import { Request } from 'express'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  myFlights: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aeroporto',
    required: false
  }]
}, {
  timestamps: true
})

interface BuyFlightsRequest extends Request{
  body:{
    purchase:{
      flight1: string,
      fare1: string,
      flight2: string,
      fare2: string,
      passengers: number,
      total: {
        miles: number,
        money: number
      }
    }
  }
}

interface MyFlightsRequest extends Request{
  body: {
    myFlights: string[] | string;
  }
}
interface LoginRequest extends Request{
  body: {
    username: string;
    password: string;
  }
}

interface UserModel extends Document{
  username: string;
  password: string;
  myFlights: string[];
}

export default model<UserModel>('User', UserSchema)
export { LoginRequest, MyFlightsRequest, BuyFlightsRequest }
