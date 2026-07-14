import React, { useState,useEffect } from 'react'
import api from '../services/api'
import { Loader2, RefreshCw, Square,Play } from "lucide-react";

const Ec2Page = () => {

const [instance,setInstance]=useState([])
const [loading,setLoading]=useState(false)
const [error,setError]=useState(null)
const [actionLoading,setActionLoading]=useState(null)

const fetchInstance=async ()=>{
try {
    setLoading(true)
    setError(null)
    const response= await api.get('/ec2/instances')
    setInstance(response.data.data)

} catch (error) {
    setError(error.response?.data?.message||"failed to fetch instances.")
}
finally{
setLoading(false)
}
}
useEffect(()=>{
    fetchInstance();
},[])



const handleInstanceAcion=async(instanceId,action)=>{
try{
    
    setActionLoading(instanceId);
    await api.post(`/ec2/${action}`,{instanceId})


  await  fetchInstance()
  console.log('fetch completed')
    setActionLoading(null)

}catch(error){
    alert(error.response?.data?.message || `Failed to ${action} instance`)
   setActionLoading(null)
}
}




 return (
    <div className='space-y-6'>
        <div className='flex justify-between items-center'>

            <div>
                <h2 className='text-2xl font-bold text-gray-800'>EC2 Instaces </h2>
                <p
                className='text-sm text-gray-500'>Manage and Monitor Your Computer Resources.</p>
            </div>

        <button 

        onClick={
            fetchInstance
        }

        className='flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'>
            
            <RefreshCw className={`w-4  h-4  ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
</div>

{error && (
    <div className='bg-red-50 border-l4 border-red-500 p-4 text-red-700'>
      <p className='font-medium'>Error</p> 
      <p>{error}</p> 
    </div>
 )}


{loading?(
    <div className='flex flex-col items-center justify-center py-20'>

        <Loader2 className='w-10 h-10 text-blue-500 animate-spin mb-4'/>
<p className='text-gray-500 '>Fetching AWS Resources...</p>
    </div>
):(
   <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
    <table className='w-full text-left border-collapse'>
        <thead>
            <tr className='bg-gray-50 border-b border-gray-200 text-sm text-gray-600'>
                <th className="p-4 font-semibold">Instance Name</th>
                <th className="p-4 font-semibold">Instance Id</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">State</th>
                <th className="p-4 font-semibold">Public Ip</th>
                <th className="p-4 font-semibold">Actions</th>
            </tr>
        </thead>

                <tbody className='divide-y divide-gray-200 text-sm'>
                    {instance.length===0?(
                         <tr>
                        <td colSpan="6"
                        className='p-8 text-center text-gray-500'
                        >No instace found in this region</td>
                    </tr>
                    ):(
                    instance.map((inst)=>(
                        <tr key={inst.id}
                        className='hover:bg-gray-50 transition-colors'>
                            <td className='p-4 font-medium text-gray-800'>{inst.name}</td>
                            <td className="p-4 text-gray-500 font-mono text-xs">{inst.id}</td>
                            <td className="p-4 text-gray-600">{inst.type}</td>
                            <td>
                                <span className={  
                             `inline-flex items-center px-2.5 py-0.5 rounded-full 
                             text-xs font-medium
                                 ${inst.state==='running' ? 
                                'bg-green-100 text-green-800' :
                                    inst.state==='stopped' ? 'bg-red-100 text-red-800':
                                    'bg-yellow-100 text-yellow-800'
                                }`}>

                                    <span
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5
                                    ${inst.state==='running'?'bg-green-500':
                                        inst.state==='stopped'?'bg-red-500':
                                        'bg-yellow-500'
                                    }`}></span>

                                    {inst.state}
                                </span>
                            </td>

                            <td className='p-4 text-gray-600 font-mono text-xs
                            '>{inst.publicIp}</td>
                            <td>
                                <div className='flex items-center space-x-2'>
                                <button 
                                onClick={()=>handleInstanceAcion(inst.id,'start')}
                            className='p-1.5 text-green-600 hover:bg-green-50
                            rounded-md transition-colors 
                            disabled:opacity-50'
                            title='Start Instance'
                            disabled={inst.state!=='stopped'}>
                                {actionLoading ===inst.id && inst.state==='stopped'?
                               <Loader2 className='w-4 h-4 animate-spin'/> :
                    
                              <Play className='w-4 h-4'/>
                              }
                                 
                                </button>
                                
                                <button
                                onClick={()=>{handleInstanceAcion(inst.id,'stop') }}
                                className='p-1.5 text-red-600 hover:bg-red-50
                                rounded-md transition-colors disabled:opacity-50
                               '
                               title='Stop Instance'
                               disabled={inst.state !=='running'}>

                                {actionLoading===inst.id && inst.state==='running'?
                                   <Loader2 className='w-4 h-4 animate-spin'/>
                                   :<Square className='w-4 h-4'/>}
                                </button>
                                
                                
                                
                                </div></td>
                        </tr>
                    ))    
                    )}
                   
                </tbody>


    </table>
   </div> 
)}
    </div>
  )
}

export default Ec2Page
