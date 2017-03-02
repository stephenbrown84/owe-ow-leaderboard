'use strict';

module.exports = Stats;

function Stats() {
    //const BATTLE_TAGS = ['Zaralus-1670', 'Nuuga-1351', 'MegaArcon-1653'];
    //const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76'];

    this.allStats = {};

}

Stats.prototype.addPlayerStats = function (friendlyName, data) {
    this.allStats[friendlyName] = data;
}

Stats.prototype.compare = function (player1, player2, hero) {
    if (this.allStats[player1].quickplay.heroes[hero].eliminations > this.allStats[player2].quickplay.heroes[hero].eliminations)
        return 1;
    else if (this.allStats[player1].quickplay.heroes[hero].eliminations < this.allStats[player2].quickplay.heroes[hero].eliminations)
        return -1;
    return 0;
}

