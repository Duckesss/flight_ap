import { Request, Response } from 'express'
import Aeroporto from '../models/Aeroporto'
import Voo, { VooRequest, RequestCreate } from '../models/Voo'

interface ObjVoo{
  [key:string]:any
}
async function getAeroporto (codAeroporto : string | string[]) {
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

class VoosController {
  public async get (req: VooRequest, res: Response) : Promise<Response> {
    const { departure1, departure2 = '' } = req.body
    if (departure2 !== '') {
      const valid = verifyDateFormat(departure1)
      !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
    }
    const valid = verifyDateFormat(departure1)
    !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
    const voos = await Voo.find({ ...req.body })
    return res.json(voos)
  }

  public async getAll (req: Request, res: Response) : Promise<Response> {
    const voos = await Voo.find()
      .populate('origin', 'code')
      .populate('destination', 'code')
      .populate('leg', 'code').exec()
    return res.json(voos)
  }

  public async create (req: RequestCreate, res: Response) : Promise<Response> {
    const { departure1, departure2 = '' } = req.body
    const valid = verifyDateFormat(departure1)
    !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
    const [ano1, mes1, dia1] = req.body.departure1.split('/').map(e => parseInt(e))
    const objVoo : ObjVoo = {
      departure1: new Date(ano1, mes1, dia1),
      ...req.body
    }

    if (departure2 !== '') {
      const valid = verifyDateFormat(departure1)
      !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
      const [ano2, mes2, dia2] = req.body.departure2.split('/').map(e => parseInt(e))
      objVoo.departure2 = new Date(ano2, mes2, dia2)
    }

    const { leg, origin, destination } = req.body
    objVoo.leg = await getAeroporto(leg)
    objVoo.origin = await getAeroporto(origin)
    objVoo.destination = await getAeroporto(destination)

    const novoVoo = new Voo(objVoo)
    await novoVoo.save()
    return res.json(novoVoo)
  }
}
export default new VoosController()

function verifyDateFormat (date : string) {
  const padraoValido = /^\d{4}\/\d{2}\/\d{2}$/.test(date)
  if (!padraoValido) { return false }

  const [ano, mes, dia] = date.split('/').map(e => parseInt(e))
  if (ano < 2000 || ano > 3000 || mes === 0 || mes > 12) { return false }

  const ultimoDia = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // tratamento de ano bissexto
  if (ano % 400 === 0 || (ano % 100 !== 0 && ano % 4 === 0)) { ultimoDia[1] = 29 }

  return dia > 0 && dia <= ultimoDia[mes - 1]
}
