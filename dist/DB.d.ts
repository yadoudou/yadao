import SQLAssember from './SQLAssember';
interface DbFields {
    [fieldName: number]: string;
}
interface DbConds {
    [key: string]: string;
}
interface DbOptions {
    [key: string]: string;
}
interface DbAppends {
    [key: string]: string;
}
declare class DB {
    mysql: any;
    assember: SQLAssember;
    lastSql: string;
    lastInsertId: number;
    lastAffectedRows: number;
    config: any;
    isConnect: boolean;
    constructor(config: any);
    connect(callback?: any): any;
    end(callback?: any): any;
    reconnect(callback?: any): any;
    call(method: any, args: any): any;
    select(tableName: string, fields: DbFields | string, conds: DbConds, options: DbOptions, appends: DbAppends): Promise<unknown>;
    selectSql(tableName: any, fields: any, conds: any, options?: any, appends?: any): string;
    insert(table: string, row: any, options?: any, onDup?: any): Promise<any>;
    insertSql(table: any, row: any, options: any, onDup: any): string;
    update(table: string, row: any, conds?: any, options?: any, appends?: any): Promise<any>;
    updateSql(table: any, row: any, conds: any, options: any, appends: any): string;
    delete(table: string, conds: any, options: any, appends: any): Promise<any>;
    deleteSql(table: any, conds: any, options: any, appends: any): string;
    getConds(conds: any): any;
    getLastSql(): string;
    getInsertId(): number;
    getAffectedRows(): number;
    query(sql: any): Promise<unknown>;
    escape(value: any): any;
}
export default DB;
