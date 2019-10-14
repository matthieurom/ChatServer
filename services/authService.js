var jwt = require("jsonwebtoken");
var User = require("../models/UserModel").default;

async function authorize(req) {
  let tokenDecoded;
  let user;
  try {
    //Récupératon du token
    const token = req.headers.authorization.replace("Bearer ", "");
    //Vérfication du token en utilisant le code "secret" défini dans la création du token
    tokenDecoded = jwt.verify(token, "secret");
    const query = User.where({
      _id: tokenDecoded
    });
    //await permet d'attendre que findOne trouve un user correspondant au token
    user = await query.findOne();
    //Si user est undefined (token non correct ou l'_id ne correspond pas à une _id de la db) alors on throw une nouvelle error
    if (!user) {
      throw new Error();
    }
    //Si on catch un erreur on retourne false
  } catch (e) {
    return false;
  }
  //Everythink works
  req.user = user;
  req.userId = tokenDecoded; // on imbrique le token décodé dans userId
  return true;
}

const authorizeMiddleware = async (req, res, next) => {
  const isAuthorized = await authorize(req);
  if (!isAuthorized) {
    return res.status(403).send("Unauthorized");
  }

  next();
};

exports.authorizeMiddleware = authorizeMiddleware;
