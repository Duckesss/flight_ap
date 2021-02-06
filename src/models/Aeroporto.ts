import { Schema, model, Document } from 'mongoose'
import { Request } from 'express'

const AeroportoSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

interface AeroportoModel extends Document{
  code:string;
  name:string;
  city:string;
  country:string;
  timezone:string
}

interface AeroportoCreateRequest extends Request{
  body: {
    code: string;
    name: string;
    city: string;
    country: string;
    timezone: string;

  }
}

export default model<AeroportoModel>('Aeroporto', AeroportoSchema)
export { AeroportoCreateRequest }
