# youtube.js

A one-stop library for just about all your YouTube needs. Supports the official API, PubSub, XML feeds, scraping and other miscellaneous YouTube things.

## Motivation

Initially only meant to replace `googleapis/youtube_v3` in another project, it now aims to be a **complete** YouTube library.

## Features

- WIP

## Usage - Scraping

As everything is still very much WIP, this is currently more of a design doc than it is an actual usage guide.
Features you see here may not exist yet, or may not be fully stable.

---

### High-level methods

The top level methods are the most basic way of making requests. They're fairly straightforward, usually safe and abstract everything away neatly.

```ts
import { ScrapingClient } from "youtube.js";

const client = new ScrapingClient();

const result = await client.channel({tag: "@Rizuna_Ch"}).fetchPosts();
if (result.isErr()) console.error(result.error);
else console.log(result.value);

```

### Contexts

Contexts are a fairly low-level concept within youtube.js, but they give you a lot of control over how and when your data is fetched.

```ts
import { ScrapingClient, CommunityContext } from "youtube.js";

const client = new ScrapingClient();

const communityTab = await client.contextFromUrl<CommunityContext>(
    "https://youtube.com/@Rizuna_Ch/community", 
);

// doesn't return anything useful, but populates get() to retrieve posts.
await communityTab.fetchAll();

const channel = communityTab.getChannelInfo();

for (const [id, post] of communityTab.get()) {
    console.log(id, post);
}
```

Channel contexts in particular are designed to be switchable. An example:

```ts
import { ScrapingClient, VideosContext, type ScrapedVideo } from "youtube.js";

const client = new ScrapingClient();


const allVideos: ScrapedVideo[] = [];

const videos = await client.contextFromUrl<VideosContext>(
    "https://youtube.com/@Rizuna_Ch/videos",
);
await videos.fetchAll();
allVideos.push(...videosTab.get().values());

const streams = await videosTab.streams.goTo();
await streams.fetchAll();
allVideos.push(...streamsTab.get().values());

const shorts = await streamsTab.shorts?.goTo();
await shorts.fetchAll();
allVideos.push(...shortsTab.get().values());
```
