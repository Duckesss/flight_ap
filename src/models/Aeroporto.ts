import { Schema, model, Document } from 'mongoose'
import { Request } from 'express'

interface AeroportoInterface{
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

interface AeroportoCreate extends Request{
  body:AeroportoInterface
}

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
type AeroportoModel = Document<AeroportoInterface>
export default model<AeroportoModel>('Aeroporto', AeroportoSchema)
export { AeroportoCreate, AeroportoInterface }
