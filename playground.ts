import { ScrapingClient } from "./src";


const client = new ScrapingClient();

(async () => {
    await client.init();

    /*const result = await client.channel({tag: "@Rizuna_Ch"}).fetchPosts();
    if (result.isErr()) return console.error(result.error);

    console.log(result.value);*/

    const result = await client.post("Ugkx7fM7aSvBxLb6uhFHV0yIz56-v7S31Wi6").fetch();

    if (result.isErr()) return console.error(result.error);

    console.log(result.value);
})();