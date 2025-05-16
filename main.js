import { serveDir, serveFile } from "@std/http";

Deno.serve((req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  console.log(pathname);

  if (pathname == "/") {
    return serveFile(req, "./public/routes/index.html");
  }

  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "public",
    });
  }

  return new Response("404 Not found", { status: 404 });
});
