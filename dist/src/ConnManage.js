var DB_1 = require('./DB');
var ConnManage = (function () {
    function ConnManage() {
    }
    ConnManage.getConn = function (database, forceNew) {
        if (forceNew === void 0) { forceNew = false; }
        if (ConnManage.$_dbData[database] && !forceNew) {
            return ConnManage.$_dbData[database];
        }
        var config = ConnManage.$_dbConfig[database];
        if (!config) {
            throw new Error('invalid db config of ' + database);
        }
        ConnManage.$_dbData[database] = new DB_1["default"](config);
        return ConnManage.$_dbData[database];
    };
    ConnManage.addDbConfig = function (database, config) {
        config = Object.assign({}, ConnManage.$_defaultConfig, config);
        config.database = database;
        ConnManage.$_dbConfig[database] = config;
        return config;
    };
    ConnManage.$_dbData = {};
    ConnManage.$_dbConfig = {};
    ConnManage.$_defaultConfig = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        charset: 'utf8'
    };
    return ConnManage;
})();
exports["default"] = ConnManage;
