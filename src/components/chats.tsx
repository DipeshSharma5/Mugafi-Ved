import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Chats({chats, submit, deleteChat}: {chats: Array<any>; submit: Function; deleteChat: Function;}) {

    const heightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(chats.length && heightRef.current) {
            heightRef.current.scrollTop = heightRef?.current?.scrollHeight;
        }
    }, [chats]);

    return (
        <div className="z-[1] relative p-5 overflow-auto pb-14 h-screen" ref={heightRef}>
            {chats.map((data, idx) => (
                data.role === 'user' ?  (
                    <div key={idx.toString()} className="clear-both">
                        <div className="float-right mb-5 bg-purple-500 rounded-s-lg rounded-tr-lg min-w-52 p-2.5 max-w-xl">
                            {data.content.reply}
                            <div className="flex justify-end items-end gap-2 mt-2.5">
                                <span onClick={() => deleteChat(idx)} className="bg-white cursor-pointer rounded-md text-black flex text-xs items-center p-1"><Image src={'/deleteIcon.svg'} alt="" width={20} height={20} className="mr-1" /> Discard</span>
                                <span onClick={() => submit('', idx)} className="bg-white cursor-pointer rounded-md text-black flex text-xs items-center p-1"><Image src={'/retry.svg'} alt="" width={20} height={20} className="mr-1" /> Try Again</span>
                            </div>
                        </div>
                    </div>
            ) :  (
                <div key={idx.toString()} className="clear-both w-fit min-w-52 max-w-xl">
                    <div className="mb-5 bg-blue-300 rounded-e-lg rounded-tl-lg text-white p-2.5">
                        {data?.content?.reply}
                        <>
                            {Array.isArray(data?.content?.payload) && data?.content?.payload.length ? (
                                <div className="bg-white text-black p-2.5 rounded-lg mt-2.5">
                                    <div className="border-b-2 capitalize">{data?.content?.type}</div>
                                    {data?.content?.payload.map((val: any, index: number) => (
                                        <div key={index.toString()}>{val?.text}</div>
                                    ))}
                                </div>
                            ): null}
                        </>
                        <div className="flex justify-end items-end gap-2 mt-2.5">
                            <span onClick={() => deleteChat(idx)} className="bg-white cursor-pointer rounded-md text-black flex text-xs items-center p-1"><Image src={'/deleteIcon.svg'} alt="" width={20} height={20} className="mr-1" /> Discard</span>
                        </div>
                    </div>
                </div>
            )))}
        </div>
    )
}