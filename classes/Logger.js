require("colors");

class Logger {
  constructor() {}

  log(str) {
    console.log(`[${new Date().toLocaleString()}] ${str}`.white);
  }

  success(str) {
    console.log(`✅ [${new Date().toLocaleString()}] ${str}`.green);
  }

  warn(str) {
    console.log(`⚠️  [${new Date().toLocaleString()}] ${str}`.yellow);
  }

  error(str) {
    console.log(`❌ [${new Date().toLocaleString()}] ${str}`.red);
  }
}

module.exports = Logger;