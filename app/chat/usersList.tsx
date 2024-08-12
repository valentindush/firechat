import { IUser } from "@/types"
import { Button } from "@nextui-org/button"
import Image from "next/image"

export default function UsersList({ users, activeReceiver, handleChangeReceiver, showUsers, setShowUsers }: {
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
