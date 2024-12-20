import Link from "next/link"
import { CalendarPlus } from "lucide-react"

import AnimatedGridPattern from "@/components/ui/animated-grid-pattern"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import Container from "@/components/container"


const Home = () => {

  return (
    <div className="flex-1">
      <Container>
        <main className="flex flex-col items-center px-4 pb-4 pt-16 bg-stone-200/60 rounded-3xl shadow gap-10 overflow-hidden relative">
          <div className="w-full flex items-center justify-center relative">
            <div className="max-w-md md:max-w-xl flex flex-col items-center gap-3 z-10">
              <Badge variant='outline' className="flex items-center shadow backdrop-blur-sm bg-white/50 gap-2 py-1 rounded-full">
                <CalendarPlus className="size-4" />
                <span>Viddeo 1.0 &bull; Public Beta</span>
              </Badge>
              <h1 className="text-4xl md:text-6xl font-semibold text-center">
                Watch and <span className="text-primary">interact</span> effortlessly
              </h1>
              <p className="text-sm md:text-base font-medium text-center max-w-xs md:max-w-sm">Discover, watch, and engage with videos while enjoying a seamless viewing experience.</p>
              <Link href='/generator' className={cn("w-full max-w-40 font-normal mt-3", buttonVariants({ variant: "default", className: "bg-foreground" }))}>
                <span>Get Started</span>
              </Link>
            </div>
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.1}
              duration={1}
              repeatDelay={1}
              className={cn(
                "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 z-0",
              )}
            />
          </div>
          <picture className="border rounded-sm md:rounded-2xl overflow-hidden shadow z-10">
            <source srcSet='/assets/hero.png' type="image/webp" />
            <img src='/assets/hero.png' alt="hero-demo" className="object-cover object-center rounded-sm md:rounded-2xl" />
          </picture>
        </main>
      </Container>
    </div >
  )
}

export default Home