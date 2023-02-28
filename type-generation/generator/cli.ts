import { Command } from "commander";
import { RequestOrchestrator } from "../../src/scraping/RequestOrchestrator";
import { join } from "path";
import { DataExtractors } from "../../src/scraping/extractors/data-extractors";
import { Result } from "neverthrow";
import { exec as execCb } from "child_process";
import { writeFile } from "fs/promises";
import { BASE_OUT_DIR, bootstrap } from "./bootstrap";
import data from "../data.json";

async function exec(command: string | string[]): Promise<string> {
    const actualCommand = Array.isArray(command) ? command.join(" ") : command;

    return new Promise((resolve, reject) => {
        execCb(actualCommand, (error, stdout) => {
            if (error) reject(error);
            resolve(stdout);
        });
    });
}

const orchestrator = new RequestOrchestrator();

(async () => {
    const command = new Command()
        .name("type-generator-util")
        .description("Internal YouTube type generator.")
        .option("-d, --initialData", "Generate ytInitialData types.", false)
        .option(
            "-p, --playerResponse",
            "Generate ytInitialPlayerResponse types.",
            false,
        )
        .option("-c, --cfg", "Generate ytCfg types.", false)
        .option("-a, --all", "Generate all types.", false)
        .parse();

    const options = command.opts();

    const { all, initialData, playerResponse, cfg } = options as Record<
        string,
        boolean
    >;

    if (!all && !initialData && !playerResponse && !cfg) {
        console.error("At least one option must be selected!");
        process.exit(1);
    }

    await bootstrap();

    const result = await orchestrator.init();
    if (result.isErr()) {
        console.error("Failed setting up orchestrator! See details below.");
        console.error(result.error);

        process.exit();
    }

    const promises: Promise<void>[] = [];

    if (all || initialData) {
        promises.push(fetch("ytInitialData"));
    }

    if (all || cfg) {
        promises.push(fetch("ytCfg"));
    }

    if (all || playerResponse) {
        promises.push(fetch("ytInitialPlayerResponse"));
    }

    await Promise.all(promises);

    await exec(
        `npx quicktype ${BASE_OUT_DIR} -o ${join(
            __dirname,
            "..",
            "..",
            "src",
            "scraping",
            "types",
            "internal",
            "generated.ts",
        )} --no-enums --no-boolean-strings --just-types`,
    ).then(console.log);

    process.exit(0);
})();

async function fetch(
    type: "ytInitialData" | "ytCfg" | "ytInitialPlayerResponse",
): Promise<void> {
    const samples = await fetchData(data[type].sources, DataExtractors[type]);

    await Promise.all(
        samples.map((file, index) =>
            writeFile(
                join(BASE_OUT_DIR, type, `${type}-${index}.json`),
                JSON.stringify(file, null, 4),
            ),
        ),
    );
}

async function fetchData(
    urls: string[],
    transform: (page: string) => Result<object, any>,
): Promise<object[]> {
    const out: object[] = [];

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i]!;
        console.log(`Fetching ${url} (${i + 1}/${urls.length})`);
        const result = await orchestrator.fetch({
            url,
            method: "GET",
            transform,
        });

        if (result.isErr()) {
            console.error(`Failed fetching ${url}. See details below!`);
            console.error(result.error);
            continue;
        }

        out.push(result.value);
    }

    return out;
}
