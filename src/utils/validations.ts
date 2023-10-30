import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Erorrs'

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      //đi qa từng lỗi và lấy msg ra xem
      const { msg } = errorObject[key]
      //nếu lỗi đặc biệt do mình tạo ra khác 422 thì mình next cho defaultErrorrHandler
      //nếu ko phải lỗi đặc biệt thì chắc chăn là lỗi 422
      //thì mình lưu vào entityError
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }

      entityError.errors[key] = msg
    }
    //sau khi duyệt xong thì mình ném cho defaultErrorrHandler xử lý

    next(entityError)
  }
}
