
//Install express server
const app = require('./server/app');
const config = require('./server/config');
const logger = require('./server/helpers/logger')

app.listen(config.port, function() {
  logger.info(`Application - Running D2C Node API on port: ${config.port} in env: ${config.node_env} with database connection to database ${config.database.database}`);
});
