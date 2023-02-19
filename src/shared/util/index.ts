import { Err, Ok, Result } from "neverthrow";

export async function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

export function isResult(arg: any): arg is Result<any, any> {
    return arg instanceof Ok || arg instanceof Err;
}

/**
 * @param value value to check. If result, is unpacked first (and returns false is it has errors).
 * @param compareTo value to compare to. Defaults to `true`.
 * @returns 
 */
export function isValueOk(value: any, compareTo: any = true): boolean {
    if (isResult(value)) {
        if (value.isErr()) return false;
        value = value.value;
    }

    return value === compareTo;
}