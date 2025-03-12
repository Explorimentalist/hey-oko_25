import { defineConfig } from "tinacms";

// Always use local mode for builds
const isLocal = true;

// Define local media configuration
const localMediaConfig = {
  tina: {
    mediaRoot: "public/uploads",
    publicFolder: "public",
  },
};

export default defineConfig({
  // In local mode we don't need remote configuration
  branch: "",
  clientId: "",
  token: "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "admin",
  },
  
  // Use local media configuration
  media: localMediaConfig,

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
