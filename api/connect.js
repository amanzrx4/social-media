import * as mysql from 'mysql'


export const db = mysql.createConnection({
    host: "localhost",
    user: "amanS",
    password: "",
    database: "social"
})