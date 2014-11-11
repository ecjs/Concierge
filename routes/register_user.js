module.exports = function(app) {
  app.get('/user', function(req, res) {
    res.send('user');
  });
  app.post('/user', function(req, res) {
    res.json(req.body);
  });
};
