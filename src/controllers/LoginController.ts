import { Request, Response } from 'express'
import Login, { LoginRequest, MyFlightsRequest } from '../models/Login'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config({
  path: './.env'
})

class LoginController {
  public async login (req: LoginRequest, res: Response) : Promise<Response> {
    const encontrouUsuario = await Login.find({ ...req.body })
    if (encontrouUsuario.length) {
      const token = jwt.sign({
        id: encontrouUsuario[0]._id
      }, process.env.SECRET, {
        expiresIn: 300
      })
      await Login.updateOne({ ...req.body }, { token })
      return res.json({ auth: true, token })
    }
    return res.json([])
  }

  public async create (req: LoginRequest, res: Response) : Promise<Response> {
    const novoLogin = new Login(req.body)
    await novoLogin.save()
    return res.json(novoLogin)
  }

  public async getMyFlights (req: MyFlightsRequest, res: Response) : Promise<Response> {
    const user = await Login.findOne({ token: req.body.token }, 'myFlights')
    return res.json(user)
  }
}
export default new LoginController()
