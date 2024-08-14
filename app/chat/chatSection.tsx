import { IMessage, IUser } from "@/types"
import { Button } from "@nextui-org/button"
import { User } from "firebase/auth"
import Image from "next/image"
import { BsSend } from "react-icons/bs"
import { FaRegImage } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import { Spinner } from "@nextui-org/spinner"
import React from "react"
import FilePreview from "@/components/chat/filePreview"

interface ChatSectionProps {
    sending: boolean,
    activeReceiver: IUser | null,
    currentUser: User | null,
    messages: IMessage[],
    message: string,
    files: FileList | null,
    setFiles: (files: FileList | null) => void,
    setMessage: (message: string) => void,
    handleSendMessage: () => void,
    handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
    messagesEndRef: React.RefObject<HTMLDivElement>,
    setShowUsers: (show: boolean) => void
}

export default function ChatSection(props: ChatSectionProps) {
    if (!props.activeReceiver) {
        return (
            <section className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-medium mb-2">Welcome, {props.currentUser?.displayName}!</h2>
                    <p className="text-xl">Select a friend to start chatting.</p>
                    <Button className="mt-4 md:hidden" onClick={() => props.setShowUsers(true)}>Show Friends</Button>
                </div>
            </section>
        )
    }

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            props.setFiles(e.target.files)
        }
    }

    return (
        <section className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Button className="md:hidden mr-2" onClick={() => props.setShowUsers(true)}>Back</Button>
                    <Image className="rounded-full" width={40} height={40} src={props.activeReceiver.photoUrl || ""} alt="profile" />
                    <div>
                        <p className="font-medium">{props.activeReceiver.displayName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{props.activeReceiver.email}</p>
                    </div>
                </div>
            </div>
            <div className="flex-grow max-h-[calc(100vh-200px)] p-4 overflow-auto">
                {props.messages.map((msg) => (
                    <div key={msg.id} className={`mb-2 ${msg.sender === props.currentUser?.uid ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${msg.sender === props.currentUser?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
                            }`}>
                            {msg.text}
                            {msg.fileUrls && msg.fileUrls.length > 0 && (
                                <div className="mt-2">
                                    {msg.fileUrls.length > 0 && <FilePreview urls={msg.fileUrls} />}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={props.messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {props.files && props.files.length > 0 && (
                    <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium">Selected files:</p>
                        <ul className="text-xs">
                            {Array.from(props.files).map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div className="">
                        <button
                            className="p-4 bg-gray-800 rounded-xl"
                        >
                            <FaMicrophone size={20} />
                        </button>
                    </div>
                    <div className="">
                        <label className="p-4 block bg-gray-800 rounded-xl" htmlFor="image">
                            <FaRegImage size={20} />
                        </label>
                        <input onChange={handleFilesChange} type="file" name="image" accept="image/*" className="hidden" id="image" multiple />
                    </div>
                    <textarea
                        value={props.message}
                        onChange={(e) => props.setMessage(e.target.value)}
                        onKeyDown={props.handleKeyPress}
                        className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Type your message..."
                        rows={2}
                    />
                    <Button
                        onClick={props.handleSendMessage}
                        color="primary"
                        className="py-8"
                        disabled={props.sending}
                    >
                        {!props.sending ? <BsSend size={20} /> : <Spinner color="white" />}
                    </Button>
                </div>
            </div>
        </section>
    )
}