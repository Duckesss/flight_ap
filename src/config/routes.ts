import { Router } from 'express'
import AeroportoController from '../controllers/AeroportoController'
import LoginController from '../controllers/LoginController'
import VoosController from '../controllers/VoosController'
import verifyToken from '../config/jwtConfig'
import * as appInfo from '../../package.json'
const routes = Router()

routes.get('/', (req, res) => {
  res.send({
    API: appInfo.name,
    Version: appInfo.version
  })
})

routes.get('/locations', AeroportoController.getAll)
routes.get('/search', VoosController.get)
routes.get('/voo/all', VoosController.getAll)

routes.post('/voo/mine', LoginController.getMyFlights)
routes.post('/voo', VoosController.create)
routes.post('/aeroporto', AeroportoController.create)
routes.post('/login', LoginController.login)

routes.put('/login', LoginController.create)

export default routes
