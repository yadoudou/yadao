var _this = this;
var ConnManage_1 = require('./ConnManage');
var GloError_1 = require('./GloError');
var BaseDao = (function () {
    function BaseDao() {
        this.dbName = null;
        this.table = null;
        this.returnSql = false;
        this.async = getListByConds(fields, conds, options = null, appends = null);
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
    return BaseDao;
})();
{
    if (this.returnSql) {
        var sql = this.db.selectSql(this.table, fields, conds, options, appends);
        this.toggleSql(false);
        return sql;
    }
    await;
    this.prevCheck();
    var result = await;
    this.db.select(this.table, fields, conds, options, appends);
    if (false === result) {
        throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
    }
    return result;
}
async;
updateByConds(fields, conds, options = null, appends = null);
{
    if (this.returnSql) {
        var sql = this.db.updateSql(this.table, fields, conds, options, appends);
        this.toggleSql(false);
        return sql;
    }
    await;
    this.prevCheck();
    var result = await;
    this.db.update(this.table, fields, conds, options, appends);
    if (false === result) {
        throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
    }
    return result;
}
async;
deleteByConds(conds, options = null, appends = null);
{
    if (this.returnSql) {
        var sql = this.db.deleteSql(this.table, conds, options, appends);
        this.toggleSql(false);
        return sql;
    }
    await;
    this.prevCheck();
    var result = await;
    this.db.delete(this.table, conds, options, appends);
    if (false === result) {
        throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
    }
    return result;
}
async;
insertRecord(fields, options = null, onDup = null);
{
    if (this.returnSql) {
        var sql = this.db.insertSql(this.table, fields, options, onDup);
        this.toggleSql(false);
        return sql;
    }
    await;
    this.prevCheck();
    var result = await;
    this.db.insert(this.table, fields, options, onDup);
    if (false === result) {
        throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
    }
    var insertId = this.db.getInsertId();
    return insertId;
}
async;
getCntByConds(conds, options = null, appends = null);
{
    var fields = [
        'COUNT(*) AS _count_num'
    ];
    if (this.returnSql) {
        var sql = this.db.selectSql(this.table, fields, conds, options, appends);
        this.toggleSql(false);
        return sql;
    }
    await;
    this.prevCheck();
    var result = await;
    this.db.select(this.table, fields, conds, options, appends);
    if (false === result) {
        throw new GloError_1["default"](GloError_1["default"].ErrorCodes.QUERY_DB_ERROR);
    }
    var row = result[0];
    return row && row['_count_num'] || 0;
}
prevCheck();
{
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
}
releaseDb();
{
    if (this.db) {
        this.db.end();
    }
}
exports["default"] = BaseDao;
