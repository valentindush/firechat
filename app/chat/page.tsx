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

function UsersList({ users, activeReceiver, handleChangeReceiver, showUsers, setShowUsers }: {
    users: IUser[],
    activeReceiver: IUser | null,
    handleChangeReceiver: (user: IUser) => void,
    showUsers: boolean,
    setShowUsers: (show: boolean) => void
}) {
    return (
        <section className={`w-full md:w-1/4 md:min-w-[250px] p-4 px-8 border-b md:border-r border-gray-200 dark:border-gray-700 ${showUsers ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Friends</h2>
                <Button className="md:hidden" onClick={() => setShowUsers(false)}>Close</Button>
            </div>
            {users.map((user) => (
                <div 
                    key={user.uid} 
                    onClick={() => {
                        handleChangeReceiver(user)
                        setShowUsers(false)
                    }} 
                    className={`flex items-center gap-2 p-4 rounded-lg cursor-pointer transition-colors ${
                        activeReceiver?.uid === user.uid ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <Image className="rounded-full" width={40} height={40} src={user.photoUrl || ""} alt="profile" />
                    <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                </div>
            ))}
        </section>
    )
}

function ChatSection({ activeReceiver, currentUser, messages, message, setMessage, handleSendMessage, handleKeyPress, messagesEndRef, setShowUsers }: {
    activeReceiver: IUser | null,
    currentUser: User | null,
    messages: IMessage[],
    message: string,
    setMessage: (message: string) => void,
    handleSendMessage: () => void,
    handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
    messagesEndRef: React.RefObject<HTMLDivElement>,
    setShowUsers: (show: boolean) => void
}) {
    if (!activeReceiver) {
        return (
            <section className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-medium mb-2">Welcome, {currentUser?.displayName}!</h2>
                    <p className="text-xl">Select a friend to start chatting.</p>
                    <Button className="mt-4 md:hidden" onClick={() => setShowUsers(true)}>Show Friends</Button>
                </div>
            </section>
        )
    }

    return (
        <section className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Button className="md:hidden mr-2" onClick={() => setShowUsers(true)}>Back</Button>
                    <Image className="rounded-full" width={40} height={40} src={activeReceiver.photoUrl || ""} alt="profile" />
                    <div>
                        <p className="font-medium">{activeReceiver.displayName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activeReceiver.email}</p>
                    </div>
                </div>
            </div>
            <div className="flex-grow max-h-[calc(100vh-200px)] p-4 overflow-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`mb-2 ${msg.sender === currentUser?.uid ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${
                            msg.sender === currentUser?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Type your message..."
                        rows={2}
                    />
                    <Button 
                        onClick={handleSendMessage} 
                        color="primary"
                        className="py-8"
                    >
                        <BsSend size={20} />
                    </Button>
                </div>
            </div>
        </section>
    )
}