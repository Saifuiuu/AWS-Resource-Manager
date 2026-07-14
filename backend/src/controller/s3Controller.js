import { s3client, cloudWatchClient } from "../config/awsConfig.js"; 
import { CloudWatch, CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
import { ListBucketsCommand,GetPublicAccessBlockCommand} from "@aws-sdk/client-s3";


 export const getBuckets= async(req,res,next)=>{
    try {
        
    const listCommand= new ListBucketsCommand({})
    const s3Response = await s3client.send(listCommand)
        
    const buckets=s3Response.Buckets || []
    const bucketReport=[]

    const endTime= new Date()
    const startTime=new Date(endTime.getTime-(3*24*60*60*1000))



    for(const bucket of buckets){

const cwCommand = new GetMetricStatisticsCommand({
                Namespace: 'AWS/S3',
                MetricName: 'BucketSizeBytes',
                Dimensions: [
                    { Name: 'BucketName', Value: bucket.Name },
                    { Name: 'StorageType', Value: 'StandardStorage' } 
                ],
                StartTime: startTime,
                EndTime: endTime,
                Period: 86400, 
                Statistics: ['Average']
            });


            let sizeInmb=0


            try {
                let cwResponse=await CloudWatchClient.send(cwCommand) 
                if(cwResponse.Datapoints && cwResponse.Datapoints.length>0){
                    const sizeInBytes=cwResponse.Datapoints[0].Average

                    sizeInmb=(sizeInBytes/(1024*1024)).toFixed(2)
                }

            } catch (error) {
                console.log(`cloudwatch metric fetch failed  fro ${bucket.Name} `)
            }


            let isPbulic =true
try {
    
            let blockCommand=new GetPublicAccessBlockCommand({Bucket:bucket.Name})
            let blockResponse= await s3client.send(blockCommand)


            const config=blockResponse.PublicAccessBlockConfiguration;


            if(config && config.BlockPublicAcls && config.BlockPublicPolicy 
                && config.IgnorePublicAcls &&  config.RestrictPublicBuckets ){
                    isPbulic=false
                }

} catch (error) {
    isPbulic=true
}
            
bucketReport.push({
    bucketName:bucket.Name,
    creationDate:bucket.creationDate,
    sizeMb:sizeInmb+"MB",
    securityStatus:isPbulic?"Warning public unsecure":"Secure|private"

})



    }

res.status(200).json({
    success:true,
    totoallBuckets:bucketReport.length,
    data:bucketReport
});


    } catch (error) {
        next(error)
    }







     

}