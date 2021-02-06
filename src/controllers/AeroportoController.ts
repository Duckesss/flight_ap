import { Request, Response } from 'express'
import Aeroporto, { AeroportoCreateRequest } from '../models/Aeroporto'

class AeroportoController {
  public async getAll (req: Request, res: Response) : Promise<Response> {
    const aeroportos = await Aeroporto.find({})
    return res.json(aeroportos)
  }

  public async create (req: AeroportoCreateRequest, res: Response) : Promise<Response> {
    const novoAeroporto = new Aeroporto(req.body)
    await novoAeroporto.save()
    return res.json(novoAeroporto)
  }
}
export default new AeroportoController()
