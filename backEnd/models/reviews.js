const db = require('../helpers/database');

//get all reviews on a given game
exports.getAll = async function getAll (gamesID) {
  const query = "SELECT * FROM reviews WHERE gamesID = ?;";
  const data = await db.run_query(query, [gamesID]);
  return data;
}

//create a new reviews (must contain gamesID in reviews)
exports.add = async function add (review) {
  const query = "INSERT INTO reviews SET ?";
  const data = await db.run_query(query, review);
  return data;
}

//delete a specific review
exports.deleteById = async function deleteById (id) {
  const query = "DELETE FROM reviews WHERE ID = ?;";
  const data = await db.run_query(query, [id]);
  return data;
}

//get an individual review
exports.getById = async function getById (id) {
  const query = "SELECT * FROM reviews WHERE ID = ?;";
  const data = await db.run_query(query, [id]);
  return data;
}

//update a review in the database by ID
exports.update = async function update (id, reviews) {
  let query = "UPDATE reviews SET ? WHERE ID = ?";
  let values = [reviews, id];
  let data = await db.run_query(query, values);
  return data;
}