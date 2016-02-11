require("babel/register");
var dotenv = require('dotenv');
dotenv.load();

var HayEquiBot = require("./lib");

HayEquiBot.run();
