import DB from './DB';
declare class BaseDao {
    dbName: string;
    table: string;
    db: DB;
    returnSql: boolean;
    _initDb(): void;
    setTable(table: string): void;
    toggleSql(value: boolean): void;
    async: any;
}
export default BaseDao;
