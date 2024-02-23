const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const logEvents = async (message, fileName) => {
  if (!fs.existsSync(path.join(__dirname, '..', "logs"))) {
    await fsPromise.mkdir(path.join(__dirname, '..', "logs"));
  }
  
  const dateTime = `${format(new Date(), "MM/dd/yyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    await fsPromise.appendFile(
      path.join(__dirname, "logs", '..', fileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requestLog.txt')
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = {logger, logEvents};
