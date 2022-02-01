import { useContext, useEffect, useRef, useState } from 'react';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import Topbar from '../../components/topbar/Topbar';
import './messenger.css';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function Messenger() {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([])
    const socket = useRef();
    const { user } = useContext(AuthContext)
    const scrollRef = useRef();
    useEffect(() => {
        socket.current = io("https://socket-fiacre.herokuapp.com");
        console.log('now');
    }, [])
    useEffect(() => {
        console.log('now again');
        socket.current.on("getMessage", (data) => {
            console.log('there is data:', data)
            setArrivalMessage({
                _id: data._id,
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        });
    }, [])
    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])
    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            const onUsers = users.users
            const usrs = (user._id === process.env.REACT_APP_ADMIN_ID) ? onUsers.filter(usr => usr.userId !== user._id) :
                onUsers.filter(usr => usr.userId === process.env.REACT_APP_ADMIN_ID)
            console.log(usrs)
            setOnlineUsers(usrs)
        })
    }, [user])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(process.env.REACT_APP_URL + "conversations/" + user._id);
                console.log(res.data)
                setConversations(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getConversations()
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(process.env.REACT_APP_URL + "messages/" + currentChat?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error)
            }

        }
        getMessages();
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        }


        try {
            const res = await axios.post(process.env.REACT_APP_URL + "messages", message);
            setMessages([...messages, res.data])
            const receiverId = currentChat.members.find(member => member !== user._id)
            socket.current.emit("sendMessage", {
                _id: res.data._id,
                senderId: user._id,
                receiverId,
                text: newMessage
            });
            setNewMessage('')
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <>
            <Topbar />
            {(JSON.parse(localStorage.getItem('show'))==true)?
            (<div onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('show');
                    window.location.href = 'https://awesome-jennings-229f16.netlify.app/';
                }} id='logout'>
                    <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" class="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7">
                        </polyline>
                        <line x1="21" y1="12" x2="9" y2="12">
                        </line>
                    </svg>
                </div>):(<div></div>)}
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder='search for friends' className='chatMenuInput' />
                        {conversations.map(c => (
                            <div key={c._id} onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                (<>
                                    <div className="chatBoxTop">
                                        {messages.map(m => (
                                            <div key={m._id} ref={scrollRef}>
                                                <Message message={m} sender={m.sender} own={m.sender === user._id} />
                                            </div>
                                        ))}

                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea placeholder='Write something...'
                                            className="chatMessageInput"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}></textarea>
                                        <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                                    </div></>) : <span className='noConversationText'> Open Conversation to start chat.</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        {
                            onlineUsers ? onlineUsers.map(usr =>
                            (<div key={usr.userId}>
                                <ChatOnline userId={usr.userId} />
                            </div>)
                            ) : (<h2>no online user yet</h2>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}