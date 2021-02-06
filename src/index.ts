import app from './app'
import * as appInfo from '../package.json'
const PORT = 5000

app.listen(PORT, () => {
  console.log(`[${appInfo.version}] [${new Date().toLocaleString('pt-br')}] Server running on localhost:${PORT}`)
})
