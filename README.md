## Next.js 'app' directory static site blog

See https://cmdcolin.github.io/posts/2023-04-08-nextjs-appdir-blog on how to
make

Updated in Feb 2024 to use updated dependencies

This repo uses a manual markdown parsing and rendering system rather than
something simpler like react-markdown for more control, but you can certainly
swap out something like react-markdown

It also does not use MDX because I find it introduces a lot of complexity, it is
just simple markdown

## Demo

https://cmdcolin.github.io/nextjs-appdir-blog/

Note that this repo specifies the basePath in next.config.js to deploy to that
particular sub-URI, remove it for your purposes
