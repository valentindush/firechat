"use client"
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
export default function Home() {

  const { signInWithGoogle, user, loading, authStateLoading } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (!authStateLoading && user) {
      router.push('/chat')
    }
  }, [user, authStateLoading])

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
      {authStateLoading ? <div>
        <Spinner />
      </div>: <Button onClick={signIn} color="primary">Sign in with google</Button>}
    </section>
  );
}
