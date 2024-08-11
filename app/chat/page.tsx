"use client"

import { db } from "@/config/firebase"
import { useAuth } from "@/providers/auth.provider"
import { IMessage, IUser } from "@/types"
import { Button } from "@nextui-org/button"
import { Timestamp, addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore"
import Image from "next/image"
import { BsSend } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react"

export default function ChatPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [activeReceiver, setActiveReceiver] = useState<IUser | null>(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<IMessage[]>([])
    const { user: currentUser } = useAuth()

    const getUsers = useCallback(async () => {
        if (!currentUser) return; // Exit if there's no current user

        const usersCollection = collection(db, "users")
        const userSnapshot = await getDocs(usersCollection)
        const usersList = userSnapshot.docs
            .map(doc => doc.data() as IUser)
            .filter(u => u.uid !== currentUser.uid)

        setUsers(usersList)
    }, [currentUser])

    useEffect(() => {
        if (currentUser) {
            getUsers()
        }
    }, [currentUser, getUsers])

    useEffect(() => {
        if (currentUser && activeReceiver) {
            const chatId = getChatId(currentUser.uid, activeReceiver.uid)
            const messagesRef = collection(db, "messages")
            const q = query(
                messagesRef,
                where("chatId", "==", chatId),
                orderBy("timestamp", "asc")
            )

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages: IMessage[] = []
                querySnapshot.forEach((doc) => {
                    fetchedMessages.push({ id: doc.id, ...doc.data() } as IMessage)
                })
                setMessages(fetchedMessages)
            })

            return () => unsubscribe()
        }
    }, [currentUser, activeReceiver])

    const handleChangeReceiver = (user: IUser) => {
        setActiveReceiver(user)
    }

    const getChatId = (uid1: string, uid2: string) => {
        return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`
    }

    const handleSendMessage = async () => {
        if (message.trim() && currentUser && activeReceiver) {
            const chatId = getChatId(currentUser.uid, activeReceiver.uid)
            const messagesRef = collection(db, "messages")
            await addDoc(messagesRef, {
                text: message.trim(),
                sender: currentUser.uid,
                receiver: activeReceiver.uid,
                chatId: chatId,
                timestamp: Timestamp.now()
            })
            setMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }


    return (
        <main className="flex px-8 h-full py-8">
            <section className="p-2 border-r border-gray-200 dark:border-gray-700 h-full max-w-sm w-full flex flex-col gap-2">
                <div className="pb-3 flex items-center gap-2">
                    <h2 className="font-semibold text-lg">Friends </h2>
                    <span className="text-xs font-light">(IDK if yall friends tho! 😂)</span>
                </div>
                {users.map((user) => (
                    <div onClick={() => handleChangeReceiver(user)} key={user.uid} className="flex items-center gap-2 p-4 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer active:scale-[.99]">
                        <div className="">
                            <Image className="rounded-full" width={40} height={40} src={user.photoUrl || ""} alt="profile" />
                        </div>
                        <div className="">
                            <p className="font-medium">{user.displayName}</p>
                            <p className="text-sm">{user.email}</p>
                        </div>
                    </div>
                ))}
            </section>
            <section className="p-2 w-full h-full flex flex-col">
                {activeReceiver ?
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 border-b-2 pb-4 border-white/10 shadow-md">
                            <div className="">
                                <Image className="rounded-full" width={40} height={40} src={activeReceiver.photoUrl || ""} alt="profile" />
                            </div>
                            <div className="">
                                <p className="font-medium">{activeReceiver.displayName}</p>
                                <p className="text-sm">{activeReceiver.email}</p>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`mb-2 ${msg.sender === currentUser?.uid ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block p-2 rounded-lg ${msg.sender === currentUser?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-grow p-4 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Type your message..."
                            />
                            <Button title="Send" startContent={<BsSend size={24} />} className="h-full" color="primary" onClick={handleSendMessage}></Button>
                        </div>
                    </div> :
                    <div className="flex flex-col items-center justify-center w-full gap-4 h-full">
                        <h2 className="text-4xl font-medium">Good Morning <b>{currentUser?.displayName}</b>!</h2>
                        <p className="text-xl"> Who would you like to chat with ?</p>
                    </div>}
            </section>
        </main>
    )
}