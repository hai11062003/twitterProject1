import { Router } from 'express'
import { register } from 'module'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, loginController)

usersRouter.post('./register', registerController)
export default usersRouter // mở pulic cho các lệnh
