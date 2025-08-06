// app/lib/storyblok.ts

// This is the direct client for fetching data on the server.
import StoryblokClient from "storyblok-js-client";

// These are for connecting Storyblok's visual editor and React components.
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";
import StoryblokBlogPost from "../components/StoryblokBlogPost";


// =================================================================
// SECTION 1: SERVER-SIDE DATA FETCHING (THIS IS THE FIX)
// =================================================================
// We create a new, direct client just for use on the server. 
// This is a more robust method that avoids the error you saw.
const client = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

// This function fetches ALL stories (e.g., all blog posts)
export async function getAllStories(contentType: string) {
  const { data } = await client.get("cdn/stories", {
    content_type: contentType,
    version: "draft",
  });
  return data.stories;
}

// This function fetches ONE story (e.g., a single blog post)
export async function getStory(slug: string) {
  const { data } = await client.get(`cdn/stories/${slug}`, {
    version: "draft",
  });
  return data.story;
}


// =================================================================
// SECTION 2: CLIENT-SIDE BRIDGE FOR THE VISUAL EDITOR
// =================================================================
// This part remains to connect the visual editor and map your
// 'blog_post' content type to your React component.
storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    blog_post: StoryblokBlogPost,
  },
});
