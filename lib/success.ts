export type Success<E> = {
    success: true;
    error: null;
} | {
    success: false;
    error: E;
}

export type AsyncSuccess<E> = Promise<Success<E>>;

function ok(): Success<never> {
    return { success: true, error: null };
}

function err<E>(error: E): Success<E> {
    return { success: false, error };
}

function isSuccess<E>(result: Success<E>): result is { success: true; error: null } {
    return result.success === true;
}

function matchSuccess<E1, E2>(
    result: Success<E1>,
    handlers: {
        error: (error: E1) => E2
    }
): Success<E2> {
    if (isSuccess(result)) {
        return { success: true, error: null };
    } else {
        return { success: false, error: handlers.error(result.error) };
    }
}

// async function asyncMatchSuccess<E1, E2>(
//     result: Success<E1>,
//     handlers: {
//         error: (error: E1) => Promise<E2> | E2,
//     }
// ): AsyncSuccess<E2> {
//     if (isSuccess(result)) {
//         return { success: true, error: null };
//     } else {
//         const errorResult = await handlers.error(result.error);
//         return { success: false, error: errorResult };
//     }
// }

async function asyncMatchSuccess<E1, E2>(
    result: AsyncSuccess<E1>,
    handlers: {
        error: (error: E1) => Promise<E2> | E2,
    }
): AsyncSuccess<E2> {
    
    const awaitedResult = await result;

    if (isSuccess(awaitedResult)) {
        return { success: true, error: null };
    } else {
        const errorResult = await handlers.error(awaitedResult.error);
        return { success: false, error: errorResult };
    }
}

export const success = {
    ok: ok,
    err: err,
    isSuccess: isSuccess,
    match: matchSuccess,
    asyncMatch: asyncMatchSuccess,
}