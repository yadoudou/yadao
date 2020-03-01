"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mysql = require('mysql');
var SQLAssember_1 = require("./SQLAssember");
var yalog_1 = require("@yadou/yalog");
var GloError_1 = require("./GloError");
;
;
;
;
var FETCH_TYPE;
(function (FETCH_TYPE) {
    FETCH_TYPE[FETCH_TYPE["ROW"] = 1] = "ROW";
    FETCH_TYPE[FETCH_TYPE["ASSOC"] = 2] = "ASSOC";
})(FETCH_TYPE || (FETCH_TYPE = {}));
;
var DB = /** @class */ (function () {
    function DB(config) {
        this.isConnect = false;
        this.config = config;
        this.mysql = mysql.createConnection(config);
        this.assember = new SQLAssember_1["default"](this);
    }
    DB.prototype.connect = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        var origCallback = callback;
        callback = function (err) {
            if (err) {
                throw new GloError_1["default"](GloError_1["default"].ErrorCodes.CONNECT_DB_ERROR, { code: err.code, message: err.message });
            }
            _this.isConnect = true;
            origCallback && origCallback(err);
        };
        return this.mysql.connect(callback);
    };
    DB.prototype.end = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        var origCallback = callback;
        callback = function (err) {
            if (!err) {
                _this.isConnect = false;
            }
            else {
                // 释放不抛Error
                yalog_1["default"].warning('END DB ERROR', { code: err.code, message: err.message });
            }
            origCallback && origCallback(err);
        };
        return this.mysql.end(callback);
    };
    DB.prototype.reconnect = function (callback) {
        if (callback === void 0) { callback = null; }
        this.mysql = mysql.createConnection(this.config);
        return this.connect(callback);
    };
    DB.prototype.call = function (method, args) {
        return this.mysql[method](args);
    };
    DB.prototype.select = function (tableName, fields, conds, options, appends) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this.assember.getSelect(tableName, fields, conds, options, appends);
                        if (!sql) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DB.prototype.selectSql = function (tableName, fields, conds, options, appends) {
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return this.assember.getSelect(tableName, fields, conds, options, appends);
    };
    DB.prototype.insert = function (table, row, options, onDup) {
        if (options === void 0) { options = null; }
        if (onDup === void 0) { onDup = null; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this.assember.getInsert(table, row, options, onDup);
                        if (!sql) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            return [2 /*return*/, false];
                        }
                        this.lastInsertId = data.insertId;
                        return [2 /*return*/, data.affectedRows];
                }
            });
        });
    };
    DB.prototype.insertSql = function (table, row, options, onDup) {
        return this.assember.getInsert(table, row, options, onDup);
    };
    DB.prototype.update = function (table, row, conds, options, appends) {
        if (conds === void 0) { conds = null; }
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this.assember.getUpdate(table, row, conds, options, appends);
                        if (!sql) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.affectedRows];
                }
            });
        });
    };
    DB.prototype.updateSql = function (table, row, conds, options, appends) {
        return this.assember.getUpdate(table, row, conds, options, appends);
    };
    DB.prototype["delete"] = function (table, conds, options, appends) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 删除必须要显示指定conds
                        if (!conds) {
                            throw new Error('DELETE NEED conds');
                        }
                        sql = this.assember.getDelete(table, conds, options, appends);
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.affectedRows];
                }
            });
        });
    };
    DB.prototype.deleteSql = function (table, conds, options, appends) {
        return this.assember.getDelete(table, conds, options, appends);
    };
    DB.prototype.getConds = function (conds) {
        return this.assember.getConds(conds);
    };
    DB.prototype.getLastSql = function () {
        return this.lastSql;
    };
    DB.prototype.getInsertId = function () {
        return this.lastInsertId;
    };
    DB.prototype.getAffectedRows = function () {
        return this.lastAffectedRows;
    };
    DB.prototype.query = function (sql) {
        var _this = this;
        var logInfo = {
            host: this.config.host,
            port: this.config.port,
            db: this.config.database
        };
        this.lastSql = sql;
        var startTime = Date.now();
        var promise = new Promise(function (resolve, reject) {
            _this.mysql.query(sql, function (error, results) {
                if (error) {
                    var errorLog = "QUERY DB ERROR";
                    var info_1 = __assign(__assign({}, logInfo), { code: error.code, message: error.message, sql: error.sql, mysql_error: error.sqlMessage });
                    yalog_1["default"].warning(errorLog, info_1);
                    resolve(false);
                    return true;
                }
                _this.lastAffectedRows = results.affectedRows || results.length;
                if (results.insertId) {
                    _this.lastInsertId = results.insertId;
                }
                var useTime = Date.now() - startTime;
                var info = __assign(__assign({}, logInfo), { use_time: useTime, affected_rows: _this.lastAffectedRows, sql: sql });
                yalog_1["default"].info('QUERY DB SUCCESS', info);
                resolve(results);
            });
        });
        return promise;
    };
    DB.prototype.escape = function (value) {
        return this.mysql.escape(value);
    };
    return DB;
}());
exports["default"] = DB;
