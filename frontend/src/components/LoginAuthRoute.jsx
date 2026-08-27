import {Outlet, Navigate} from "react-router-dom"

export default function LoginAuthRoute(){
    const isLoggedIn = localStorage.getItem('token') !== null
    return isLoggedIn ? <Outlet/> : <Navigate to={'/login'} replace/>
}