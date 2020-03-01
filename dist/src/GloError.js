var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var yalog_1 = require('@yadou/yalog');
var ErrorCodes = {
    TIP_ERROR: 1000,
    QUERY_DB_ERROR: 1001,
    DB_TABLE_ERROR: 1002,
    CONNECT_DB_ERROR: 1003,
    PARAM_ERROR: 1111,
    OTHER_ERROR: 9999
};
var ErrorMessage = {
    QUERY_DB_ERROR: 'Query DB error',
    DB_TABLE_ERROR: 'DB or table error',
    CONNECT_DB_ERROR: 'Connect DB error',
    PARAM_ERROR: 'param error'
};
var GloError = (function (_super) {
    __extends(GloError, _super);
    function GloError(code, params) {
        if (params === void 0) { params = {}; }
        var message = ErrorCodes[code] ? ErrorMessage[ErrorCodes[code]] : '' + code;
        yalog_1["default"].warning(message, params);
        for (var i in params) {
            message += i + "[" + params[i] + "]";
        }
        _super.call(this, message);
    }
    GloError.ErrorCodes = ErrorCodes;
    return GloError;
})(Error);
exports["default"] = GloError;
