// ./models/catModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`SELECT wop_cat.cat_id, wop_cat.name, wop_cat.weight, wop_cat.owner, wop_cat.filename, wop_cat.birthdate, wop_user.name as ownername
                                                FROM wop_cat JOIN wop_user 
                                                ON wop_cat.owner = wop_user.user_id;`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getCat = async (catId) => {
  try {
    const [rows] = await promisePool.execute(`SELECT wop_cat.cat_id, wop_cat.name, wop_cat.weight, wop_cat.owner, wop_cat.filename, wop_cat.birthdate, wop_user.name as ownername
                                                FROM wop_cat JOIN wop_user 
                                                ON wop_cat.owner = wop_user.user_id
                                                WHERE cat_id = ?;`, [catId]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};
const addCat = async (data) => {
  try {
    const [rows] = await promisePool.execute(`INSERT INTO wop_cat (name, birthdate, weight, owner, filename) VALUES (?, ?, ?, ?, ?); `, data);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};
const updateCat = async (data) => {
  try {
    const [rows] = await promisePool.execute(`UPDATE wop_cat SET name = "${data[0]}", weight = "${data[2]}", owner = "${data[3]}", birthdate = "${data[1]}" WHERE wop_cat.cat_id = "${data[4]}";`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};
const deleteCat = async (catId) => {
  try {
    const [rows] = await promisePool.execute(`DELETE FROM wop_cat WHERE wop_cat.cat_id = "${catId}";`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};
module.exports = {
  getAllCats,
  getCat,
  addCat,
  updateCat,
  deleteCat,
};