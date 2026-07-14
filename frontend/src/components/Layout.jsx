import React from 'react'
import {Link,Outlet,useLocation} from "react-router-dom"
import {Server,Database,BarChart3, Icon} from "lucide-react"



const Layout = () => {
const location =useLocation()
    const navItems=[
        {path:'/',label:"OverView",icon:BarChart3},
         {path:'/ec2',label:"Ec2 Instance",icon:Server},
          {path:'/s3',label:"S3 Buckets",icon:Database},
    ]


 return (
    <div className='h-screen flex bg-gray-100'>

<aside className='w-64 bg-gray-900 text-white flex flex-col'>
  <div className='p-4 text-xl font-bold border-b border-gray-800'>
    AWS Manager</div>


    <nav className='flex-1 p-4 space-y-2'>

      {navItems.map((item)=>(
        <Link 
        key={item.path} 
        to={item.path}

      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors 
        ${location.pathname===item.path ?'bg-blue-600 text-white':
       'text-gray-400 hover:bg-gray-800 hover:text-white' }`}>

       <item.icon/>

       <span>{item.label}</span>

       </Link>
      ))}
    </nav>
</aside>




<div className='flex-1 flex flex-col overflow-hidden'>

  <header className='bg-white shadow-sm h-16 flex items-center px-6'>
    <h1 className='text-xl font-semibold text-gray-800'>
    {navItems.find(item=>item.path===location.pathname)?.label || 'Dashboard'}
</h1>
  </header>


  <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6'>

    <Outlet/>
  </main>

</div>
        
      
    </div>
  )
}

export default Layout
