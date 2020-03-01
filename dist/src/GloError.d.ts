declare class GloError extends Error {
    static ErrorCodes: {
        TIP_ERROR: number;
        QUERY_DB_ERROR: number;
        DB_TABLE_ERROR: number;
        CONNECT_DB_ERROR: number;
        PARAM_ERROR: number;
        OTHER_ERROR: number;
    };
    constructor(code: any, params?: {});
}
export default GloError;
