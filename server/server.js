var express = require("express");

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

// Require path
var path = require('path');
const cors = require('cors');


var app = express();


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/gamestat_mongoose', { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Cannot connect to the database'+ err)}
);


mongoose.Promise = global.Promise;

var GameStatSchema = new mongoose.Schema({
    gameId: String,
    level: String,
    level_number: Number,
    timeRBS: Number,
    timeNRBS: Number
   }, {timestamps: true })

mongoose.model('GameStat', GameStatSchema);
var GameStat = mongoose.model('GameStat')

app.use(bodyParser.json());

//Retrieve all game stats
app.get('/stats', function (req, res){
    GameStat.find({},null,{sort: 'level_number'}, function(err, gamestats) {

        if(err){
            console.log("could not get gamestats", err);
            res.json({message: "Error", error: err})
         }
         else {
            res.json({message: "Success", data: gamestats})
         }
    })

});

//create a gamestat, post route
app.post('/stats', function (req, res){

    var gamestat = new GameStat(req.body);

    gamestat.save(function(err, gamestats) {

        if(err) {
            console.log('something went wrong');
            res.json({message: "Error", error: err})
            console.log(err)
      } else {
            console.log('successfully added a game stat!');
            res.json({message: "Success", data: gamestats})
        }
    })
});

//delete game stat by ID
app.delete('/stats/destroy/:id', function (request, res){
    console.log("in server")
    id = request.params.id;
    console.log("ID",id)

    GameStat.remove({_id: id}, function(err,gamestat){
        if(err) {
            console.log('could not delete stat',err);
            res.json({message: "Error: Could not delete game stat", error: err})
        } else {
            console.log('successfully deleted game stat!');
            res.json({message: "Success", data: gamestat})
        }
   })

});

app.listen(8000, function() {
  console.log("listening on port 8000");
})
