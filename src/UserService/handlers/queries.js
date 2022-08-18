const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'postgres',
  port: 5432,
})   
  
const originalPoolQuery = Pool.prototype.query;
Pool.prototype.myquery = async function query(...args) {
    try {
        return await originalPoolQuery.apply(this, args);
    } catch (e) {
        // All magic is here. new Error will generate new stack, but message will copyid from e
        throw new Error(e)
    }
} 

const getUsers = async () => {
  var result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  return result.rows;
}

// const createUser = async (id, name) => {
//   var result = await pool.myquery('INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *', [id, name])
//   if(result.error){
//     throw result.error;
//   }
//   return result.rows[0].id;
// } 

const createUser = async (id, name) => {
  try{
    var result = await pool.query('INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *', [id, name])
    if(result.error){
      throw result.error;
    }
    return result.rows[0].id;
  }
  catch(err){
    throw new Error(err)
  }

  
}

module.exports = {
    getUsers,
    createUser
  }