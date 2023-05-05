import { expect } from "chai";
import { ScrapingClient } from "../../src";
import { FetchErrorCode } from "../../src/scraping/errors/FetchError";


describe("Orchestrator", () => {
    it("should return Err when orchestrator uninitialized", async () => {
        const client = new ScrapingClient();
        
        const err = await client.channel({tag: "@:)"}).fetchAbout();

        expect(err.isErr()).to.be.true;
        if (err.isOk()) return;

        expect(err.error).property("code").to.equal(FetchErrorCode.NotInitialized);
    });
});