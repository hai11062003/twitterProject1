import { Router } from 'express'
import { register } from 'module'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  RefreshTokenValidator,
  accessTokenValidator,
  loginValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, wrapAsync(loginController))

usersRouter.post('/register', registerValidator, wrapAsync(registerController))

/*
  des: đăng xuất 
  path: /users/logout
  method: POST
  Header: {Authorization: 'Bearer <access_token>'}
  body: {refresh_token: string}

*/
usersRouter.post('.logout', accessTokenValidator, RefreshTokenValidator, wrapAsync(logoutController))

//hàm bình thường thi dùng
export default usersRouter // mở pulic cho các lệnh
