// Extra logger middleware stub for candidate to enhance
const chalk = require('chalk'); 

module.exports = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    let statusColor = chalk.white;
    if (status >= 500) statusColor = chalk.red;
    else if (status >= 400) statusColor = chalk.yellow;
    else if (status >= 300) statusColor = chalk.cyan;
    else if (status >= 200) statusColor = chalk.green;

    const log = `[${timestamp}] ${method} ${url} ${statusColor(status)} ${duration}ms`;

    console.log(log);


    if (Object.keys(req.body || {}).length) {
      console.log(chalk.gray('  Body:'), req.body);
    }

    if (Object.keys(req.query || {}).length) {
      console.log(chalk.gray('  Query:'), req.query);
    }
  });

  next();
};