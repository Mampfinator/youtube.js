# youtube.js

A one-stop library for just about all your YouTube needs. Supports the official API, PubSub, XML feeds, scraping and other miscellaneous YouTube things.

## Motivation

Initially only meant to replace `googleapis/youtube_v3` in another project, it now aims to be a **complete** YouTube library.

## Features

- [ ] API
  - [ ] Readonly endpoints
  - [ ] Scoped auth provider
- [ ] PubSub
  - [ ] Awaitable subscriptions
  - [ ] Automatic re-leasing
- [x] RSS/XML feeds
  - [x] videos.xml (are there even any other feeds?)
- [ ] Scraping
  - [ ] Channels
    - [x] Non-API features (separate `/videos`, `/shorts`, `/streams`; `/community`; `/channels`)
    - [ ] Search
    - [ ] /featured
  - [ ] Search
  - [x] Community Posts
  - [ ] Comments

## Usage

For usage guides, [see the wiki](https://github.com/Mampfinator/youtube.js/wiki).
