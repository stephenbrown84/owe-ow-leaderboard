'use strict';

module.exports = Stats;

function Stats(initData) {
    //const BATTLE_TAGS = ['Zaralus-1670', 'Nuuga-1351', 'MegaArcon-1653'];
    //const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76'];

    this.allStats = initData;

}

function getAttr(playerHero, attr) {
    if (!(attr in playerHero))
        return 0.0;
    else
        return playerHero[attr];
}

function getPlayerHeroStatsFor(playerName, playerHero) {

    var winnerObj = {
        name: playerName,
        eliminations_per_life: getAttr(playerHero, 'eliminations_per_life'),
        objective_kills_average: getAttr(playerHero, 'objective_kills_average'),
        healing_done_average: getAttr(playerHero, 'healing_done_average'),
        damage_done_average: getAttr(playerHero, 'damage_done_average'),
        final_blows_average: getAttr(playerHero, 'final_blows_average'),
        damage_blocked_average: getAttr(playerHero, 'damage_blocked_average')
    }

    return winnerObj;
}

function generateBlankHeroStats() {
    var winnerObj = {
        name: "N/A",
        eliminations_per_life: 0,
        objective_kills_average: 0,
        healing_done_average: 0,
        damage_done_average: 0,
        final_blows_average: 0,
        damage_blocked_average: 0
    }

    return winnerObj;
}

Stats.prototype.addPlayerStats = function (friendlyName, data) {
    this.allStats[friendlyName] = data;
}

Stats.prototype.getBestPlayerFor = function (hero, isCompetitive) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i=1; i < keys.length; i++) {
        if (this.compare(winner, keys[i], hero, isCompetitive) < 0)
            winner = keys[i];
    }
    return winner;
}

Stats.prototype.getStatsOfBestPlayerFor = function (hero, isCompetitive) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i = 1; i < keys.length; i++) {
        if (this.compare(winner, keys[i], hero, isCompetitive) < 0)
            winner = keys[i];
    }

    var playerHero = this.allStats[winner].quickplay.heroes[hero];
    return getPlayerHeroStatsFor(winner, playerHero);
}

Stats.prototype.getStatsOfBestTwoPlayersFor = function (hero, isCompetitive) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i = 1; i < keys.length; i++) {
        if (this.compare(winner, keys[i], hero, isCompetitive) < 0) {
            winner = keys[i];
        }    
    }

    var secondPlace = keys[0];
    if (keys[0] == winner)
        secondPlace = keys[1];

    for (var i = 1; i < keys.length; i++) {
        if (keys[i] == winner)
            continue;
        if (this.compare(secondPlace, keys[i], hero) < 0) {
            secondPlace = keys[i];
        }
    }

    var winnerStats, secondPlaceStats;
    var winnerPlayerHero, secondPlacePlayerHero;
    if (!isCompetitive) {
        winnerPlayerHero = this.allStats[winner].quickplay.heroes[hero];
        secondPlacePlayerHero = this.allStats[secondPlace].quickplay.heroes[hero];
        winnerStats = getPlayerHeroStatsFor(winner, winnerPlayerHero);
        secondPlaceStats = getPlayerHeroStatsFor(secondPlace, secondPlacePlayerHero);
    }
    else {
        if (winner && ('competitive' in this.allStats[winner]) && (hero in this.allStats[winner].competitive.heroes)) {
            winnerPlayerHero = this.allStats[winner].competitive.heroes[hero];
            winnerStats = getPlayerHeroStatsFor(winner, winnerPlayerHero);
        }
        else {
            winnerStats = generateBlankHeroStats(winner);
        }
        if (secondPlace && ('competitive' in this.allStats[secondPlace]) && (hero in this.allStats[secondPlace].competitive.heroes)) {
            secondPlacePlayerHero = this.allStats[secondPlace].competitive.heroes[hero];
            secondPlaceStats = getPlayerHeroStatsFor(secondPlace, secondPlacePlayerHero);
        }
        else {
            secondPlaceStats = generateBlankHeroStats(secondPlace);
        }
        //winnerPlayerHero = this.allStats[winner].competitive.heroes[hero];
        //secondPlacePlayerHero = this.allStats[secondPlace].competitive.heroes[hero];
    }

    return [winnerStats, secondPlaceStats];
}

Stats.prototype.getAllStats = function () {
    return this.allStats;
}

Stats.prototype.compare = function (player1, player2, hero, isCompetitive) {
    var player1Hero, player2Hero;

    if (isCompetitive) {
        if (!('competitive' in this.allStats[player1]))
            return -1;
        else if (!('competitive' in this.allStats[player2]))
            return 1;

        player1Hero = this.allStats[player1].competitive.heroes[hero];
        player2Hero = this.allStats[player2].competitive.heroes[hero];
    }
    else {
        player1Hero = this.allStats[player1].quickplay.heroes[hero];
        player2Hero = this.allStats[player2].quickplay.heroes[hero];
    }

    if (!player1Hero)
        return -1;
    else if (!player2Hero)
        return 1;

    // Both players should have at least 1 hour of game play to use for the hero
    if (getAttr(player1Hero, 'time_played') < 60)
        return -1;
    else if (getAttr(player2Hero, 'time_played') < 60)
        return 1;

    var ratios = [];

    ratios.push(getAttr(player1Hero, 'eliminations_per_life') / (getAttr(player1Hero, 'eliminations_per_life') + getAttr(player2Hero, 'eliminations_per_life')));
    ratios.push(getAttr(player1Hero, 'objective_kills_average') / (getAttr(player1Hero, 'objective_kills_average') + getAttr(player2Hero, 'objective_kills_average')));
    ratios.push(getAttr(player1Hero, 'healing_done_average') / (getAttr(player1Hero, 'healing_done_average') + getAttr(player2Hero, 'healing_done_average')));
    //ratios.push(getAttr(player1Hero, 'self_healing_average') / (getAttr(player1Hero, 'self_healing_average') + getAttr(player2Hero, 'self_healing_average')));
    ratios.push(getAttr(player1Hero, 'damage_done_average') / (getAttr(player1Hero, 'damage_done_average') + getAttr(player2Hero, 'damage_done_average')));
    ratios.push(getAttr(player1Hero, 'final_blows_average') / (getAttr(player1Hero, 'final_blows_average') + getAttr(player2Hero, 'final_blows_average')));
    ratios.push(getAttr(player1Hero, 'damage_blocked_average') / (getAttr(player1Hero, 'damage_blocked_average') + getAttr(player2Hero, 'damage_blocked_average')));

    var count = 0;
    var total = 0;
    for (var i = 0; i < ratios.length; i++) {
        if (!isNaN(ratios[i])) {
            total += ratios[i];
            count++;
        }
    }

    if (count == 0)
        return player1;

    var total_ratio = total / count;

    console.log(hero);
    console.log(player1 + " vs " + player2);
    console.log(total_ratio.toString());

    if (total_ratio > 0.5)
        return 1;
    else if (total_ratio < 0.5)
        return -1;
    return 0;
}

