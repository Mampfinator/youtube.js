import { ScrapingClient } from "./src";

async function main() {
    const client = new ScrapingClient();
    await client.init();
    
    const chat = await client.chat("KWu2Iyk2GIs");

    for await (const message of chat.read()) {
        console.log(message);
    }
}

main();