const db = require('../helpers/database');
const bcrypt = require('bcrypt');
//get a single user by its id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
//list all the users in the database
exports.getAll = async function getAll () {
    let query = "SELECT * FROM users;";
    let data = await db.run_query(query);
    return data;
}

//create a new user in the database
exports.add = async function add (user) {
  const query = "INSERT INTO users SET ?";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  console.log(hash);
  const data = await db.run_query(query, user);
  return data;
}

//update an existing user
exports.update = async function update (user) {
  const query = "UPDATE users SET ? WHERE ID = ?;";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const values = [user, user.ID];
  const data = await db.run_query(query, values);
  return data;
}
//delete an user by ID
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

//get a single user by the (unique) username
exports.findByUsername = async function getByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?;";
    const user = await db.run_query(query, username);
    return user;
    }