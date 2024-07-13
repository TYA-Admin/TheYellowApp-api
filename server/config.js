var config = {};

//Port Number
config.port = process.env.PORT || 3000

// ENVs are dev, staging, prod
config.node_env = process.env.ENV || 'dev'

config.jwtSecret = process.env.JWT_SECRET;

config.database = {
    //  connectionLimit - the connectionLimit is the number of max connections in a pool.
    // This number cannot exceed  AWS  micro instance database (66 connections) max connections  (show variables like 'max_connections'),
    // We will set the connectionLimit equal to AWS RDS parameters
    connectionLimit: 50, //important
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    //If we reach connection limit, put the conection in a queue and wait for 10 seconds
    waitForConnections: true,
    multipleStatements: true,
    debug: false,
    // 'Z' stands for Zulu time, which is equivalent to UTC
    timezone: 'Z'
  };

//Export Modules
module.exports = config;
