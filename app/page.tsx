"use client"
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
export default function Home() {

  const { signInWithGoogle, user } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/chat')
    }
  }, [])

  const signIn = async () => {
    try{
      signInWithGoogle()
      router.push("/chat")
    }catch(error){
      console.log(error)
      alert(error)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Button onClick={signIn} color="primary">Sign in with google</Button>
    </section>
  );
}
