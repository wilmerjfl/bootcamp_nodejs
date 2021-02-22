const logger = (req, res, next) => {
  req.hello = 'Hello World';
  next();
};
module.exports = logger;
