declare const _default: () => {
    port: number;
    promiseTimout: number;
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    redis: {
        host: string;
        port: number;
    };
    config: {
        proxyEnabled: string;
        timeOut: string | number;
    };
};
export default _default;
