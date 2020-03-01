var _this = this;
var mysql = require('mysql');
var SQLAssember_1 = require('./SQLAssember');
var yalog_1 = require('@yadou/yalog');
var GloError_1 = require('./GloError');
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
var DB = (function () {
    function DB(config) {
        this.isConnect = false;
        this.async = select(tableName, string, fields, DbFields | string, conds, DbConds, options, DbOptions, appends, DbAppends);
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
    return DB;
})();
{
    var sql = this.assember.getSelect(tableName, fields, conds, options, appends);
    if (!sql) {
        return false;
    }
    var result = await;
    this.query(sql);
    return result;
}
selectSql(tableName, fields, conds, options = null, appends = null);
{
    return this.assember.getSelect(tableName, fields, conds, options, appends);
}
async;
insert(table, string, row, options = null, onDup = null);
{
    var sql = this.assember.getInsert(table, row, options, onDup);
    if (!sql) {
        return false;
    }
    var data = await;
    this.query(sql);
    if (!data) {
        return false;
    }
    this.lastInsertId = data.insertId;
    return data.affectedRows;
}
insertSql(table, row, options, onDup);
{
    return this.assember.getInsert(table, row, options, onDup);
}
async;
update(table, string, row, conds = null, options = null, appends = null);
{
    var sql = this.assember.getUpdate(table, row, conds, options, appends);
    if (!sql) {
        return false;
    }
    var data = await;
    this.query(sql);
    return data.affectedRows;
}
updateSql(table, row, conds, options, appends);
{
    return this.assember.getUpdate(table, row, conds, options, appends);
}
async;
delete (table);
string,
    conds,
    options,
    appends;
{
    // 删除必须要显示指定conds
    if (!conds) {
        throw new Error('DELETE NEED conds');
    }
    var sql = this.assember.getDelete(table, conds, options, appends);
    var data = await;
    this.query(sql);
    return data.affectedRows;
}
deleteSql(table, conds, options, appends);
{
    return this.assember.getDelete(table, conds, options, appends);
}
getLastSql();
{
    return this.lastSql;
}
getInsertId();
{
    return this.lastInsertId;
}
getAffectedRows();
{
    return this.lastAffectedRows;
}
query(sql);
{
    var logInfo = {
        host: this.config.host,
        port: this.config.port,
        db: this.config.database
    };
    this.lastSql = sql;
    var startTime = Date.now();
    var promise = new Promise(function (resolve, reject) {
        (_a = _this.mysql).query.apply(_a, [sql, function (error, results) {
            if (error) {
                var errorLog = "QUERY DB ERROR";
                var info_1 = {};
            }
        }].concat(logInfo, [code, error.code, message, error.message, sql, error.sql, mysql_error, error.sqlMessage]));
        var _a;
    });
    yalog_1["default"].warning(errorLog, info);
    resolve(false);
    return true;
}
this.lastAffectedRows = results.affectedRows || results.length;
var useTime = Date.now() - startTime;
var info = { logInfo: logInfo, use_time: useTime, affected_rows: this.lastAffectedRows, sql: sql };
yalog_1["default"].info('QUERY DB SUCCESS', info);
resolve(results);
return promise;
escape(value);
{
    return this.mysql.escape(value);
}
exports["default"] = DB;
