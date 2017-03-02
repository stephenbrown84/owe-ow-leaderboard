'use strict';

module.exports = function () {

    //const BATTLE_TAGS = ['Zaralus-1670', 'Nuuga-1351', 'MegaArcon-1653'];
    const HERO_NAMES = ['pharah', 'reaper', 'soldier:_76'];

    var allStats = {};

    this.addPlayerStats = function (friendlyName, data) {
        allStats[friendlyName] = data;
    }

    this.compare = function (player1, player2, hero) {
        if (allStats[player1].competitive.heroes[hero].eliminations > allStats[player2].competitive.heroes[hero].eliminations)
            return 1;
        else if (allStats[player1].competitive.heroes[hero].eliminations < allStats[player2].competitive.heroes[hero].eliminations)
            return -1;
        return 0;
    }
}
