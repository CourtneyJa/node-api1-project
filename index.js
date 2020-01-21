// implement your API here
const db = require("./data/db.js");
const express = require("express");
const server = express();
server.listen(4000, () => {
  console.log("*** listening on port 4000");
});
server.use(express.json());

server.get("/", (req, res) => {
  res.send("holla if you hear me");
});

//post req to create user w/ error message if no name or bio
server.post("/api/users", (req, res) => {
  const dbInfo = req.body;

  if (!dbInfo.name || !dbInfo.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  } else {
    db.insert(dbInfo)
      .then(users => {
        db.findById(users.id)
          .then(user => {
            res.status(201).json(user);
          })
          .catch(err => {
            res.status(500).json({
              errorMessage:
                "There was an error while saving the user to the database",
              err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database",
          err
        });
      });
  }
});

//get req to retrieve all users w/standard retrieval error
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved" });
    });
});

//get req for user by ID  w/ id not found and standard error
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const dbInfo = req.body;

  db.findById(id, dbInfo)
    .then(user => {
      if (!user) {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist"
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved" });
    });
});

//delete req that removes user by id w/standard error and error finding user ID match

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const dbInfo = req.body;

  db.findById(id, dbInfo)
    .then(user => {
      if (!user) {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist"
        });
      } else {
        db.remove(dbInfo).then(users => {
          db.findById(users.id)
            .then(user => {
              res.status(201).json(user);
            })
            .catch(err => {
              res.status(500).json({
                errorMessage:
                  "There was an error while saving the user to the database",
                err
              });
            });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

//put req that updates a specified user by ID - does not update the original

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const dbInfo = req.body;

  db.findById(id, dbInfo)
    .then(user => {
      if (!dbInfo.name || !dbInfo.bio) {
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user" });
      } else if (!id) {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist"
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be modified" });
    });
});
