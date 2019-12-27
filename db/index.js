const { Pool } = require('pg')
const connectionString = 'postgresql://postgres:password@localhost:5432/recipebuilder'
const pool = new Pool({
    connectionString: connectionString,
})
module.exports = {
    query: (text, params) => pool.query(text, params),
}