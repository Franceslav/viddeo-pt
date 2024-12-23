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

interface Props {
  name: string | null | undefined
}

const UserMenu: FC<Props> = ({ name }) => {

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className='shadow-md'>
          <AvatarFallback>{name ? getInitials(name) : "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        <DropdownMenuItem disabled>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu;