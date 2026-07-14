
import React from 'react'
import Layout from './components/Layout'
import {Routes,Route} from 'react-router-dom'
import Ec2Page from './pages/Ec2Page.jsx'
import Overview from './pages/Overview.jsx'




const S3Page=()=>{
<div>
  <h2 className='text-2xl font-bold text-gray-700'>S3 Storage</h2>
  <p className='mt-2 text-gray-500 '>Bucket sizes security status will appear here </p>
</div>
}



const App = () => {
  return (

    <Routes>

      <Route path='/' element={<Layout/>}>
      <Route index element={<Overview/>} />
      <Route path='ec2' element={<Ec2Page/>}/>
      <Route path="s3" element={<S3Page />} />
      </Route>
    </Routes>
  )
}

export default App
