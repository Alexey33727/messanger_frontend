import React, { useContext, useEffect, useState } from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';
import io from 'socket.io-client'
import useFileToBase64 from '../../hooks/useFileToBase64';

const CreateChat = () => {
    const { currentUser } = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [chatname, setChatname] = useState('')
    const [file, setFile] = useState({})
    const [user, setUser] = useState('user not found')
    const [userID, setUserID] = useState(null)
    const soket = io.connect("http://localhost:5000")
    const nav = useNavigate()

    const searchUser = () => {
        const req = {
            type: "findUserByEmail",
            email: search,
            acsess: localStorage.getItem('acsess')
        }
        if (currentUser.email == search) {
            toast.error('This is you')
            return
        }
        soket.emit("message", JSON.stringify(req))
    }
    const createChat = async () => {
        let base64 = await useFileToBase64(file)
        const req = {
            type: "createChat",
            name: chatname,
            createdBy: currentUser.id,
            users: [currentUser.id, userID],
            photo: base64,
            acsess: localStorage.getItem('acsess')
        }
        soket.emit("message", JSON.stringify(req))
        // if (chatname != '' && file != {}) {
        //     console.log("cr");
        // console.log(JSON.stringify(req));
            
        // }
    }
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            console.log(message);
            if (message.type == "createChat") {
                nav('/')
            }
            if (message.type == "user") {
                setUser({ ...message.user })
                setUserID(message.user.id)
            }
        })
    })

    return (
        <div className='crChat'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='section'>
                <Link to="/">&times;</Link>
                <form>
                    <label htmlFor="file">
                        <div className='photo'>
                            <MdOutlineFileDownload />
                            <p>Upload image</p>
                        </div>
                    </label>
                    <input onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} type="file" name="" id="file" />
                    <input value={chatname} onChange={e => setChatname(e.target.value)} placeholder='Enter chat name' type="text" name="" id="" />
                </form>
                <div className='chooseUser'>
                    <div className='search'>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder='search by email' type="text" />
                        <button onClick={searchUser}><IoSearch /></button>
                    </div>
                    <div className='users'>
                        {user != 'user not found'
                            ? (<div onClick={createChat} className="userChat" key={user.id} >
                                {user.photo ? <img src={user.photo} alt="" /> : <FaUserCircle />}
                                <div className="userChatInfo">
                                    <span>{user.username}</span>
                                </div>
                            </div>)
                            : <p>User not Found</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateChat