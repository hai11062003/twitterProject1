import { Router } from 'express'
import { register } from 'module'
import {
  emailVerifyController,
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  RefreshTokenValidator,
  accessTokenValidator,
  emailVerifyValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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

/*
des : resend email verify
method : POST 
headers: {Authorization: Bearer <access_token>}

*/
usersRouter.post('/resend-email-verify', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
 des: forgot password 
 khi ng dùng quên mk , họ cung cấp email cho mình 
 mminhf  sẽ xem có user nào sở hữu email đó k , nếcos thì mình tạo forgot pasword 
 method: POST 
 path: /users/forgot-password 
 body: {email: string}
*/

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
 des: verify forgot-password-token
 người ùng sau khi báo forgot pasword, họ sẽ nhận đc 1 email 
 họ vào và click vào link trong email đó , link đó sẽ có  req đính kèm 
 forgot_password_token và gửi lên sever  
 path: //user/forgot_password_token
 mình sẽ verify cái token này nếu thành công thì mình  sẽ cho ngta reset password 
 method : POST
 body: {forgot_password_token:string}
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))

//hàm bình thường thi dùng

export default usersRouter // mở pulic cho các lệnh
