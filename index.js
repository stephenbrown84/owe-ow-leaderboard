var cool = require('cool-ascii-faces');
var owjs = require('overwatch-js');

var express = require('express');
var app = express();

var initData = require('./test.json');
var Stats = require('./stats');
//var stats = new Stats(initData);
var stats = new Stats({});


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

const BATTLE_TAGS = ['MegaArcon-1653', 'noj-1818', 'Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767'];
const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'd.va', 'symmetra'];
const HERO_NAMES_FRIENDLY = ['Pharah', 'Reaper', 'Soldier76', 'Reinhardt', 'Junkrat', 'Mei', 'Tracer', 'Genji', 'McCree', 'Winston',
    'Roadhog', 'Zenyatta', 'Mercy', 'Ana', ' Sombra', 'Bastion', 'Hanzo', 'Widowmaker', 'D.Va', 'Symmetra'];

/*
const BATTLE_TAGS = ['MegaArcon-1653', 'Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767', 'noj-1818'];
const HERO_NAMES = [ 'ana'];
const HERO_NAMES_FRIENDLY = ['Ana'];
*/

function getOWStats(battleTag, pos) {

    if (pos < BATTLE_TAGS.length) {
        owjs
            .getAll('pc', 'us', battleTag)
            .then((data) => { stats.addPlayerStats(battleTag.slice(0, -5), data); pos++; getOWStats( BATTLE_TAGS[pos], response, pos) })
    }
    /*
    else {
        //response.send(stats.getAllStats());

        var out = "";
        for (var i = 0; i < HERO_NAMES.length; i++) {
            out += "<p> " + HERO_NAMES_FRIENDLY[i] + ": " + stats.getBestPlayerFor(HERO_NAMES[i]) + "</p>";
        }
        response.send(out);
    }
    */
}

function refreshOWStats() {
    stats = new Stats({});
    getOWStats(BATTLE_TAGS[0], 0);
}

app.get('/stats', function (request, response) {

    //// Retrieve all stats, including heroes details
    //getOWStats(BATTLE_TAGS[0], response, 0);
    //response.send(stats.getAllStats());


    var out = "";
    for (var i=0; i < HERO_NAMES.length; i++) {
        var bestPlayers = stats.getStatsOfBestTwoPlayersFor(HERO_NAMES[i]);
        //out += "<p> " + HERO_NAMES_FRIENDLY[i] + ": " + stats.getBestPlayerFor(HERO_NAMES[i]) + "</p>";
        out += "<h2>" + HERO_NAMES_FRIENDLY[i] + ": " + bestPlayers[0].name + "</h2>";
        out += "<div><p><b>1st Place</b></p>" + JSON.stringify(bestPlayers[0], null, 2) + "</div>"
        out += "<div><p><b>2nd Place</b></p>" + JSON.stringify(bestPlayers[1], null, 2) + "</div>"
    }

    response.send(out);

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
    refreshOWStats();
    setInterval(refreshOWStats, 600000);
});


