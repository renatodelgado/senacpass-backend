import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pinoHttp from 'pino-http'

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(pinoHttp())

app.get('/', (req, res) => {
  return res.json({
    message: 'API funcionando 🚀'
  })
})

export { app }