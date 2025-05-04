export type Result<D, E> =
    | { data: D; error: null }
    | { data: null; error: E };

export type AsyncResult<D, E> = Promise<Result<D, E>>;

function ok<D>(data: D): Result<D, never> {
    return { data, error: null };
}

function err<E>(error: E): Result<never, E> {
    return { data: null, error };
}

function isError<D, E>(result: Result<D, E>): result is { data: null; error: E } {
    return result.error !== null;
}

function machResult<D1, E1, D2, E2>(
    result: Result<D1, E1>,
    handlers: {
        data:  (data: D1)  => D2
        error: (error: E1) => E2
    }
): Result<D2, E2> {

    if (isError(result)) {
        return err(handlers.error(result.error));
    } else {
        return ok(handlers.data(result.data));
    }
}

// async function asyncMatchResult<D1, E1, D2, E2>(
//     result: Result<D1, E1>,
//     handlers: {
//         data: (data: D1) => Promise<D2> | D2,
//         error: (error: E1) => Promise<E2> | E2,
//     }
// ): AsyncResult<D2, E2> {
//     if (isError(result)) {
//         const errorResult = await handlers.error(result.error);
//         return err(errorResult);
//     } else {
//         const dataResult = await handlers.data(result.data);
//         return ok(dataResult);
//     }
// }

async function asyncMatchResult<D1, E1, D2, E2>(
    result: AsyncResult<D1, E1>,
    handlers: {
        data: (data: D1) => D2 | Promise<D2>,
        error: (error: E1) => E2 | Promise<E2>,
    }
): Promise<Result<D2, E2>> {

    const awaitedResult = await result;

    if (isError(awaitedResult)) {
        const errorResult = await handlers.error(awaitedResult.error);
        return err(errorResult);
    } else {
        const dataResult = await handlers.data(awaitedResult.data);
        return ok(dataResult);
    }
}

export const result = {
    ok: ok,
    err: err,
    isError: isError,
    match: machResult,
    asyncMatch: asyncMatchResult,
}