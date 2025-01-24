type DatabaseResponse<D, E> = {
    data: D;
    error: null;
} | {
    data: null;
    error: E;
};


export default DatabaseResponse;