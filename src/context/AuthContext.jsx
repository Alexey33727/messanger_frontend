import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import io from 'socket.io-client'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})
    const soket = io.connect("http://localhost:5000")
    const navigate = useNavigate()

    useEffect(() => {
        const req = {
            type: "findUserByEmail",
            email: localStorage.getItem('email'),
            acsess: localStorage.getItem('acsess')
        }
        setTimeout(() => {
            soket.emit("message", JSON.stringify(req))
        }, 2000);


    }, [localStorage.getItem('email')])
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            if (message) {
                setCurrentUser(message.user)
            }
            if (message.type == "error") {
                navigate("/login")
            }
        })
    })

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}