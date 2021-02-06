import mongoose, { Schema, model, Document } from 'mongoose'
import { Request } from 'express'

const VooSchema = new Schema({
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aeroporto',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aeroporto',
    required: true
  },
  departure1: {
    type: Date,
    required: true
  },
  passengers: {
    type: Number,
    required: true
  },
  totalPassengers: {
    type: Number,
    required: true
  },
  departure2: {
    type: Date,
    required: false
  },
  leg: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aeroporto',
    required: false
  }],
  faresMoney: {
    type: Number,
    required: true
  },
  faresMiles: {
    type: Number,
    required: true
  },
  fares: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

interface VooModel extends Document {
  origin:string;
  destination:string;
  departure1:Date;
  passengers:number;
  totalPassengers:number;
  departure2:Date;
  leg?: string[];
  faresMoney:number;
  faresMiles:number;
  fares:string;
}

interface GetVooRequest extends Request{
  body:{
    origin: string;
    destination: string;
    departure1: string;
    passengers: number;
    departure2?: string;
  }
}

interface CreateVooRequest extends Request{
  body: {
    leg?: string[];
    faresMoney: number;
    faresMiles: number;
    fares: string;
    origin: string;
    destination: string;
    departure1: string;
    passengers: number;
    departure2?: string;
  }
}

export default model<VooModel>('Voo', VooSchema)
export { GetVooRequest, CreateVooRequest, VooModel }
