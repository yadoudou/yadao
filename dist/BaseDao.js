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
var ConnManage_1 = require("./ConnManage");
var GloError_1 = require("./GloError");
var yalog_1 = require("@yadou/yalog");
var Utils_1 = require("./Utils");
var BaseDao = /** @class */ (function () {
    function BaseDao() {
        this.dbName = null;
        this.table = null;
        this.returnSql = false;
    }
    BaseDao.prototype._initDb = function () {
        // invalid dbName or table
        if (!this.dbName || !this.table) {
            throw new GloError_1["default"](GloError_1["default"].ErrorCodes.DB_TABLE_ERROR, { dbName: this.dbName, table: this.table });
        }
        this.db = ConnManage_1["default"].getConn(this.dbName);
    };
    BaseDao.prototype.setTable = function (table) {
        this.table = table;
    };
    BaseDao.prototype.toggleSql = function (value) {
        this.returnSql = value;
    };
    BaseDao.prototype.getListByConds = function (fields, conds, options, appends) {
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.returnSql) {
                            sql = this.db.selectSql(this.table, fields, conds, options, appends);
                            this.toggleSql(false);
                            return [2 /*return*/, sql];
                        }
                        return [4 /*yield*/, this.prevCheck()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select(this.table, fields, conds, options, appends)];
                    case 2:
                        result = _a.sent();
                        if (false === result) {
                            throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseDao.prototype.updateByConds = function (fields, conds, options, appends) {
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.returnSql) {
                            sql = this.db.updateSql(this.table, fields, conds, options, appends);
                            this.toggleSql(false);
                            return [2 /*return*/, sql];
                        }
                        return [4 /*yield*/, this.prevCheck()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.update(this.table, fields, conds, options, appends)];
                    case 2:
                        result = _a.sent();
                        if (false === result) {
                            throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseDao.prototype.deleteByConds = function (conds, options, appends) {
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.returnSql) {
                            sql = this.db.deleteSql(this.table, conds, options, appends);
                            this.toggleSql(false);
                            return [2 /*return*/, sql];
                        }
                        return [4 /*yield*/, this.prevCheck()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db["delete"](this.table, conds, options, appends)];
                    case 2:
                        result = _a.sent();
                        if (false === result) {
                            throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseDao.prototype.insertRecord = function (fields, options, onDup) {
        if (options === void 0) { options = null; }
        if (onDup === void 0) { onDup = null; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, insertId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.returnSql) {
                            sql = this.db.insertSql(this.table, fields, options, onDup);
                            this.toggleSql(false);
                            return [2 /*return*/, sql];
                        }
                        return [4 /*yield*/, this.prevCheck()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.insert(this.table, fields, options, onDup)];
                    case 2:
                        result = _a.sent();
                        if (false === result) {
                            throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
                        }
                        insertId = this.db.getInsertId();
                        return [2 /*return*/, insertId];
                }
            });
        });
    };
    BaseDao.prototype.getCntByConds = function (conds, options, appends) {
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return __awaiter(this, void 0, void 0, function () {
            var fields, sql, result, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = [
                            'COUNT(*) AS _count_num'
                        ];
                        if (this.returnSql) {
                            sql = this.db.selectSql(this.table, fields, conds, options, appends);
                            this.toggleSql(false);
                            return [2 /*return*/, sql];
                        }
                        return [4 /*yield*/, this.prevCheck()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select(this.table, fields, conds, options, appends)];
                    case 2:
                        result = _a.sent();
                        if (false === result) {
                            throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
                        }
                        row = result[0];
                        return [2 /*return*/, row && row['_count_num'] || 0];
                }
            });
        });
    };
    BaseDao.prototype.getListById = function (arrIds, fields, idKey) {
        if (idKey === void 0) { idKey = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var bolOneKey, strIds, conds, arrList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof arrIds === 'number' || typeof arrIds === 'string') {
                            bolOneKey = ('' + arrIds).trim();
                            arrIds = [arrIds];
                        }
                        strIds = this.getIdStr(arrIds);
                        if (strIds === false) {
                            return [2 /*return*/, []];
                        }
                        conds = [idKey + " IN (" + strIds + ")"];
                        if (fields !== '*' && fields.indexOf(idKey) === -1 && fields.indexOf('*') === -1) {
                            fields.push(idKey);
                        }
                        return [4 /*yield*/, this.getListByConds(fields, conds)];
                    case 1:
                        arrList = _a.sent();
                        arrList = Utils_1["default"].getMapFromList(arrList, idKey);
                        if (bolOneKey) {
                            return [2 /*return*/, arrList[bolOneKey]];
                        }
                        return [2 /*return*/, arrList];
                }
            });
        });
    };
    BaseDao.prototype.getRecordByConds = function (fields, conds, options, appends) {
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return __awaiter(this, void 0, void 0, function () {
            var arrList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!appends) {
                            appends = ['LIMIT 1'];
                        }
                        else if (appends.findIndex(function (append) {
                            append = " " + append.toLowerCase() + " ";
                            return append.indexOf(' limit ') > -1;
                        }) === -1) {
                            appends.push('LIMIT 1');
                        }
                        return [4 /*yield*/, this.getListByConds(fields, conds, options, appends)];
                    case 1:
                        arrList = _a.sent();
                        if (arrList.length > 0) {
                            return [2 /*return*/, arrList[0]];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    BaseDao.prototype.getTableFieldValue = function (arrIds, mapField, mapKey) {
        if (mapKey === void 0) { mapKey = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var arrList, type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getListById(arrIds, [mapField, mapKey], mapKey)];
                    case 1:
                        arrList = _a.sent();
                        type = typeof arrIds;
                        if (type === 'string' || type === 'number') {
                            return [2 /*return*/, arrList[mapField]];
                        }
                        return [2 /*return*/, Utils_1["default"].getMapFieldValue(arrList, mapField, mapKey)];
                }
            });
        });
    };
    BaseDao.prototype.add = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.insertRecord(record)];
            });
        });
    };
    BaseDao.prototype.addAll = function (arrList, onDump) {
        if (onDump === void 0) { onDump = null; }
        return __awaiter(this, void 0, void 0, function () {
            var arrData, keys, sql, result;
            var _this = this;
            return __generator(this, function (_a) {
                if (!Array.isArray(arrList) || arrList.length === 0) {
                    return [2 /*return*/, false];
                }
                arrData = [];
                arrList.map(function (record) {
                    if (!keys) {
                        keys = Object.keys(record).map(function (key) { return "`" + key + "`"; }).join(',');
                    }
                    var values = Object.values(record).map(function (val) {
                        return _this.db.escape(val);
                    });
                    arrData.push("(" + values.join(',') + ")");
                });
                sql = "INSERT INTO " + this.table + " (" + keys + ") values " + arrData.join(',');
                if (onDump) {
                    sql += " " + onDump;
                }
                result = this.db.query(sql);
                if (!result) {
                    throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR, { sql: sql });
                }
                return [2 /*return*/, result];
            });
        });
    };
    BaseDao.prototype.save = function (record, key) {
        if (key === void 0) { key = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var conds;
            var _a;
            return __generator(this, function (_b) {
                if (!record[key]) {
                    throw new GloError_1["default"]('record has no key value', __assign(__assign({}, record), { key: key }));
                }
                conds = (_a = {},
                    _a[key] = record[key],
                    _a);
                delete record[key];
                return [2 /*return*/, this.updateByConds(record, conds)];
            });
        });
    };
    BaseDao.prototype.getCondsSql = function (conds) {
        if (!this.db) {
            this._initDb();
        }
        return this.db.getConds(conds);
    };
    BaseDao.prototype.startTrans = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query('START TRANSACTION')];
                    case 1:
                        result = _a.sent();
                        if (result === false) {
                            throw new GloError_1["default"]('start transaction query failed');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseDao.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query('COMMIT')];
                    case 1:
                        result = _a.sent();
                        if (result === false) {
                            throw new GloError_1["default"]('commit query failed ');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseDao.prototype.rollback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query('ROLLBACK')];
                    case 1:
                        result = _a.sent();
                        if (result === false) {
                            throw new GloError_1["default"]('rollback query faild ');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseDao.prototype.getIdStr = function (arrIds) {
        var _this = this;
        var newIds = [];
        arrIds.map(function (id) {
            id = ('' + id).trim();
            if (id.length > 0) {
                newIds.push(_this.addslashes(id));
            }
        });
        if (newIds.length === 0) {
            yalog_1["default"].warning('empty ids', { ids: arrIds.join(',') });
            return false;
        }
        return "'" + newIds.join("','") + "'";
    };
    BaseDao.prototype.addslashes = function (str) {
        str = str.replace(/(['"\\]|null)/ig, function (match) {
            return '\\' + match;
        });
        return str;
    };
    BaseDao.prototype.prevCheck = function () {
        var _this = this;
        if (!this.db) {
            this._initDb();
        }
        return new Promise(function (resolve, reject) {
            if (_this.db.isConnect) {
                resolve(true);
            }
            else {
                _this.db.reconnect(function (err) {
                    err ? reject(err) : resolve(true);
                });
            }
        });
    };
    BaseDao.prototype.releaseDb = function () {
        if (this.db) {
            this.db.end();
        }
    };
    return BaseDao;
}());
exports["default"] = BaseDao;
