var owjs = require('overwatch-js');
var fs = require('fs');

var express = require('express');
var app = express();

var initData = require('./test.json');
var Stats = require('./statsengine');

var env = process.env.NODE_ENV || 'dev';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const BATTLE_TAGS = ['Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767', 'Dirtnapper-1628', 'Suracis-1355', 'MajorYeehaw-1782',
                     'MegaArcon-1653', 'Isoulle-1235', 'Crabgor-1947'];

/*const BATTLE_TAGS = ['Zaralus-1670'];    */
/*
const BATTLE_TAGS = ['NorthernYeti-1308', 'MegaArcon-1653', 'noj-1818', 'Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767',
    'Isoulle-1235', 'MajorYeehaw-1139', 'Dirtnapper-1628', 'Suracis-1355', 'WiseOldGamer-1346',
    'Leunam-1664', 'Amara-1941']; //'Nick-15366', 'Chesley-1524', 'Jay-11736', 'StephyCakes-1653',
    */
const HERO_NAMES = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya', 'orisa'];
const HERO_NAMES_CLEAN = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya', 'orisa'];
const HERO_NAMES_FRIENDLY = ['Pharah', 'Reaper', 'Soldier76', 'Reinhardt', 'Junkrat', 'Mei', 'Tracer', 'Genji', 'McCree', 'Winston',
    'Roadhog', 'Zenyatta', 'Mercy', 'Ana', ' Sombra', 'Bastion', 'Hanzo', 'Widowmaker', 'D.Va', 'Symmetra', 'Zarya', 'Orisa'];

/*
const BATTLE_TAGS = ['MegaArcon-1653', 'Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767', 'noj-1818'];
const HERO_NAMES = [ 'ana'];
const HERO_NAMES_FRIENDLY = ['Ana'];
*/

var stats;
var freshRawData = {};

function refreshOWStats() {
    freshRawData = {};
    promises = [];
    for (var i = 0; i < BATTLE_TAGS.length; i++) {
        promises.push(owjs.getAll('pc', 'us', BATTLE_TAGS[i]), false);
    }
    Promise.all(promises).then((data) => {
        for (var j = 0; j < data.length; j++) {
            if (!data[j]) continue;
            var battleTag = data[j].profile.nick;
            freshRawData[battleTag] = data[j]
            console.log("Got data for: " + battleTag);
        }
        stats = new Stats(freshRawData);
        fs.writeFile('ow_stats.json', JSON.stringify(freshRawData), (err) => {
            if (err) console.log("Unable to save ow_stats.json!");
                console.log('ow_stats.json was saved');
        });
    }).catch((err) => {
        console.log("Error fetching from PlayOverwatch: " + err.message);
    });
}

function initOWStats() {
    try {
        fs.accessSync("ow_stats.json", fs.R_OK);
        stats = new Stats(JSON.parse(fs.readFileSync('ow_stats.json', 'utf8')));
        console.log("Read ow_stats.json and loaded it.");
    } catch (e) {
        console.log("Error: " + e);
        stats = new Stats({});
        refreshOWStats();
    }
}

app.get('/dirt', function(request, response) {
    owjs.getAll('pc', 'us', 'Dirtnapper-1628')
            .then((data) => {
            response.send(data);

        });
});

app.get('/clan/members', function (request, response) {
    response.send(BATTLE_TAGS.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }));
});

app.get('/stats/raw', function (request, response) {
    response.send(stats.getRawStats());
});

app.get('/stats/sorted/:season', function (request, response) {
    console.log(request.params);
    var season = request.params.season;

    try {
        fs.accessSync('stats_backup/sorted_stats_season' + season.toString() + '.json', fs.R_OK);
        var seasonSortedStats = JSON.parse(fs.readFileSync('stats_backup/sorted_stats_season' + season.toString() + '_new.json', 'utf8'));
        delete seasonSortedStats.quickplay;
        console.log("Read raw_stats"+ season.toString() + ".json and loaded it.");
        response.send(seasonSortedStats);
    } catch (e) {
        console.log("Error: " + e);
        response.send({});
    }
});

app.get('/stats/sorted/', function (request, response) {
    if (stats.isReady()) {
        response.send(stats.getSortedStats())
    }
    else {
        response.send({});
    }
});

app.get('/bestfit', function (request, response) {
    //var comp = ['winston', 'pharah', 'zarya', 'lucio', 'zenyatta', 'genji'];
    //var players = ['noj', 'Nuuga', 'Zaralus', 'Nemisari', 'MegaArcon', 'Lawbringer'];
    var comp = request.query.comp.split("_");
    var players = request.query.players.split("_");
    var timePlayed = request.query.timeplayed;
    var type = request.query.type;
    var gameMode = request.query.gamemode;

    var results;
    //console.log(type);
    if (type == 'maxteam') {
        results = stats.getBestPlayerFitForMaximumOverallTeamSkill(comp, players, timePlayed, gameMode);
    }
    else {
        results = stats.getBestPlayerFit(comp, players, timePlayed, gameMode);
    }
    //console.log(results);
    response.send(results);

});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
    console.log(env);
    initOWStats();
    if ((env == 'release') || (env == 'devproxy')) {
        refreshOWStats();
        setInterval(refreshOWStats, 600000);
    }
});
