import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"

const LoginBtn = () => {

  return (
    <Link
      href='/auth'
      className={cn(buttonVariants({ variant: "ghost" }))}>
      Log in
    </Link>
  )
}

export default LoginBtn