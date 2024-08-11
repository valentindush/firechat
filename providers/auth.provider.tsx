import { auth, db } from "@/config/firebase";
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
    user: User | null
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null)

    const signInWithGoogle = async () => { 
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider())
            const user = result.user

            if(user){
                const useRef = doc(db, "users", user.uid)
                await setDoc(useRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    lastLogin: new Date()
                }, {merge: true})
            }

            setUser(result.user)
        } catch (error) {
            console.log("Auth error: ", error)
        }
    }

    const signOutUser = async () =>{
        try {
            await signOut(auth)
            setUser(null)
        } catch (error) {
            console.log("Sign out error: ", error)
        }
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            setUser(user)
        })

        return ()=> unsubscribe()
    }, [])

    return(
        <AuthContext.Provider value={{user, signInWithGoogle, signOut: signOutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext)
    if(context == undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}