import SQLAssember from './SQLAssember';
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
    async: any;
}
export default DB;
