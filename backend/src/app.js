import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import healthRoutes from './routes/health.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import ec2Routes from './routes/ec2Routes.js'
import s3routes from './routes/s3Routes.js'
import { protect } from './middleware/authMiddleware.js'

const app=express()

app.use(cors(
    {
        origin:'http://localhost:5173',
        credentials:true
    }
));

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1',healthRoutes)
app.use('/api/v1/auth',authRoutes)


app.use('/api/v1/ec2',protect,ec2Routes)
app.use('/api/v1/s3',protect,s3routes)

app.use((req,res,next)=>{
    res.status(404);
    const error=  new Error (`error not found:${req.originalUrl}`)
    next(error)
})

app.use(errorHandler)

export default app