import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.chema'
import databaseService from '~/services/database.services'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { EmailVerifyReqBody, LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

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

export const emailVerifyController = async (req: Request<ParamsDictionary, any, EmailVerifyReqBody>, res: Response) => {
  //khi mà req vào đc đây nghĩa là email_verify_token đã valid
  //đông thời trong req sẽ có decoded_email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  //tim xem co user co ma nay ko
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  //nếu có user đó thì ta sẽ kiểm tra xem user đí lưu email_verify_token ko?
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //neu xuong dc dday la user nay chua nay la co, va chua verify
  //verify email là : tìm user đó bằng user_id và update lai j email_verify_token thành ''
  //và verify : 1
  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
