import Aeroporto from '../models/Aeroporto'

async function getAeroporto (codAeroporto : string | string[]) : Promise<string[]> {
  let aeroporto
  if (typeof codAeroporto === 'string') {
    aeroporto = await Aeroporto.find({
      code: codAeroporto
    })
  } else {
    const searchAeroporto = codAeroporto.map(code => ({ code }))
    aeroporto = await Aeroporto.find({
      $or: searchAeroporto
    })
  }
  return aeroporto.map(e => e._id)
}

export { getAeroporto }
