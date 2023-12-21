import React, { useContext, useEffect, useRef, useState } from 'react';
import { SlPaperClip } from "react-icons/sl";
import { GoPaperAirplane } from "react-icons/go";
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import io from 'socket.io-client'
import useFileToBase64 from '../../hooks/useFileToBase64';

const Input = () => {
    const [files, setFiles] = useState([])
    const [text, setText] = useState("")
    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)
    const soket = io.connect("http://localhost:5000")

    const clearFiles = () => {
        const inp = document.getElementById('file').value = ""
        setFiles([])
    }

    const handSel = (e) => {
        const filesItems = e.target.files
        setFiles([...filesItems])
    }


    async function getMediaUrls(files) {
        const mediaUrls = [];
        for (const file of files) {
            let base64 = await useFileToBase64(file)
            mediaUrls.push(base64);
        }
        return mediaUrls.join(" ");
    }


    const create = async () => {
        let mediaUrl = []
        mediaUrl = files.length == 0 ? null : files.length > 1
            ? await getMediaUrls(files)
            : await useFileToBase64(files[0])

        const req = {
            type: "sendMessage",
            chatId: data.chatId,
            userId: currentUser.id,
            text: text,
            mediaUrl: mediaUrl,
            acsess: localStorage.getItem('acsess')
        }
        if (text.trim() != '' || files.length != 0) {
            soket.emit("message", JSON.stringify(req))
        }
    }
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            if (message.type = "messages") {
                clearFiles()
                setText("")
            }
        })
    })


    return (
        <div className="inp">
            {files.length !== 0 && (
                <dialog style={{ display: 'block' }}>
                    <ol>
                        {files?.map(el => <li key={el.name}>{el.name} - {file.size} bytes</li>)}
                    </ol>
                    <button onClick={clearFiles}>reset</button>
                </dialog>
            )}
            <div className='block'>
                <input value={text} onChange={e => setText(e.target.value)} placeholder='Enter your message' className='txt' type="text" />
                <div className='btnf'>
                    <label htmlFor="file"><SlPaperClip fontSize={20} /></label>
                    <input onChange={handSel} className='fl' style={{ display: 'none' }} multiple="multiple" type="file" name="file" id="file" />
                    <button onClick={create}><GoPaperAirplane fontSize={20} /></button>
                </div>
            </div>
        </div>
    )
}

export default Input