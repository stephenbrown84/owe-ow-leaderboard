'use strict';

module.exports = Stats;

function Stats(initData) {
    //const BATTLE_TAGS = ['Zaralus-1670', 'Nuuga-1351', 'MegaArcon-1653'];
    //const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76'];

    this.allStats = initData;

}

Stats.prototype.addPlayerStats = function (friendlyName, data) {
    this.allStats[friendlyName] = data;
}

Stats.prototype.getBestPlayerFor = function (hero) {
    var keys = Object.keys(this.allStats);
    var winner = keys[0];

    for (var i=1; i < keys.length; i++) {
        if (this.compare(keys[i - 1], keys[i], hero) < 0)
            winner = keys[i];
    }
    return winner;
}

Stats.prototype.compare = function (player1, player2, hero) {
    var player1Hero = this.allStats[player1].quickplay.heroes[hero];
    var player2Hero = this.allStats[player2].quickplay.heroes[hero];

    if (!player1)
        return -1;
    else if (!player2)
        return 1;

    var elimn_per_life_ratio = player1Hero.eliminations_per_life / (player1Hero.eliminations_per_life + player2Hero.eliminations_per_life);
    var weapon_accuracy_ratio = player1Hero.weapon_accuracy / (player1Hero.weapon_accuracy + player2Hero.weapon_accuracy);
    var solo_kills_ratio = player1Hero.solo_kills_average / (player1Hero.solo_kills_average + player2Hero.solo_kills_average);
    var objective_kills_ratio = player1Hero.objective_kills_average / (player1Hero.objective_kills_average + player2Hero.objective_kills_average);


    var total_ratio = (elimn_per_life_ratio + weapon_accuracy_ratio + solo_kills_ratio + objective_kills_ratio) / 4;

    if (total_ratio > 0.5)
        return 1;
    else if (total_ratio < 0.5)
        return -1;
    return 0;
}

