import DB from './DB';
import ConnManage from './ConnManage';
import GloError from './GloError';
import Log from '@yadou/yalog';
import Utils from './Utils';

class BaseDao {
    dbName: string = null;
    table: string = null;
    db: DB;
    returnSql: boolean = false;

    _initDb () {
        // invalid dbName or table
        if ( !this.dbName || !this.table ) {
            throw new GloError( GloError.ErrorCodes.DB_TABLE_ERROR, {dbName: this.dbName, table: this.table});
        }
        this.db = ConnManage.getConn( this.dbName );
    }

    setTable ( table: string ) {
        this.table = table;
    }

    toggleSql( value: boolean ) {
        this.returnSql = value;
    }

    async getListByConds( fields, conds, options = null, appends = null ) {
        if ( this.returnSql ) {
            let sql = this.db.selectSql( this.table, fields, conds, options, appends );
            this.toggleSql( false );
            return sql;
        }
        await this.prevCheck();
        let result = await this.db.select( this.table, fields, conds, options, appends );
        if ( false === result ) {
            throw new GloError( GloError.ErrorCodes.QUERY_DB_ERROR );
        }
        return result;
    }

    async updateByConds( fields, conds, options = null, appends = null ) {
        if ( this.returnSql ) {
            let sql = this.db.updateSql( this.table, fields, conds, options, appends );
            this.toggleSql( false );
            return sql;
        }
        await this.prevCheck();
        let result = await this.db.update( this.table, fields, conds, options, appends );
        if ( false === result ) {
            throw new GloError( GloError.ErrorCodes.QUERY_DB_ERROR );
        }
        return result;
    }

    async deleteByConds( conds, options = null, appends = null ) {
        if ( this.returnSql ) {
            let sql = this.db.deleteSql( this.table, conds, options, appends );
            this.toggleSql( false );
            return sql;
        }
        await this.prevCheck();
        let result = await this.db.delete( this.table, conds, options, appends );
        if ( false === result ) {
            throw new GloError( GloError.ErrorCodes.QUERY_DB_ERROR );
        }
        return result;
    }

    async insertRecord( fields, options = null, onDup = null ) {
        if ( this.returnSql ) {
            let sql = this.db.insertSql( this.table, fields, options, onDup );
            this.toggleSql( false );
            return sql;
        }
        await this.prevCheck();
        let result = await this.db.insert( this.table, fields, options, onDup );
        if ( false === result ) {
            throw new GloError( GloError.ErrorCodes.QUERY_DB_ERROR );
        }
        let insertId = this.db.getInsertId();
        return insertId;
    }

    async getCntByConds( conds, options = null , appends = null ) {
        let fields = [
            'COUNT(*) AS _count_num'
        ];
        if ( this.returnSql ) {
            let sql = this.db.selectSql( this.table, fields, conds, options, appends );
            this.toggleSql( false );
            return sql;
        }
        await this.prevCheck();
        let result = await this.db.select( this.table, fields, conds, options, appends );
        if ( false === result ) {
            throw new GloError( GloError.ErrorCodes.QUERY_DB_ERROR );
        }
        let row = result[ 0 ];
        return row && row[ '_count_num' ] || 0; 
    }

    async getListById ( arrIds, fields, idKey = 'id' ) {
        let bolOneKey;
        if ( typeof arrIds === 'number' || typeof arrIds === 'string') {
            bolOneKey = ( '' + arrIds ).trim();
            arrIds = [ arrIds ];
        }
        let strIds = this.getIdStr( arrIds );
        if ( strIds === false ) {
            return [];
        }
        let conds = [ `${idKey} IN (${strIds})` ];
        if ( fields !== '*' && fields.indexOf( idKey ) === -1 && fields.indexOf( '*' ) === -1 ) {
            fields.push( idKey );
        }
        let arrList = await this.getListByConds( fields, conds );
        arrList = Utils.getMapFromList( ( arrList as [] ), idKey );
        if ( bolOneKey ) {
            return arrList[ bolOneKey ];
        }
        return arrList;
    }

    async getRecordByConds (fields, conds, options = null , appends = null ) {
        if ( !appends ) {
            appends = [ 'LIMIT 1' ];
        } else if ( appends.findIndex( ( append ) => { 
            append = ` ${append.toLowerCase()} `;
            return append.indexOf( ' limit ') > -1;
        } ) === -1 ) {
            appends.push( 'LIMIT 1' );
        }
        let arrList = await this.getListByConds( fields, conds, options, appends );
        if ( (<[]>arrList).length > 0 ) {
            return arrList[ 0 ];
        }
        return [];
    }

    async getTableFieldValue( arrIds, mapField, mapKey = 'id' ) {
        let arrList = await this.getListById( arrIds, [ mapField, mapKey ], mapKey );
        let type = typeof arrIds;
        if ( type === 'string' || type === 'number' ) {
            return arrList[ mapField ];
        }
        return Utils.getMapFieldValue( arrList, mapField, mapKey );
    }
    
    async add( record ) {
        return this.insertRecord( record );
    }

    async addAll ( arrList, onDump = null ) {
        if ( !Array.isArray( arrList ) || arrList.length === 0 ) {
            return false;
        }
        let arrData = [];
        let keys;
        arrList.map( ( record ) => {
            if ( !keys ) {
                keys = Object.keys( record ).map( ( key ) => `\`${key}\`` ).join( ',' );
            }
            let values = Object.values( record ).map( ( val ) => { 
                return this.db.escape( val ); 
            } )
            arrData.push( `(${values.join( ',' )})` )
        } )
        let sql = `INSERT INTO ${this.table} (${keys}) values ${arrData.join( ',' )}`;
        if ( onDump ) {
            sql += ` ${onDump}`;
        }
        let result = this.db.query( sql );
        if ( !result ) {
            throw new GloError( GloError.ErrorCodes.QUERY_DB_ERROR, { sql } );
        }
        return result;
    }

    async save ( record, key = 'id' ) {
        if ( !record[ key ] ) {
            throw new GloError( 'record has no key value' , { ...record, key } );
        }
        let conds = {
            [key]: record[ key ]
        }
        delete record[ key ];
        return this.updateByConds( record, conds );
    }

    getCondsSql ( conds ) {
        if ( !this.db ) {
            this._initDb();
        }
        return this.db.getConds( conds );
    }

    async startTrans () {
        let result = await this.db.query('START TRANSACTION');
        if ( result === false ) {
            throw new GloError( 'start transaction query failed');
        }
        return result;
    }
    async commit () {
        let result = await this.db.query('COMMIT');
        if ( result === false ) {
            throw new GloError( 'commit query failed ' );
        }
        return result;
    }

    async rollback () {
        let result = await this.db.query('ROLLBACK');
        if ( result === false ) {
            throw new GloError( 'rollback query faild ' );
        }
        return result;
    }

    getIdStr( arrIds ) {
        let newIds = [];
        arrIds.map( ( id ) => {
            id = ( '' + id ).trim();
            if ( id.length > 0 ) {
                newIds.push( this.addslashes( id ) );
            }
        })
        if ( newIds.length === 0 ) {
            Log.warning('empty ids', {ids: arrIds.join(',') } );
            return false;
        }
        return `'${newIds.join("','")}'`;
    }

    addslashes ( str ) {
        str = str.replace(/(['"\\]|null)/ig, function ( match ) {
            return '\\' + match;
        } )
        return str;
    }

    prevCheck () {
        if ( !this.db ) {
            this._initDb();
        }
        return new Promise( ( resolve, reject ) => {
            if ( this.db.isConnect ) {
                resolve( true );
            } else {
                this.db.reconnect( ( err ) => {
                    err ? reject( err ) : resolve( true );
                })
            }
        } );
    }    

    releaseDb () {
        if ( this.db ) {
            this.db.end();
        }
    }
}

export default BaseDao;