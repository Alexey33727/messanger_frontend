import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';
import { useFavorites } from '../../hooks/useFavorites';
import { useActions } from '../../hooks/useActions';
import useFileToBase64 from '../../hooks/useFileToBase64';
import io from 'socket.io-client'

const CreateGroup = () => {
    const { currentUser } = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [chatname, setChatname] = useState('')
    const [file, setFile] = useState({})
    const [user, setUser] = useState('user not found')
    const { favorites } = useFavorites()
    const { toggleFavorites, setData } = useActions()
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
            users: favorites.map((el) => el.id),
            photo: base64,
            acsess: localStorage.getItem('acsess')
        }
        if (chatname != '' && file != {}) {
            soket.emit("message", JSON.stringify(req))
        }
    }
    const sd = async () => {
        setData(currentUser)
    }
    useEffect(() => {
        sd()
        console.log(favorites);
    }, [favorites])
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            if (message.type == "user") {
                setUser({ ...message.user })
            }
            if (message.type == "createChat") {
                nav('/')
            }
        })
    })



    return (
        <div className='crGroup'>
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
                    <div className="select">
                        <div className='users'>
                            <p>Searched user</p>
                            {user != 'user not found'
                                ? (<div onClick={() => toggleFavorites(user)} className="userChat" key={user.id} >
                                    {user.photo ? <img src={user.photo} alt="" /> : <FaUserCircle />}
                                    <div className="userChatInfo">
                                        <span>{user.username}</span>
                                    </div>
                                </div>)
                                : <p>User not Found</p>
                            }
                        </div>
                        <div className="selectUser">
                            <p>Selected users</p>
                            {
                                favorites?.map((user) => {
                                    return (
                                        <div onClick={() => toggleFavorites(user)} className="userChat" key={user.id} >
                                            {user.photo ? <img src={user.photo} alt="" /> : <FaUserCircle />}
                                            <div className="userChatInfo">
                                                <span>{user.username}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <button onClick={createChat}>create</button>
                </div>
            </div>
        </div>
    )
}

export default CreateGroup