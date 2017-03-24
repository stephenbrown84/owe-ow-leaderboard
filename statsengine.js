'use strict';
const util = require('util');

module.exports = StatsEngine;


const HERO_NAMES = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya', 'lucio', 'torbjorn', 'orisa'];
const HERO_NAMES_CLEAN = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya', 'lucio', 'torbjorn', 'orisa'];
const HERO_NAMES_FRIENDLY = ['Pharah', 'Reaper', 'Soldier76', 'Reinhardt', 'Junkrat', 'Mei', 'Tracer', 'Genji', 'McCree', 'Winston',
    'Roadhog', 'Zenyatta', 'Mercy', 'Ana', ' Sombra', 'Bastion', 'Hanzo', 'Widowmaker', 'D.Va', 'Symmetra', 'Zarya', 'Lucio', 'Torbjorn', 'Orisa'];


//const HERO_NAMES = ['pharah' ];


function StatsEngine(initData) {
    this.rawStats = initData;
    this.resetStats();
}

function getDictioanryOfImportantFieldsFor(hero, playMode) {
    var fieldList = getImportantFieldsFor(hero, playMode);
    var fieldDict = {};
    for (var i =0; i< fieldList.length; i++) {
        fieldDict[fieldList[i].name] = fieldList[i];
    }
    return fieldDict;
}

function getImportantFieldsFor(hero, playMode) {
    var fields;
    if (hero == 'pharah') {
        fields = [
            {name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_average', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_average', prettyName: 'Eliminations Average', weight: 1.0, required: true},
            {name: 'damage_done_average', prettyName: 'Damage Done Average', weight: 1.0, required: true},
            {name: 'final_blows_average', prettyName: 'Final Blows Average', weight: 1.5, required: true},
            {name: 'barrage_kills_average', prettyName: 'Barrage Kills Average', weight: 1.2, required: true}
        ];
    }
    else if (hero == 'reaper') {
        fields = [
            {name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_average', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_average', prettyName: 'Eliminations Average', weight: 1.0, required: true},
            {name: 'damage_done_average', prettyName: 'Damage Done Average', weight: 1.0, required: true},
            {name: 'final_blows_average', prettyName: 'Final Blows Average', weight: 1.5, required: true},
            {name: 'death_blossom_kills_average', prettyName: 'Death Blossom Kills Average', weight: 1.2, required: true}
        ];
    }
    else if (hero == 'soldier76') {
        fields = [
            {name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_average', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_average', prettyName: 'Eliminations Average', weight: 1.0, required: true},
            {name: 'healing_done_average', prettyName: 'Healing Done Average', weight: 1.0, required: true},
            {name: 'self_healing_average', prettyName: 'Self Healing Average', weight: 1.0, required: true},
            {name: 'damage_done_average', prettyName: 'Damage Done Average', weight: 1.0, required: true},
            {name: 'final_blows_average', prettyName: 'Final Blows Average', weight: 1.5, required: true},
            {name: 'helix_rockets_kills_average', prettyName: 'Helix Rockets Kills Average', weight: 1.0, required: true},
            {name: 'tactical_visor_kills_average', prettyName: 'Tactical Visor Kills Average', weight: 1.2, required: true},
        ];
    }
    else if (hero == 'reinhardt') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.0, required: true},
            { name: 'objective_kills_average', weight: 1.0, required: true },
            {name: 'eliminations_average', weight: 1.0, required: true},
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'objective_time_average', weight: 1.5, required: true },
            {name: 'fire_strike_kills_average', weight: 1.0, required: true},
            {name: 'earthshatter_kills_average', weight: 1.0, required: true},
            {name: 'final_blows_average', weight: 1.5, required: true},
            {name: 'damage_blocked_average', weight: 1.0, required: true}
        ];
    }
    else if (hero == 'junkrat') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.5, required: true},
            { name: 'objective_kills_average', weight: 1.0, required: true },
            {name: 'eliminations_average', weight: 1.0, required: true},
            {name: 'damage_done_average', weight: 1.2, required: true},
            {name: 'final_blows_average', weight: 1.2, required: true},
            {name: 'rip-tire_kills_average', weight: 1.0, required: true}
        ];
    }
    else if (hero == 'mei') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.0, required: true},
            {name: 'objective_kills_average', weight: 1.0, required: true},
            {name: 'eliminations_average', weight: 1.0, required: true},
            {name: 'damage_done_average', weight: 1.0, required: true},
            {name: 'final_blows_average', weight: 1.2, required: true},
            {name: 'self_healing_average', prettyName: 'Self Healing Average', weight: 1.0, required: true },
            { name: 'objective_time_average', weight: 1.5, required: true },
            {name: 'enemies_frozen_average', weight: 1.2, required: true},
            {name: 'blizzard_kills_average', weight: 1.2, required: true}
        ];
    }
    else if (hero == 'tracer') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.0, required: true},
            {name: 'objective_kills_average', weight: 1.0, required: true},
            {name: 'eliminations_average', weight: 1.0, required: true},
            {name: 'damage_done_average', weight: 1.0, required: true},
            {name: 'final_blows_average', weight: 1.5, required: true},
            {name: 'self_healing_average', weight: 1.0, required: true},
            {name: 'pulse_bombs_attached_average', weight: 1.0, required: true},
            {name: 'pulse_bomb_kills_average', weight: 1.2, required: true}
        ];
    }
    else if (hero == 'genji') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.0, required: true},
            { name: 'objective_kills_average', weight: 1.0, required: true },
            {name: 'eliminations_average', weight: 1.0, required: true},
            {name: 'damage_done_average', weight: 1.0, required: true},
            {name: 'final_blows_average', weight: 1.5, required: true},
            {name: 'damage_reflected_average', weight: 1.0, required: true},
            {name: 'dragonblade_kills_average', weight: 1.2, required: true}
        ];
    }
    else if (hero == 'mccree') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.0, required: true},
            { name: 'objective_kills_average', weight: 1.0, required: true },
            {name: 'eliminations_average', weight: 1.0, required: true},
            {name: 'damage_done_average', weight: 1.0, required: true},
            {name: 'final_blows_average', weight: 1.5, required: true},
            {name: 'fan_the_hammer_kills_average', weight: 1.2, required: true},
            {name: 'deadeye_kills_average', weight: 1.2, required: true}
        ];
    }
    else if (hero == 'winston') {
        fields = [
            {name: 'eliminations_per_life', weight: 1.0, required: true},
            { name: 'objective_kills_average', weight: 1.0, required: true },
            {name: 'eliminations_average', weight: 1.0, required: true},
            {name: 'damage_done_average', weight: 1.0, required: true},
            {name: 'final_blows_average', weight: 1.5, required: true},
            {name: 'players_knocked_back_average', weight: 1.2, required: false },
            {name: 'primal_rage_kills__average', weight: 1.0, required: false}
        ];
    }
    else if (hero == 'roadhog') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.5, required: true },
            { name: 'objective_time_average', weight: 1.2, required: true },
            { name: 'self_healing_average', weight: 1.0, required: true },
            { name: 'enemies_hooked_average', weight: 1.2, required: true },
            { name: 'whole_hog_kills_average', weight: 1.2, required: true }
        ];
    }
    else if (hero == 'zenyatta') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.2, required: true },
            { name: 'healing_done_average', weight: 2.0, required: true },
            { name: 'transcendence_healing_best', weight: 1.0, required: true },
            { name: 'defensive_assists_average', weight: 1.5, required: true },
            { name: 'offensive_assists_average', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'mercy') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.0, required: true },
            { name: 'self_healing_average', weight: 1.0, required: true },
            { name: 'healing_done_average', weight: 2.0, required: true },
            { name: 'defensive_assists_average', weight: 1.5, required: true },
            { name: 'offensive_assists_average', weight: 1.5, required: true },
            { name: 'players_resurrected_average', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'ana') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.0, required: true },
            { name: 'self_healing_average', weight: 1.0, required: true },
            { name: 'healing_done_average', weight: 2.0, required: true },
            { name: 'defensive_assists_average', weight: 1.5, required: true },
            { name: 'offensive_assists_average', weight: 1.5, required: true },
            { name: 'enemies_slept_average', weight: 1.5, required: true },
            { name: 'nano_boost_assists_average', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'sombra') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.5, required: true },
            { name: 'offensive_assists_average', weight: 1.5, required: true },
            { name: "enemies_emp'd_average", weight: 1.5, required: true },
            { name: 'enemies_hacked_average', weight: 1.2, required: true }
        ];
    }
    else if (hero == 'bastion') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'healing_done_average', weight: 1.2, required: true },
            { name: 'final_blows_average', weight: 1.5, required: true },
            { name: 'sentry_kills_average', weight: 1.5, required: true },
            { name: "recon_kills_average", weight: 1.5, required: true },
            { name: 'tank_kills_average', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'hanzo') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.5, required: true },
            { name: 'recon_assists_most_in_game', weight: 1.0, required: false },
            { name: "scatter_arrow_kills_average", weight: 1.5, required: false },
            { name: 'dragonstrike_kills_average', weight: 1.2, required: false }
        ];
    }
    else if (hero == 'widowmaker') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.2, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 2.0, required: true },
            { name: 'recon_assists_most_in_game', weight: 1.0, required: false },
            { name: "venom_mine_kills_average", weight: 1.0, required: false }
        ];
    }
    else if (hero == 'dva') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.2, required: true },
            { name: 'objective_time_average', weight: 1.5, required: true },
            { name: 'damage_blocked_average', weight: 2.0, required: true },
            { name: "self-destruct_kills_average", weight: 1.2, required: true }
        ];
    }
    else if (hero == 'symmetra') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.2, required: true },
            { name: 'damage_blocked_average', weight: 1.0, required: true },
            { name: 'sentry_turret_kills_average', weight: 1.0, required: false },
            { name: 'players_teleported_average', weight: 1.0, required: false },
            { name: "teleporter_uptime_average", weight: 1.0, required: false }
        ];
    }
    else if (hero == 'zarya') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.2, required: true },
            { name: 'objective_time_average', weight: 1.5, required: true },
            { name: 'damage_blocked_average', weight: 1.5, required: true },
            { name: 'lifetime_average_energy', weight: 2.0, required: true },
            { name: "projected_barriers_applied_average", weight: 1.0, required: true }
        ];
    }
    else if (hero == 'lucio') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.0, required: true },
            { name: 'objective_time_average', weight: 1.0, required: true },
            { name: 'healing_done_average', weight: 2.0, required: true },
            { name: 'self_healing_average', weight: 1.0, required: true },
            { name: "defensive_assists_average", weight: 1.5, required: true },
            { name: 'sound_barriers_provided_average', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'torbjorn') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_kills_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.2, required: true },
            { name: 'turret_kills_average', weight: 1.2, required: true },
            { name: "armor_packs_created_average", weight: 1.5, required: true },
            { name: 'molten_core_kills_average', weight: 1.2, required: true }
        ];
    }
    else if (hero == 'orisa') {
        fields = [
            { name: 'eliminations_per_life', weight: 1.0, required: true },
            { name: 'objective_time_average', weight: 1.0, required: true },
            { name: 'eliminations_average', weight: 1.0, required: true },
            { name: 'damage_done_average', weight: 1.0, required: true },
            { name: 'final_blows_average', weight: 1.2, required: true },
            { name: 'damage_blocked_average', weight: 1.2, required: true },
            { name: 'offensive_assists_average', weight: 1.2, required: true },
            { name: 'damage_amplified_average', weight: 1.5, required: true }
        ];
    }
    else {
        fields = [
            {name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_average', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            { name: 'healing_done_average', prettyName: 'Healing Done Average', weight: 1.0, required: true },
            {name: 'damage_done_average', prettyName: 'Damage Done Average', weight: 1.0, required: true},
            {name: 'final_blows_average', prettyName: 'Final Blows Average', weight: 1.2, required: true },
            { name: 'damage_blocked_average', prettyName: 'Damage Blocked Average', weight: 1.0, required: true }
        ];
    }

    if (playMode == 'competitive') {
        fields.push({ name: 'win_percentage', prettyName: 'Win Percentage', weight: 2.0, required: false })
    }

    return fields;
}

function getRequiredFieldsFor(hero, playMode) {
    var impFields = getImportantFieldsFor(hero, playMode);
    var reqFields = [];
    for (var i=0; i < impFields.length; i++) {
        if (impFields[i].required)
            reqFields.push(impFields[i]);
    }

    return reqFields;
}

function hasEnoughTimePlayed(heroStats, hero) {
    return ('time_played' in heroStats) && (getAttr(heroStats, 'time_played') > 19);
}

function hasRequiredFieldsForHero(heroStats, hero, playMode) {
    var reqFields = getRequiredFieldsFor(hero, playMode);
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

    //if ((hero =='ana') && (playMode == 'competitive')) console.log("SEE ME: " + playMode + ": " + hero + ": " + util.inspect(heroStats, { showHidden: false, depth: null }) + ": " + amt);
    if (amt <= 0.0) return;

    if (!(fieldName in this.heroTotals[playMode][hero])) {
        this.heroTotals[playMode][hero][fieldName] = { total: 0.0, count: 0 };
    }
    this.heroTotals[playMode][hero][fieldName].total += amt;
    this.heroTotals[playMode][hero][fieldName].count += 1;
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

StatsEngine.prototype.resetStats = function() {
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

StatsEngine.prototype.initializeAllFieldsForPlayer = function (player, playMode, hero) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    this.calculatedStats[playMode][player][hero] = {};

    var impFields = getImportantFieldsFor(hero, playMode);
    for (var i = 0; i < impFields.length; i++) {
        this.calculatedStats[playMode][player][hero][impFields[i].name] = { 'relative': 0.0, 'actual': 0.0};
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

    //console.log(fieldName + "   " + amt);
    /*
    if ((player.toLowerCase() == 'nuuga') && (hero == 'ana')) {
        console.log(player + ": " + playMode + ": " + hero + ": " + fieldName + "   " + amt);
        console.log(this.heroTotals[playMode][hero][fieldName].total);
        console.log(this.heroTotals[playMode][hero][fieldName].count);
        console.log("-------");

    }
    */
    if (amt <= 0.0) return;
    
    if (!(fieldName in this.calculatedStats[playMode][player][hero])) {
        this.calculatedStats[playMode][player][hero][fieldName] = {};
    }

    var total = this.heroTotals[playMode][hero][fieldName].total;
    var count = this.heroTotals[playMode][hero][fieldName].count;
    this.calculatedStats[playMode][player][hero][fieldName]['relative'] = amt / (total / count);
    this.calculatedStats[playMode][player][hero][fieldName]['actual'] = amt;
}

StatsEngine.prototype.setHeroPercentageOverallForPlayer = function (player, hero, playMode, calculatedHeroStats) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    var heroFields = getImportantFieldsFor(hero, playMode);
    var heroFieldDict = getDictioanryOfImportantFieldsFor(hero, playMode);

    var overallAmt = 0.0;
    var count = 0;
    for (var i=0; i < heroFields.length; i++) {
        if (heroFields[i].name in this.calculatedStats[playMode][player][hero]) {
            overallAmt += (this.calculatedStats[playMode][player][hero][heroFields[i].name]['relative']) * (heroFieldDict[heroFields[i].name].weight);
            count += (1 * heroFieldDict[heroFields[i].name].weight);
        }    
    }
    overallAmt = overallAmt / count;

    this.calculatedStats[playMode][player][hero]['OVERALL'] = { 'relative': overallAmt, 'actual': overallAmt };
    this.addOverallForPlayerForHero(player, hero, playMode, overallAmt);
}

StatsEngine.prototype.addOverallForPlayerForHero = function (player, hero, playMode, overallAmt) {
    if (!(hero in this.sortedStats[playMode])) {
        this.sortedStats[playMode][hero] = [];
    }

    if (!(player in this.sortedStats[playMode][hero])) {
        // Add in time played for all results stats
        var heroStats = this.getHeroStatsFor(player, playMode, hero);
        var time_played = getAttr(heroStats, 'time_played');

        var fields = getDictioanryOfImportantFieldsFor(hero, playMode)

        this.sortedStats[playMode][hero].push({
            name: player, 'overall': overallAmt, 'time_played': time_played,
            'fields': fields,
            'stats': this.calculatedStats[playMode][player][hero] });
    }

}

StatsEngine.prototype.calculateAllStats = function () {
    this.resetStats();
    this.calculateStats('quickplay');
    this.calculateStats('competitive');
}

StatsEngine.prototype.calculateStats = function (playMode) {
    var keys = Object.keys(this.rawStats);

    for (var i = 0; i < HERO_NAMES.length; i++) {

        var hero = HERO_NAMES[i];
        var heroFields = getImportantFieldsFor(hero, playMode);

        // Do up hero totals
        for (var j = 0; j < keys.length; j++) {
            if (!this.hasHeroStatsFor(keys[j], playMode, hero))
                continue;

            var heroStats = this.getHeroStatsFor(keys[j], playMode, hero);
            for (var k = 0; k < heroFields.length; k++) {
                //if ((keys[j].toLowerCase() == 'nuuga') &&(hero == 'ana')) console.log("SEE ME: " + playMode + ": " + hero + ": " + util.inspect(heroStats, { showHidden: false, depth: null }));
                if (hasRequiredFieldsForHero(heroStats, hero, playMode) && hasEnoughTimePlayed(heroStats, hero)) {
                    //if ((keys[j].toLowerCase() == 'nuuga') && (hero == 'ana')) console.log("SEE ME: " + playMode + ": " + hero + ": " + util.inspect(heroStats, { showHidden: false, depth: null }));
                    this.updateHeroTotal(hero, playMode, heroFields[k].name, heroStats);
                }
            }
        }

        // Calculate player percentage for every hero stat
        for (var j = 0; j < keys.length; j++) {
            if (!this.hasHeroStatsFor(keys[j], playMode, hero))
                continue;

            var heroStats = this.getHeroStatsFor(keys[j], playMode, hero);
            if (!hasRequiredFieldsForHero(heroStats, hero, playMode) || !hasEnoughTimePlayed(heroStats, hero)) continue;

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


    //console.log(util.inspect(this.sortedStats, { showHidden: false, depth: null }));

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

StatsEngine.prototype.getRawStats = function () {
    return this.rawStats;
}

StatsEngine.prototype.isReady = function() {
    return (Object.keys(this.rawStats).length > 0);
}