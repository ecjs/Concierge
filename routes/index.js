module.exports = function(app) {
  app.get('/', jwtauth, function(req, res) {
    res.send('index');
  });
};
