'use strict';
// catController
const {getAllUsers, getUser} = require('../models/userModel');

const user_list_get = async (req, res) => {
    const kayttajat = await getAllUsers();
    res.json(kayttajat);
};

const user_get = async (req, res) => {
    const user = await getUser(req.params.id);
    delete user.password;
    if(user.length > 0) {
        console.log('käyttäjä', user);
        res.json(user.pop());
    }
    else {
        res.send("Virhe");
    }};

const user_post = (req, res) => {
    console.log(req.body);
    res.send("Add user route");
};
module.exports = {
    user_list_get,
    user_get,
    user_post,
};