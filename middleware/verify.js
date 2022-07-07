const jwt = require("jsonwebtoken");

/**
 * verify that user is logged in
 */
function verify(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);
  try {
    //console.log("This is decoded \n\n\n", "");
    const decoded = jwt.verify(
      authorization.split(" ")[1],
      process.env.ACCESS_TOKEN_KEY
    );
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

exports.verify = verify;
