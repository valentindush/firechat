import { IMessage, IUser } from "@/types"
import { Button } from "@nextui-org/button"
import { User } from "firebase/auth"
import Image from "next/image"
import { BsSend } from "react-icons/bs"
import { FaRegImage } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";

export default function ChatSection({ activeReceiver, currentUser, messages, message, setMessage, handleSendMessage, handleKeyPress, messagesEndRef, setShowUsers }: {
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
                        <div className={`inline-block p-2 rounded-lg ${msg.sender === currentUser?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="">
                        <button
                            className="p-4 bg-gray-800 rounded-xl"
                        >
                            <FaMicrophone size={20} />
                        </button>
                    </div>
                    <div className="">
                        <label htmlFor="image">
                            <button
                                className="p-4 bg-gray-800 rounded-xl"
                            >
                                <FaRegImage size={20} />
                            </button>
                        </label>
                        <input type="file" name="image" className="hidden" id="image" />
                    </div>
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