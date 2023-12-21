import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast, Toaster } from 'react-hot-toast';
import io from 'socket.io-client'

const Login = () => {
    const [pass, setPass] = useState('')
    const [email, setEmail] = useState('')
    const [vision, setVision] = useState(false)
    const soket = io.connect("http://localhost:5000")
    const nav = useNavigate()



    const hanSub = (e) => {
        e.preventDefault();

        const req = {
            type: "login",
            email: email,
            password: pass
        }
        if (email < 5) {
            toast.error('The email cannot be less than 5 characters long')
            return
        }
        if (pass < 6) {
            toast.error('The password cannot be less than 6 characters long')
            return
        }
        setTimeout(() => {
            soket.emit("message", JSON.stringify(req))
        }, 2000);
        // soket.current.onmessage = (event) => {{
        //     const message = JSON.parse(event.data)
        //     if (message.type == 'user') {
        //         localStorage.setItem('acsess', message.acsessToken)
        //         localStorage.setItem('email', email)
        //         nav('/')
        //     }
        //     if (message.type == 'error') {
        //         toast.error('Invalid email or password')
        //     }
        // }}
        // // soket.current.onclose = () => {{
        // //     console.log("close");
        // // }}
        // soket.current.onerror = () => {{
        //     console.error("error");
        // }}
    }
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            console.log(message);
            if (message.type == 'user') {
                localStorage.setItem('acsess', message.acsessToken)
                localStorage.setItem('email', email)
                nav('/')
            }
            if (message.type == 'error') {
                toast.error('Invalid email or password')
            }
        })
    })

    return (
        <div className='login'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <form onSubmit={e => hanSub(e)}>
                <div>
                    <h1>Life Chat</h1>
                    <p>Login</p>
                </div>
                <input placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)} name='email' type="email" />
                <div className='pass'>
                    <input placeholder='Enter your password' value={pass} onChange={e => setPass(e.target.value)} name='pass' type={vision ? "text" : "password"} />
                    <button onClick={() => setVision(!vision)} type="button">{vision ? <FaEye /> : <FaEyeSlash />}</button>
                </div>

                <button type="submit">Sign in</button>
                <p>You don't have an account? <Link to={'/register'}>Register</Link></p>
            </form>
        </div>
    )
}

export default Login