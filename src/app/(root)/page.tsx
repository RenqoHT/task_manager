import { Categories, Container, PostCard, PostGroupList, SortPopup, Title, TopBar } from "@/components/shared";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const posts = await prisma.post.findMany({});
    
    return (
        <>
        
            <Container>
                
            </Container>
            <TopBar/>

            <Container className="mt-5">
                {/* Посты */}
                <PostGroupList items={posts}/>
            </Container>

            <div style={{height: 3000}}/>
        </>
    );
}
