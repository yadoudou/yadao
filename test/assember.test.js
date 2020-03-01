var utils = require('./utils');
const SQLAssember = utils.loadEsModule('SQLAssember');
const assert = require('assert');
class DB  {
    escape ( str ) {
        return `'${str}'`;
    }
}
var assember = new SQLAssember( new DB() );

describe('SQL Assember Test', () => {
    let nowTime = Math.floor( Date.now() / 1000 )
    it('get SELECT SQL', () => {
        let sql = `SELECT id, name, grade FROM user WHERE (uid > 1000) AND (create_time >= 1000) AND (create_time <= 2000) AND (name LIKE '%user%') AND (is_del = 'n') ORDER BY id DESC LIMIT 1000,100`;
        let assemberSql = assember.getSelect(
            'user',
            ['id', 'name', 'grade'],
            {
                uid: [ 1000, '>'],
                create_time: [ 1000, '>=', 2000, '<=' ],
                name: [ '%user%', 'LIKE'],
                is_del: 'n'
            },
            null,
            [
                'ORDER BY id DESC',
                'LIMIT 1000,100'
            ]
        )
        assert.equal(sql, assemberSql);
    })
    it('get INSERT SQL', () => {       
        let sql = `INSERT user SET is_del='n', create_time=${nowTime}, name='username' ON DUPLICATE KEY UPDATE create_time=${nowTime}`;
        let assemberSql = assember.getInsert(
            'user',
            {
                is_del: 'n',
                create_time: nowTime,
                name: 'username'
            },
            null,
            {
                create_time: nowTime
            }
        );
        assert.equal( sql, assemberSql );
    })
    it('get UPDATE SQL', () => {
        let sql = `UPDATE  user SET is_del='y', update_time=${nowTime} WHERE (create_time < unix_timestamp('2018-08-08')) AND (is_del = 'n') ORDER BY id DESC LIMIT 10`;
        let assemberSql = assember.getUpdate(
            'user',
            {
                is_del: 'y',
                update_time: nowTime,
            },
            {
                0: "create_time < unix_timestamp('2018-08-08')",
                is_del: 'n'
            },
            null,
            [
                'ORDER BY id DESC',
                'LIMIT 10'
            ]
        );
        assert.equal( sql, assemberSql );
    })
    it('get DELETE SQL', () => {
        let limitTime = nowTime - 3600 * 24 * 30;
        let sql = `DELETE  FROM user WHERE (is_del = 'y') AND (update_time > ${limitTime}) ORDER BY id DESC LIMIT 100`;
        let assemberSql = assember.getDelete(
            'user',
            {
                is_del: 'y',
                update_time: [ limitTime, '>' ]
            },
            null,
            [
                'ORDER BY id DESC',
                'LIMIT 100'
            ]
        );
        assert.equal( sql, assemberSql );
    })
} )