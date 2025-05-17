export default async function getGame() {
  const url = new URL(globalThis.window.location.href);
  // Returns the game ID
  const gameID = url.pathname.split("/")[2];
  const res = await fetch(`/get-game?game=${gameID}`);
  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`);
  }

  const game = await res.json().then((result) => result);
  return game;
}

