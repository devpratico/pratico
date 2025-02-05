// TODO: move to _types
type DatabaseResponse<D, E> = {
    data: D;
    error: null;
} | {
    data: null;
    error: E;
};


export default DatabaseResponse;