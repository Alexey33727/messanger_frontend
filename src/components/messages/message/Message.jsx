import React, { useContext, useEffect, useRef } from 'react'
import { FaFileAlt } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext'
import { ChatContext } from '../../../context/ChatContext'
import { useState } from 'react'

export const Message = ({ message }) => {

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const ref = useRef()

    useEffect(() => {
        ref.current.scrollIntoView({ behavior: "smooth" })
    }, [data.chatId])


    return (
        <div ref={ref} className={message.user_id == currentUser.id ? "message" : "owner"}>
            {/* <div className="messageInfo">
                <p></p>
            </div> */}
            <div className="messageContent">
                <span className='us'>{message.email}</span>
                <p>{message.text}</p>
                {message.media_url && <div className='photo'>
                    {message.media_url && message.media_url.split(" ").map((el, index) => {
                        if (el.includes("image")) {
                            return (<img
                                src={el}
                                tabIndex={index}
                            ></img>)
                        }
                    })
                    }
                    <div className='see'></div>
                </div>}
                {message.media_url && <div className='files'>
                    {message.media_url && message.media_url.split(" ").map(el => {
                        if (el.includes("application")) {
                            // let file = []
                            // const reader = new FileReader();
                            // reader.onloadend = () => {
                            //     file = reader.result
                            // };
                            // reader.re(el);
                            return (
                                <a href={el} download >
                                    <FaFileAlt />
                                    <p>file</p>
                                </a>
                            )
                        }
                    })
                    }
                </div>}
                <span className='span'>{message.created_at.replace('-', '.').replace('-', '.')}</span>
            </div>
        </div>
    )
}