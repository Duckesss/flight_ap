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
  money: {
    type: Number,
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

interface UserModel extends Document{
  username: string;
  password: string;
  money: number;
  myFlights: string[];
}

interface BuyFlightsRequest extends Request{
  body:{
    purchase:{
      flight1: string,
      flight2?: string,
      passengers: number,
      cost: number
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
interface CreateUserRequest extends Request{
  body:{
    username: string;
    password: string;
    money: number;
  }
}

export default model<UserModel>('User', UserSchema)
export { LoginRequest, MyFlightsRequest, BuyFlightsRequest, CreateUserRequest }
