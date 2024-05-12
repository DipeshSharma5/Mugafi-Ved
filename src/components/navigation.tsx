'use client';
import React, { useEffect, useState } from "react";
import ChatSection from "./chatSection";
import Image from "next/image";

const initialData = {
    chats: [{
        id: 1,
        name: 'Chat 1',
        chats: []
    },
    {
        id: 2,
        name: 'Create New',
        chats: []
    }]
}

export default function Navigation() {

    const [chatSelected, setChatSelected] = useState(0);
    const [allChats, setAllChats] = useState(initialData);

    /* On page load checking if data in local storage exist and if not setting intial data */
    useEffect(() => {
        const chatsHistory = localStorage.getItem('chatsHistory');
        if(chatsHistory) {
            const chats = JSON.parse(chatsHistory);
            setAllChats({...chats});
        } else {
            localStorage.setItem('chatsHistory', JSON.stringify(allChats));
        }
    }, []);

    /* changing chat window and creating new one if last one gets seleced */
    function selectChat(idx: number) {
        setChatSelected(idx);
        const data = allChats;
        if(idx === data.chats.length - 1) {
            const chatsHistory = localStorage.getItem('chatsHistory');
            if(chatsHistory) {
                const data = JSON.parse(chatsHistory);
                data.chats.splice(idx, 0, { id: idx+1, name: `Chat ${idx+1}`, chats: []});
                setAllChats({...data});
                localStorage.setItem('chatsHistory', JSON.stringify(data));
            }
        }
    }

    /* deleteing chat window and check if last chat window is getting deleted then creating a new one */
    function deleteChatSection(idx: number) {
        const chatsHistory = localStorage.getItem('chatsHistory');
        if(chatsHistory) {
            const chatsData = JSON.parse(chatsHistory);
            chatsData.chats.splice(idx, 1);
            if(chatsData.chats.length == 1) {
                chatsData.chats.splice(0, 0, { id: 1, name: `Chat 1`, chats: []});
            }
            setAllChats({...chatsData});
            localStorage.setItem('chatsHistory', JSON.stringify(chatsData));
        }
    }

    return (
        <div className="flex">
            <div className="w-96 border-r h-screen overflow-y-auto">
                {allChats.chats.map((data, idx) => (
                    <div key={idx.toString()} onClick={() => selectChat(idx)} className={`cursor-pointer m-5 p-5 rounded-lg ${chatSelected === idx ? 'bg-slate-400' : 'bg-slate-600'}`}>
                        {data.name}
                        {idx != allChats.chats.length - 1 ? (
                            <Image src={'/deleteIcon.svg'} alt="" width={20} height={20} className="float-right" onClick={() => deleteChatSection(idx)} />
                        ) : null}
                    </div>
                ))}
            </div>
            <ChatSection chatSelected={chatSelected}/>
        </div>
    )
}