var mysql = require('mysql');

var connection = mysql.createConnection( {
    host: '172.16.2.104',
    user: 'root',
    password: '',
    database: 'mysql'
} );
connection.connect();
connection.query('SELECT * FROM user LIMIT 1', ( error, results, fields ) => {
    if ( error ) {
        throw error;
    }
});

connection.end();