declare enum LIST_TYPE {
    COM = 0,
    AND = 1,
    SET = 2,
}
export { LIST_TYPE };
declare class SQLAssember {
    db: any;
    constructor(db: any);
    getSelect(tables: any, fields: any, conds?: any, options?: any, appends?: any): string;
    getUpdate(table: any, row: any, conds: any, options: any, appends: any): string;
    getDelete(table: any, conds?: any, options?: any, appends?: any): string;
    getInsert(table: any, row: any, options?: any, onDup?: any): string;
    _makeUpdateOrDelete(table: any, row: any, conds: any, options: any, appends: any): string;
    getConds(conds: any): any;
    _makeList(list: any, type?: LIST_TYPE, cut?: string): string;
    _makeConds(conds: any): {};
    _isEmpty(value: any): boolean;
    _isInt(value: any): boolean;
}
export default SQLAssember;
