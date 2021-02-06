import * as jwt from 'jsonwebtoken'
import oauth from '../controllers/OauthController'
import { Request, Response, NextFunction } from 'express'

export default (req : Request, res : Response, next : NextFunction) : Response | void => {
  const token = typeof req.headers.Authorization === 'object' ? req.headers.Authorization[0] : req.headers.Authorization
  if (oauth.inBlackList(token)) { return res.status(403).json({ auth: false, message: 'Token inválido.' }) }
  if (!token) {
    return res.status(401).json({ auth: false, message: 'Nenhum token foi informado.' })
  }

  jwt.verify(token, process.env.SECRET, function (err, decoded : any) {
    if (err) {
      return res.status(403).json({ auth: false, message: 'Token inválido.' })
    }
    req.params.userId = decoded.id
    next()
  })
}
