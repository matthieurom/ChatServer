var Message = require("../models/MessageModel").default;
var authorizeMiddleware = require("../services/authService")
  .authorizeMiddleware;

function messageController(app) {
  app
    // Créer un message
    .post("/messages", authorizeMiddleware, (req, res) => {
      newMessage = new Message({
        text: req.body.text,
        date: Date.now(),
        chat: req.body.chatId,
        user: req.userId
      });
      newMessage.save();
      return res.json(newMessage);
    })

    // Récupérer les messages d'un chat 
    .get("/messages/:id", authorizeMiddleware, async (req, res) => {
      let query = Message.where({ chat: req.params.id });
      const message = await query.find();
      if (!message) {
        return res.status(404).send("Bad Request, message undefined");
      }
      return res.json(message);
    });
}

exports.default = messageController;
