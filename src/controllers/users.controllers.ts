import { Request, Response } from 'express'
import User from '~/models/schemas/User.chema'
import databaseService from '~/services/database.services'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { RegisterReqBody } from '~/models/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'text@gmail.com' && password === '123456') {
    res.json({
      data: [
        { fname: 'Diep', yob: 1999 },
        { fname: 'Hai', yob: 2000 },
        { fname: 'Duy', yob: 2003 }
      ]
    })
  } else {
    res.status(400).json({
      message: 'login failed'
    })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    //??????????????tao 1 user moi va bo vao collection users trong database--------------------------
    const result = await userService.register(req.body)
    console.log(result)

    return res.status(201).json({
      message: 'register successfully',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'register failed',
      error
    })
  }
}
