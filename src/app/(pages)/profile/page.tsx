import { auth } from "@/auth"

const Profile = async () => {

  const session = await auth()

  console.log(session)

  return (
    <div>Profile</div>
  )
}

export default Profile