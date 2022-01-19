import './chatOnline.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ChatOnline({userId}) {
    const [user,setUser]=useState();
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(()=>{
     const getUser=async()=>{
         try {
           const res=await axios(process.env.REACT_APP_URL+'users?userId='+userId)  
           console.log('user:',res.data)
           setUser(res.data)
         } catch (error) {
          console.log(error)
         }
     }
     getUser();
    },[userId])
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img className='chatOnlineImg' src={user?.profilePicture? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" />
                    <div className="chatOnlineBadge">

                    </div>
                </div>
                <span className="chatOnlineName">{user?.username}</span>
            </div>
        </div>
    )
}