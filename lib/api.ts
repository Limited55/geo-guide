import fs from "fs";
import path from "path";
import matter from "gray-matter";

// import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeTOC from "@jsdevtools/rehype-toc";
import imageSize from "rehype-img-size";
import section from "@agentofuser/rehype-section";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import geographies from "./geo-data/geography.geo.json";
import { getCountryData } from "./geo-api";

export function getSlugs(postType: string) {
  if (postType === "country") {
    return geographies.features.map((feature) => {
      return feature.properties.adm0_a3;
    });
  } else {
    return fs.readdirSync(getDirectory(postType)).map((filepath) => {
      return filepath.replace(/\.md$/, "");
    });
  }
}

export function getGuides(postType: string) {
  const slugs = getSlugs(postType);
  const guides = slugs.map((slug) => getGuide(postType, slug));
  return guides;
}

export async function getGuide(postType: string, slug: string) {
  const fullPath = path.join(getDirectory(postType), `${slug}.md`);

  // read file contents
  let content =
    postType === "country"
      ? `
  ## Whoops!
  Looks like we don't have a page for ${
    getCountryData(slug).name
  } yet. This may be because we haven't gotten around to it yet, or it doesn't have coverage altogether. Check back later!`
      : "";

  if (fs.existsSync(fullPath)) {
    content = fs.readFileSync(fullPath, { encoding: "utf8" });
  }

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    parseFrontmatter: true,
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [imageSize, { dir: "public" }],
        section,
        rehypeTOC,
      ],
    },
  });

  const result = {
    slug,
    content: mdxSource,
  };

  return result;
}

function getDirectory(postType: string) {
  return path.resolve(postType === "country" ? "_country-guides" : "_guides");
}
