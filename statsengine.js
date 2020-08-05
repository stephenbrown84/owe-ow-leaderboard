'use strict';
const util = require('util');
const Combinatorics = require('js-combinatorics');

module.exports = StatsEngine;


const HERO_NAMES = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'mccree', 'doomfist', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya', 'lucio', 'torbjorn',
    'orisa', 'wreckingball', 'ashe', 'brigitte', 'moira', 'baptiste', 'sigma', 'echo'];
const HERO_NAMES_CLEAN = ['pharah', 'reaper', 'soldier76', 'reinhardt', 'junkrat', 'mei', 'tracer', 'genji', 'doomfist', 'mccree', 'winston',
    'roadhog', 'zenyatta', 'mercy', 'ana', 'sombra', 'bastion', 'hanzo', 'widowmaker', 'dva', 'symmetra', 'zarya', 'lucio', 'torbjorn',
    'orisa', 'wreckingball', 'ashe', 'brigitte', 'moira', 'baptiste', 'sigma', 'echo'];
const HERO_NAMES_FRIENDLY = ['Pharah', 'Reaper', 'Soldier76', 'Reinhardt', 'Junkrat', 'Mei', 'Tracer', 'Genji', 'Doomfist', 'McCree', 'Winston',
    'Roadhog', 'Zenyatta', 'Mercy', 'Ana', ' Sombra', 'Bastion', 'Hanzo', 'Widowmaker', 'D.Va', 'Symmetra', 'Zarya', 'Lucio', 'Torbjorn',
    'Orisa', 'Wrecking Ball', 'Ashe', 'Brigitte', 'Moira', 'Baptiste', 'Sigma', 'Echo'];

const LN_ADJUSTMENT = 1.0;

/* NO LONGER NEEDED SINCE PlayOverwatch FIXED THEIR STATS

const TIMES_1000_FIELDS = [
  'hero_damage_done_avg_per_10_min',
  'barrier_damage_done_avg_per_10_min',
  'all_damage_done_avg_per_10_min',
  'healing_done_avg_per_10_min',
  'self_healing_avg_per_10_min',
  'scoped_critical_hits_avg_per_10_min',
  'damage_blocked_avg_per_10_min',
  'health_recovered_avg_per_10_min',
  'damage_reflected_avg_per_10_min',
  'shields_created_avg_per_10_min',
  'coalescence_healing_avg_per_10_min'
];

const TIMES_100_FIELDS = [
  'eliminations_avg_per_10_min',
  'objective_kills_avg_per_10_min',
  'final_blows_avg_per_10_min',
  'barrage_kills_avg_per_10_min',
  'death_blossom_kills_avg_per_10_min',
  'bob_kills_avg_per_10_min',
  'tactical_visor_kills_avg_per_10_min',
  'helix_rockets_kills_avg_per_10_min',
  'fire_strike_kills_avg_per_10_min',
  'rip-tire_kills_avg_per_10_min',
  'enemies_frozen_avg_per_10_min',
  'blizzard_kills_avg_per_10_min',
  'players_knocked_back_avg_per_10_min',
  'enemies_hooked_avg_per_10_min',
  'defensive_assists_avg_per_10_min',
  'offensive_assists_avg_per_10_min',
  'players_resurrected_avg_per_10_min',
  'enemies_slept_avg_per_10_min',
  'offensive_assists_avg_per_10_min',
  "enemies_emp'd_avg_per_10_min",
  'projected_barriers_applied_avg_per_10_min',
  'sound_barriers_provided_avg_per_10_min',
  'turret_kills_avg_per_10_min',
  'dragonblade_kills_avg_per_10_min'
];

const TIMES_10_FIELDS = [

];
*/

const noPlacementsDoneThisSeason = ['Shankus'];


function StatsEngine(initData) {
    this.rawStats = initData;
    for (var i = 0; i < noPlacementsDoneThisSeason.length; i++) {
        if (noPlacementsDoneThisSeason[i] in this.rawStats) {
            delete this.rawStats[noPlacementsDoneThisSeason[i]].competitive;
            console.log("Deleted comp stats for " + noPlacementsDoneThisSeason[i]);
        }
    }
    //console.log(this.rawStats);
    this.stripSubStatCategories();
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
    var fields = [];
    if (hero == 'pharah') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'direct_hit_accuracy', prettyName: 'Direct Hit Accuracy', weight: 1.5, required: true},
            {name: 'barrage_kills_avg_per_10_min', prettyName: 'Barrage Kills Average', weight: 1.2, required: false}
        ];
    }
    else if (hero == 'sigma') {
        fields = [
          //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
          {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
          {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
          {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
          {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
          {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true}
        ];
    }
    else if (hero == 'reaper') {
        fields = [
          //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
          {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
          {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
          {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
          {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
          {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
          {name: 'death_blossom_kills_avg_per_10_min', prettyName: 'Death Blossom Kils Per 10 Min', weight: 1.2, required: false}
        ];
    }
    else if (hero == 'ashe') {
        fields = [
          //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
          {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
          {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
          {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
          {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
          {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
          {name: 'bob_kills_avg_per_10_min', prettyName: 'Bob Kills Per 10 Min', weight: 1.0, required: true}

        ];
    }
    else if (hero == 'echo') {
        fields = [
          //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
          {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
          {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
          {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
          {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
          {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
          {name: 'sticky_bombs_kills_avg_per_10_min', prettyName: 'Sticky Bombs Kills Per 10 Min', weight: 1.0, required: true},
          {name: 'focusing_beam_kills_avg_per_10_min', prettyName: 'Focusing Beam Kills Per 10 Min', weight: 1.0, required: true},
          {name: 'sticky_bombs_direct_hits_avg_per_10_min', prettyName: 'Sticky Bombs Direct Hits Per 10 Min', weight: 1.0, required: true}
        ];
    }
    else if (hero == 'soldier76') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Average', weight: 1.0, required: true},
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Average', weight: 1.0, required: true},
            {name: 'critical_hits_avg_per_10_min', prettyName: 'Critical Hits Per 10 Min', weight: 1.2, required: true},
            {name: 'helix_rockets_kills_avg_per_10_min', prettyName: 'Helix Rockets Kills Average', weight: 1.0, required: false},
            {name: 'tactical_visor_kills_avg_per_10_min', prettyName: 'Tactical Visor Kills Average', weight: 1.2, required: false}
        ];
    }
    else if (hero == 'reinhardt') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.0, required: true },
            {name: 'fire_strike_kills_avg_per_10_min', prettyName: 'Fire Strike Kills Per 10 Min', weight: 1.0, required: false},
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.5, required: true},
            {name: 'charge_kills_avg_per_10_min', prettyName: 'Chaarge Kills Per 10 Min', weight: 0.5, required: true},
            {name: 'earthshatter_kills_avg_per_10_min', prettyName: 'Earthshatter Kills Per 10 Min', weight: 0.5, required: false}

        ];
    }
    else if (hero == 'junkrat') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.75, required: true},
            {name: 'concussion_mine_kills_avg_per_10_min', prettyName: 'Mine Kills Per 10 Min', weight: 1.0, required: true},
            {name: 'rip-tire_kills_avg_per_10_min', prettyName: 'Rip Tire Kills Per 10 Min', weight: 1.0, required: false}
        ];
    }
    else if (hero == 'mei') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Average', weight: 1.0, required: true},
            {name: 'enemies_frozen_avg_per_10_min', prettyName: 'Enemies Frozen Per 10 Min', weight: 1.2, required: true},
            {name: 'blizzard_kills_avg_per_10_min', prettyName: 'Blizzard Kills Per 10 Min', weight: 1.0, required: false}
        ];
    }
    else if (hero == 'tracer') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'health_recovered_avg_per_10_min', prettyName: 'Self Healing Per 10 Min', weight: 1.0, required: true},
            {name: 'pulse_bomb_kills_avg_per_10_min', prettyName: 'Pulse Bomb Kills Per 10 Min', weight: 0.75, required: false}
        ];
    }
    else if (hero == 'genji') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'damage_reflected_avg_per_10_min', prettyName: 'Damage Reflected Per 10 Min', weight: 1.0, required: true},
            {name: 'dragonblade_kills_avg_per_10_min', prettyName: 'Dragonblade Kills Per 10 Min', weight: 1.0, required: false}
        ];
    }
    else if (hero == 'mccree') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'fan_the_hammer_kills_avg_per_10_min', prettyName: 'Fan the Hammer Kills Per 10 Min', weight: 1.0, required: true},
            {name: 'deadeye_kills_avg_per_10_min', prettyName: 'Deadeye Kills Per 10 Min', weight: 0.75, required: true}
        ];
    }
    else if (hero == 'doomfist') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'shields_created_avg_per_10_min', prettyName: 'Shields Created Per 10 Min', weight: 1.2, required: true},
            {name: 'meteor_strike_kills_avg_per_10_min', prettyName: 'Meteor Strike Kills Per 10 Min', weight: 0.75, required: true}
        ];
    }
    else if (hero == 'winston') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.5, required: true},
            {name: 'jump_pack_kills_avg_per_10_min', prettyName: 'Jump Pack Kills Per 10 Min', weight: 1.0, required: true},
            {name: 'players_knocked_back_avg_per_10_min', prettyName: 'Players Kncoked Back Per 10 Min', weight: 0.75, required: false },
            {name: 'primal_rage_kills_avg_per_10_min', prettyName: 'Primal Rage Kills Per 10 Min', weight: 1.0, required: false }
        ];
    }
    else if (hero == 'roadhog') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.75, required: true},
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Average', weight: 1.0, required: true},
            {name: 'enemies_hooked_avg_per_10_min', prettyName: 'Enemies Hooked Per 10 Min', weight: 1.2, required: true },
            {name: 'whole_hog_kills_avg_per_10_min', prettyName: 'Whole Hog Kills Per 10 Min', weight: 1.2, required: false }
        ];
    }
    else if (hero == 'zenyatta') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'defensive_assists_avg_per_10_min', prettyName: 'Defensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assists Per 10 Min', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'moira') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'defensive_assists_avg_per_10_min', prettyName: 'Defensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'coalescence_healing_avg_per_10_min', prettyName: 'Coalescence Healing Per 10 Min', weight: 1.5, required: false }
        ];
    }
    else if (hero == 'brigitte') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.2, required: true },
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assists Per 10 Min', weight: 1.5, required: true }
        ];
    }
    else if (hero == 'mercy') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 0.25, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 0.25, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 0.25, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Done Per 10 Min', weight: 1.2, required: true },
            {name: 'defensive_assists_avg_per_10_min', prettyName: 'Defensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'players_resurrected_avg_per_10_min', prettyName: 'Players Resurrected Per 10 Min', weight: 1.0, required: false }

        ];
    }
    else if (hero == 'ana') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.0, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Done Per 10 Min', weight: 1.2, required: true },
            {name: 'defensive_assists_avg_per_10_min', prettyName: 'Defensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'enemies_slept_avg_per_10_min', prettyName: 'Enemies Slept Per 10 Min', weight: 1.5, required: false },
            {name: 'nano_boost_assists_avg_per_10_min', prettyName: 'Nano Boost Assists Per 10 Min', weight: 1.5, required: false }
        ];
    }
    else if (hero == 'sombra') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assits Per 10 Min', weight: 1.5, required: true },
            {name: "enemies_hacked_avg_per_10_min", prettyName: "Enemied Hacked Per 10 Min", weight: 1.0, required: true },
            {name: "enemies_emp'd_avg_per_10_min", prettyName: "Enemied EMP'd Per 10 Min", weight: 1.5, required: true }
        ];
    }
    else if (hero == 'bastion') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 1.25, required: true},
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Per 10 Min', weight: 1.2, required: true},
            {name: 'tank_kills_avg_per_10_min', prettyName: 'Tank Kills Per 10 Min', weight: 1.0, required: false }
        ];
    }
    else if (hero == 'hanzo') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 1.0, required: true},
            {name: 'recon_assists_avg_per_10_min', prettyName: 'Recon Assists Per 10 Min', weight: 1.0, required: true},
            {name: 'storm_arrow_kills_avg_per_10_min', prettyName: 'Storm Arrow Kills Per 10 Min', weight: 1.2, required: true},
            {name: 'dragonstrike_kills_avg_per_10_min', prettyName: 'Dragon Strike Kills Per 10 Min', weight: 1.2, required: false}
        ];
    }
    else if (hero == 'widowmaker') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.25, required: true},
            {name: 'venom_mine_kills_avg_per_10_min', prettyName: 'Venom Mine Kills Per 10 Min', weight: 0.50, required: true},
            {name: 'venom_mine_kills_avg_per_10_min', prettyName: 'Venom Mine Kills Per 10 Min', weight: 0.50, required: true},
            {name: 'scoped_critical_hits_avg_per_10_min', prettyName: 'Scoped Critical Hits Per 10 Min', weight: 1.50, required: true},
            {name: 'recon_assists_avg_per_10_min', prettyName: 'Recon Assists Per 10 Min', weight: 1.0, required: true},
        ];
    }
    else if (hero == 'dva') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.5, required: true},
            {name: 'self-destruct_kills_avg_per_10_min', prettyName: 'Self Destruct Kills Per 10 Min', weight: 1.0, required: false}
        ];
    }
    else if (hero == 'symmetra') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'sentry_turret_kills_avg_per_10_min', prettyName: 'Sentry Turret Kills Per 10 Min', weight: 1.0, required: true },
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.5, required: false}
        ];
    }
    else if (hero == 'zarya') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.5, required: true },
            {name: 'average_energy', prettyName: 'Average Energy', weight: 2.0, required: true },
            {name: "projected_barriers_applied_avg_per_10_min", prettyName: 'Projected Barriers Applied Per 10 Min', weight: 1.0, required: true }
        ];
    }
    else if (hero == 'lucio') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.0, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Done Per 10 Min', weight: 1.2, required: true },
            {name: 'defensive_assists_avg_per_10_min', prettyName: 'Defensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'sound_barriers_provided_avg_per_10_min', prettyName: 'Sound Barriers Provided Per 10 Min', weight: 1.5, required: false }
        ];
    }
    else if (hero == 'torbjorn') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.5, required: true},
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'turret_kills_avg_per_10_min', prettyName: 'Turret Kills Per 10 Min', weight: 1.2, required: true },
            {name: 'molten_core_kills_avg_per_10_min', prettyName: 'Molten Core Kills Per 10 Min', weight: 1.2, required: true }
        ];
    }
    else if (hero == 'orisa') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hereo Damage Per 10 Min', weight: 1.0, required: true },
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'damage_blocked_avg_per_10_min', prettyName: 'Damage Blocked Per 10 Min', weight: 1.5, required: true},
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assists Per 10 Min', weight: 1.2, required: true },
            {name: 'damage_amplified_avg_per_10_min', prettyName: 'Daamage Amplified Per 10 Min', weight: 1.2, required: false }
        ];
    }
    else if (hero == 'wreckingball') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hereo Damage Per 10 Min', weight: 1.0, required: true },
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'players_knocked_back_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.2, required: false}
        ];
    }
    else if (hero == 'baptiste') {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hereo Damage Per 10 Min', weight: 1.0, required: true },
            {name: 'barrier_damage_done_avg_per_10_min', prettyName: 'Barrier Damage Per 10 Min', weight: 0.5, required: true},
            {name: 'healing_done_avg_per_10_min', prettyName: 'Healing Done Per 10 Min', weight: 2.0, required: true },
            {name: 'self_healing_avg_per_10_min', prettyName: 'Self Healing Done Per 10 Min', weight: 1.2, required: true },
            {name: 'offensive_assists_avg_per_10_min', prettyName: 'Offensive Assists Per 10 Min', weight: 1.5, required: true },
            {name: 'amplification_matrix_assists_avg_per_10_min', prettyName: 'Amp Matrix Assists Per 10 Min', weight: 1.2, required: true },
            {name: 'immortality_field_deaths_prevented_avg_per_10_min', prettyName: 'Deaths Prevented Per 10 Min', weight: 1.5, required: true }
        ];
    }
    else {
        fields = [
            //{name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
            {name: 'objective_kills_avg_per_10_min', prettyName: 'Objective Kills Average', weight: 1.0, required: true},
            {name: 'eliminations_avg_per_10_min', prettyName: 'Eliminations Per 10 Min', weight: 1.0, require: true},
            {name: 'final_blows_avg_per_10_min', prettyName: 'Final Blows Per 10 Min', weight: 1.5, required: true},
            {name: 'all_damage_done_avg_per_10_min', prettyName: 'Damage Done Average', weight: 1.0, required: true},
            {name: 'damage_blocked_average', prettyName: 'Damage Blocked Average', weight: 1.0, required: true },

        ];
    }
/*
    fields = [
        {name: 'hero_damage_done_avg_per_10_min', prettyName: 'Hero Damage Per 10 Min', weight: 1.0, required: true}
        {name: 'eliminations_per_life', prettyName: 'Eliminations Per Life', weight: 1.0, required: true},
        {name: 'all_damage_done_most_in_life', prettyName: 'All Damage Done Most In Life', weight: 1.0, required: false},
        {name: 'hero_damage_done_most_in_life', prettyName: 'Hero Damage Done Most In Life', weight: 1.0, required: false}
    ];*/

    if (playMode == 'competitive') {
        fields.push({ name: 'win_percentage', prettyName: 'Win Percentage', weight: 1.5, required: false });
    }

    fields.push({ name: 'time_played', prettyName: 'Time Played', weight: 1.5, required: false });

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
    else {
        if (attr == 'time_played') {
            var totalMins = 0;
            var timeParts = heroStats[attr].split(':');
            if (timeParts.length > 2) {
                totalMins = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
            }
            else if (timeParts.length > 1) {
                totalMins = parseInt(timeParts[0]);
            }
            return totalMins;
        }
        return parseFloat(heroStats[attr]);
    }
}

StatsEngine.prototype.hasHeroStatsFor = function(name, playMode, hero) {
    return ((name in this.rawStats) && (playMode in this.rawStats[name]['heroStats'])
        && (hero in this.rawStats[name]['heroStats'][playMode]));
}

StatsEngine.prototype.getHeroStatsFor = function(name, playMode, hero) {
    var heroStats = {};
    if (hero in this.rawStats[name]['heroStats'][playMode]) {
        heroStats = this.rawStats[name]['heroStats'][playMode][hero];
    }
    return heroStats;
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

StatsEngine.prototype.stripSubStatCategories = function() {
    var playModes = ['quickplay', 'competitive'];
    for (var i = 0; i < 2; i++) {
        for (var player in this.rawStats) {
            for (var hero in this.rawStats[player]["heroStats"][playModes[i]]) {
                var subStatCategories = [];
                for (var subStatCat in this.rawStats[player]["heroStats"][playModes[i]][hero]) {
                    subStatCategories.push(subStatCat);
                }
                for (var j = 0; j < subStatCategories.length; j++) {
                    var subStatCat = subStatCategories[j];
                    for (var stat in this.rawStats[player]["heroStats"][playModes[i]][hero][subStatCat]) {
                        this.rawStats[player]["heroStats"][playModes[i]][hero][stat] = this.rawStats[player]["heroStats"][playModes[i]][hero][subStatCat][stat];
                    }
                    delete this.rawStats[player]["heroStats"][playModes[i]][hero][subStatCat];
                }
            }
        }
    }
}

StatsEngine.prototype.resetStats = function() {
    this.calculatedStats = {
        quickplay: {},
        competitive: {}
    };
    this.sortedStats = {
        quickplay: {},
        competitive: {}
    };
    this.baseWeightAverages = {
        quickplay: {},
        competitive: {}
    };
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

StatsEngine.prototype.getAdjustedTimePlayed = function (timePlayed) {
    if (timePlayed > 300.0) {
        return 300.0;
    }
    else {
        return timePlayed;
    }

    /*
    if (timePlayed == 0.0) {
        return 0.0;
    }
    var adjustedTimePlayed = (-1 * (Math.log(timePlayed / 60.0) / 3.0)) + 1.0;
    if (adjustedTimePlayed < 0.01) {
        return 0.01;
    }
    adjustedTimePlayed = adjustedTimePlayed * 60.0;
    return adjustedTimePlayed;
    */
}

StatsEngine.prototype.setHeroPercentageForFieldForPlayer = function (player, hero, playMode, fieldName, heroStats) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    var amt = getAttr(heroStats, fieldName);

    // Adjust played based on negative ln formula
    if (fieldName == 'time_played') {
        amt = this.getAdjustedTimePlayed(amt);
    }

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
    //console.log(this.calculatedStats[playMode][player][hero][fieldName]['relative']);
    if (Number.isNaN(amt / (total / count))) {
        console.log(playMode + " : " + player + " : " + hero + " : " + fieldName);
        console.log(amt + " : " + total + " : " + count);
        console.log();
    }
    this.calculatedStats[playMode][player][hero][fieldName]['actual'] = amt;
}


StatsEngine.prototype.trackHeroBaseWeightForHero = function (player, hero, playMode) {

    var isInitial = false;
    if (!(hero in this.baseWeightAverages[playMode])) {
        this.baseWeightAverages[playMode][hero] = {};
        this.baseWeightAverages[playMode][hero].totalOfWeights = 0.0;
        this.baseWeightAverages[playMode][hero].count = 0;
    }

    var heroFields = getImportantFieldsFor(hero, playMode);
    var heroFieldDict = getDictioanryOfImportantFieldsFor(hero, playMode);

    var heroStats = this.getHeroStatsFor(player, playMode, hero);
    var time_played = getAttr(heroStats, 'time_played');

    var adjustedTimePlay = (time_played / 60.0) + 8.0;
    var weight = Math.log(adjustedTimePlay) / 2.0;

    this.baseWeightAverages[playMode][hero].totalOfWeights += weight;
    this.baseWeightAverages[playMode][hero].count += 1;

    /*

    if ((playMode == 'quickplay') && (hero == 'genji'))
        console.log("TESTING: " + hero + " : " + this.baseWeightAverages[playMode][hero].totalOfWeights + ": " + this.baseWeightAverages[playMode][hero].count);
        */
}

/*
StatsEngine.prototype.trackHeroBaseWeightForHeroForPlayer = function (player, hero, playMode) {

    var isInitial = false;
    if (!(hero in this.baseWeightAverages[playMode])) {
        this.baseWeightAverages[playMode][hero] = {};
        this.baseWeightAverages[playMode][hero].totalOfWeights = 0.0;
        this.baseWeightAverages[playMode][hero].count = 0;
    }

    var heroFields = getImportantFieldsFor(hero, playMode);
    var heroFieldDict = getDictioanryOfImportantFieldsFor(hero, playMode);

    var heroStats = this.getHeroStatsFor(player, playMode, hero);
    var time_played = getAttr(heroStats, 'time_played');

    var adjustedTimePlay = (time_played / 60.0) + LN_ADJUSTMENT;
    var weight = Math.log(adjustedTimePlay) / 300.0;

    this.baseWeightAverages[playMode][hero].totalOfWeights += weight;
    this.baseWeightAverages[playMode][hero].count += 1;


    if ((playMode == 'quickplay') && (hero == 'genji'))
        console.log("TESTING: " + hero + " : " + this.baseWeightAverages[playMode][hero].totalOfWeights + ": " +  this.baseWeightAverages[playMode][hero].count);
}
*/
/*

StatsEngine.prototype.trackHeroBaseWeightForFieldForPlayer = function (player, hero, playMode, fieldName) {

    var isInitial = false;
    if (!(hero in this.baseWeightAverages[playMode])) {
        this.baseWeightAverages[playMode][hero] = {};
    }

    if (!(fieldName in this.baseWeightAverages[playMode][hero])) {
        this.baseWeightAverages[playMode][hero][fieldName] = {};
        this.baseWeightAverages[playMode][hero][fieldName].totalOfWeights = 0.0;
        this.baseWeightAverages[playMode][hero][fieldName].count = 0;
        isInitial = true;
    }

    var heroFields = getImportantFieldsFor(hero, playMode);
    var heroFieldDict = getDictioanryOfImportantFieldsFor(hero, playMode);

    var heroStats = this.getHeroStatsFor(player, playMode, hero);
    var time_played = getAttr(heroStats, 'time_played');

    var adjustedTimePlay = (time_played / 60.0) + LN_ADJUSTMENT;
    var weight = Math.log(adjustedTimePlay);

    this.baseWeightAverages[playMode][hero][fieldName].totalOfWeights += weight;
    this.baseWeightAverages[playMode][hero][fieldName].count += 1;

    if ((playMode == 'competitive') && (hero == 'genji'))
        console.log("TESTING: " + fieldName + " : " + this.baseWeightAverages[playMode][hero][fieldName]);
}
*/

StatsEngine.prototype.setHeroPercentageOverallForPlayer = function (player, hero, playMode, calculatedHeroStats) {
    if (!(player in this.calculatedStats[playMode])) {
        this.calculatedStats[playMode][player] = {};
    }

    if (!(hero in this.calculatedStats[playMode][player])) {
        this.calculatedStats[playMode][player][hero] = {};
    }

    var heroFields = getImportantFieldsFor(hero, playMode);
    var heroFieldDict = getDictioanryOfImportantFieldsFor(hero, playMode);

    //var heroStats = this.getHeroStatsFor(player, playMode, hero);
    //var time_played = getAttr(heroStats, 'time_played');

    var overallAmt = 0.0;
    var count = 0;
    for (var i = 0; i < heroFields.length; i++) {
        if (heroFields[i].name in this.calculatedStats[playMode][player][hero]) {
            //var adjustedTimePlay = (time_played / 60.0) + LN_ADJUSTMENT;
            //var weight = Math.log(adjustedTimePlay);
            //var weight = heroFieldDict[heroFields[i].name].weight;
            var weight = heroFieldDict[heroFields[i].name].weight;

            /*
            if (heroFields[i].name == 'time_played') {
                var adjustedTimePlay = (time_played / 60.0) + 8.0;
                weight = Math.log(adjustedTimePlay) / 2.0;

                var averageTimeplayedWeight = this.baseWeightAverages[playMode][hero].totalOfWeights / this.baseWeightAverages[playMode][hero].count;
                count += averageTimeplayedWeight;
            }
            else {
                weight = heroFieldDict[heroFields[i].name].weight;
                count += weight;
            }
            */

            overallAmt += (this.calculatedStats[playMode][player][hero][heroFields[i].name]['relative']) * weight;
            count += weight;

            //var baseWeightAverageForHeroField = this.baseWeightAverages[playMode][hero][heroFields[i].name].totalOfWeights / this.baseWeightAverages[playMode][hero][heroFields[i].name].count;
            //count += weight;
        }
    }
    /*
    var adjustedTimePlay = (time_played / 60.0) + LN_ADJUSTMENT;
    var timePlayedWeight = Math.log(adjustedTimePlay) / 300.0;
    var baseWeightAverageForHero = this.baseWeightAverages[playMode][hero].totalOfWeights / this.baseWeightAverages[playMode][hero].count;

    if ((player == 'Jay') && (hero == 'genji') && (playMode == 'quickplay')) {
        console.log("TEST: " + timePlayedWeight + ": " + baseWeightAverageForHero + ": " + overallAmt);
    }
    */

    //overallAmt = (overallAmt / count) * (timePlayedWeight / baseWeightAverageForHero);
    overallAmt = overallAmt / count;

    this.calculatedStats[playMode][player][hero]['OVERALL'] = { 'relative': overallAmt, 'actual': overallAmt };
    this.addOverallForPlayerForHero(player, hero, playMode, overallAmt);

    /*
    if ((player == 'Jay') && (hero == 'genji') && (playMode == 'quickplay')) {
        console.log("TEST: " + timePlayedWeight + ": " + baseWeightAverageForHero + ": " + overallAmt);
    }*/
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

        // Calculate player base weight for time_played stat
        for (var j = 0; j < keys.length; j++) {
            if (!this.hasHeroStatsFor(keys[j], playMode, hero))
                continue;

            var heroStats = this.getHeroStatsFor(keys[j], playMode, hero);
            if (!hasRequiredFieldsForHero(heroStats, hero, playMode) || !hasEnoughTimePlayed(heroStats, hero)) continue;

            this.trackHeroBaseWeightForHero(keys[j], hero, playMode);

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
    return this.calculatedStats;
}

StatsEngine.prototype.getRawStats = function () {
    return this.rawStats;
}

StatsEngine.prototype.getBestPlayerFit = function (comp, players, timePlayed, gameMode) {
    this.calculateAllStats();

    var bestFitResults = [];

    for (var i = 0; i < comp.length; i++) {
        for (var j = 0; j < players.length; j++) {

            var playerStatsForHero = null;
            if (comp[i].toLowerCase() in this.sortedStats[gameMode]) {
                playerStatsForHero = this.sortedStats[gameMode][comp[i].toLowerCase()].filter(function (obj) {
                    return obj.name.toLowerCase() == players[j].toLowerCase();
                })[0];
            }

            if (playerStatsForHero && (playerStatsForHero.time_played > timePlayed)) {
                playerStatsForHero["heroName"] = comp[i];
                bestFitResults.push(playerStatsForHero);
            }
        }
        bestFitResults.sort(function (x, y) {
            return y.overall - x.overall;
        })
    }

    //console.log(bestFitResults);

    var takenHeroes = [];
    var takenPlayers = [];
    var results = [];
    for (var k = 0; k < bestFitResults.length; k++) {
        if (!(takenHeroes.includes(bestFitResults[k].heroName)) && !(takenPlayers.includes(bestFitResults[k].name))) {
            takenHeroes.push(bestFitResults[k].heroName);
            takenPlayers.push(bestFitResults[k].name);
            delete bestFitResults[k].stats;
            delete bestFitResults[k].fields;
            results.push(bestFitResults[k]);
        }
    }

    results.sort(function (x, y) {
        return x.heroName.localeCompare(y.heroName);
    });

    return results;
}

StatsEngine.prototype.getBestPlayerFitForMaximumOverallTeamSkill = function (comp, players, timePlayed, gameMode) {
    this.calculateAllStats();

    var NUM_OF_HEROES_TO_PICK = 0;
    if ((players.length > comp.length) && (players.length > 5)) {
            NUM_OF_HEROES_TO_PICK = 6;
    }
    else {
        NUM_OF_HEROES_TO_PICK = players.length
    }

    if (comp.length < NUM_OF_HEROES_TO_PICK) {
        NUM_OF_HEROES_TO_PICK = comp.length;
    }

    var totalCombos = Combinatorics.C(comp.length, NUM_OF_HEROES_TO_PICK) * Combinatorics.P(players.length, NUM_OF_HEROES_TO_PICK);
    //console.log("Total number of things to check: " + totalCombos);

    if (totalCombos > 4000000) {
        return { error: "That's " + totalCombos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " combinations! You ask too much of me I'm afraid." };
    }

    var heroCombinations = Combinatorics.combination(comp, NUM_OF_HEROES_TO_PICK);
    heroCombinations = heroCombinations.toArray();
    //.log("Hero Combinations Length=" + heroCombinations.length);
    //console.log("Perms=" + heroCombinations + "--END--");

    var playerPermutations = Combinatorics.permutation(players, NUM_OF_HEROES_TO_PICK);
    playerPermutations = playerPermutations.toArray();
    //console.log("Player Perms Length=" + playerPermutations.length);
    //console.log("Player Perms=" + playerCombinations + "-----------END---------");

    var maxOverallTeamSkill = 0.0;
    var maxOverallTeam = [];

    for (var i = 0; i < heroCombinations.length; i++) {
        var heroComb = heroCombinations[i];
        //console.log(heroComb);
        for (var j = 0; j < playerPermutations.length; j++) {

            var playerPerm = playerPermutations[j];

            var currTeam = [];
            var teamSkill = 0.0;

            for (var k = 0; k < heroComb.length; k++) {

                var playerStatsForHero = null;
                if (heroComb[k].toLowerCase() in this.sortedStats[gameMode]) {
                    playerStatsForHero = this.sortedStats[gameMode][heroComb[k].toLowerCase()].filter(function (obj) {
                        return obj.name.toLowerCase() == playerPerm[k].toLowerCase();
                    })[0];
                }

                if (playerStatsForHero && (playerStatsForHero.time_played > timePlayed)) {
                    playerStatsForHero["heroName"] = heroComb[k];
                }
                else {
                    playerStatsForHero = {};
                    playerStatsForHero["heroName"] = heroComb[k];
                    playerStatsForHero["name"] = playerPerm[k];
                    playerStatsForHero["overall"] = 0.0;
                    playerStatsForHero["time_played"] = 'N/A';
                }

                currTeam.push(playerStatsForHero);
                teamSkill += playerStatsForHero["overall"];

                if (teamSkill > maxOverallTeamSkill) {
                    maxOverallTeamSkill = teamSkill;
                    maxOverallTeam = currTeam;
                }
            }
        }

    }

    maxOverallTeam.sort(function (x, y) {
        return x.heroName.localeCompare(y.heroName);
    });

    return maxOverallTeam;
}

/*
StatsEngine.prototype.isCalculatedReady = function() {
    return (Object.keys(this.sortedStats.quickplay).length > 0);
}*/

StatsEngine.prototype.isReady = function() {
    return (Object.keys(this.rawStats).length > 0);
}
