import getGame from "./tools/get-game.js";
async function main() {
  const game = await getGame()
  console.log(game);
}

main()
