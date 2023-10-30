import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { NextFunction, Request, Response } from 'express'
import { defaultErrorrHandler } from './middlewares/error.middlewares'
const app = express()
const PORT = 3000
databaseService.connect()

app.use(express.json())
//route mac dinh localHost : 3000
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/api', usersRouter)
//localhost:3000/tweets

//ap su dung 1 error handler tong
app.use(defaultErrorrHandler)

app.listen(PORT, () => {
  console.log(`Sever dang mo o tren port ${PORT}`)
})
