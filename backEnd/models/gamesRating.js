const db = require('../helpers/database');

//add a new rating record
exports.addRate = async function addRate (rating) {
    const query = "INSERT INTO gamesRating SET ?";
    const data = await db.run_query(query, rating);
    return data;
  }
  

//remove a rating record
exports.unrate = async function unrate (id, uid) {
  let query = "DELETE FROM gamesRating WHERE ID=?;";
  const result = await db.run_query(query, [id, uid]);
  return result;
}

//count the number of rates for a game
exports.count = async function count (id) {
  let query = "SELECT count(1) as rating FROM gamesRating WHERE gamesID=?;";
  const result = await db.run_query(query, [id]);
  return result[0].rating;
}

//get an individual rate
exports.getById = async function getById (id) {
  const query = "SELECT * FROM gamesRating WHERE ID = ?;";
  const data = await db.run_query(query, [id]);
  return data;
}

//get all rates on a given game
exports.getAll = async function getAll (gamesID) {
  const query = "SELECT * FROM gamesRating WHERE gamesID = ?;";
  const data = await db.run_query(query, [gamesID]);
  return data;
}