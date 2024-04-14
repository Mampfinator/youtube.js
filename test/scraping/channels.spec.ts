import { expect } from "chai";
import {
    ChannelTab,
    CommunityContext,
    ScrapingClient,
    StreamsContext,
    VideosContext,
} from "../../src";

describe("Channel Tabs", function () {
    this.timeout(5000);

    let client: ScrapingClient;

    before(async () => {
        client = new ScrapingClient();
        await client.init();
    });

    after(async () => {
        await client.destroy();
    });

    console.warn(
        "WARNING: These tests do live requests and could, therefore, take quite a bit of time.",
    );

    /**
     *
     */
    const channelUrl = `https://youtube.com/@MoriCalliope/`;

    function forTab(tab: ChannelTab) {
        return channelUrl + tab;
    }

    it("should fetch videos", async () => {
        const videosContext = await client.contexts.fromUrl<VideosContext>(
            forTab(ChannelTab.Videos),
        );

        expect(videosContext.isOk()).to.be.true;

        if (videosContext.isErr()) return;

        //@ts-expect-error protected method
        const iterator = videosContext.value.getElements();

        const next = await iterator.next();
        expect(next.value.isOk()).to.be.true;
        expect(next.value.value.elements.size).to.be.greaterThan(0);
    });

    it("should fetch streams", async () => {
        const streamsContext = await client.contexts.fromUrl<StreamsContext>(
            forTab(ChannelTab.Streams),
        );

        expect(streamsContext.isOk()).to.be.true;
        if (streamsContext.isErr()) return;

        //@ts-expect-error protected method
        const iterator = streamsContext.value.getElements();

        const next = await iterator.next();
        expect(next.value.isOk()).to.be.true;
        expect(next.value.value.elements.size).to.be.greaterThan(0);
    });

    it("should fetch shorts", async () => {
        const shortsContext = await client.contexts.fromUrl<StreamsContext>(
            forTab(ChannelTab.Shorts),
        );

        expect(shortsContext.isOk()).to.be.true;
        if (shortsContext.isErr()) return;

        //@ts-expect-error protected method
        const iterator = shortsContext.value.getElements();

        const next = await iterator.next();
        expect(next.value.isOk()).to.be.true;
        expect(next.value.value.elements.size).to.be.greaterThan(0);
    });

    it("should fetch community posts", async () => {
        const communityContext =
            await client.contexts.fromUrl<CommunityContext>(
                forTab(ChannelTab.Community),
            );

        expect(communityContext.isOk()).to.be.true;
        if (communityContext.isErr()) return;

        //@ts-expect-error protected method
        const iterator = communityContext.value.getElements();

        const next = await iterator.next();
        expect(next.value.isOk()).to.be.true;
        expect(next.value.value.elements.size).to.be.greaterThan(0);
    });
});
