const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userMdel");

exports.singup = (req, res, next) => {
  /** haché le mot de passe avec bcrypt.hash() **/

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur créé !!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "user not finded" });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json({ message: "password is incorrect" });
          }
          const newToken = jwt.sign(
            { userId: user._id },
            "RANDOM_TOKEN_SECRET",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            userId: user._id,
            token: newToken,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
