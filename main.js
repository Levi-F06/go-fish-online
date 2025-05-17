import { serveDir, serveFile } from "@std/http";
import { ulid } from "@std/ulid";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname == "/create-game" && req.method === "POST") {
    const data = await req.formData();
    const id = ulid();
    const file = await Deno.create(`./games/${id}.json`);
    const writer = file.writable.getWriter();
    const game = JSON.stringify(
      {
        id: id,
        status: "waiting",
        privacy: data.get("private"),
        playerCount: data.get("players"),
        creationDate: Date.now(),
        players: [],
      },
      null,
      "\t",
    );
    // await writer.write(new TextEncoder().encode(`
    // {
    //   "id": "${id}",
    //   "status": "waiting",
    //   "privacy": "${data.get("private")}",
    //   "player_count": "${data.get("players")}",
    //   "creation-date": "${Date.now()}",
    //   "players": []
    // }
    // `.trim()));
    await writer.write(new TextEncoder().encode(game));
    return Response.redirect(req.url, 303);
  }

  // TEMPORARY PATH
  if (pathname == "/create-game") {
    return serveFile(req, "./public/routes/create-game.html");
  }

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
