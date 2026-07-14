import {EC2Client } from "@aws-sdk/client-ec2"
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch"
import {S3Client} from "@aws-sdk/client-s3"

import dotenv from 'dotenv'
dotenv.config()

//automatically pick credentials from .env

console.log(process.env.AWS_REGION)

const region = process.env.AWS_REGION

export const ec2Client= new EC2Client({
    region,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})




export const s3client= new S3Client({
    region,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})

export const cloudWatchClient=new CloudWatchClient({
region,
credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
}
})



