var express = require("express"),
  app = express(),
  redis = require("redis"),
  client = redis.createClient(),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
  client.SMEMBERS("students", function(err, pupils) {
    res.render("index", {students: pupils});
  });
});

app.post("/create", function(req, res){
  client.SADD("students", req.body.name);
  res.redirect("/");
});

app.delete("/remove", function(req, res){
  client.del("students");
  res.redirect("/");
});

app.listen(3000, function(){
  console.log("Server startin on port 3000");
});