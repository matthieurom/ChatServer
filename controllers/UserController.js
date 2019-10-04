var User = require("../models/UserModel").default;
var Message = require("../models/MessageModel").default;
var Chat = require("../models/ChatModel").default;
var md5 = require("md5");
var jwt = require("jsonwebtoken");
var authorizeMiddleware = require("../services/authService")
  .authorizeMiddleware;

function userController(app) {
  app
    // Créer un user
    .post("/register", (req, res) => {
      newUser = new User({
        login: req.body.login,
        password: md5(req.body.password),
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });
      newUser.save();
      return res.json(newUser);
    })

    // Récupérer un user depuis son id
    .get("/user/:id", async (req, res) => {
      try {
        const query = User.where({ _id: req.params.id });
        const response = await query.findOne();
        if (!response) {
          throw new Error();
        }
        return res.json(response);
      } catch {
        return res.status(500).send("ERROR 500!!");
      }
    })

    // Récupérer le user courrant
    .get("/currentuser", authorizeMiddleware, async (req, res) => {
      try {
        console.log("user is:", req.user);
        res.json(req.user);
      } catch (e) {
        console.log(e);
        return res.status(500).send("ERROR 500 ?");
      }
    })

    //Générer un token depuis un utilisateur connu de la db
    .post("/login", (req, res) => {
      var query = User.where({
        login: req.body.login,
        password: md5(req.body.password)
      });
      query.findOne(function(err, user) {
        if (err) return res.status(500).send("Error 500");
        if (!user) {
          return res.status(404).send("Bad Request");
        } else {
          return res.send(jwt.sign({ _id: user._id }, "secret"));
        }
      });
    })

    // Récupérer les derniers chat consultés par le user
    .get("/user/current/lastchat", authorizeMiddleware, async (req, res) => {
      //   var query = Message.where({ user: req.userId });
      //   const messages = await query.find();
      //   console.log("messages is : ", messages);

      const chats = await Chat.aggregate([
        {
          $lookup: {
            from: "messages",
            let: { zeub: "$_id" },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$chat", "$$zeub"] } }
              },
              {
                $limit: 1
              },
              {
                $sort: { date: -1 }
              }
            ],
            as: "messages"
          }
        },
        {
          $addFields: {
            last_message: { $arrayElemAt: ["$messages", 0] }
          }
        },
        {
          $match: {
            "last_message.user": req.user._id
          }
        },
        {
          $sort: {
            "last_message.date": -1
          }
        },
        {
          $limit: 10
        }
      ]);

      console.log(chats);

      res.json(chats);
    });
}

exports.default = userController;
