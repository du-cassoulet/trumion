const { default: chalk } = require("chalk");

class Logger {
  constructor() {}

  log(str) {
    console.log(chalk.white(`✔️  [${new Date().toLocaleString()}] ${str}`));
  }

  success(str) {
    console.log(chalk.green(`✅ [${new Date().toLocaleString()}] ${str}`));
  }

  warn(str) {
    console.log(chalk.yellow(`⚠️  [${new Date().toLocaleString()}] ${str}`));
  }

  error(str) {
    console.log(chalk.red(`❌ [${new Date().toLocaleString()}] ${str}`));
  }
}

module.exports = Logger;