import { serve } from "bun";
import index from "./index.html";
import { createShortLink, getLinkFromSlug, getURLFromSlug } from "./link_shortener";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/list" : {
      async GET(req) {
        return Response.json(["beans", "toast"])
      },
    },
    "/api/test": {
      async GET(req) {
        await createShortLink("https://portal.pyro.host/aff.php?aff=1")
        return Response.json({});
      },
    },
    "/api/create":{
      async POST(req) {
        const { url, slug, name, description, apiKey} = await req.json()
        if (apiKey !== "faggot") {
          return Response.json({success: 0, data: "no"})
        }
        const {success, data} = await createShortLink(url, slug, name, description);
        return Response.json({success, data});
      },
      async GET(req) {
        return Response.redirect("https://youtube.com/logout")
      },
    },

    "/:slug": async req => {
      const slug = req.params.slug;
      const url = await getURLFromSlug(slug);
      if (url) {
        return Response.redirect(url.url);
      } else {
        return Response.json({"error": "url not found at this slug"})
      }
    },
    "/:slug/preview": async req => {
      const slug = req.params.slug;
      const link = await getLinkFromSlug(slug);

      if (link) {
        return Response.json(link)
      }

      return Response.json({})
    },

  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
let SERVER_URL = server.url;
console.log(`🚀 Server running at ${server.url}`);