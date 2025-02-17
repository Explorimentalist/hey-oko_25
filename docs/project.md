
#Project Overview
Hey-Oko is a design portfolio website with the goal of promotion the work of Ngatye Brian Oko.
This website is an art project and should be designed as such standing next to Awwwards portfolio websites.
There should be a balance between the art and the functionality of the website.

Take this portfolio as a reference for the design and layout.
- https://tonyyanchen.com/

Take my old portfolio ONLY FOR CONTENT context.
- https://www.hey-oko.com/

Core funtionality:
- Displaying the designer's capabilities using visual storytelling (show, don't tell)
- Navigation through the website with ease.
    - bottom menu to access all project pages
    - navigation progress indicator with section navigation or floating navigation menu allowing users to navigate to different sections within that page.
    - footer with social media links

#Pages
##Home Page
- Home Hero
- Logo Page Loader
- Menu
- Navigation progress indicator with section navigation or floating navigation menu
- Custom cursor
- Footer

##Project Page template
- Project Summary
- Project Hero
- Project Details
- Animated Intro
- Project Results
- Navigation progress indicator with section navigation or floating navigation menu
- Footer

#Components
- Home Hero
- Logo Page Loader
- Menu
- Navigation progress indicator with section navigation or floating navigation menu
- Project Summary
- Project Hero
- Project Details
- Custom cursor
- Animated Intro
- Project Results
- Footer
    - message: Help me not getting high on my own supply.
    - email contact
    - youtube link


#Documentation

##Fonts
https://www.fontshare.com/fonts/general-sans

##Lottie & GSAP
###Scroll animation
https://gsap.com/docs/v3/HelperFunctions/helpers/LottieScrollTrigger/


##TinaCMS
### TinaCMS & Cloudinary
Install the following packages:
yarn add next-tinacms-cloudinary @tinacms/auth

Register the Media Store
Now, you can replace the default repo-based media with the external media store. You can register the Cloudinary Media store via the loadCustomStore prop.

The loadCustomStore prop can be configured within tina/config.{js,ts}.

Copy
//tina/config.{ts,js}

export default defineConfig({
  //...
  media: {
-    tina: {
-      publicFolder: 'public',
-      mediaRoot: 'uploads',
-    },
+    loadCustomStore: async () => {
+      const pack = await import("next-tinacms-cloudinary");
+      return pack.TinaCloudCloudinaryMediaStore;
+    },
  },
})
Set up API routes
Tina's "external media provider" support requires a light backend media handler, that needs to be setup/hosted by the user. There are multiple ways to setup this handler:

"NextJS API Routes"
For sites using NextJS, you can setup the handler as a NextJS Server function. To do so, create a pages/api/cloudinary/[...media].ts file in your project, with the following implementation:

Copy
// pages/api/cloudinary/[...media].ts

import {
  mediaHandlerConfig,
  createMediaHandler,
} from 'next-tinacms-cloudinary/dist/handlers'

import { isAuthorized } from '@tinacms/auth'

export const config = mediaHandlerConfig

export default createMediaHandler({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  authorized: async (req, _res) => {
    try {
      if (process.env.NODE_ENV == 'development') {
        return true
      }

      const user = await isAuthorized(req)

      return user && user.verified
    } catch (e) {
      console.error(e)
      return false
    }
  },
})
Here's what's happening in the above snippet:

We call createMediaHandler to set up routes and connect your instance of the Media Store to your Cloudinary account.
The authorized key will make it so only authorized users within TinaCloud can upload and make media edits.
Framework Agnostic implementations
In the above example, we showed how to host the backend handler as a NextJS API function. If you are using Vercel with another framework, the same approach applies (with the small difference that you need to use /api/... instead of /pages/api/... for your handler).

You can also check out our Netlify Functions implementation.

Update Schema
Now that the media store is registered and the API route for media set up, let's add an image to your schema.

In your tina/config.{ts,tsx,js} add a new field for the image, e.g:

Copy
 {
  name: 'hero',
  type: 'image',
  label: 'Hero Image',
 }
Now, when editing your site, the image field will allow you to connect to your Cloudinary account via the Media Store to manage your media assets.


https://tina.io/docs/reference/media/external/cloudinary



#Current File Structure

.
├── .cursorignore
├── .env
├── .gitignore
├── .next
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── cache
│   │   ├── .rscinfo
│   │   ├── swc
│   │   │   └── plugins
│   │   └── webpack
│   │       ├── client-development
│   │       └── server-development
│   ├── package.json
│   ├── react-loadable-manifest.json
│   ├── server
│   │   ├── app
│   │   │   ├── _not-found
│   │   │   ├── favicon.ico
│   │   │   ├── page.js
│   │   │   └── page_client-reference-manifest.js
│   │   ├── app-paths-manifest.json
│   │   ├── interception-route-rewrite-manifest.js
│   │   ├── middleware-build-manifest.js
│   │   ├── middleware-manifest.json
│   │   ├── middleware-react-loadable-manifest.js
│   │   ├── next-font-manifest.js
│   │   ├── next-font-manifest.json
│   │   ├── pages-manifest.json
│   │   ├── server-reference-manifest.js
│   │   ├── server-reference-manifest.json
│   │   ├── vendor-chunks
│   │   │   ├── @swc.js
│   │   │   ├── gsap.js
│   │   │   └── next.js
│   │   └── webpack-runtime.js
│   ├── static
│   │   ├── chunks
│   │   │   ├── app
│   │   │   ├── app-pages-internals.js
│   │   │   ├── main-app.js
│   │   │   ├── polyfills.js
│   │   │   └── webpack.js
│   │   ├── css
│   │   │   └── app
│   │   ├── development
│   │   │   ├── _buildManifest.js
│   │   │   └── _ssgManifest.js
│   │   ├── media
│   │   │   ├── 26a46d62cd723877-s.woff2
│   │   │   ├── 55c55f0601d81cf3-s.woff2
│   │   │   ├── 581909926a08bbc8-s.woff2
│   │   │   ├── 6d93bde91c0c2823-s.woff2
│   │   │   ├── 97e0cb1ae144a2a9-s.woff2
│   │   │   ├── a34f9d1faa5f3315-s.p.woff2
│   │   │   └── df0a9ae256c0569c-s.woff2
│   │   └── webpack
│   │       ├── 28ee57d89ff5e636.webpack.hot-update.json
│   │       ├── 2f5d8abced3e6dfb.webpack.hot-update.json
│   │       ├── 319de72ace69f75d.webpack.hot-update.json
│   │       ├── 368ef835a38f3dee.webpack.hot-update.json
│   │       ├── 3f26a000528d69c4.webpack.hot-update.json
│   │       ├── 52c89d2991d2f969.webpack.hot-update.json
│   │       ├── 633457081244afec._.hot-update.json
│   │       ├── app
│   │       ├── e8403a7eeab1eb51.webpack.hot-update.json
│   │       ├── webpack.28ee57d89ff5e636.hot-update.js
│   │       ├── webpack.2f5d8abced3e6dfb.hot-update.js
│   │       ├── webpack.319de72ace69f75d.hot-update.js
│   │       ├── webpack.368ef835a38f3dee.hot-update.js
│   │       ├── webpack.3f26a000528d69c4.hot-update.js
│   │       ├── webpack.52c89d2991d2f969.hot-update.js
│   │       └── webpack.e8403a7eeab1eb51.hot-update.js
│   ├── trace
│   └── types
│       ├── app
│       │   ├── layout.ts
│       │   └── page.ts
│       ├── cache-life.d.ts
│       └── package.json
├── README.md
├── content
│   ├── components
│   ├── pages
│   ├── posts
│   │   └── hello-world.md
│   └── projects
├── docs
│   ├── .cursorrules
│   └── project.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── admin
│   │   ├── .gitignore
│   │   └── index.html
│   ├── file.svg
│   ├── fonts
│   ├── globe.svg
│   ├── images
│   ├── models
│   ├── next.svg
│   ├── uploads
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── about
│   │   │   └── @modal
│   │   ├── api
│   │   │   └── cloudinary
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects
│   │       └── @modal
│   ├── components
│   │   ├── animations
│   │   ├── home
│   │   │   └── HomeHero.tsx
│   │   ├── layout
│   │   ├── projects
│   │   ├── shared
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LogoLoader.tsx
│   │   │   ├── Menu.tsx
│   │   │   └── NavigationProgress.tsx
│   │   └── ui
│   ├── lib
│   │   ├── hooks
│   │   └── utils
│   ├── pages
│   │   └── demo
│   │       └── blog
│   └── styles
│       └── globals.css
├── tailwind.config.ts
├── tina
│   ├── .gitignore
│   ├── __generated__
│   │   ├── _graphql.json
│   │   ├── _lookup.json
│   │   ├── _schema.json
│   │   ├── client.ts
│   │   ├── config.prebuild.jsx
│   │   ├── frags.gql
│   │   ├── queries.gql
│   │   ├── schema.gql
│   │   ├── static-media.json
│   │   └── types.ts
│   ├── config.ts
│   └── tina-lock.json
└── tsconfig.json
