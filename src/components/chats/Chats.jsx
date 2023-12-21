import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { ChatContext } from "../../context/ChatContext"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaUserPlus } from "react-icons/fa6"
import { TbUsersPlus } from "react-icons/tb";
import io from 'socket.io-client'

export const Chats = (props) => {
    const { currentUser } = useContext(AuthContext)
    const [load, setLoad] = useState(false)
    const { dispatch } = useContext(ChatContext)
    const [chats, setChats] = useState()
    const soket = io.connect("http://localhost:5000")

    useEffect(() => {
        const getChats = () => {

            const req = {
                type: "getChatsByUser",
                userId: currentUser.id,
                acsess: localStorage.getItem('acsess')
            }
            setLoad(true)
            soket.emit("message", JSON.stringify(req))
        }
        currentUser.id && getChats()

    }, [currentUser.id])
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            if (message) {
                setLoad(false)
                setChats(message.chats)
            }
        })
    })

    const handleSelect = (u) => {
        props.setphn(true)
        dispatch({ type: "CHANGE_USER", payload: u })
        // props.setAct(false)
    }
    // if (!props.chats) {
    //     return (
    //         <div className={s.Chats}>
    //             <img className={s.loader} src={loader} alt="" />
    //         </div>
    //     )
    // }

    return (
        <div className="chats">
            {load
                ? <span className="loader"></span>
                : chats?.map(chat => {
                    return (
                        <div className="userChat" key={chat.id} onClick={() => handleSelect(chat)} >
                            {chat.photo && <img src={chat.photo} alt="" />}
                            <div className="userChatInfo">
                                <span>{chat.name}</span>
                            </div>
                        </div>)
                })
            }
            <dialog>
                <div title='Create chat' className='crChatL'>
                    <Link to='createchat'><FaUserPlus /></Link>
                </div>
                <div title='Create group' className='crChatL'>
                    <Link to='creategroup'><TbUsersPlus /></Link>
                </div>
            </dialog>

        </div>
    )
}