import express from 'express'
import 'dotenv/config'
import connection from './DB/connectionDB.js'
import userRouter from './src/modules/user/user.routes.js'
import companyRouter from './src/modules/company/company.routes.js'
import jobRouter from './src/modules/job/job.routes.js'
import { AppError } from './src/utils/classError.js'
import { globalErrorHandling } from './globalErrorHandling.js'

const app = express()
app.use(express.json())
app.use("/user",userRouter)
app.use("/company",companyRouter)
app.use("/job",jobRouter)
connection()
const port = process.env.port | 3000

app.use('*', (req, res,next) =>{
    return next(new AppError("404 Page is not found ", 404))
} )



app.use(globalErrorHandling)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))