import React, { ChangeEvent, act, useEffect, useRef, useState } from "react";
import vedApiCall from "./apiService";
import Chats from "./chats";
import Image from "next/image";

const ActionType = [
    {
        id: 1,
        text: 'Improve Story Idea'
    },
    {
        id: 2,
        text: 'Suggest What to Write Next'
    },
    {
        id: 3,
        text: 'Expand'
    }
]

export default function ChatSection({ chatSelected }: { chatSelected: number }) {

    const [chatData, setChatData] = useState<Array<any>>([]);
    const [inputVal, setInputVal] = useState('');
    const [showActions,  setShowActions] = useState(false);
    const [selectedAction, setSelectedAction] = useState(0);
    const [wordsCount, setWordsCount] = useState(0);

    function checkInputValue(e: ChangeEvent<HTMLInputElement>) {

        const val = e.target.value;
        if( val.includes('/')) {
            setShowActions(true);
            setSelectedAction(0);

            if(!inputVal.includes('/')) setInputVal(val);
        } else {
            setShowActions(false);
            setInputVal(val);
        }
    }

    /*
    this function work for 3 functionalities
    1) when user directly sumbit either through submit button or Enter
    2) when user select a action
    3) when user try again for any last message (in this case message are sent till the selected message) */
    async function submit(context = '', tryingAgainId? : number) {
        if(showActions && !context) {
            context = ActionType[selectedAction].text;
        }

        if(context) setShowActions(false);

        let data = [];
        if(tryingAgainId !== undefined) {
            chatData.forEach((val, idx) => {
                if(idx <= tryingAgainId) data.push(val);
            })
        } else {

            if(!inputVal) return;
            data = chatData;
            const obj = {
                content: {
                    type: 'answer',
                    reply: inputVal,
                    context
                },
                role: 'user'
            };
            data.push(obj);
            setChatData([...data]);
            setInputVal('');
        }

       const res = await vedApiCall(data);
       if(tryingAgainId !== undefined) data = chatData;
       if(res.status === 200) {
        data.push({content: JSON.parse(res.data.response), role:'assistant'});
       }

       setChatData([...data]);
       const chatsHistory = localStorage.getItem('chatsHistory');
       if(chatsHistory) {
        const chatsData = JSON.parse(chatsHistory);
        chatsData.chats[chatSelected].chats = [...data];
        localStorage.setItem('chatsHistory', JSON.stringify(chatsData));
       }
    }

    function deleteChat(idx: number) {
        const chatsHistory = localStorage.getItem('chatsHistory');
        if(chatsHistory) {
            const chatsData = JSON.parse(chatsHistory);
            chatsData.chats[chatSelected].chats.splice(idx, 1);
            localStorage.setItem('chatsHistory', JSON.stringify(chatsData));
            setChatData([...chatsData.chats[chatSelected].chats]);
        }
    }

    /* for adding keybord functionalities */
    function keyCheck(e: React.KeyboardEvent<HTMLInputElement>) {
        if(e.key === 'Enter') {
            submit();
        } if(showActions) {
            if(e.key === 'ArrowUp' ) {
                if(selectedAction === 0)
                    setSelectedAction(ActionType.length - 1);
                else
                    setSelectedAction(selectedAction - 1);
            }
            else if(e.key === 'ArrowDown' ) {
                if(selectedAction === ActionType.length - 1)
                    setSelectedAction(0);
                else
                    setSelectedAction(selectedAction + 1);
            }
        }
    }

    useEffect(() => {
        const chatsHistory = localStorage.getItem('chatsHistory');
        if(chatsHistory) {
            const chatsData = JSON.parse(chatsHistory);
            if(chatsData.chats[chatSelected]?.chats) setChatData([...chatsData.chats[chatSelected].chats]);
        }

        setInputVal('');
    }, [chatSelected]);

    useEffect(() => {
        setWordsCount(inputVal.length);
    }, [inputVal]);

    return (
        <div className="relative h-screen w-full bg-white overflow-hidden after:bg-chatBgImage after:top-0 after:left-0 after:bottom-0 after:right-0 after:absolute after:h-full after:opacity-20">
                <Chats chats={chatData} submit={submit} deleteChat={deleteChat}/>
                <div className="absolute bottom-0 w-full z-[1]">
                    {showActions ? (
                        <div className="w-full bg-white text-black border-t">
                            {ActionType.map((data, idx) => (
                                <div key={idx.toString()} className={`p-5 border-b cursor-pointer ${selectedAction === idx ? 'bg-slate-400' : ''}`} onClick={() => submit(data.text)}>{data.text}</div>
                            ))}
                        </div>
                    ) : null}
                <div className="flex bg-slate-500 h-20">
                    <Image src={'/mugafiIcon.svg'} alt="" width={50} height={50} className="absolute bottom-8 left-0"/>
                    <input type="text" className="pl-14 w-full text-xl focus:outline-none bg-transparent text-white h-14" value={inputVal} onChange={checkInputValue} onKeyDown={keyCheck}/>
                    <Image src={'/arrow.png'} alt="" width={50} height={50} className="absolute bottom-6 right-0 z-10 cursor-pointer" onClick={() => submit()} />
                    <div className="absolute bottom-0 left-0">Total Words: {wordsCount}</div>
                </div>
            </div>
        </div>
    )
}