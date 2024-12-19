'use client'

import { trpc } from "@/utils/trpc"

const SayHello = () => {

  const sayHello = trpc.hello.useQuery({ text: "world" })
  return (
    <div>
      <div>
        {JSON.stringify(sayHello.data)}
      </div>
    </div>
  )
}

export default SayHello