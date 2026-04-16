import sql from 'mssql/msnodesqlv8.js'

const config = {
    server: 'KRAZE\\SQLEXPRESS',
    database: 'factorysync',
    driver: 'msnodesqlv8',
    connectionString: 'DSN=abc;Trusted_Connection=Yes;',
    options: {
        trustedConnection: true
    }
}

let pool;

export async function connectDB() {
    try {
        pool = await sql.connect(config)
    console.log('Connected with WIndows Auth')
    } catch(e) {
        console.log(e)
    }
}

export function getPool() {
    return pool
}