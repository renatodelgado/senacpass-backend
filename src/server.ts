import dotenv from 'dotenv'
import { app } from './app'
import { AppDataSource } from './shared/infra/database/data-source'

dotenv.config()

const PORT = process.env.PORT || 3333

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connected successfully')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('❌ Error during Data Source initialization:', error)
  })