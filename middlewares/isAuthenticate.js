const jwt = require('jsonwebtoken');
module.exports = function isAuthenticate(req, res, next){
  
  const token = req.header('Authorization').replace('Bearer ', '')
  if (token == null) return res.sendStatus(401)
  console.log(token);
   jwt.verify(token, 'fu', (err,decode) => {
          if (err){
            console.log(err);
            return res.sendStatus(403);
          }
          req.user = decode;
          console.log(` ${JSON.stringify(req.user.id)}`);
          next();
      });
}