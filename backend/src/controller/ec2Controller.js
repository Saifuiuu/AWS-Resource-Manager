import { DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { ec2Client, cloudWatchClient } from "../config/awsConfig.js"; // Import name fixed
import { GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";


const Pricing = {
    't2.micro': 0.0116,
    't3.micro': 0.0104,
    't3.small': 0.0208,
    't3.medium': 0.0416,
    'c5.large': 0.085,
    'm5.large': 0.096
};

export const getIdleInstances = async (req, res, next) => {
    try {
        const describeCommand = new DescribeInstancesCommand({});
        const ec2Response = await ec2Client.send(describeCommand);

        let instances = []; 
        
        ec2Response.Reservations?.forEach(reservation => {
            reservation.Instances?.forEach(instance => {
                if (instance.State?.Name === 'running') {
                    const nameTag = instance.Tags?.find(tag => tag.Key === 'Name');
                    instances.push({
                        id: instance.InstanceId,
                        name: nameTag ? nameTag.Value : 'Unnamed',
                        type: instance.InstanceType 
                    });
                }
            });
        });

        //array to save idle instances
        const idleInstancesReport = []; 

        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - (24 * 60 * 60 * 1000));

        for (const instance of instances) {
            const cwCommand = new GetMetricStatisticsCommand({
                Namespace: 'AWS/EC2',
                MetricName: 'CPUUtilization',
                Dimensions: [{ Name: 'InstanceId', Value: instance.id }],
                StartTime: startTime,
                EndTime: endTime,
                Period: 86400, 
                Statistics: ['Average']
            });

            
            const cwResponse = await cloudWatchClient.send(cwCommand);
            const dataPoint = cwResponse.Datapoints;

            let avgCpu = 0;

            if (dataPoint && dataPoint.length > 0) {
                avgCpu = dataPoint[0].Average;
            }

            if (avgCpu < 5.0) {
                
                const hourlyRate = Pricing[instance.type] || 0.02; // Fallback added
                
                const wastedCost24h = hourlyRate * 24;

                idleInstancesReport.push({
                    instanceId: instance.id,
                    name: instance.name,
                    instanceType: instance.type,
                    averageCpu24h: avgCpu.toFixed(2) + '%',
                    estimatedLoss24h: '$' + wastedCost24h.toFixed(2),
                    status: 'IDLE-RECOMMENDED TO STOP'
                });
            }
        }

        res.status(200).json({
            success: true,
            idleCount: idleInstancesReport.length,
            data: idleInstancesReport
        });
    } catch (error) {
        next(error);
    }
};


export const getAllInstances = async (req, res, next) => {
    try {
        const command = new DescribeInstancesCommand({});
        const response = await ec2Client.send(command);
        
        
        let instances = [];
        response.Reservations?.forEach(reservation => {
            reservation.Instances?.forEach(instance => {
                const nameTag = instance.Tags?.find(tag => tag.Key === 'Name');
                instances.push({
                    id: instance.InstanceId,
                    name: nameTag ? nameTag.Value : 'Unnamed Instance',
                    type: instance.InstanceType,
                    state: instance.State?.Name,
                    publicIp: instance.PublicIpAddress || 'No Public IP',
                    privateIp: instance.PrivateIpAddress,
                    launchTime: instance.LaunchTime
                });
            });
        });

        res.status(200).json({
            success: true,
            count: instances.length,
            data: instances
        });
    } catch (error) {
        next(error); 
    }
};


export const startInstance = async (req, res, next) => {
    try {
        let { instanceId } = req.body;
        if (!instanceId) {
            res.status(400);
            return next(new Error("Instance ID required for starting instance")); 
        }

        let command = new StartInstancesCommand({ InstanceIds: [instanceId] });
        let response = await ec2Client.send(command); 

        res.status(200).json({
            success: true,
            message: `Starting instance: ${instanceId}`,
            data: response.StartingInstances
        });
    } catch (error) {
        next(error);
    }
};


export const stopInstance = async (req, res, next) => {
    try {
        let { instanceId } = req.body;
        if (!instanceId) {
            res.status(400);
            return next(new Error("Instance ID required for deletion")); 
        }

        let command = new StopInstancesCommand({InstanceIds:[instanceId]});
        let response = await ec2Client.send(command); 

        res.status(200).json({
            success:true,
            message:`Stopping instance:${instanceId}`,
            data:response.StoppingInstances 
        });
    } catch (error) {
        next(error);
    }
};