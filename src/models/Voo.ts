import mongoose, { Schema, model, Document } from 'mongoose'
import { Request } from 'express'

interface VooInterface{
  origin: string;
  destination: string;
  departure1: string;
  passengers: number;
  departure2?: string;
}

interface VooRequest extends Request{
  body:VooInterface
}

interface VooCreate extends VooInterface{
    leg: string[];
    faresMoney: number;
    faresMiles: number;
    fares: string;
}
interface RequestCreate extends Request{
  body:VooCreate
}

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
    type: String,
    required: true
  },
  departure2: {
    type: Date,
    required: false
  },
  leg: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aeroporto',
    required: true
  }],
  faresMoney: {
    type: String,
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
type VooModel = Document<VooInterface>
export default model<VooModel>('Voo', VooSchema)
export { VooRequest, RequestCreate }
