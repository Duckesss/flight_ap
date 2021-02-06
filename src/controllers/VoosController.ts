import { Request, Response } from 'express'
import Voo, { GetVooRequest, CreateVooRequest } from '../models/Voo'
import { getAeroporto } from '../Utils'

class VoosController {
  public async get (req: GetVooRequest, res: Response) : Promise<Response> {
    const { departure1, departure2 } = req.body
    let date2
    if (departure2) {
      const valid = verifyDateFormat(departure2)
      !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
      date2 = new Date(departure2)
    }
    const valid = verifyDateFormat(departure1)
    !valid && res.status(400).json({ erro: 1, message: 'invalid date' })

    const date1 = new Date(departure1)
    const voos = await Voo.find({ ...req.body, departure1: date1, departure2: date2 })
    return res.json(voos)
  }

  public async getAll (req: Request, res: Response) : Promise<Response> {
    const voos = await Voo.find()
      .populate('origin', 'code')
      .populate('destination', 'code')
      .populate('leg', 'code').exec()
    return res.json(voos)
  }

  public async create (req: CreateVooRequest, res: Response) : Promise<Response> {
    const { departure1, departure2, leg, origin, destination, passengers } = req.body
    const dadosVoo: {[k: string]: any} = { ...req.body }
    if (departure2) {
      const valid = verifyDateFormat(departure2)
      !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
      dadosVoo.departure2 = new Date(departure2)
    }

    const valid = verifyDateFormat(departure1)
    !valid && res.status(400).json({ erro: 1, message: 'invalid date' })
    dadosVoo.departure1 = new Date(departure1)
    dadosVoo.leg = await getAeroporto(leg)
    dadosVoo.origin = await getAeroporto(origin)
    dadosVoo.destination = await getAeroporto(destination)
    dadosVoo.totalPassengers = passengers
    const novoVoo = new Voo({ ...dadosVoo })
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
