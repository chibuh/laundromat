import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'



function ProtectedRouteReg({authState}) {
  
  return authState=='student'?<Outlet/>:<Navigate to="/"/>
}
function ProtectedRouteReg2({authState}) {
  return authState=='manager'?<Outlet/>:<Navigate to="/"/>
}

export default ProtectedRouteReg
export {ProtectedRouteReg2}