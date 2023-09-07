const db = require('../helpers/database');
//get a single user by its id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM games WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
//list all the games in the database
exports.getAll = async function getAll () {
    let query = "SELECT * FROM games;";
    let data = await db.run_query(query);
    return data;
}

//create a new game in the database
exports.add = async function add (game) {
    let query = "INSERT INTO games SET ?";
    let data = await db.run_query(query, game);
    return data;
}
//update a game in the database by ID
exports.update = async function update (id, games) {
    let query = "UPDATE games SET ? WHERE ID = ?";
    let values = [games, id];
    let data = await db.run_query(query, values);
    return data;
}
//delete a game by ID
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM games WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}