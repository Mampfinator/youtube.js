import { err, ok, Result } from "neverthrow";
import { type Dispatcher } from "undici";
import { isValueOk } from "../../shared/util";
import { FetchError, IRequestOrchestrator } from "../scraping.interfaces";
import { getContexts, ContextData } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";

export class ContextFactory {
    private readonly matchers: ContextData[];
    
    constructor(
        private readonly orchestrator: IRequestOrchestrator
    ) {
        this.matchers = getContexts().sort(({weight: weightA}, {weight: weightB}) => weightB - weightA);
    }


    public async fromUrl<T extends ScrapingContext>(url: string, method?: Dispatcher.HttpMethod): Promise<Result<T, FetchError | Error>> {
        try { new URL(url) } catch (error) { return err(error as TypeError); }

        for (const {matcher, constructor} of this.matchers) {

            if (!isValueOk(matcher(url))) continue;

            const data = await this.orchestrator.fetch({url, method: method ?? "GET"});

            if (data.isErr()) return err(data.error);

            try {
                const context = new constructor(this.orchestrator, data.value, url);
                return ok(context as T);
            } catch (error) {
                return err(error as Error);
            }
        }

        return err(new Error(`No matching context found for ${url}.`));
    }
}