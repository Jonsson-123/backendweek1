// ./models/catModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const getAllCats = async (next) => {
  try {
    const [rows] = await promisePool.execute(`SELECT wop_cat.cat_id, wop_cat.name, wop_cat.weight, wop_cat.owner, wop_cat.filename, wop_cat.birthdate, wop_user.name as ownername
                                                FROM wop_cat JOIN wop_user 
                                                ON wop_cat.owner = wop_user.user_id;`);
    return rows;
  } catch (e) {
    console.error('getAllCats', e.message);
    next(httpError('Database error', 500));
  }
};

const getCat = async (catId, next) => {
  try {
    const [rows] = await promisePool.execute(`SELECT wop_cat.cat_id, wop_cat.name, wop_cat.weight, wop_cat.owner, wop_cat.filename, wop_cat.birthdate, wop_user.name as ownername
                                                FROM wop_cat JOIN wop_user 
                                                ON wop_cat.owner = wop_user.user_id
                                                WHERE cat_id = ?;`, [catId]);
    return rows;
  } catch (e) {
    console.error('getCat', e.message);
    next(httpError('Database error', 500));
  }
};

const addCat = async (data, next) => {
  try {
    const [rows] = await promisePool.execute(`INSERT INTO wop_cat (name, birthdate, weight, owner, filename) VALUES (?, ?, ?, ?, ?); `, data);
    return rows;
  } catch (e) {
    console.error('addCat', e.message);
    next(httpError('Database error', 500));

  }
};
/*
const updateCat = async (data) => {
  try {
    const [rows] = await promisePool.execute(`UPDATE wop_cat SET name = "${data[0]}", weight = "${data[2]}", owner = "${data[3]}", birthdate = "${data[1]}" WHERE wop_cat.cat_id = "${data[4]}";`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

 */
const deleteCat = async (catId, user, next) => {
  try {
    let sql = 'DELETE FROM wop_cat WHERE cat_id = ?';
    const params = [];
    if (user.role === 0 ) {
      sql += ';'
      params.push(catId);
    } else {
      sql += ' AND owner = ?;';
      params.push(catId, user.user_id);
    }
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('deleteCat', e.message);
    next(httpError('Database error', 500));
  }
};
const updateCat = async (data, next) => {
  try {
    const [rows] = await promisePool.execute(`UPDATE wop_cat set name = ?, birthdate = ?,  weight = ?, owner = ? WHERE cat_id = ? AND owner = ?; `, data);
    return rows;
  } catch (e) {
    console.error('updateCat', e.message);
    next(httpError('Database error', 500));
  }
};
module.exports = {
  getAllCats,
  getCat,
  addCat,
  updateCat,
  deleteCat,
};