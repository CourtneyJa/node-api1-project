// implement your API here
const db = require("./data/db");
const express = require("express");
const server = express();
server.listen(4000, () => {
  console.log("holla if you hear me");
});
server.use(express.json());