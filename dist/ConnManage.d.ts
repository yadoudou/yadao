import DB from './DB';
interface DbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database?: string;
    connectTimeout?: number;
    charset: string;
}
declare class ConnManage {
    private static $_dbData;
    private static $_dbConfig;
    private static $_defaultConfig;
    static getConn(database: string, forceNew?: boolean): DB;
    static addDbConfig(database: string, config: DbConfig): DbConfig;
}
export default ConnManage;
