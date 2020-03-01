import Log from '@yadou/yalog';

const ErrorCodes = {
    TIP_ERROR: 1000,
    QUERY_DB_ERROR: 1001,
    DB_TABLE_ERROR: 1002,
    CONNECT_DB_ERROR: 1003,
    PARAM_ERROR: 1111,
    OTHER_ERROR: 9999
};

const ErrorMessage = {
    QUERY_DB_ERROR: 'Query DB error',
    DB_TABLE_ERROR: 'DB or table error',
    CONNECT_DB_ERROR: 'Connect DB error',
    PARAM_ERROR: 'param error',
}


class GloError extends Error {
    static ErrorCodes = ErrorCodes;
    constructor ( code, params = {} ) {
        let message = ErrorCodes[ code ] ? ErrorMessage[ ErrorCodes[ code ] ] : '' + code;
        Log.warning( message, params );
        for ( let i in params ) {
            message += `${i}[${params[ i ]}]`;
        }
        super( message );
    }
}

export default GloError;
