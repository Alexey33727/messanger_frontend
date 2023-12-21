import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast, Toaster } from 'react-hot-toast';
import io from 'socket.io-client'

const Register = () => {
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const [email, setEmail] = useState('')
    const [vision, setVision] = useState(false)
    const soket = io.connect("http://localhost:5000")
    const nav = useNavigate()

    const hanSub = (e) => {
        e.preventDefault();


        const req = {
            type: "register",
            username: name,
            email: email,
            password: pass
        }
        if (email < 5) {
            toast.error('The email cannot be less than 5 characters long')
            return
        }
        if (name < 2) {
            toast.error('The name cannot be less than 2 characters long')
            return
        }
        if (pass < 6) {
            toast.error('The password cannot be less than 6 characters long')
            return
        }
        soket.emit("message", JSON.stringify(req))
    }
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
                if (message.type == 'success') {
                    localStorage.setItem('acsess', message.acsessToken)
                    localStorage.setItem('email', email)
                    nav('/')
                }
                if (message.type == 'error') {
                    toast.error('Something error')
                }
        })
    })

    return (
        <div className='register'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <form onSubmit={(e) => hanSub(e)}>
                <div>
                    <h1>Life Chat</h1>
                    <p>Register</p>
                </div>
                <input autoComplete="new-text" placeholder='Enter your name' value={name} onChange={e => setName(e.target.value)} name='username' type="text" />
                <input autoComplete="new-email" placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)} name='email' type="email" />
                <div className='pass'>
                    <input autoComplete="new-password" placeholder='Enter your password' value={pass} onChange={e => setPass(e.target.value)} name='pass' type={vision ? "text" : "password"} />
                    <button onClick={() => setVision(!vision)} type="button">{vision ? <FaEye /> : <FaEyeSlash />}</button>
                </div>

                <button type="submit">register</button>
                <p>You do have an account? <Link to={'/login'}>Login</Link></p>
            </form>
        </div>
    )
}

export default Register