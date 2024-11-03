const { Pool } = require('pg');
const pool = new Pool({
    user: 'andrecompanygianesi',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'password123',
    port: 5432,
});

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = {
    query,
    end: () => pool.end()
};