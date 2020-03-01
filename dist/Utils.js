"use strict";
exports.__esModule = true;
var yalog_1 = require("@yadou/yalog");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getMapFromList = function (arrList, mapKey) {
        var mapList = {};
        for (var key in arrList) {
            if (!arrList.hasOwnProperty(key)) {
                continue;
            }
            var record = arrList[key];
            if (!record[mapKey]) {
                yalog_1["default"].warning('record has no mapKey', { mapKey: mapKey });
                continue;
            }
            mapList[record[mapKey]] = record;
        }
        return mapList;
    };
    Utils.getFieldValue = function (arrList, mapKey, bolUnique) {
        if (bolUnique === void 0) { bolUnique = true; }
        var values = [];
        Object.values(arrList).map(function (record) {
            if (record[mapKey] !== undefined) {
                values.push(record[mapKey]);
            }
        });
        if (bolUnique) {
            var set = new Set(values);
            return set.values();
        }
        return values;
    };
    Utils.getFieldArray = function (arrList, mapKey) {
        var mapList = {};
        var mapKeyValue;
        Object.values(arrList).map(function (record) {
            mapKeyValue = record[mapKey];
            if (mapKeyValue === undefined) {
                return;
            }
            if (!mapList[mapKeyValue]) {
                mapList[mapKeyValue] = [];
            }
            mapList[mapKeyValue].push(record);
        });
        return mapList;
    };
    Utils.getMapFieldValue = function (arrList, mapField, mapKey) {
        if (mapKey === void 0) { mapKey = 'id'; }
        var mapValue = {};
        Object.values(arrList).map(function (record) {
            if (record[mapKey] !== undefined && record[mapField] !== undefined) {
                mapValue[record[mapKey]] = record[mapField];
            }
        });
        return mapValue;
    };
    return Utils;
}());
exports["default"] = Utils;
