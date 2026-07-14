import express from "express"
import {getAllInstances,getIdleInstances,startInstance,stopInstance} from "../controller/ec2Controller.js"

const router=express.Router()

router.get('/instances',getAllInstances)
router.post('/start',startInstance)
router.post('/stop',stopInstance)
router.get('/idleInstances',getIdleInstances)


export default router