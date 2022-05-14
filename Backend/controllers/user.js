const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.singup = (req, res, next) => {
  /** haché le mot de passe avec bcrypt.hash() **/
  console.log(req.body);
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
