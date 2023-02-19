# (mostly) automatic type generation

Because YouTube's `ytInitialData`, `ytCfg` & `ytInitialPlayerResponse` are massively complicated nested objects, we use [quicktype](https://quicktype.io/) CLI and some example pages to generate types automatically.

To (re-)generate types, run `npm run generate`. Types will be output directly into `src/scraping/types/internal.ts`.
Note that this will run the default request orchestrator on your machine.
While this usually shouldn't cause any issues, mind that YouTube's bot detection may block you at any time and you're responsible for that yourself.

This will generate various JSON files in `out/`. Feel free to ignore those as they should **not** be comitted.

`data.json` contains URLs to fetch and run extractors on. If you add any, they should be comitted.
