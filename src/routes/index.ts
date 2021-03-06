import { Router } from 'express'
import AeroportoController from '../controllers/AeroportoController'
import UserController from '../controllers/UserController'
import VoosController from '../controllers/VoosController'
import verifyToken from '../middlewares/Oauth'
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
routes.get('/voo', VoosController.getPaginated)
routes.get('/voo/count', VoosController.countVoos)
routes.get('/my-flights', verifyToken, UserController.getMyFlights)

routes.post('/voo', VoosController.create)
routes.post('/aeroporto', AeroportoController.create)
routes.post('/login', UserController.login)
routes.post('/checkout', verifyToken, UserController.buyFlights)

routes.put('/login', UserController.create)

export default routes
