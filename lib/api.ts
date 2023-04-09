// lib/api.ts
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@leafac/rehype-shiki";
import * as shiki from "shiki";

// memoize/cache the creation of the markdown parser, this sped up the
// building of the blog from ~60s->~10s
let p: ReturnType<typeof getParserPre> | undefined;

async function getParserPre() {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeShiki, {
      highlighter: await shiki.getHighlighter({ theme: "poimandres" }),
    })
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      content: (arg) => ({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + arg.properties?.id,
          style: "margin-right: 10px",
        },
        children: [{ type: "text", value: "#" }],
      }),
    });
}

function getParser() {
  if (!p) {
    p = getParserPre().catch((e) => {
      p = undefined;
      throw e;
    });
  }
  return p;
}

export async function getPostById(id: string) {
  const realId = id.replace(/\.md$/, "");
  const fullPath = join("_posts", `${realId}.md`);
  const { data, content } = matter(
    await fs.promises.readFile(fullPath, "utf8")
  );

  const parser = await getParser();
  const html = await parser.process(content);

  return {
    ...data,
    title: data.title,
    id: realId,
    date: `${data.date?.toISOString().slice(0, 10)}`,
    html: html.value.toString(),
  };
}

export async function getAllPosts() {
  const posts = await Promise.all(
    fs.readdirSync("_posts").map((id) => getPostById(id))
  );
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}
