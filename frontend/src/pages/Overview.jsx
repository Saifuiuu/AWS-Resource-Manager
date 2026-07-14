// src/pages/Overview.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, DollarSign, Activity, Loader2, RefreshCw } from 'lucide-react';

const Overview = () => {
  const [idleData, setIdleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdleMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ec2/idleInstances');
      setIdleData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch idle metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdleMetrics();
  }, []);

  // Total estimated loss calculate karna (Array reduce use karke)
  const totalLoss = idleData.reduce((acc, curr) => {
    // String "$0.25" se numeric value 0.25 nikalna
    const value = parseFloat(curr.estimatedLoss24h.replace('$', ''));
    return acc + (isNaN(value) ? 0 : value);
  }, 0);

  return (
    <div className='space-y-6'>

<div className='flex item-center justify-between'>
    <div>
        <h1 className='text-2xl font-bold '>Financial Overview</h1>
        <p className='text-gray-500'>Treak idle resource and coast leakage</p>
    </div>
<div >
    <button className=' text-gray-500   flex items-center space-x-2 border border-black-200 rounded-md p-2 px-4 bg-white'
    onClick={fetchIdleMetrics}>
        <  RefreshCw className={`w-4 ${loading?'animate-spin':''}`}/>
        <span>Refresh</span>
    </button>
</div>

</div>


{error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

{loading? <div className='flex flex-col items-center justify-center'>
    <Loader2 className='w-10 h-10 animate-spin text-blue-500 mb-4'/>
    <p className='text-gray-500 '>Extracting Idle Instances</p>
</div>:<>

<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

<div className='flex items-center space-x-5 flex-1 border border-gray-200 p-5  rounded-lg bg-white'>
    <div className='border  border-red-200 rounded-md bg-red-200  p-5'>
        <AlertTriangle className='w-8 h-8 text-red-400'/>
    </div>
    <div>
        <p className='text-gray-650'>idle instances detected</p>
        <p className='text-3xl font-bold'>{idleData.length}</p>
    </div>
</div>
<div className='flex items-center space-x-5 flex-1 border border-gray-200 p-5 rounded-lg  bg-white'>
    <div className='border  border-red-200 rounded-md bg-red-200  p-5'>
        < DollarSign className='w-8 h-8 text-red-400'/>
    </div>
    <div>
        <p className='text-gray-650'>Estimated 24h Coast Leakge</p>
        <p className='text-3xl font-bold'>{totalLoss}</p>
    </div>
</div>
</div>



<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                Action Required: Idle Resources
              </h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-semibold">Instance Name</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">24h Avg CPU</th>
                  <th className="p-4 font-semibold">24h Cost Loss</th>
                  <th className="p-4 font-semibold">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {idleData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Great job! No idle resources detected in the last 24 hours.
                    </td>
                  </tr>
                ) : (
                  idleData.map((instance) => (
                    <tr key={instance.instanceId} className="hover:bg-red-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{instance.name}</td>
                      <td className="p-4 text-gray-600">{instance.instanceType}</td>
                      <td className="p-4 text-gray-600 font-mono">{instance.averageCpu24h}</td>
                      <td className="p-4 font-medium text-red-600">{instance.estimatedLoss24h}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {instance.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
</div>
</>}
    </div>
  );
};

export default Overview;