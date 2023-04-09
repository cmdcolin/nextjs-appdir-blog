import { getPostById, getAllPosts } from "@/lib/api";

// Set the title of the page to be the post title, note that we no longer use
// e.g. next/head in app dir
export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const { title } = await getPostById(id);
  return {
    title,
  };
}

// Generate the post, note that this is a "react server component"! it is allowed to be async
export default async function Post({
  params: { id },
}: {
  params: { id: string };
}) {
  const { html, title, date } = await getPostById(id);
  return (
    <article>
      <h1>{title}</h1>
      <h4>{date}</h4>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

// This function can statically allow nextjs to find all the posts that you have made, and statically generate them
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    id: post.id,
  }));
}
