"use client"

import { db } from "@/config/firebase"
import { useAuth } from "@/providers/auth.provider"
import { IMessage, IUser } from "@/types"
import { Button } from "@nextui-org/button"
import { Timestamp, addDoc, collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore"
import Image from "next/image"
import { BsSend } from "react-icons/bs"
import { useCallback, useEffect, useState, useRef } from "react"
import { User } from "firebase/auth"
import { Navbar } from "@/components/navbar"
import UsersList from "./usersList"
import ChatSection from "./chatSection"

export default function ChatPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [activeReceiver, setActiveReceiver] = useState<IUser | null>(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<IMessage[]>([])
    const { user: currentUser } = useAuth()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showUsers, setShowUsers] = useState(true)

    const getUsers = useCallback(async () => {
        if (!currentUser) return

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
        if (!currentUser || !activeReceiver) return

        const chatId = getChatId(currentUser.uid, activeReceiver.uid)
        const messagesRef = collection(db, "messages")
        const q = query(
            messagesRef,
            where("chatId", "==", chatId),
            orderBy("timestamp", "asc")
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IMessage))
            setMessages(fetchedMessages)
        })

        return () => unsubscribe()
    }, [currentUser, activeReceiver])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleChangeReceiver = (user: IUser) => setActiveReceiver(user)

    const getChatId = (uid1: string, uid2: string) => uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`

    const handleSendMessage = async () => {
        if (!message.trim() || !currentUser || !activeReceiver) return

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <main className="flex flex-col h-full md:flex-row">
            <UsersList
                users={users}
                activeReceiver={activeReceiver}
                handleChangeReceiver={handleChangeReceiver}
                showUsers={showUsers}
                setShowUsers={setShowUsers}
            />
            <ChatSection
                activeReceiver={activeReceiver}
                currentUser={currentUser}
                messages={messages}
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                handleKeyPress={handleKeyPress}
                messagesEndRef={messagesEndRef}
                setShowUsers={setShowUsers}
            />
        </main>
    )
}