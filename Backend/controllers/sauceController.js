const Sauce = require("../models/sauceModel");
const fs = require("fs");
const { findOne } = require("../models/sauceModel");

/* creation de sauce.*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  newSauce
    .save()
    .then(() =>
      res.status(201).json({ message: "new sauce created successfuly" })
    )
    .catch((error) => res.status(400).json({ error }));
};

/* get array of all sauce.*/
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((allSauce) => res.status(200).json(allSauce))
    .catch((error) => res.status(400).json({ error }));
};

/* get one sauce .*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((onesauce) => res.status(200).json(onesauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  if (req.file) {
    /**delete last registred img if user load new img **/
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const lastImg = sauce.imageUrl.split("/images/")[1];
        fs.unlink("images/" + lastImg, () => {});
      })
      .catch((error) => console.log("Failed to delete old image!!"));
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "sauce updated !!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res
          .status(404)
          .json({ error: new Error("Object sauce not finded!!") });
      }

      /*
      if (sauce.userId !== req.auth.userId) {
        console.log("test 2");
        return res
          .status(401)
          .json({ error: new Error("request not authorized !!") });
      } */

      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "sauce deleted!!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.addLikeDislike = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersLiked: req.body.userId },
        $inc: { likes: req.body.like++ },
      }
    )
      .then(() => res.status(200).json({ message: "User Liked Sauce !!!" }))
      .catch((error) => res.status(400).json({ error }));
  }
  if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "User Disliked Sauce !!!" }))
      .catch((error) => res.status(400).json({ error }));
  }
  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //console.log(sauce.usersLiked.includes(req.body.userId));
        if (sauce.usersLiked.includes(req.body.userId)) {
          // console.log("user liked include user id ");
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          )
            .then(() =>
              res.status(200).json({ message: "User remove Like Sauce !!!" })
            )
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() =>
              res.status(200).json({ message: "User remove Dislike Sauce !!!" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }
};
