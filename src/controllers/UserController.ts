import { Response } from 'express'
import User, { BuyFlightsRequest, LoginRequest, MyFlightsRequest } from '../models/User'
import oauth from './OauthController'
import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({
  path: './.env'
})

class UserController {
  public async login (req: LoginRequest, res: Response) : Promise<Response> {
    const encontrouUsuario = await User.find({ ...req.body })
    if (encontrouUsuario.length) {
      const token = oauth.getNewToken(encontrouUsuario[0]._id)
      return res.json({ auth: true, token })
    }
    return res.json([])
  }

  public async create (req: LoginRequest, res: Response) : Promise<Response> {
    const novoLogin = new User(req.body)
    await novoLogin.save()
    return res.json(novoLogin)
  }

  public async getMyFlights (req: MyFlightsRequest, res: Response) : Promise<Response> {
    const user = await User.findOne({ id: new ObjectId(req.params.userId).toHexString() }, 'myFlights')
    return res.json(user)
  }

  public async buyFlights (req: BuyFlightsRequest, res: Response) : Promise<Response> {
    const { flight1, flight2 } = req.body.purchase
    const flights = [flight1, flight2].map(e => new ObjectId(e).toHexString())
    const user = await User.findOneAndUpdate({ id: new ObjectId(req.params.userId).toHexString() }, {
      $push: {
        myFlights: {
          $each: flights
        }
      }
    })
    oauth.addBlackList(req.params.Authorization)
    const token = oauth.getNewToken(user._id)
    return res.json({ ...user, token })
  }
}
export default new UserController()
