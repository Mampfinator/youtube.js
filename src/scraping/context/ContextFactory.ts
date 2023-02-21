import { err, ok, Result } from "neverthrow";
import { type Dispatcher } from "undici";
import { isResult, isValueOk } from "../../shared/util";
import { FetchError, IRequestOrchestrator } from "../scraping.interfaces";
import { getContexts, ContextData } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";

export interface ContextOptions {
    /**
     * Orchestrator the `ScrapingClient` was instantiated with.
     */
    orchestrator: IRequestOrchestrator;
    body: string;
    url: string;
}

export class ContextFactory {
    private readonly matchers: ContextData[];
    
    constructor(
        private readonly orchestrator: IRequestOrchestrator
    ) {
        this.matchers = getContexts().sort(({weight: weightA}, {weight: weightB}) => weightB - weightA);
    }

    public async fromUrl<T extends object>(url: string, method?: Dispatcher.HttpMethod): Promise<Result<T, FetchError | Error>> {
        try { new URL(url) } catch (error) { return err(error as TypeError); }

        let data: Result<any, any> | undefined;
        let options: Partial<ContextOptions> = {orchestrator: this.orchestrator, url: url};

        for (const {matcher, constructor} of this.matchers) {

            if (!isValueOk(matcher(url))) continue;

            if (!data) {
                // we only fetch once we know we have at least one Context that can do anything with this URL.
                data = await this.orchestrator.fetch({url, method: method ?? "GET"});
                if (data.isErr()) return err(data.error);
                options.body = data.value;
            }


            if ("from" in constructor && typeof constructor.from === "function") {
                const result = constructor.from(options);

                if (!isResult(result)) return err(new TypeError(`Expected ${constructor.name}.from to return Result, got ${typeof result}.`));
                if (result.isErr()) continue;
                return ok(result.value as T);

            } else {
                try {
                    const context = new constructor(options);
                    return ok(context as T);
                } catch (error) {
                    return err(error as Error);
                }
            }
        }

        return err(new Error(`No matching context found for ${url}.`));
    }
}