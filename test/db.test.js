var utils = require('./utils');
var assert = require('assert');
const ConnManage = utils.loadEsModule('ConnManage');
const BaseDao = utils.loadEsModule( 'BaseDao' );


//初始化DB配置
crmConfig = {
    host: '172.16.2.104',
    port: 3306,
    user: 'root',
    password: '',
}
ConnManage.addDbConfig( 'nodetest', crmConfig );


let db;
describe( 'mysql db test', () => {
    before( () => {
        db = ConnManage.getConn('nodetest');
        if ( !db ) {
            throw new Error('invalid db');
        }
    })

    after( () => {
        db.end();
    })

    it('connect db', (done) => {
        db.connect( ( err ) => {
            assert.ifError( err );
            done();
        })
    })
    it('select data', (done) => {
        let err = 'error';
        db.select(
            'test_table',
            ['id', 'user_name', 'create_time'],
            {
                id: 1
            },
            null,
            [ 'ORDER BY id DESC LIMIT 1' ]
        ).then( ( data ) => {
            assert.ok(Array.isArray(data));
            if ( data.length > 0 ) {
                data = data[ 0 ];
            } else {
                err = null;
                return true;
            }
            assert.equal( typeof data.user_name, 'string' );
            err = null;
        } ).catch( (error) => {
            err = error;
            assert.fail(error);
        } ).finally( () => {
            done(err);
        })
    });
    it('insert data', ( done ) => {
        let err = 'error';
        db.insert(
            'test_table',
            {
                user_name: 'test user',
                create_time: Math.floor( Date.now() / 1000 )
            }
        ).then( ( data ) => {
            err = null;
        }).finally( () => {
            done( err );
        } )
    })
    let insertId;
    it('get insert id', () => {
        let id = db.getInsertId();
        insertId = id;
        assert.equal( typeof id, 'number');
    } )
    it('update data', (done) => {
        let err = 'error';
        db.update(
            'test_table',
            {
                create_time: Math.floor( Date.now() / 1000 ),
                is_del: 'y'
            },
            {
                id: insertId            
            }
        ).then( ( data ) => {
            assert.equal( data, 1 );
            err = null;
        }).catch( (error) => {
           err = error;
        } ).finally( () => {
            done( err );
        })
    })
    it( 'delete data ', async () => {
        let data = await db.delete(
            'test_table',
            {
                id:insertId
            }
        );
        assert.equal( data, 1);
    } )
})

class TestTable extends BaseDao {
    constructor () {
        super();
        this.dbName = 'nodetest';
        this.table = 'test_table';
    }
}

describe( 'base dao db test', () => {
    let tableDao;
    before( () => {
        tableDao = new TestTable();
    })

    let insertId;
    let record = {
        user_name: 'userName' + Math.floor( Math.random() * ( 9999 - 1000) + 1000),
        create_time: Math.floor( Date.now() / 1000 )
    };
    it('insert', async () => {
        insertId = await tableDao.insertRecord(
            record
        );
        assert.equal( typeof insertId, 'number' );
    } )

    it('select', async ( ) => {
        let data = await tableDao.getListByConds(
            ['*'],
            {
                id: insertId
            },
            null,
            [
                'ORDER BY id DESC LIMIT 1'
            ]
        );
        assert.equal( data.length, 1 );
        assert.equal( data[ 0 ].id, insertId );
    } )

    it( 'getRecordByConds test', async () => {
        let data = await tableDao.getRecordByConds( ['*'], { id: insertId } );
        assert.equal( data.id, insertId );
    } )

    it('getListById test', async () => {
        let data = await tableDao.getListById( insertId, [ '*' ] );
        assert.equal( data.id, insertId );
    } )

    it('getTableFieldValue test', async () => {
        let data = await tableDao.getTableFieldValue( insertId, 'user_name' );
        assert.equal( data, record.user_name );
    })

    it('addAll test', async () => {
        let recordList = [
            { user_name: 'addAll1', create_time: Math.floor( ( new Date() ).getTime() / 1000 ) },
            { user_name: 'addAll2', create_time: Math.floor( ( new Date() ).getTime() / 1000 ) }
        ];
        let result = await tableDao.addAll( recordList );
        assert.equal( result.affectedRows, 2);
    } )

    it( 'save test', async () => {
        let saveRecord = { ...record, id: insertId };
        saveRecord.create_time = saveRecord.create_time + 10;
        let result = await tableDao.save( saveRecord );
        assert.equal( result, 1 );
    })

    it( 'getConds sql', () => {
        let conds = { id: 11, user_name: 'userName' };
        let sql = tableDao.getCondsSql( conds );
        assert.equal( sql, `(id = 11) AND (user_name = 'userName')`);
    } )

    it('update', async () => {
        let data = await tableDao.updateByConds(
            {
                is_del: 'y'
            },
            {
                id: insertId
            }
        );
        assert.equal( data, 1);
    } )

    it( 'delete', async () => {
        let data = await tableDao.deleteByConds(
            {
                id: insertId,
                is_del: 'y'
            }
        );
        assert.equal( data, 1);

        //查不到这个数据了
        let result = await tableDao.getListByConds(
            ['*'],
            {
                id: insertId
            }
        );
        assert.equal( result.length, 0 );
    })

    it ( 'get cnt', async () => {
        let data = await tableDao.getCntByConds(
            {
                id: insertId
            }
        );
        assert.equal(data, 0);
    })

    after( () => {
        tableDao.releaseDb();
    } )
} );