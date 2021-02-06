import { Response } from 'express'
import User, { BuyFlightsRequest, LoginRequest, MyFlightsRequest, CreateUserRequest } from '../models/User'
import Oauth from './OauthController'
import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import Voo from '../models/Voo'
dotenv.config({
  path: './.env'
})

class UserController {
  public async login (req: LoginRequest, res: Response) : Promise<Response> {
    const encontrouUsuario = await User.find({ ...req.body })
    if (encontrouUsuario.length) {
      const token = Oauth.getNewToken(encontrouUsuario[0]._id)
      return res.json({ auth: true, token })
    }
    return res.json([])
  }

  public async create (req: CreateUserRequest, res: Response) : Promise<Response> {
    const novoLogin = new User(req.body)
    await novoLogin.save()
    return res.json(novoLogin)
  }

  public async getMyFlights (req: MyFlightsRequest, res: Response) : Promise<Response> {
    const user = await User.findOne({ _id: new ObjectId(req.params.userId) })
    return res.json(user)
  }

  public async buyFlights (req: BuyFlightsRequest, res: Response) : Promise<Response> {
    const { flight1, flight2, cost, passengers } = req.body.purchase
    const arrayVoos = [flight1]
    flight2 && arrayVoos.push(flight2)
    const flights = arrayVoos.map(e => new ObjectId(e))
    const voos = await Voo.find({ _id: { $in: flights } })
    if (!voos.length) {
      return res.status(400).json({
        erro: 1,
        mensagem: 'Não foi possível encontrar o voo'
      })
    }
    const updateProibido = voos.some(voo => (voo.totalPassengers < (voo.passengers + passengers)))
    if (updateProibido) {
      return res.status(400).json({
        erro: 1,
        mensagem: 'Existem mais passageiros do que o permitido'
      })
    }

    await Voo.updateMany({ _id: flights }, { $inc: { passengers } })
    const user = await User.findOneAndUpdate({ _id: new ObjectId(req.params.userId) }, {
      $push: {
        myFlights: { $each: [] }
      },
      $inc: { money: -cost }
    }, {
      useFindAndModify: false
    })
    Oauth.addBlackList(req.headers.authorization)
    const token = Oauth.getNewToken(user._id)
    return res.json({ ...user, token })
  }
}
export default new UserController()
