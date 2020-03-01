"use strict";
exports.__esModule = true;
var LIST_TYPE;
(function (LIST_TYPE) {
    LIST_TYPE[LIST_TYPE["COM"] = 0] = "COM";
    LIST_TYPE[LIST_TYPE["AND"] = 1] = "AND";
    LIST_TYPE[LIST_TYPE["SET"] = 2] = "SET";
})(LIST_TYPE || (LIST_TYPE = {}));
exports.LIST_TYPE = LIST_TYPE;
;
var SQLAssember = /** @class */ (function () {
    function SQLAssember(db) {
        this.db = db;
    }
    SQLAssember.prototype.getSelect = function (tables, fields, conds, options, appends) {
        if (conds === void 0) { conds = null; }
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        var sql = 'SELECT ';
        // 1.options
        if (options) {
            options = this._makeList(options, LIST_TYPE.COM, ' ');
            if (options.length === 0) {
                return null;
            }
            sql += options + " ";
        }
        // 2. fields
        fields = this._makeList(fields, LIST_TYPE.COM);
        if (fields.length === 0) {
            return null;
        }
        sql += fields + " FROM ";
        //3. from
        tables = this._makeList(tables, LIST_TYPE.COM);
        if (tables.length === 0) {
            return null;
        }
        sql += tables + " ";
        //4. conditions
        if (conds) {
            conds = this._makeConds(conds);
            conds = this._makeList(conds, LIST_TYPE.AND);
            if (conds.length === 0) {
                return null;
            }
            sql += "WHERE " + conds + " ";
        }
        //5. appends
        if (appends) {
            appends = this._makeList(appends, LIST_TYPE.COM, ' ');
            if (appends.length === 0) {
                return null;
            }
            sql += appends;
        }
        sql = sql.trim();
        return sql;
    };
    SQLAssember.prototype.getUpdate = function (table, row, conds, options, appends) {
        if (this._isEmpty(row)) {
            return null;
        }
        return this._makeUpdateOrDelete(table, row, conds, options, appends);
    };
    SQLAssember.prototype.getDelete = function (table, conds, options, appends) {
        if (conds === void 0) { conds = null; }
        if (options === void 0) { options = null; }
        if (appends === void 0) { appends = null; }
        return this._makeUpdateOrDelete(table, null, conds, options, appends);
    };
    SQLAssember.prototype.getInsert = function (table, row, options, onDup) {
        if (options === void 0) { options = null; }
        if (onDup === void 0) { onDup = null; }
        var sql = 'INSERT ';
        if (options) {
            options = this._makeList(options, LIST_TYPE.COM, ' ');
            sql += options + " ";
        }
        // table
        sql += table + " SET ";
        // columns and values
        row = this._makeList(row, LIST_TYPE.SET);
        if (row.length === 0) {
            return null;
        }
        sql += row;
        if (onDup) {
            sql += ' ON DUPLICATE KEY UPDATE ';
            onDup = this._makeList(onDup, LIST_TYPE.SET);
            if (onDup.length === 0) {
                return null;
            }
            sql += onDup;
        }
        return sql;
    };
    SQLAssember.prototype._makeUpdateOrDelete = function (table, row, conds, options, appends) {
        // 1. options
        var sql = '';
        if (options) {
            if (Array.isArray(Object.values(options))) {
                options = this._makeList(options, LIST_TYPE.COM, ' ');
            }
            sql = options;
        }
        else {
            options = '';
        }
        // 2. fields
        if (!row) {
            // delete
            sql = "DELETE " + options + " FROM " + table + " ";
        }
        else {
            sql = "UPDATE " + options + " " + table + " SET ";
            row = this._makeList(row, LIST_TYPE.SET);
            if (row.length === 0) {
                return null;
            }
            sql += row + " ";
        }
        // 3. conds
        if (conds) {
            conds = this._makeConds(conds);
            conds = this._makeList(conds, LIST_TYPE.AND);
            if (conds.length === 0) {
                return null;
            }
            sql += "WHERE " + conds + " ";
        }
        // 4. appends
        if (appends) {
            appends = this._makeList(appends, LIST_TYPE.COM, ' ');
            if (appends.length === 0) {
                return null;
            }
            sql += appends;
        }
        return sql;
    };
    SQLAssember.prototype.getConds = function (conds) {
        conds = this._makeConds(conds);
        conds = this._makeList(conds, LIST_TYPE.AND);
        return conds;
    };
    SQLAssember.prototype._makeList = function (list, type, cut) {
        var _this = this;
        if (type === void 0) { type = LIST_TYPE.SET; }
        if (cut === void 0) { cut = ', '; }
        if (typeof list === 'string') {
            return list;
        }
        var sql = '';
        //for set in insert and update
        if (type === LIST_TYPE.SET) {
            Object.entries(list).map(function (_a) {
                var name = _a[0], value = _a[1];
                if (_this._isInt(name)) {
                    sql += value + ", ";
                }
                else {
                    if (!_this._isInt(value)) {
                        if (value === null) {
                            value = 'NULL';
                        }
                        else {
                            value = _this.db.escape(value);
                        }
                    }
                    sql += name + "=" + value + ", ";
                }
            });
            sql = sql.substring(0, sql.length - 2);
        }
        else if (type === LIST_TYPE.AND) {
            // for where conds
            Object.entries(list).map(function (_a) {
                var name = _a[0], value = _a[1];
                if (_this._isInt(name)) {
                    sql += "(" + value + ") AND ";
                }
                else {
                    if (!_this._isInt(value)) {
                        if (value === null) {
                            value = 'NULL';
                        }
                        else {
                            value = _this.db.escape(value);
                        }
                    }
                    sql += "(" + name + " " + value + ") AND ";
                }
            });
            //trim and
            sql = sql.substring(0, sql.length - 5);
        }
        else {
            sql = Object.values(list).join(cut);
        }
        return sql;
    };
    SQLAssember.prototype._makeConds = function (conds) {
        var _this = this;
        if (typeof conds === 'string') {
            return conds;
        }
        var arrConds = {};
        var numberIndex = 0;
        Object.entries(conds).map(function (_a) {
            var key = _a[0], value = _a[1];
            if (Array.isArray(value)) {
                var num = value.length;
                if (num === 2) {
                    arrConds[key + " " + value[1]] = value[0];
                }
                else if (num === 4) {
                    arrConds[key + " " + value[1]] = value[0];
                    arrConds[key + " " + value[3]] = value[2];
                }
                else {
                    throw new Error('Unsupport SQL conds format, conds:' + JSON.stringify(conds));
                }
            }
            else if (_this._isInt(key) && (typeof value === 'string')) {
                arrConds[numberIndex++] = value;
            }
            else {
                arrConds[key + " ="] = value;
            }
        });
        return arrConds;
    };
    SQLAssember.prototype._isEmpty = function (value) {
        var ownKeys = Object.keys(value);
        return ownKeys.length === 0;
    };
    SQLAssember.prototype._isInt = function (value) {
        value = parseInt(value);
        return (typeof value === "number") && ((value | 0) === value);
    };
    return SQLAssember;
}());
exports["default"] = SQLAssember;
