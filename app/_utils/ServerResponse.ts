// TODO: move to _types
type ServerResponse<D, E> = {
    data: D;
    error: null;
} | {
    data: null;
    error: E;
};


export default ServerResponse;