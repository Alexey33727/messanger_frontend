import { useContext, useEffect, useState } from 'react';
import { Chats } from '../../components/chats/Chats';
import Input from '../../components/input/Input';
import Messages from '../../components/messages/Messages';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import io from 'socket.io-client'
import useFileToBase64 from '../../hooks/useFileToBase64';


// import { Link } from 'react-router-dom';
// import { PiChats } from "react-icons/pi";

const Home = () => {
    const { data } = useContext(ChatContext)
    const { currentUser } = useContext(AuthContext)
    const [phn, setphn] = useState(false)
    const soket = io.connect("http://localhost:5000")

    // async function getFileData(file) {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             resolve(reader.result);
    //         };
    //         console.log(file);
    //         reader.readAsDataURL(file);
    //     })
    // }

    const updatePhoto = async (f) => {
        let base64 = await useFileToBase64(f)
        const req = {
            type: "changePhoto",
            userId: currentUser.id,
            photo: String(base64),
            acsess: localStorage.getItem('acsess')
        }
        if (file.length != 0) {
            console.log(base64);
            soket.emit("message", JSON.stringify(req))
        }
    }
    useEffect(() => {
        soket.on("message", (event) => {
            const message = JSON.parse(event)
            if (message) {
                toast.success("Please refresh the page to update the avatar")
            }
        })
    })

    return (
        <div className={phn ? 'gridsec2' : 'gridsec'}>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="navhead">
                <h1>Life Chat</h1>
                <label htmlFor="up">{currentUser.photo ? <img src={currentUser.photo} alt="" /> : <FaUserCircle />}</label>
                <input onChange={e => updatePhoto(e.target.files[0])} style={{ display: 'none' }} type="file" name="up" id="up" />
            </div>
            <Chats setphn={setphn} />
            <Messages />
            <div className="head"><span onClick={() => setphn(false)}>&times;</span><div className="hf">{data.user && <p>{data?.user.name}</p>}</div></div>
            <Input />
        </div>
    );
}

export default Home;
