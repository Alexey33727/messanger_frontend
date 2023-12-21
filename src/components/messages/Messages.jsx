import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { Message } from './Message/Message'
import io from 'socket.io-client'

const Messages = (props) => {
    const soket = io.connect("http://localhost:5000")
    const [messages, setMessages] = useState("Open chat to see messages")
    const { data } = useContext(ChatContext)
    const [load, setLoad] = useState(false)
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (data.chatId != 'null') {
            const req = {
                type: "getMessagesByChat",
                chatId: data.chatId,
                acsess: localStorage.getItem('acsess')
            }
            setMessages([])
            setLoad(true)
            soket.emit("message", JSON.stringify(req))
        }
    }, [data.chatId])
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            setLoad(false)
            if (message) {
                setMessages([...message.messages])
            }
            if (message.type == "error") {
                navigate("/login")
            }
        })
    })
    if (messages == "Open chat to see messages") {
        return (
            <div className="messages">
                <p className="notOpen">Open chat to see messages</p>
            </div>
        )
    }

    return (
        <div className="messages">
            {load
                ? <span className="loader"></span>
                : messages?.map(m => {
                    return <Message message={m} key={m.id} />
                })
            }
        </div>
    )
}

export default Messages