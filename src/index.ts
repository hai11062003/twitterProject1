import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

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

app.listen(PORT, () => {
  console.log(`Sever dang mo o tren port ${PORT}`)
})
