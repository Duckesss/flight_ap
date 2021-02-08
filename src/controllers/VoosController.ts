import { Request, Response } from 'express'
import Voo, { GetVooRequest, CreateVooRequest } from '../models/Voo'
import Aeroporto from '../controllers/AeroportoController'

class VoosController {
  public async get (req: GetVooRequest, res: Response) : Promise<Response> {
    const allString = Object.values(req.query).every(e => typeof e === 'string')
    if (allString) {
      console.log(req.query)
      const { departure1, departure2, passengers } = req.query
      delete req.query.passengers
      let date2
      if (departure2 && typeof departure2 === 'string') {
        const valid = verifyDateFormat(departure2)
        if (!valid) { return res.status(400).json({ erro: 1, message: 'invalid date' }) }
        date2 = new Date(departure2)
      }
      if (typeof departure1 === 'string') {
        const valid = verifyDateFormat(departure1)
        if (!valid) { return res.status(400).json({ erro: 1, message: 'invalid date' }) }

        if (typeof req.query.origin === 'string' && typeof req.query.destination === 'string') {
          req.query.origin = await Aeroporto.getAeroporto(req.query.origin)
          req.query.destination = await Aeroporto.getAeroporto(req.query.destination)
          const date1 = new Date(departure1)
          const voos = await Voo.find({ ...req.query, departure1: date1, departure2: date2 })
          const allowedFlights = voos.filter(voo => voo.totalPassengers >= (Number(passengers) + voo.passengers))
          return res.json(allowedFlights)
        }
      }
    } else {
      return res.status(400).json({
        erro: 1,
        message: 'Parâmetros enviados incorretamente'
      })
    }
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
      if (!valid) {
        return res.status(400).json({ erro: 1, message: 'invalid date' })
      }
      dadosVoo.departure2 = new Date(departure2)
    }

    const valid = verifyDateFormat(departure1)
    if (!valid) {
      return res.status(400).json({ erro: 1, message: 'invalid date' })
    }
    dadosVoo.departure1 = new Date(departure1)
    if (leg) { dadosVoo.leg = await Aeroporto.getAeroporto(leg) }
    dadosVoo.origin = await Aeroporto.getAeroporto(origin)
    dadosVoo.destination = await Aeroporto.getAeroporto(destination)
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
