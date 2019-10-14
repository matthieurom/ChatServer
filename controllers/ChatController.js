var Chat = require("../models/ChatModel").default;

function chatController(app) {
  app
    // Créer un chat
    .post("/chat", (req, res) => {
      const newChat = new Chat({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category
      });
      newChat.save();
      return res.json(newChat);
    })

    // Récupérer un chat
    .get("/chat/:id", async (req, res) => {
      try {
        const query = Chat.where({ _id: req.params.id });
        const response = await query.findOne();
        if (!response) {
          throw new Error();
        }
        return res.json(response);
      } catch (e) {
        return res.status(500).send("ERROR 500");
      }
    })

    // Récupérer tous les chat
    .get("/chat", async (req, res) => {
      const chats = await Chat.find();
      res.json(chats);
    });
}

exports.default = chatController;
