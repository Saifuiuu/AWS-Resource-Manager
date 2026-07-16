// src/pages/S3Page.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Database, ShieldAlert, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

const S3Page = () => {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuckets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/s3/buckets');
      setBuckets(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch S3 buckets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  console.log("Backend S3 Data:", buckets);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">S3 Storage</h2>
          <p className="text-sm text-gray-500">Monitor bucket sizes and security configurations.</p>
        </div>
        <button 
          onClick={fetchBuckets}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Scanning Storage & Security Policies...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-semibold">Bucket Name</th>
                <th className="p-4 font-semibold">Creation Date</th>
                <th className="p-4 font-semibold">Size (CloudWatch)</th>
                <th className="p-4 font-semibold">Security Status</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200 text-sm">
  {buckets.length === 0 ? (
    <tr>
      <td colSpan="4" className="p-8 text-center text-gray-500">
        No S3 buckets found in this account.
      </td>
    </tr>
  ) : (
    buckets.map((bucket, index) => {
      // 1. Safe Date Parsing
      const dateString = bucket.creationDate || bucket.CreationDate;
      const formattedDate = dateString ? new Date(dateString).toLocaleDateString() : 'Unknown Date';

      // 2. Safe Size Mapping
      const bucketSize = bucket.sizeMB || bucket.size || '0 MB';

      // 3. Case-Insensitive Security Check
      const statusStr = (bucket.securityStatus || "").toLowerCase();
      const isSecure = statusStr.includes("secure");

      return (
        <tr key={index} className="hover:bg-gray-50 transition-colors">
          <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-400" />
            {bucket.bucketName || bucket.Name}
          </td>
          
          <td className="p-4 text-gray-600">
            {formattedDate}
          </td>
          
          <td className="p-4 text-gray-600 font-mono">
            {bucketSize}
          </td>
          
          <td className="p-4">
            {isSecure ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                {bucket.securityStatus}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <ShieldAlert className="w-3.5 h-3.5" />
                {bucket.securityStatus || "Unknown"}
              </span>
            )}
          </td>
        </tr>
      );
    })
  )}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default S3Page;