import { expect } from "chai";
import { ChannelTab, ScrapingClient, VideosContext } from "../../src";
import { FetchErrorCode } from "../../src/scraping/errors/FetchError";
import { URLBuilder } from "../../src/shared/builders/URLBuilder";

describe("Misc", () => {
    let client: ScrapingClient;
    beforeEach(async () => {
        client = new ScrapingClient();
        await client.init();
    });

    afterEach(async () => {
        await client?.destroy();
    });

    describe("ElementContext", () => {
        it("should only fetch the amount of elements specified", async () => {
            const context = await client.contexts.fromUrl<VideosContext>(
                URLBuilder.channel()
                    .tag("@Dokibird")
                    .tab(ChannelTab.Streams)
                    .build(),
            );
            expect(context.isOk()).to.be.true;
            if (context.isErr()) return;

            const result = await context.value.fetchElements(5);
            expect(result.isOk()).to.be.true;
            if (result.isErr()) return;

            const elements = context.value.get();

            expect(elements.size).to.be.equal(5);
        });
    });
});
