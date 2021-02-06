import { Request, Response } from 'express'
import Aeroporto, { AeroportoCreateRequest } from '../models/Aeroporto'

class AeroportoController {
  /**
   *  Retorna todos os aeroportos cadastrados no banco
   */
  public async getAll (req: Request, res: Response) : Promise<Response> {
    const aeroportos = await Aeroporto.find({})
    return res.json(aeroportos)
  }

  /**
   *  Cria um novo aeroporto
   */
  public async create (req: AeroportoCreateRequest, res: Response) : Promise<Response> {
    const novoAeroporto = new Aeroporto(req.body)
    await novoAeroporto.save()
    return res.json(novoAeroporto)
  }

  /**
   * Pega um aeroporto através do seu código (ou array de códigos) e retorna um array de id (string)
   */
  public async getAeroporto (codAeroporto : string | string[]) : Promise<string[]> {
    let aeroporto
    if (typeof codAeroporto === 'string') {
      aeroporto = await Aeroporto.find({
        code: codAeroporto
      })
    } else {
      const searchAeroporto = codAeroporto.map(code => ({ code }))
      aeroporto = await Aeroporto.find({
        $or: searchAeroporto
      })
    }
    return aeroporto.map(e => e._id)
  }
}
export default new AeroportoController()
