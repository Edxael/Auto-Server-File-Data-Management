// Conection and credentials to DataBase

require('dotenv/config')

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        database: 'My1App-Exp',
        user: process.env.PG_User,
        password: process.env.PG_Pass
    }
})

module.exports = knex