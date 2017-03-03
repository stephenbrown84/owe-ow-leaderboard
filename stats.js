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

    ratios = [];

    ratios.push(getAttr(player1Hero, 'eliminations_per_life') / (getAttr(player1Hero, 'eliminations_per_life') + getAttr(player2Hero, 'eliminations_per_life')));
    //var weapon_accuracy_ratio = player1Hero.weapon_accuracy / (player1Hero.weapon_accuracy + player2Hero.weapon_accuracy);
    ratios.push(getAttr(player1Hero, 'solo_kills_average') / (getAttr(player1Hero, 'solo_kills_average') + getAttr(player2Hero, 'solo_kills_average')));
    ratios.push(getAttr(player1Hero, 'objective_kills_average') / (getAttr(player1Hero, 'objective_kills_average') + getAttr(player2Hero, 'objective_kills_average')));

    var count = 0;
    for (var i = 0; i < ratios.length; i++) {
        if (!isNaN(ratios[i]))
            count++;
    }

    if (count == 0)
        return player1;

    var total_ratio = (elimn_per_life_ratio + solo_kills_ratio + objective_kills_ratio) / count;

    console.log(hero);
    console.log(player1 + " vs " + player2);
    console.log(total_ratio.toString());

    if (total_ratio > 0.5)
        return 1;
    else if (total_ratio < 0.5)
        return -1;
    return 0;
}

