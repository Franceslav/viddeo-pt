import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Container from "@/components/container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SeasonsManagement from "./_components/seasons-management"
import EpisodesManagement from "./_components/episodes-management"
import CharactersManagement from "./_components/characters-management"

const AdminPage = async () => {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth")
    }

    return (
        <Container className="flex-1 py-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Админ панель</h1>
                    <p className="text-muted-foreground">
                        Управление сезонами и эпизодами
                    </p>
                </div>

                <Tabs defaultValue="seasons" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="seasons">Сезоны</TabsTrigger>
                        <TabsTrigger value="episodes">Эпизоды</TabsTrigger>
                        <TabsTrigger value="characters">Персонажи</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="seasons" className="space-y-4">
                        <SeasonsManagement />
                    </TabsContent>
                    
                    <TabsContent value="episodes" className="space-y-4">
                        <EpisodesManagement userId={session.user.id!} />
                    </TabsContent>
                    
                    <TabsContent value="characters" className="space-y-4">
                        <CharactersManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </Container>
    )
}

export default AdminPage
