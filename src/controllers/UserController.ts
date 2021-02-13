import { Response } from 'express'
import User, { BuyFlightsRequest, LoginRequest, MyFlightsRequest, CreateUserRequest } from '../models/User'
import Oauth from './OauthController'
import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import Voo, { VooModel } from '../models/Voo'
dotenv.config({
  path: './.env'
})

class UserController {
  /**
   * Método usado para login. Retorna o token usado nas requisições
   */
  public async login (req: LoginRequest, res: Response) : Promise<Response> {
    const encontrouUsuario = await User.find({ ...req.body })
    if (encontrouUsuario.length) {
      const token = Oauth.getNewToken(encontrouUsuario[0]._id)
      return res.json({ auth: true, token })
    }
    return res.json([])
  }

  /**
   * Cria um novo usuário
   */
  public async create (req: CreateUserRequest, res: Response) : Promise<Response> {
    const novoLogin = new User(req.body)
    await novoLogin.save()
    return res.json(novoLogin)
  }

  /**
   * Retorna todos os voos de um usuário
   */
  public async getMyFlights (req: MyFlightsRequest, res: Response) : Promise<Response> {
    const user = await User
      .findOne({ _id: new ObjectId(req.params.userId) }, 'myFlights')
      .populate([{
        path: 'myFlights',
        populate: {
          path: 'destination',
          model: 'Aeroporto'
        }
      }])
      .exec()
    return res.json(user)
  }

  /**
   * Método responsável pela compra de voos. Após fazer a compra, um novo token é gerado
   */
  public async buyFlights (req: BuyFlightsRequest, res: Response) : Promise<Response> {
    const { flight1, flight2, cost, passengers } = req.body.purchase
    const arrayVoos = [flight1]
    flight2 && arrayVoos.push(flight2)
    console.log(arrayVoos)
    const flights = arrayVoos.map(e => new ObjectId(e))
    const [voos, existe] = await getVoo(flights)
    if (!existe) {
      return res.status(400).json({
        erro: 1,
        mensagem: 'Não foi possível encontrar o voo'
      })
    }
    const excessoPassageiros = voos.some(voo => (voo.totalPassengers < (voo.passengers + passengers)))
    if (excessoPassageiros) {
      return res.status(400).json({
        erro: 1,
        mensagem: 'Existem mais passageiros do que o permitido'
      })
    }
    await addPassageiros(flights, passengers)
    const idUsuario = await compraPassagens(new ObjectId(req.params.userId), arrayVoos, cost)
    Oauth.addBlackList(req.headers.authorization)
    const token = Oauth.getNewToken(idUsuario)
    return res.json({ token })
  }
}
export default new UserController()

async function getVoo (idsVoos : ObjectId[]) : Promise<[VooModel[], boolean]> {
  const voos = await Voo.find({ _id: { $in: idsVoos } })
  return [voos, voos.length > 0]
}
async function addPassageiros (idsVoos : ObjectId[], passengers : number) : Promise<void> {
  await Voo.updateMany({ _id: idsVoos }, { $inc: { passengers } })
}
async function compraPassagens (idUsuario : ObjectId, idVoos : string[], preco : number) : Promise<string> {
  const user = await User.findOneAndUpdate({ _id: idUsuario }, {
    $push: {
      myFlights: { $each: idVoos }
    },
    $inc: { money: -preco }
  }, {
    useFindAndModify: false
  })
  return user._id
}
