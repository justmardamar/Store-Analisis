import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export default function Login(){
    const navigate = useNavigate()
    const [login,setLoginData] = useState({
        email: "",
        password: "",
    })
    const handleInputChange = (e) => {
        const {name,value} = e.target
        setLoginData({
            ...login,
            [name]:value,
        })
    }
    const handleLogin = async (e) =>{
        e.preventDefault()
        const res = await axios.post("http://localhost:5000/api/login",login)
        console.log(res)
        if(res.data.isLoggedIn){
            if(res.data.role === 'Super Admin'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'Super Admin')
                
            }
            if(res.data.role === 'Admin'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'Admin')
            }
            if(res.data.role === 'kasir'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'kasir')
            }
            if(res.data.role === 'Stock'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'Stock')
            }
            navigate('/')
        }else{
            console.log("Login failed")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-8">
            <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 md:grid-cols-[0.9fr_1.1fr]">
                <div className="hidden bg-teal-800 p-10 text-white md:flex md:flex-col md:justify-between">
                    <div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-teal-800">S</div>
                        <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-teal-200">Storewise</p>
                        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">Everything your store needs, in one clear view.</h1>
                    </div>
                    <p className="text-sm leading-6 text-teal-100">Inventory, transactions, and teams working together.</p>
                </div>
                <div className="p-7 sm:p-10">
                    <div className="mb-8 md:hidden"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-lg font-bold text-white">S</div></div>
                    <div className="mb-8">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Welcome back</p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your workspace</h1>
                        <p className="mt-2 text-sm text-slate-500">Use your account details to continue.</p>
                    </div>
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">Email address</label>
                            <input className="form-input" id="email" type="email" name="email" value={login.email} onChange={handleInputChange} placeholder="you@company.com" required />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between"><label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label><span className="text-xs font-medium text-teal-700">Keep it private</span></div>
                            <input className="form-input" id="password" type="password" name="password" value={login.password} onChange={handleInputChange} placeholder="Enter your password" required />
                        </div>
                        <button className="button-primary mt-2 w-full" type="submit">Sign in <span className="ml-2" aria-hidden="true">→</span></button>
                    </form>
                </div>
            </div>
        </div>
    )
}
