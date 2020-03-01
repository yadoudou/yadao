import DB from './DB';



interface DbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database ?: string;
    connectTimeout ?: number;
    charset: string;
}

interface DbConfigData {
    [database: string]: DbConfig;
}

interface DbData  {
    [database: string]: DB
}

class ConnManage {
    private static $_dbData: DbData = {};
    private static $_dbConfig: DbConfigData = {};
    private static $_defaultConfig: DbConfig = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        charset: 'utf8'
    };
    static getConn( database: string, forceNew: boolean = false ) {
        if ( ConnManage.$_dbData[ database ] && !forceNew ) {
            return ConnManage.$_dbData[ database ];
        }
        let config = ConnManage.$_dbConfig[ database ];
        if ( !config ) {
            throw new Error('invalid db config of '+ database );
        }
        ConnManage.$_dbData[ database ] = new DB( config );
        return ConnManage.$_dbData[ database ];
    }

    static addDbConfig( database: string, config: DbConfig ) {
        config = Object.assign({}, ConnManage.$_defaultConfig, config );
        config.database = database;
        ConnManage.$_dbConfig[ database ] = config;
        return config;
    }
}

export default ConnManage;