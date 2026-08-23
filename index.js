
var fs = require('fs');

var express = require('express');
var app = express();

var owapi = require('./owapi');

var initData = require('./test.json');
var Stats = require('./statsengine');

var env = process.env.NODE_ENV || 'dev';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const BATTLE_TAGS = ['Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767', 'Dirtnapper-1628', 'Suracis-1355', 'MajorYeehaw-1782',
                     'MegaArcon-1653', 'Jamie-1389', 'Tasslehoff-1222', 'Shankus-1281', 'Dutchy-1645'];

//const BATTLE_TAGS = ['Zaralus-1670'];
/*
const BATTLE_TAGS = ['NorthernYeti-1308', 'MegaArcon-1653', 'noj-1818', 'Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767',
    'Isoulle-1235', 'MajorYeehaw-1139', 'Dirtnapper-1628', 'Suracis-1355', 'WiseOldGamer-1346',
    'Leunam-1664', 'Amara-1941']; //'Nick-15366', 'Chesley-1524', 'Jay-11736', 'StephyCakes-1653', 'NFLDPUNK-1988'
    */

/*
const BATTLE_TAGS = ['MegaArcon-1653', 'Nuuga-1351', 'Zaralus-1670', 'Nemisari-1767', 'noj-1818'];
const HERO_NAMES = [ 'ana'];
const HERO_NAMES_FRIENDLY = ['Ana'];
*/

var stats;
var freshRawData = {};
var activeSeasonNumber = 17;

async function commitFileToGitHub(filePath, contentString, message) {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY || 'stephenbrown84/owe-ow-leaderboard';
    if (!token) {
        console.log(`[GitHub Commit] GITHUB_TOKEN environment variable not set. Skipping GitHub auto-commit for ${filePath}.`);
        return;
    }

    try {
        const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
        const base64Content = Buffer.from(contentString, 'utf8').toString('base64');

        let sha = undefined;
        const checkRes = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'Overwatch-Leaderboard-App'
            }
        });

        if (checkRes.ok) {
            const checkData = await checkRes.json();
            sha = checkData.sha;
        }

        const body = {
            message: message || `Auto-update ${filePath}`,
            content: base64Content,
            branch: 'main'
        };
        if (sha) {
            body.sha = sha;
        }

        const putRes = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Overwatch-Leaderboard-App'
            },
            body: JSON.stringify(body)
        });

        if (putRes.ok) {
            console.log(`[GitHub Commit] Successfully committed ${filePath} to GitHub repo ${repo}!`);
        } else {
            const errText = await putRes.text();
            console.error(`[GitHub Commit Error] Failed to commit ${filePath}: ${putRes.status} ${errText}`);
        }
    } catch (err) {
        console.error(`[GitHub Commit Error] Exception committing ${filePath}:`, err.message);
    }
}

function saveSeasonSnapshot() {
    if (!stats || !stats.isReady()) {
        console.log("[Snapshot] Stats engine not ready yet.");
        return;
    }

    var rawData = stats.getRawStats();
    if (!rawData || Object.keys(rawData).length === 0) {
        console.log("[Snapshot] No raw stats available to snapshot.");
        return;
    }

    if (!fs.existsSync('stats_backup')) {
        fs.mkdirSync('stats_backup', { recursive: true });
    }

    var seasonSet = {};
    for (var player in rawData) {
        var pSeason = rawData[player].currentSeason || 24;
        seasonSet[pSeason] = true;
    }

    var availableSeasons = Object.keys(seasonSet).map(function(n) { return parseInt(n); }).sort(function(a, b) { return a - b; });

    availableSeasons.forEach(function(targetSeason) {
        var strictRawData = {};
        for (var p in rawData) {
            var pSeason = rawData[p].currentSeason || 24;
            if (pSeason === targetSeason) {
                strictRawData[p] = rawData[p];
            }
        }

        var seasonEngine = new Stats(strictRawData);
        var sorted = seasonEngine.getSortedStats();
        if (sorted && sorted.competitive) {
            var snapshotObj = { competitive: sorted.competitive };
            var filename = 'stats_backup/sorted_stats_season' + targetSeason + '_new.json';
            var contentString = JSON.stringify(snapshotObj, null, 2);
            fs.writeFile(filename, contentString, function(err) {
                if (err) {
                    console.error("[Snapshot Error] Failed to save " + filename + ":", err);
                } else {
                    console.log("[Snapshot] Saved OW2 Season " + targetSeason + " snapshot to " + filename);
                    commitFileToGitHub(filename, contentString, `[Auto Snapshot] Season ${targetSeason} update`);
                }
            });
        }
    });
}

function scheduleDailyMidnightSnapshot() {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
    );
    var msToMidnight = night.getTime() - now.getTime();
    console.log("[Snapshot] Scheduled next daily midnight snapshot in " + Math.round(msToMidnight / 60000) + " minutes.");

    setTimeout(function() {
        console.log("[Midnight Snapshot] Triggering daily midnight season snapshot...");
        saveSeasonSnapshot();
        setInterval(saveSeasonSnapshot, 24 * 60 * 60 * 1000);
    }, msToMidnight);
}

async function refreshOWStats() {
    freshRawData = {};
    for (var i = 0; i < BATTLE_TAGS.length; i++) {
        try {
            var data = await owapi.getAllStats(BATTLE_TAGS[i]);
            if (data) {
                var battleTag = data.battletag;
                freshRawData[battleTag.split('-')[0]] = data;
                if (data.currentSeason) {
                    activeSeasonNumber = data.currentSeason;
                }
                console.log("Got data for: " + battleTag + " (Season " + activeSeasonNumber + ")");
            }
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.log("Error fetching " + BATTLE_TAGS[i] + ": " + err.message);
        }
    }
    stats = new Stats(freshRawData);
    var targetPath = fs.existsSync('stats_backup') ? 'stats_backup/ow_stats.json' : 'ow_stats.json';
    var rawStatsString = JSON.stringify(stats.getRawStats());
    fs.writeFile(targetPath, rawStatsString, (err) => {
        if (err) console.log("Unable to save " + targetPath + "!");
        else {
            console.log(targetPath + ' was saved');
            commitFileToGitHub(targetPath, rawStatsString, `[Auto Update] ow_stats.json raw data`);
            saveSeasonSnapshot();
        }
    });
}

function initOWStats() {
    try {
        var owStatsPath = fs.existsSync('stats_backup/ow_stats.json') ? 'stats_backup/ow_stats.json' : 'ow_stats.json';
        fs.accessSync(owStatsPath, fs.R_OK);
        stats = new Stats(JSON.parse(fs.readFileSync(owStatsPath, 'utf8')));
        console.log("Read " + owStatsPath + " and loaded it.");
        saveSeasonSnapshot();
    } catch (e) {
        console.log("Error loading ow_stats.json: " + e);
        stats = new Stats({});
        refreshOWStats();
    }
    scheduleDailyMidnightSnapshot();
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

app.get('/seasons', function (request, response) {
    var seasons = [];
    try {
        var files = fs.readdirSync('stats_backup');
        files.forEach(function(file) {
            var match = file.match(/^sorted_stats_season(\d+)/);
            if (match && match[1] && seasons.indexOf(match[1]) === -1) {
                seasons.push(match[1]);
            }
        });
    } catch (e) {
        console.log("Error reading stats_backup:", e);
    }
    response.send(seasons.sort(function(a, b) { return parseInt(a) - parseInt(b); }));
});

app.get('/stats/sorted/:season', function (request, response) {
    console.log(request.params);
    var season = request.params.season;

    try {
        var filePath = 'stats_backup/sorted_stats_season' + season.toString() + '_new.json';
        if (!fs.existsSync(filePath)) {
            filePath = 'stats_backup/sorted_stats_season' + season.toString() + '.json';
        }
        var seasonSortedStats = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        delete seasonSortedStats.quickplay;
        console.log("Read " + filePath + " and loaded it.");
        response.send(seasonSortedStats);
    } catch (e) {
        console.log("Error: " + e);
        response.send({});
    }
});

app.get('/stats/sorted/', function (request, response) {
    if (stats.isReady()) {
        var rawData = stats.getRawStats();
        var latestSeason = 24;
        for (var player in rawData) {
            var s = rawData[player].currentSeason;
            if (s && s > latestSeason) {
                latestSeason = s;
            }
        }

        var filePath = 'stats_backup/sorted_stats_season' + latestSeason + '_new.json';
        if (fs.existsSync(filePath)) {
            try {
                var seasonSortedStats = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                var fullSorted = stats.getSortedStats();
                response.send({
                    quickplay: fullSorted.quickplay,
                    competitive: seasonSortedStats.competitive || {}
                });
                return;
            } catch(e) {
                console.error("Error reading latest season snapshot for /stats/sorted/:", e);
            }
        }
        response.send(stats.getSortedStats());
    }
    else {
        response.send({});
    }
});

app.get('/stats/calc/', function (request, response) {
    if (stats.isReady()) {
        response.send(stats.getCalculatedStats())
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

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
    console.log(env);
    initOWStats();
    refreshOWStats();
    setInterval(refreshOWStats, 600000);
});
