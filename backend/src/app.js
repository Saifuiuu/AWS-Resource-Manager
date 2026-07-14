import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/health.js'
import errorHandler from './middleware/errorHandler.js'
import ec2Routes from './routes/ec2Routes.js'
import s3routes from './routes/s3Routes.js'

const app=express()

app.use(cors())
app.use(express.json())

app.use('/api/v1',healthRoutes)
app.use('/api/v1/ec2',ec2Routes)
app.use('/api/v1/s3',s3routes)

app.use((req,res,next)=>{
    res.status(404);
    const error=  new Error (`error not found:${req.originalUrl}`)
    next(error)
})

app.use(errorHandler)

export default app