const Sauce = require("../models/sauceModel");

/* creation de sauce.*/
exports.createSauce = (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    ...req.body,
  });
  Sauce.bulkSave()
    .then(() =>
      res.status(201).json({ message: "sauce created successfuly :)" })
    )
    .catch((error) => res.status(400).json({ error }));
};

/* Renvoie un tableau de toutes les sauces de la base de données.*/
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((newSauce) => res.status(200).json({ newSauce }))
    .catch((error) => res.status(400).json({ error }));
};
/* Renvoie un tableau d'un seul  sauces de la base de données.*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then((newSauce) => res.status(200).json({ newSauce }))
    .catch((error) => res.status(404).json({ error }));
};
