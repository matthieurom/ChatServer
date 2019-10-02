"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Chat = require("./models/Chat");

var _Chat2 = _interopRequireDefault(_Chat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chatController(app) {
  app.post("/chat", function (req, res) {
    newChat = new _Chat2.default({
      name: req.body.name,
      description: req.body.description,
      category: req.body.description
    });
    newChat.save();
    return res.json(newChat);
  })

  // RECUPERER TOUTES LES TODO D'UN UTILISATEUR //
  .get("/todo", authorizeMiddleware, async function (req, res) {
    var query = User.where({ _id: req.userId }); // on récupère l'utilisateur concerné
    var user = await query.findOne();
    if (user) {
      return res.json(user.todos);
    } else {
      return res.status(404).send("Bad Request, undefined todo");
    }
  });
}

exports.default = chatController;