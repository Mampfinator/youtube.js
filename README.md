# youtube.js

A YouTube API library written purely out of spite. :)

## Motivation

The `googleapis` package is borderline unusable with strict null checking! This package is a wrapper around the API that doesn't extend **LITERALLY EVERY PROPERTY** of returned objects with `undefined | null`.

## Features

- **Fully & properly typed**, instead of [`{ [P]?: T | null }` everywhere](https://github.com/googleapis/google-api-nodejs-client/blob/31defea1dca2e32d2cfcea1649087a206e7254d1/src/apis/youtube/v3.ts#L3740).
- Designed to be mostly interoperable with `googleapis/youtube_v3`, just with better types.
