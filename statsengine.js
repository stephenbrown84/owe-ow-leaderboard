'use strict';
const util = require('util');

module.exports = StatsEngine;


const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'd.va', 'symmetra', 'zarya'];
const HERO_NAMES_CLEAN = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya'];
const HERO_NAMES_FRIENDLY = ['Pharah', 'Reaper', 'Soldier76', 'Reinhardt', 'Junkrat', 'Mei', 'Tracer', 'Genji', 'McCree', 'Winston',
    'Roadhog', 'Zenyatta', 'Mercy', 'Ana', ' Sombra', 'Bastion', 'Hanzo', 'Widowmaker', 'D.Va', 'Symmetra', 'Zarya'];


//const HERO_NAMES = ['pharah' ];


function StatsEngine(initData) {
    this.rawStats = initData;
    this.calculatedStats = {
        quickplay: {},
        competitive: {}
    };
    this.sortedStats = {
        quickplay: {},
        competitive: {}
    }
    this.heroTotals = {
        quickplay : {},
        competitive : {}
    };
}

function getImportantFieldsFor(hero) {
    var fields = [
        {name: 'eliminations_per_life', required: true},
        {name: 'objective_kills_average', required: true},
        {name: 'healing_done_average', required: false},
        {name: 'damage_done_average', required: true},
        {name: 'final_blows_average', required: true},
        {name: 'damage_blocked_average', required: false}
    ];

    return fields;
}

function getRequiredFieldsFor(hero) {
    var impFields = getImportantFieldsFor(hero);
    var reqFields = [];
    for (var i=0; i < impFields.length; i++) {
        if (impFields[i].required)
            reqFields.push(impFields[i]);
    }

    return reqFields;
}

function hasEnoughTimePlayed(heroStats, hero) {
    return ('time_played' in heroStats) && (getAttr(heroStats, 'time_played') > 10);
}

function hasRequiredFieldsForHero(heroStats, hero) {
    var reqFields = getRequiredFieldsFor(hero);
    for (var i = 0; i < reqFields.length; i++) {
        if (!(reqFields[i].name in heroStats)) {
            return false;
        }  
    }
    return true;
}

function getAttr(heroStats, attr) {
    if (!(attr in heroStats))
        return 0.0;
    else
        return heroStats[attr];
}

StatsEngine.prototype.hasHeroStatsFor = function(name, playMode, hero) {
    return ((name in this.rawStats) && (playMode in this.rawStats[name]) && ('heroes' in this.rawStats[name][playMode]) && (hero in this.rawStats[name][playMode]['heroes']));
}

StatsEngine.prototype.getHeroStatsFor = function(name, playMode, hero) {
    return this.rawStats[name][playMode]['heroes'][hero];
}

StatsEngine.prototype.updateHeroTotal = function (hero, playMode, fieldName, heroStats) {
    //console.log(hero + " " + playMode + " " + fieldName + " " + amt);
    if (!(hero in this.heroTotals[playMode])) {
        this.heroTotals[playMode][hero] = {};
    }

    var amt = getAttr(heroStats, fieldName);
    if (amt <= 0.0) return;

    if (!(fieldName in this.heroTotals[playMode][hero])) {
        this.heroTotals[playMode][hero][fieldName] = { total: 0.0, count: 0 };
    }
    else {
        this.heroTotals[playMode][hero][fieldName].total += amt;
        this.heroTotals[playMode][hero][fieldName].count += 1;
    }
}

function compareByOverall(a, b) {
    if (a.overall > b.overall) {
        return -1;
    }
    if (a.overall < b.overall) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

StatsEngine.prototype.initializeAllFieldsForPlayer = function (player, playMode, hero) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    this.calculatedStats[playMode][player][hero] = {};

    var impFields = getImportantFieldsFor(hero);
    for (var i = 0; i < impFields.length; i++) {
        this.calculatedStats[playMode][player][hero][impFields[i].name] = 0.0;
    }
}

StatsEngine.prototype.setHeroPercentageForFieldForPlayer = function (player, hero, playMode, fieldName, heroStats) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    var amt = getAttr(heroStats, fieldName);
    if (amt <= 0.0) return;

    if (!(fieldName in this.calculatedStats[playMode][player][hero])) {
        this.calculatedStats[playMode][player][hero][fieldName] = 0.0;
    }

    //console.log(hero + " " + fieldName);
    var total = this.heroTotals[playMode][hero][fieldName].total;
    var count = this.heroTotals[playMode][hero][fieldName].count;
    this.calculatedStats[playMode][player][hero][fieldName] = amt / (total / count);
}

StatsEngine.prototype.setHeroPercentageOverallForPlayer = function (player, hero, playMode, calculatedHeroStats) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    var heroFields = getImportantFieldsFor(hero);

    var overallAmt = 0.0;
    var count = 0;
    for (var i=0; i < heroFields.length; i++) {
        if (heroFields[i].name in this.calculatedStats[playMode][player][hero]) {
            overallAmt += this.calculatedStats[playMode][player][hero][heroFields[i].name];
            count += 1;
        }    
    }
    overallAmt = overallAmt / count;

    this.calculatedStats[playMode][player][hero]['OVERALL'] = overallAmt;
    this.addOverallForPlayerForHero(player, hero, playMode, overallAmt);
}

StatsEngine.prototype.addOverallForPlayerForHero = function (player, hero, playMode, overallAmt) {
    if (!(hero in this.sortedStats[playMode])) {
        this.sortedStats[playMode][hero] = [];
    }

    if (!(player in this.sortedStats[playMode][hero])) {
        this.sortedStats[playMode][hero].push({ name: player, 'overall': overallAmt, 'stats': this.calculatedStats[playMode][player][hero] });
    }

}

StatsEngine.prototype.calculateAllStats = function () {
    this.calculateStats('quickplay');
    this.calculateStats('competitive');
}

StatsEngine.prototype.calculateStats = function (playMode) {
    var keys = Object.keys(this.rawStats);

    for (var i = 0; i < HERO_NAMES.length; i++) {

        var hero = HERO_NAMES[i];
        var heroFields = getImportantFieldsFor(hero);

        // Do up hero totals
        for (var j = 0; j < keys.length; j++) {
            if (!this.hasHeroStatsFor(keys[j], playMode, hero))
                continue;

            var heroStats = this.getHeroStatsFor(keys[j], playMode, hero);
            for (var k = 0; k < heroFields.length; k++) {
                if (hasRequiredFieldsForHero(heroStats, hero)) {
                    this.updateHeroTotal(hero, playMode, heroFields[k].name, heroStats);
                }
            }
        }

        // Calculate player percentage for every hero stat
        for (var j = 0; j < keys.length; j++) {
            if (!this.hasHeroStatsFor(keys[j], playMode, hero))
                continue;

            var heroStats = this.getHeroStatsFor(keys[j], playMode, hero);
            if (!hasRequiredFieldsForHero(heroStats, hero) || !hasEnoughTimePlayed(heroStats, hero)) continue;

            //if ((playMode == 'competitive') && (keys[j] == 'NorthernYeti')) console.log(util.inspect(heroStats, { showHidden: false, depth: null }) + " " + hero);

            this.initializeAllFieldsForPlayer(keys[j], playMode, hero);
            for (var k = 0; k < heroFields.length; k++) {
                this.setHeroPercentageForFieldForPlayer(keys[j], hero, playMode, heroFields[k].name, heroStats);
            }
        }
    }

    for (var j = 0; j < keys.length; j++) {
        for (var i = 0; i < HERO_NAMES.length; i++) {
            var hero = HERO_NAMES[i];
            //console.log(this.calculatedStats + " " + playMode);
            if ((keys[j] in this.calculatedStats[playMode]) && (hero in this.calculatedStats[playMode][keys[j]])) {
                var calculatedHeroStats = this.calculatedStats[playMode][keys[j]][hero];
                this.setHeroPercentageOverallForPlayer(keys[j], hero, playMode, calculatedHeroStats);
            }
        }
    }

    var heroKeys = Object.keys(this.sortedStats[playMode]);
    for (var i = 0; i < heroKeys.length; i++) {
        this.sortedStats[playMode][heroKeys[i]].sort(compareByOverall);
    }


    console.log(util.inspect(this.sortedStats, { showHidden: false, depth: null }));

    //console.dir(this.heroTotals['quickplay']['d.va']['eliminations_per_life']);
    //console.log(util.inspect(this.heroTotals, { showHidden: false, depth: null }));
    //console.log(util.inspect(this.calculatedStats, { showHidden: false, depth: null }));

}

StatsEngine.prototype.getSortedStats = function () {
    this.calculateAllStats();
    return this.sortedStats;
}

StatsEngine.prototype.getCalculatedStats = function () {
    this.calculateAllStats();
    //this.calculateStats('competitive');
    //console.log(this.heroTotals);
    return this.calculatedStats;
}