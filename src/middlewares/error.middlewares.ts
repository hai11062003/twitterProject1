import { NextFunction, Request, Response } from 'express'
import { keyBy, omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Erorrs'

export const defaultErrorrHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('lỗi nè ' + err.message)
  // nơi tập kết mọi lỗi từ hệ thống về
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }

  //còn nếu code mà chạy được xuống dday thì error sẽ là 1 lỗi mặc định
  //err{message, stack, name}
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    // errorInfor: err //truyền vậy là truyền lên cả stack(full lỗi và đường dẫn của file lỗi)
    errorInfor: omit(err, ['stack']) //truyền vậy là chỉ truyền lên message
  })
}
