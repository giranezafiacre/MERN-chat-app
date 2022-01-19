import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function Message({message,sender,own}){
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user,setUser]=useState()
    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const res = await axios(process.env.REACT_APP_URL+'users?userId='+sender)
                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
        
        }
        getUser();
    },[sender])
    return(
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={user?.profilePicture? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt) }</div>
        </div>
    )
}