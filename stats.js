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
        self_healing_average: getAttr(playerHero, 'self_healing_average'),
        final_blows_average: getAttr(playerHero, 'final_blows_average'),
        damage_blocked_average: getAttr(playerHero, 'damage_blocked_average')
    }

    return winnerObj;
}

Stats.prototype.addPlayerStats = function (friendlyName, data) {
    this.allStats[friendlyName] = data;
}

Stats.prototype.getBestPlayerFor = function (hero) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i=1; i < keys.length; i++) {
        if (this.compare(winner, keys[i], hero) < 0)
            winner = keys[i];
    }
    return winner;
}

Stats.prototype.getStatsOfBestPlayerFor = function (hero) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i = 1; i < keys.length; i++) {
        if (this.compare(winner, keys[i], hero) < 0)
            winner = keys[i];
    }

    var playerHero = this.allStats[winner].quickplay.heroes[hero];
    return getPlayerHeroStatsFor(winner, playerHero);
}

Stats.prototype.getStatsOfBestTwoPlayersFor = function (hero) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i = 1; i < keys.length; i++) {
        if (this.compare(winner, keys[i], hero) < 0) {
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

    var winnerPlayerHero = this.allStats[winner].quickplay.heroes[hero];
    var secondPlacePlayerHero = this.allStats[secondPlace].quickplay.heroes[hero];
    return [getPlayerHeroStatsFor(winner, winnerPlayerHero), getPlayerHeroStatsFor(secondPlace, secondPlacePlayerHero)];
}

Stats.prototype.getAllStats = function () {
    return this.allStats;
}

Stats.prototype.compare = function (player1, player2, hero) {
    var player1Hero = this.allStats[player1].quickplay.heroes[hero];
    var player2Hero = this.allStats[player2].quickplay.heroes[hero];

    if (!player1Hero)
        return -1;
    else if (!player2Hero)
        return 1;

    var ratios = [];

    ratios.push(getAttr(player1Hero, 'eliminations_per_life') / (getAttr(player1Hero, 'eliminations_per_life') + getAttr(player2Hero, 'eliminations_per_life')));
    ratios.push(getAttr(player1Hero, 'objective_kills_average') / (getAttr(player1Hero, 'objective_kills_average') + getAttr(player2Hero, 'objective_kills_average')));
    ratios.push(getAttr(player1Hero, 'healing_done_average') / (getAttr(player1Hero, 'healing_done_average') + getAttr(player2Hero, 'healing_done_average')));
    ratios.push(getAttr(player1Hero, 'self_healing_average') / (getAttr(player1Hero, 'self_healing_average') + getAttr(player2Hero, 'self_healing_average')));
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

