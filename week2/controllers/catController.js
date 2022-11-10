'use strict';
// catController
const {getAllCats, getCat, addCat, updateCat, deleteCat} = require('../models/catModel');
const {httpError} = require('../utils/errors');
const {validationResult} = require('express-validator');


const cat_list_get = async (req, res, next) => {
    const kissat = await getAllCats(next);
    res.json(kissat);
};

const cat_get = async (req, res, next) => {
    const cat = await getCat(req.params.id, next);
    if (cat.length > 0) {
        console.log('kissa', cat);
        res.json(cat.pop());
    } else {
        res.send("Virhe");
    }
};

const cat_post = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors.
        // Error messages can be returned in an array using `errors.array()`.
        console.error('cat_post validation', errors.array());
        next(httpError('Invalid data', 400));
        return;
    }
    const data = [
        req.body.name,
        req.body.birthdate,
        req.body.weight,
        req.body.owner,
        req.file.filename,
    ];
    const result = await addCat(data, next);
    if (result.affectedRows > 0) {
        res.json({
            message: 'cat added',
            cat_id: result.insertId,
        });

    } else {
        res.send('virhe');
    }
};
const cat_put = async (req, res, next) => {
    try {
        console.log('cat_put', req.body);
        const data = [
            req.body.name,
            req.body.birthdate,
            req.body.weight,
            req.body.owner,
            req.body.id,
        ];

        const result = await updateCat(data, next);
        if (result.affectedRows > 0) {
            res.json({
                message: 'cat modified',
            });
        } else {
            next(httpError('No cat modified', 400));
        }
    } catch (e) {
        console.error('cat_put', e.message);
        next(httpError('Invalid input', 400));
    }
};
const cat_delete = async (req, res, next) => {
    console.log('cat delete', req.params.id);
    const result = await deleteCat(req.params.id, next);
    if (result.affectedRows > 0) {
        res.json({
            message: 'cat deleted',
        });
    } else {
        res.send('virhe');
    }
};
module.exports = {
    cat_list_get,
    cat_get,
    cat_post,
    cat_put,
    cat_delete,
};