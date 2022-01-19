import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
// import dotenv from "dotenv";

// dotenv.config();
export default function Conversation({ conversation, currentUser }) {
    
    const [user,setUser] = useState();
    // const [picture,setPicture] = useState()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(()=>{
        const friendId = conversation.members.find(m=>m !== currentUser._id);
        const getUser = async ()=>{
            try {
                const res = await axios(process.env.REACT_APP_URL+'users?userId='+friendId)
                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
        
        }
        getUser();
    }, [currentUser,conversation,PF])
    return (
        <div className="conversation">
            <img className="conversationImg" 
            src={user?.profilePicture? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" />
            <span className="conversationName">{user?.username}</span>
        </div>
    )
}