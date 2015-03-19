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
  client.SMEMBERS("students", function(err, students) {
    res.render("index", {students: students});
  });
});

//create a student
app.post("/create", function(req, res){
  client.SADD("students", req.body.name);
  res.redirect("/");
});

//remove all students
app.delete("/remove", function(req, res){
  client.del("students");
  res.redirect("/");
});

//remove specific student
app.delete("/remove/:student", function(req, res){
  client.SMEMBERS("students", function(err, students){
    students.forEach(function(student){
      if(req.params.student === student){
        client.SREM("students", student);
        res.redirect("/");
      }
    });
  });
});

//start server
app.listen(3000, function(){
  console.log("Server startin on port 3000");
});