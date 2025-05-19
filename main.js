import { serveDir, serveFile, setCookie } from "@std/http";
import { ulid } from "@std/ulid";

const GAME_ROUTE = new URLPattern({ pathname: "/game/:id" });

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
    await writer.write(new TextEncoder().encode(game));

    const headers = new Headers();
    setCookie(headers, {
      name: "username",
      value: data.get("username"),
    });

    const url = new URL(`/game/${id}`, req.url);
    headers.set("Location", url.toString());

    return new Response(null, {
      status: 303,
      headers: headers,
    });
  }

  if (GAME_ROUTE.exec(req.url)) {
    return serveFile(req, "./public/routes/game.html");
  }

  // TEMPORARY PATH
  if (pathname == "/create-game") {
    return serveFile(req, "./public/routes/create-game.html");
  }

  if (pathname == "/") {
    return serveFile(req, "./public/routes/index.html");
  }

  if (pathname == "/get-game") {
    const game = url.searchParams.get("game");

    try {
      const data = await Deno.readTextFile(`./games/${game}.json`);
      return new Response(data);
    } catch (_) {
      return new Response(JSON.stringify({
        status: "not found",
      }));
    }
  }

  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "public",
    });
  }

  return new Response("404 Not found", { status: 404 });
});
