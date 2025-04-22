const { jwt } = require('./jwt');

function createSelfMiddleware() {
  if (process.env.MODE_TEST === 'true') {
    return [];
  }

  return [
    jwt,
    (req, res, next) => {
      const user = req.user;
      const { username } = req.params;

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (username !== user.username && user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    },
  ];
}

module.exports = { createSelfMiddleware };
