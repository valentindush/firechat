"use client"

import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/providers/auth.provider";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { User } from "@nextui-org/user"
import { IoIosLogOut } from "react-icons/io";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/avatar";
import { useRouter } from "next/navigation";

export const Navbar = () => {

  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () =>{
    signOut()
    router.replace('/')
  }

  return (
    <div className="px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">🔥Chat</h2>
        <ThemeSwitch />
      </div>
      <div className="">
        {user && <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <div className="flex items-center">
              {user?.photoURL?<Avatar src={user?.photoURL} />: <Avatar name={`${user?.displayName}`} />}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Button onClick={handleSignOut} color="danger" startContent={<IoIosLogOut />}>
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>}
      </div>
    </div>
  );
};
