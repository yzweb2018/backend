const mysql = require('mysql')
const bcrypt = require('bcrypt');


var connection = mysql.createConnection({
  host: "127.0.0.1",
  database: "c9",
  user: "application",
  password: "apppw1"
});

exports.runAuthChecks = function(req, res) {
  return new Promise(function(resolve, reject){
    var auth = req.get("authorization")
    if(!auth){
      reject("No Headers")
    }
    var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
    var sql = "select password_hash from users where user_name = ?"
    connection.query(sql, [credentials[0]], function(err, data){
      if(err)throw err
      else if(!data[0]){
        console.log("argh")
        reject("User not found")
      } else {
        var match =  bcrypt.compareSync(credentials[1], data[0].password_hash);
        console.log("PW Match: " + match)
        if(match == true){
          resolve()
        } else {
          reject("Invalid User Password")
        }
      }
    })
  })
}

exports.logIn = function(req, res){
  module.exports.runAuthChecks(req, res).then(function(){
    res.status(200).send("Successfully logged in")
  }).catch(function(err){res.status(401).send(err)})
}