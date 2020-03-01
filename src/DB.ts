const mysql = require('mysql');
import SQLAssember from './SQLAssember';
import Log from '@yadou/yalog';
import GloError from './GloError';

interface DbFields {
    [fieldName: number]: string;
};
interface DbConds {
    [key: string]: string;
};
interface DbOptions {
    [key: string]: string;
};
interface DbAppends {
    [key: string]: string;
};

enum FETCH_TYPE  {
    ROW = 1,
    ASSOC = 2
};

class DB {
    mysql: any;
    assember: SQLAssember;
    lastSql: string;
    lastInsertId: number;
    lastAffectedRows: number;
    config;
    isConnect = false;
    constructor( config ) {
        this.config = config;
        this.mysql = mysql.createConnection(config);
        this.assember = new SQLAssember(this);
    }

    connect ( callback = null ) {
        let origCallback = callback;
        callback = (err) => {
            if ( err ) {
                throw new GloError(GloError.ErrorCodes.CONNECT_DB_ERROR, {code: err.code, message: err.message});
            }
            this.isConnect = true;
            origCallback && origCallback( err );    
        }
        return this.mysql.connect( callback );
    }

    end ( callback = null ) {
        let origCallback = callback;
        callback = (err) => {
            if ( !err ) {
                this.isConnect = false;
            } else {
                // 释放不抛Error
                Log.warning('END DB ERROR', { code: err.code, message: err.message } );
            }
            origCallback && origCallback( err );
        }
        return this.mysql.end( callback );
    }

    reconnect( callback = null ) {
        this.mysql = mysql.createConnection( this.config );
        return this.connect( callback );
    }

    call ( method, args ) {
        return this.mysql[method](args);
    }

    async select ( 
        tableName: string, 
        fields: DbFields | string, 
        conds: DbConds, 
        options: DbOptions, 
        appends: DbAppends ) {
        let sql = this.assember.getSelect( tableName, fields, conds, options, appends );
        if ( !sql ) {
            return false;
        }
        let result = await this.query( sql );
        return result;
    }

    selectSql ( tableName, fields, conds, options = null, appends = null ) {
        return this.assember.getSelect( tableName, fields, conds, options, appends );
    }

    async insert (
        table: string,
        row,
        options = null,
        onDup = null
    ) {
        let sql = this.assember.getInsert( table, row, options, onDup );
        if ( !sql ) {
            return false;
        }
        let data: any = await this.query( sql );
        if ( !data ) {
            return false;
        }
        this.lastInsertId = data.insertId;
        return data.affectedRows;
    }

    insertSql ( table, row, options, onDup ) {
        return this.assember.getInsert( table, row, options, onDup );
    }

    async update (
        table: string,
        row,
        conds = null,
        options = null,
        appends = null
    ) {
        let sql = this.assember.getUpdate( table, row, conds, options, appends );
        if ( !sql ) {
            return false;
        }
        let data: any = await this.query( sql );
        return data.affectedRows;
    }

    updateSql ( table, row, conds, options, appends ) {
        return this.assember.getUpdate( table, row, conds, options, appends );
    }

    async delete (
        table: string,
        conds,
        options,
        appends
    ) {
        // 删除必须要显示指定conds
        if ( !conds ) {
            throw new Error('DELETE NEED conds');
        }
        let sql = this.assember.getDelete( table, conds, options, appends );
        let data: any = await this.query( sql );
        return data.affectedRows;
    }

    deleteSql ( table, conds, options, appends ) {
        return this.assember.getDelete( table, conds, options, appends );
    }

    getConds ( conds ) {
        return this.assember.getConds( conds );
    }

    getLastSql() {
        return this.lastSql;
    }

    getInsertId () {
        return this.lastInsertId;
    }

    getAffectedRows () {
        return this.lastAffectedRows;
    }

    query ( sql) {
        let logInfo = {
            host: this.config.host,
            port: this.config.port,
            db: this.config.database
        };
        this.lastSql = sql;
        let startTime = Date.now();
        let promise = new Promise((resolve, reject) => {
            this.mysql.query(sql, ( error, results ) => {
                if ( error ) {
                    let errorLog = `QUERY DB ERROR`;
                    let info = { ...logInfo, code: error.code, message: error.message, sql: error.sql, mysql_error: error.sqlMessage };
                    Log.warning( errorLog, info );
                    resolve( false );
                    return true;
                }
                this.lastAffectedRows = results.affectedRows || results.length;
                if ( results.insertId ) {
                    this.lastInsertId = results.insertId;
                }
                let useTime = Date.now() - startTime;
                let info = { ...logInfo, use_time: useTime, affected_rows: this.lastAffectedRows, sql: sql };
                Log.info('QUERY DB SUCCESS', info );
                resolve( results);
            })
        })
        return promise;
    }

    escape ( value ) {
        return this.mysql.escape( value );
    }

}

export default DB;