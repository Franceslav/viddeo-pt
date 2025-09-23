import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { FC } from "react"
import LogoutBtn from "./logout-btn"
import Link from "next/link"
import Image from "next/image"

interface Props {
  name: string | null | undefined
  image?: string | null
}

const UserMenu: FC<Props> = ({ name, image }) => {

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className='shadow-md'>
          {image ? (
            <Image
              src={image}
              alt={name || 'Avatar'}
              fill
              className="object-cover"
            />
          ) : (
            <AvatarFallback>{name ? getInitials(name) : "U"}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu;