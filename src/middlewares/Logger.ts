import { Request,Response, NextFunction } from 'express'

const loggerMiddleware = (req : Request, res : Response , next : NextFunction) => {
    console.log('=== NEW REQUEST === ')
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks : any = [];
  
    res.write = (...restArgs : any) => {
      chunks.push(Buffer.from(restArgs[0]));
      defaultWrite.apply(res, restArgs);
      return true
    };
  
    res.end = (...restArgs  : any) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString('utf8');
  
      console.log(body);
  
      defaultEnd.apply(res, restArgs);
    };
  
    next();
  };
export {loggerMiddleware}