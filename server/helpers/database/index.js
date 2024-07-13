var config = require('../../config');
var mysql = require('mysql');
var pool = mysql.createPool(config.database);

var performQuery = function(sql, paramsArray, callback) {
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        //Check error
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        // make the query
        connection.query(sql, paramsArray, function(err, results) {
            // connection.release();
            connection.destroy()

            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            callback(false, results);
        });

    });

};

var performQueryPromise = function(sql, paramsArray) {


    //CREATE A PROMISE
    return new Promise(function(resolve, reject) {

        //QUERY
        // Try to connect to the database
        try {

            pool.getConnection(function(err, connection) {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                connection.query(sql, paramsArray, function(err, results) {
                    //Release connection
                    connection.release();
                    // connection.destroy()

                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }

                    resolve(results);
                });
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }

    });
};


var query = function(sql, paramsArray) {


    //CREATE A PROMISE
    return new Promise(function(resolve, reject) {

        //QUERY
        // Try to connect to the database
        try {

            pool.getConnection(function(err, connection) {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                connection.query(sql, paramsArray, function(err, results) {
                    //Release connection
                    connection.release();
                    // connection.destroy()

                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }

                    resolve(results);
                });
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }

    });
};

var getItem = function(sql, paramsArray) {

    //CREATE A PROMISE
    return new Promise(function(resolve, reject) {

        //QUERY
        // Try to connect to the database
        try {

            pool.getConnection(function(err, connection) {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                connection.query(sql, paramsArray, function(err, results) {

                    //Release connection
                    connection.release();


                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }

                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        reject('NO_ITEMS_FOUND');
                    }

                });
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }

    });
};

module.exports.performQuery = performQuery;
module.exports.performQueryPromise = performQueryPromise;
module.exports.query = query; //same as performQueryPromise
module.exports.getItem = getItem;
