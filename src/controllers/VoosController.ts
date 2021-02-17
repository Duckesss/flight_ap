import { Request, Response } from 'express'
import Voo, { GetVooRequest, CreateVooRequest } from '../models/Voo'
import Aeroporto from '../controllers/AeroportoController'
const pageSize = 10;

class VoosController {
	public async get (req: GetVooRequest, res: Response) : Promise<Response> {
		const queryParams = (req.query as any);
		const validParams = Object.entries(queryParams).reduce((retorno,[key,value]) => {
			let validParam = typeof value === "string"
			if(!validParam)
				return retorno
			const keysDatas = ["departure1","departure2"]
			if(keysDatas.includes(key)){
				validParam = verifyDateFormat(value as string)
				if(!validParam)
					return retorno
				retorno.params[key] = new Date(value as string)
				retorno.keysEnviadas.push(key)
				return retorno
			}
			retorno.keysEnviadas.push(key)
			retorno.params[key] = value
			return retorno
		},{
			keysEnviadas: [],
			params: {}
		} as {[key: string] : any})
		const {params,keysEnviadas} = validParams
		const parametrosObrigatorios = ["origin","destination","departure1"]
		const requestValida = parametrosObrigatorios.every(param => keysEnviadas.includes(param))
		if(!requestValida){
			return res.status(400).json({
				erro: 1,
				message: 'Parâmetros enviados incorretamente',
				parametros: validParams
			})
		}
		params.origin = await Aeroporto.getAeroporto(params.origin)
		params.destination = await Aeroporto.getAeroporto(params.destination)
		const voos = await Voo.find({ ...params })
		  .populate('origin')
		  .populate('destination')
		  .exec()
		const allowedFlights = voos.filter(voo => voo.totalPassengers >= (Number(params?.passengers || 0) + voo.passengers))
		return res.json(allowedFlights)
  }
  public async getPaginated (req: Request, res: Response) : Promise<Response> {
    let skip = 0
    let limit = pageSize
    if(req.query.page)
      skip = pageSize*(Number(req.query.page) - 1)
    
    const voos = await Voo.find()
      .skip(skip).limit(limit)
      .populate('origin')
      .populate('destination')
      .populate('leg', 'code').exec()
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
    dadosVoo.passengers = 0
    const novoVoo = new Voo({ ...dadosVoo })
    await novoVoo.save()
    return res.json(novoVoo)
  }

  public async countVoos(req: Request, res: Response) : Promise<Response> {
    const voos = await Voo.countDocuments({})
    const pages = Math.floor(voos/pageSize) + (voos%pageSize ? 1 : 0)
    return res.json(pages)
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
