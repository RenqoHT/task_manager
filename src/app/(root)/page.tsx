import { Container, PostGroupList, TopBar, AddPostButton } from "@/components/shared";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const posts = await prisma.post.findMany({});

    return (
        <>
            <TopBar/>

            <Container className="mt-5 mb-5">
                {/* Посты */}
                <PostGroupList items={posts}/>
                <AddPostButton />
            </Container>

            {/* <div style={{height: 3000}}/> */}
        </>
    );
}
