import * as jwt from 'jsonwebtoken'

class Oauth {
    private tokenBlockList : string[]

    /**
     * Retorna um novo token que codifica o @id
     */
    public getNewToken (id : string) : string {
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // 30 minutos
      })
      return token
    }

    /**
     * Adiciona o @token à blacklist
     */
    public addBlackList (token : string) : void {
      this.tokenBlockList.push(token)
    }

    /**
     * Verifica se o @token está na blacklist dos tokens
     */
    public inBlackList (token: string) : boolean {
      return this.tokenBlockList.includes(token)
    }
}
export default new Oauth()
