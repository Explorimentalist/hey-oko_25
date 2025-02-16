import { defineConfig } from "tinacms";

const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Home Page",
        path: "content/pages",
        format: "mdx",
        ui: {
          router: () => "/",
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Home Hero",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
              },
              {
                type: "image",
                name: "backgroundImage",
                label: "Background Image",
              }
            ]
          },
          {
            type: "object",
            name: "loader",
            label: "Logo Page Loader",
            fields: [
              {
                type: "image",
                name: "logo",
                label: "Logo",
              },
              {
                type: "string",
                name: "animation",
                label: "Animation Type",
                options: ["fade", "slide", "scale"],
              }
            ]
          },
          {
            type: "object",
            name: "navigation",
            label: "Navigation",
            fields: [
              {
                type: "boolean",
                name: "showProgressIndicator",
                label: "Show Progress Indicator",
              },
              {
                type: "string",
                name: "menuStyle",
                label: "Menu Style",
                options: ["floating", "fixed"],
              }
            ]
          }
        ]
      },
      {
        name: "projects",
        label: "Projects",
        path: "content/projects",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            name: "hero",
            label: "Project Hero",
            fields: [
              {
                type: "image",
                name: "mainImage",
                label: "Main Image",
              },
              {
                type: "string",
                name: "category",
                label: "Category",
              }
            ]
          },
          {
            type: "object",
            name: "summary",
            label: "Project Summary",
            fields: [
              {
                type: "string",
                name: "client",
                label: "Client",
              },
              {
                type: "datetime",
                name: "date",
                label: "Date",
              },
              {
                type: "string",
                name: "role",
                label: "Role",
              }
            ]
          },
          {
            type: "object",
            name: "details",
            label: "Project Details",
            fields: [
              {
                type: "rich-text",
                name: "description",
                label: "Description",
              },
              {
                type: "image",
                name: "gallery",
                label: "Gallery",
                list: true,
              }
            ]
          },
          {
            type: "object",
            name: "results",
            label: "Project Results",
            fields: [
              {
                type: "string",
                name: "outcome",
                label: "Outcome",
              },
              {
                type: "rich-text",
                name: "impact",
                label: "Impact",
              }
            ]
          }
        ],
        ui: {
          router: ({ document }) => `/projects/${document._sys.filename}`,
        },
      },
      {
        name: "components",
        label: "Global Components",
        path: "content/components",
        format: "json",
        fields: [
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              {
                type: "string",
                name: "message",
                label: "Message",
              },
              {
                type: "string",
                name: "email",
                label: "Contact Email",
              },
              {
                type: "string",
                name: "youtubeUrl",
                label: "YouTube Link",
              }
            ]
          },
          {
            type: "object",
            name: "cursor",
            label: "Custom Cursor",
            fields: [
              {
                type: "string",
                name: "style",
                label: "Cursor Style",
                options: ["default", "dot", "circle", "custom"],
              },
              {
                type: "string",
                name: "color",
                label: "Cursor Color",
              }
            ]
          },
          {
            type: "object",
            name: "menu",
            label: "Menu Settings",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Menu Items",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                  },
                  {
                    type: "string",
                    name: "path",
                    label: "Path",
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
