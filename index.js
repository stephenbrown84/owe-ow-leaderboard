var cool = require('cool-ascii-faces');
var owjs = require('overwatch-js');

var express = require('express');
var app = express();
var Stats = require('./stats');
var stats = new Stats();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

const BATTLE_TAGS = ['Zaralus-1670', 'Nuuga-1351', 'MegaArcon-1653'];
const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76'];

app.get('/stats', function (request, response) {

    //// Retrieve all stats, including heroes details
    for (var i = 0; i < BATTLE_TAGS.length; i++) {
        var friendlyName = BATTLE_TAGS[i].slice(0, -5);
        console.log(BATTLE_TAGS[i]);
        owjs
        .getAll('pc', 'us', BATTLE_TAGS[i])
        .then((data) => stats.addPlayerStats(friendlyName, data));
    }
    

    response.send(stats.compare('Zaralus','Nuuga', 'pharah'));

    /*
    client.get("http://api.lootbox.eu/pc/us/Zaralus-1670/competitive/hero/Pharah/", function (data, res) {
        response.send(data);
    });

    owAPIReq({ url: 'https://api.lootbox.eu/pc/us/Zaralus-1670/competitive/hero/Pharah/', json: true }, function (err, res, json) {
        if (!err && res.statusCode == 200) {
            var info = JSON.parse(json)
            // do more stuff
            response.send(info);
        }
        else {
            response.send("WTF HAPPEND " + err);
        }
    });
    */
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


