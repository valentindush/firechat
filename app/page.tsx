"use client"
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";
export default function Home() {

  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser
  const router = useRouter()

  useEffect(()=>{
    if(user){
      router.push('/chat')
    }
    console.log(user)
  },[])

  const signIn = async()=>{
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (error: any) {
        setError(error.message)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Button onClick={signIn} color="primary">Sign in with google</Button>
    </section>
  );
}
