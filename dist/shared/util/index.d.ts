import { Result } from "neverthrow";
export declare function sleep(ms: number): Promise<unknown>;
export declare function isResult(arg: any): arg is Result<any, any>;
/**
 * @param value value to check. If result, is unpacked first (and returns false is it has errors).
 * @param compareTo value to compare to. Defaults to `true`.
 * @returns
 */
export declare function isValueOk(value: any, compareTo?: any): boolean;
