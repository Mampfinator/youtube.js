import { err, ok, Result } from "neverthrow";
import {
    YoutubejsError,
    YoutubejsTypeError,
} from "../../shared/errors/YouTubejsError";
import { Type } from "../../shared/types";
import { isResult, isValueOk } from "../../shared/util";
import { FetchError, FetchErrorCode } from "../errors/FetchError";
import { IRequestOrchestrator } from "../scraping.interfaces";
import { getContexts, ContextData } from "./decorators/Context";

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

    constructor(private readonly orchestrator: IRequestOrchestrator) {
        this.matchers = getContexts().sort(
            ({ weight: weightA }, { weight: weightB }) => weightB - weightA,
        );
    }

    /**
     *
     * @param url URL to fetch from. If `useContext` is not provided, attempts to automatically find a matcher.
     * @param useContext Use this context regardless of which other contexts may match the provided URL.
     */
    public async fromUrl<T extends object>(
        url: string,
        useContext?: Type<T>,
    ): Promise<Result<T, FetchError>> {
        try {
            new URL(url);
        } catch {
            return err(new FetchError(FetchErrorCode.InvalidURL));
        }

        let data: Result<any, any> | undefined;
        let options: Partial<ContextOptions> = {
            orchestrator: this.orchestrator,
            url: url,
        };

        if (useContext) {
            const result = await this.orchestrator.fetch({
                url,
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
                }
            });
            if (result.isErr()) return err(result.error);
            const context = this.getContext(useContext, {
                ...options,
                body: result.value,
            } as ContextOptions);
            return context as any;
        }

        for (const { matcher, constructor } of this.matchers) {
            if (!isValueOk(matcher(url))) continue;

            if (!data) {
                // we only fetch once we know we have at least one Context that can do anything with this URL.
                data = await this.orchestrator.fetch({ url, method: "GET" });
                if (data.isErr()) return err(data.error);
                options.body = data.value;
            }

            const result = this.getContext(
                constructor,
                options as Required<typeof options>,
            );
            if (result.isErr()) return err(result.error);

            if (!result.value) continue;

            return result as any;
        }
        return err(
            new FetchError(FetchErrorCode.InternalError, {}, [
                new YoutubejsError("NoContextFound", url),
            ]),
        );
    }

    private getContext<T extends Type<unknown>>(
        constructor: T,
        options: ContextOptions,
    ): Result<InstanceType<T> | undefined, FetchError> {
        if ("from" in constructor && typeof constructor.from === "function") {
            const result = constructor.from(options);

            if (!isResult(result))
                return err(
                    new FetchError(FetchErrorCode.InternalError, {}, [
                        new YoutubejsTypeError("ExpectedResult", result),
                    ]),
                );
            if (result.isErr()) return ok(undefined);
            return ok(result.value as InstanceType<T>);
        } else {
            try {
                const context = new constructor(options);
                return ok(context as InstanceType<T>);
            } catch (error) {
                return err(
                    new FetchError(FetchErrorCode.Unknown, {}, [
                        error as Error,
                    ]),
                );
            }
        }
    }
}
