import { Router } from 'express'
import { register } from 'module'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  RefreshTokenValidator,
  accessTokenValidator,
  emailVerifyValidator,
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
/*
des: verify email
khi ng dùng đăng kí , trong email của họ sẽ có 1 link 
trong link này đã setup sẵn 1 request kèm email_verify_token
thì vẻify email là cái route cho request đó 
path : users/verify-eamil
body: {email_verify_token: string}
*/
usersRouter.post('verify-email', emailVerifyValidator, wrapAsync(emailVerifyController))

//hàm bình thường thi dùng

export default usersRouter // mở pulic cho các lệnh
