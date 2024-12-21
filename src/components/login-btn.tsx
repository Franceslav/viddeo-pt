import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { cn, getInitials } from "@/lib/utils"
import { auth } from "@/auth"
import { Avatar, AvatarFallback } from "./ui/avatar"

const LoginBtn = async () => {

  const session = await auth()

  return (
    <>
      {session?.user ? (
        <Avatar>
          <AvatarFallback>{session.user.name ? getInitials(session.user.name) : "U"}</AvatarFallback>
        </Avatar>
      ) : (
        <Link href='/auth' className={cn(buttonVariants({ variant: "ghost" }))}>Log in</Link>
      )}
    </>

  )
}

export default LoginBtn