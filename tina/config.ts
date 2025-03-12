import { defineConfig } from "tinacms";

// Set isLocal to true for the build process
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true" || process.env.NODE_ENV !== "production";

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "",
  clientId: isLocal ? "" : process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: isLocal ? "" : process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "admin",
  },

  media: {
    loadCustomStore: async () => {
      const pack = await import("next-tinacms-cloudinary");
      return pack.TinaCloudCloudinaryMediaStore;
    },
  },

  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "image",
            name: "sequence",
            label: "Image Sequence",
            list: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
