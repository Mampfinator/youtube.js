import { expect } from "chai";
import { ScrapingClient, AttachmentType } from "../../src";

describe("Community Posts", function() {
    this.timeout(10000);

    let client: ScrapingClient;
    before(async () => {
        client = new ScrapingClient();
        await client.init();
    });

    after(async () => {
        await client.destroy();
    });

    describe("Attachments", () => {
        it("No Attachment", async () => {
            const post = await client
                .post("UgkxC2BTK0XOqIi5i3kntkG09JX-GELRf7v8")
                .getPost();
            expect(post.isOk()).to.be.true;
            if (post.isErr()) return;

            expect(post.value)
                .property("attachmentType")
                .to.be.equal(AttachmentType.None);
        });

        it("Image Attachment", async () => {
            const post = await client
                .post("UgkxB55RI7tUNNnuHZ9EeIvPXPIzQ1slEqOD")
                .getPost();
            expect(post.isOk()).to.be.true;
            if (post.isErr()) return;

            expect(post.value)
                .property("attachmentType")
                .to.be.equal(AttachmentType.Image);
        });

        it("Video Attachment", async () => {
            const post = await client
                .post("UgkxwcNLTxJr73FTF-BspknyQ-W5H_nIlUGS")
                .getPost();
            expect(post.isOk()).to.be.true;
            if (post.isErr()) return;

            expect(post.value)
                .property("attachmentType")
                .to.be.equal(AttachmentType.Video);
        });

        it("Poll Attachment", async () => {
            const post = await client
                .post("UgkxNlPO5cBIzDRqTHrDK44bmY0L4F8wHU8M")
                .getPost();
            expect(post.isOk()).to.be.true;
            if (post.isErr()) return;

            expect(post.value)
                .property("attachmentType")
                .to.be.equal(AttachmentType.Poll);
        });

        it("Quiz Attachment", async () => {
            const post = await client
                .post("UgkxOqZkVZym3ZCLaEnq0IhikrD3O-7uXMb4")
                .getPost();
            expect(post.isOk()).to.be.true;
            if (post.isErr()) return console.error(post.error);

            expect(post.value)
                .property("attachmentType")
                .to.be.equal(AttachmentType.Quiz);
        });
    });
});
