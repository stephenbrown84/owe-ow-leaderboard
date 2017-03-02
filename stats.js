'use strict';

module.exports = function () {
    //const BATTLE_TAGS = ['Zaralus-1670', 'Nuuga-1351', 'MegaArcon-1653'];
    //const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76'];

    this.allStats = {};

    this.addPlayerStats = function (friendlyName, data) {
        this.allStats[friendlyName] = data;
    }

    this.compare = function (player1, player2, hero) {
        return this.allStats;
        /*
        if (this.allStats[player1].competitive.heroes[hero].eliminations > this.allStats[player2].competitive.heroes[hero].eliminations)
            return 1;
        else if (this.allStats[player1].competitive.heroes[hero].eliminations < this.allStats[player2].competitive.heroes[hero].eliminations)
            return -1;
        return 0;
        */
    }
}
