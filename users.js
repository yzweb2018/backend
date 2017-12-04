const mysql = require('mysql')
const bcrypt = require('bcrypt')

const auth = require('../authorization.js')

var connection = mysql.createConnection({
  host: "127.0.0.1",
  database: "c9",
  user: "application",
  password: "apppw1"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Users API connected to c9 database.")
});

exports.register = function(req, res) {
  var sql = "select user_name from users where user_name = ?;"
  console.log(sql)
  connection.query(sql, [req.body.user_name], function(err, data){
    if (err) throw err
    console.log(data.length)
    if (data.length != 0) {
      res.status(401).send("user exists")
    } else {
      var hash = bcrypt.hashSync(req.body.password, 1);
      var sql = "INSERT INTO users(\
               user_name,\
               password_hash,\
               email,\
               title,\
               first_name,\
               surname,\
               address_first_line,\
               address_second_line,\
               address_third_line,\
               post_code) VALUES(?,?,?,?,?,?,?,?,?,?);"
      connection.query(sql, [req.body.user_name, hash, req.body.email, req.body.title, req.body.first_name, req.body.surname, req.body.address_first_line, req.body.address_second_line, req.body.address_third_line, req.body.post_code], function(err, data){
          if (err) throw err;
          res.status(200).send(data)
      })
    }
  })
    
    
    
  
}

exports.getUser = function(req, res){
    var sql = "select * from users where user_name = ?;"
    connection.query(sql, [req.params.user_name],function(err, data){
      if (err) throw err;
      res.status(200).send(data)
    })
}

exports.updateUser = function(req, res){
  auth.runAuthChecks(req, res).then(function(){
      var sql = "UPDATE users\
               SET password_hash = ?\
               , email = ?\
               , title = ?\
               , first_name = ?\
               , surname = ?\
               , address_first_line = ?\
               , address_second_line = ?\
               , address_third_line = ?\
               , post_code = ?\
               where user_name = ?;"
    connection.query(sql, [req.body.password_hash, req.body.email, req.body.title, req.body.first_name, req.body.surname, req.body.address_first_line, req.body.address_second_line, req.body.address_third_line, req.body.post_code, req.params.user_name], function (err, data) {
        if (err) throw err;
        res.status(200).send(data);
    })
  }).catch(function(err){res.status(401).send(err)})
}


exports.deleteByUsername = function(req,res){
  auth.runAuthChecks(req, res).then(function(){
    var sql = "delete from users where user_name = ?;"
    connection.query(sql, [req.params.user_name], function(err, data){
      
      if (err){ throw err}
      else if (data.affectedRows == 0){res.status(409).send("User doesnt exist.")}
      res.status(200).send(data)
    })
  }).catch(function(err){res.status(401).send(err)})
}

exports.test = function(req,res){
  auth.runAuthChecks(req, res).then(function(match){ console.log(match)})
  
}
