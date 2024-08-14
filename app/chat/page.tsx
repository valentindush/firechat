"use client"

import { db, storage } from "@/config/firebase"
import { useAuth } from "@/providers/auth.provider"
import { IMessage, IUser } from "@/types"
import { Timestamp, addDoc, collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useCallback, useEffect, useState, useRef } from "react"
import UsersList from "./usersList"
import ChatSection from "./chatSection"
import { useRouter } from "next/navigation"
import { Spinner } from "@nextui-org/spinner";
import { v4 as uuidv4 } from 'uuid'

export default function ChatPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [activeReceiver, setActiveReceiver] = useState<IUser | null>(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<IMessage[]>([])
    const [files, setFiles] = useState<FileList | null>(null)
    const { user: currentUser, authStateLoading } = useAuth()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showUsers, setShowUsers] = useState(true)
    const [sending, setSending] = useState(false)

    const router = useRouter()

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
        if (!authStateLoading && !currentUser) {
            router.replace('/')
        }
    }, [currentUser, authStateLoading])

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

    const uploadFiles = async () => {
        if (!files) return [];

        const uploadedFiles: string[] = [];

        for (const file of Array.from(files)) {
            const storageRef = ref(storage, `uploads/images/${file.name}-${uuidv4()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            uploadedFiles.push(downloadUrl);
        }

        return uploadedFiles;
    };

    const handleSendMessage = async () => {
        if ((!message.trim() && !files) || !currentUser || !activeReceiver) return;
        setSending(true)

        try {
            const chatId = getChatId(currentUser.uid, activeReceiver.uid);
            const messagesRef = collection(db, "messages");

            let fileUrls: string[] = [];

            if (files && files.length > 0) {
                fileUrls = await uploadFiles();
            }

            await addDoc(messagesRef, {
                text: message.trim(),
                sender: currentUser.uid,
                receiver: activeReceiver.uid,
                chatId: chatId,
                timestamp: Timestamp.now(),
                fileUrls: fileUrls
            });

            setMessage("");
            setFiles(null);
        } catch (error) {
            console.log("Error sending message", error)
        }finally{
            setSending(false)
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!authStateLoading && !currentUser) return (
        <Spinner size="lg" />
    )

    return (
        <>
            <main className="flex flex-col h-full md:flex-row">
                <UsersList
                    users={users}
                    activeReceiver={activeReceiver}
                    handleChangeReceiver={handleChangeReceiver}
                    showUsers={showUsers}
                    setShowUsers={setShowUsers}
                />
                <ChatSection
                    sending={sending}
                    activeReceiver={activeReceiver}
                    currentUser={currentUser}
                    messages={messages}
                    message={message}
                    files={files}
                    setFiles={setFiles}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                    handleKeyPress={handleKeyPress}
                    messagesEndRef={messagesEndRef}
                    setShowUsers={setShowUsers}
                />
            </main>
        </>
    )
}