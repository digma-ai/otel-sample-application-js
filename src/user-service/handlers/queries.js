const Pool = require('pg').Pool

const host = process.env.DB_HOST || 'localhost';
console.log('db host:', host);

const pool = new Pool({
  user: 'postgres',
  host,
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
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  return result.rows;
}

const getUser = async (id) => {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
    ORDER BY id ASC
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

// const createUser = async (id, name) => {
//   const result = await pool.myquery('INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *', [id, name])
//   if(result.error){
//     throw result.error;
//   }
//   return result.rows[0].id;
// } 

const createUser = async (id, name) => {
  try{
    const result = await pool.query('INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *', [id, name])
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
  getUser,
  createUser,
};
