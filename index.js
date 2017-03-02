var cool = require('cool-ascii-faces');
var owjs = require('overwatch-js');

var express = require('express');
var app = express();

var initData = require('./test.json');
var Stats = require('./stats');
//var stats = new Stats(initData);

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

const BATTLE_TAGS = ['Nemisari-1767', 'noj-1818', 'MegaArcon-1653', 'Nuuga-1351', 'Zaralus-1670'];
const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'd.va', 'symmetra'];
const HERO_NAMES_FRIENDLY = ['Pharah', 'Reaper', 'Soldier76', 'Reinhardt', 'Junkrat', 'Mei', 'Tracer', 'Genji', 'McCree', 'Winston',
    'Roadhog', 'Zenyatta', 'Mercy', 'Ana', ' Sombra', 'Bastion', 'Hanzo', 'Widowmaker', 'D.Va', 'Symmetra'];

/*
const BATTLE_TAGS = ['noj-1818', 'Nuuga-1351'];
const HERO_NAMES = [ 'ana'];
const HERO_NAMES_FRIENDLY = ['Ana'];
*/

function getOWStats(battleTag, response, pos) {

    if (pos < BATTLE_TAGS.length) {
        owjs
            .getAll('pc', 'us', battleTag)
            .then((data) => { stats.addPlayerStats(battleTag.slice(0, -5), data); pos++; getOWStats( BATTLE_TAGS[pos], response, pos) })
    }
    else {
        var out = "";
        for (var i = 0; i < HERO_NAMES.length; i++) {
            out += "<p> " + HERO_NAMES_FRIENDLY[i] + ": " + stats.getBestPlayerFor(HERO_NAMES[i]) + "</p>";
        }
        response.send(out);
    }
}

app.get('/stats', function (request, response) {

    //// Retrieve all stats, including heroes details
    getOWStats(BATTLE_TAGS[0], response, 0);

    /*
    var out = "";
    for (var i=0; i < HERO_NAMES.length; i++) {
        out += "<p> " + HERO_NAMES_FRIENDLY[i] + ": " + stats.getBestPlayerFor(HERO_NAMES[i]) + "</p>";

    }

    response.send(out);
    */
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


