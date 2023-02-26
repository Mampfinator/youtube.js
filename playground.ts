import { ScrapingClient } from "./src";


const client = new ScrapingClient();

(async () => {
    await client.init();

    const result = await client.channel({tag: "@SelenTatsuki"}).fetchFeaturedChannels();

    if (result.isErr()) console.error(result.error);
    else console.log(result.value);


    await client.destroy();
})();