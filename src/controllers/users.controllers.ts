import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.chema'
import databaseService from '~/services/database.services'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { LogoutReqBody, RegisterReqBody } from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  //vào req lấy user ra , và lấy user_id và lấy id của user đó

  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng cái user_id đó tạo access và rếh _token
  const result = await userService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOHIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  //??????????????tao 1 user moi va bo vao collection users trong database--------------------------
  const result = await userService.register(req.body)
  console.log(result)

  return res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  //lấy refresh_token từ body
  const refresh_token = req.body.refresh_token
  //goi ham logout , ham nhan vao refresh_token tim va xoa
  const result = await userService.logout(refresh_token)
  res.json(result)
}
