var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');

/**
* Get all users.
*/
router.route('/users')
    .get(function(req, res) {
        var query = `SELECT
                         users.name,
                         COUNT(*) AS points
                     FROM points
                     JOIN users
                         ON points.userId = users.id
                         GROUP BY users.id;`;
        global.connection.query(query, function (error, results, fields) {
            if (error) throw error;
            res.send(JSON.stringify(results));
        });
    });

/**
* Get user info.
*/
/*
router.route('/users/:id')
    .get(function(req, res) {
        var query = `SELECT
                       users.name,
                       COUNT(*) AS points
                     FROM points
                     JOIN users
                       ON points.userId = users.id
                       GROUP BY users.id;`;

        global.connection.query(query, function (error, results, fields) {
            if (error) throw error;
            res.send(JSON.stringify(results));
        });
    });
*/

/**
* Give user a point.
*/
router.route('/users/:id/add_point')
    .put(function(req, res) {
        var query = `INSERT INTO
                     points (userId, added, deleted)
                     VALUES (${mysql.escape(req.params.id)}, CURRENT_TIMESTAMP(), false)`;
        global.connection.query(query, function (error, results, fields) {
            if (error) throw error;
            res.send({"success": 1});
        });
    });

/** 
* Create new user.
*/
router.route('/users/create')
    .post(function(req,res) {
        var query = `INSERT INTO 
                     users (name, added) 
                     VALUES ("${mysql.escape(req.body.name)}", CURRENT_TIMESTAMP())`;
        global.connection.query(query, function (error, results, fields) {
            if (error) throw error;
            res.send({"userId": results.insertId});
        });
    });


module.exports = router;
