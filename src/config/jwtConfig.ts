import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
const tokenBlockList : string[] = []

export default (req : Request, res : Response, next : NextFunction) : Response | void => {
  const token = typeof req.headers.Authorization === 'object' ? req.headers.Authorization[0] : req.headers.Authorization
  if (tokenBlockList.includes(token)) { return res.status(403).json({ auth: false, message: 'Token inválido.' }) }
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

function getNewToken (id : string) : string {
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: 300 // 30 minutos
  })
  return token
}

export { tokenBlockList, getNewToken }
