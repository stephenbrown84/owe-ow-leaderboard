/* global angular */
angular.module("app", ['ui.bootstrap'])
    .controller("BestFitCtrl", function($http, $scope, $timeout, $q) {

        $scope.ROLES = {
            OFFENSE: 'OFFENSE',
            TANK: 'TANK',
            DEFENSE: 'DEFENSE',
            SUPPORT: 'SUPPORT',
            ALL: 'ALL'
        }

        $scope.heroOptions = [
            {
                id: 'all',
                label: 'All Heroes',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'genji',
                label: 'Genji',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'mccree',
                label: 'McCree',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'pharah',
                label: 'Pharah',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'reaper',
                label: 'Reaper',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'soldier76',
                label: 'Soldier76',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'sombra',
                label: 'Sombra',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'tracer',
                label: 'Tracer',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'bastion',
                label: 'Bastion',
                role: $scope.ROLES.DEFENSE

            },
            {
                id: 'hanzo',
                label: 'Hanzo',
                role: $scope.ROLES.DEFENSE
            },
            {
                id: 'junkrat',
                label: 'Junkrat',
                role: $scope.ROLES.DEFENSE
            },
            {
                id: 'mei',
                label: 'Mei',
                role: $scope.ROLES.DEFENSE
            },
            {
                id: 'torbjorn',
                label: 'Torbjorn',
                role: $scope.ROLES.DEFENSE
            },
            {
                id: 'widowmaker',
                label: 'Widowmaker',
                role: $scope.ROLES.DEFENSE
            },
            {
                id: 'dva',
                label: 'D.Va',
                role: $scope.ROLES.TANK
            },
            {
                id: 'orisa',
                label: 'Orisa',
                role: $scope.ROLES.TANK
            },
            {
                id: 'reinhardt',
                label: 'Reinhardt',
                role: $scope.ROLES.TANK
            },
            {
                id: 'roadhog',
                label: 'Roadhog',
                role: $scope.ROLES.TANK
            },
            {
                id: 'winston',
                label: 'Winston',
                role: $scope.ROLES.TANK
            },
            {
                id: 'zarya',
                label: 'Zarya',
                role: $scope.ROLES.TANK
            },
            {
                id: 'ana',
                label: 'Ana',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'lucio',
                label: 'Lucio',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'mercy',
                label: 'Mercy',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'zenyatta',
                label: 'Zenyatta',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'symmetra',
                label: 'Symmetra',
                role: $scope.ROLES.SUPPORT
            }
        ];

        $scope.selectedType = "maxteam";
        $scope.heroClasses = {};
        $scope.roleClasses = {};
        $scope.memberClasses = {};
        $scope.gameMode = 'quickplay';

        $scope.clanMembers = [];
        $scope.timePlayed = 30;

        $scope.heroes = $scope.heroOptions.slice(1);

        $scope.bestfitResults = '';

        $scope.toggleHeroSelection = function (h) {
            //$scope.currentHero = h;
            $scope.currentHeroClass = h.role;
            //$scope.clearHeroClasses();
            //$scope.clearRoleClasses();
            if ($scope.heroClasses[h.id] == 'card-hero-icon-selected') {
                $scope.heroClasses[h.id] = 'card-hero-icon';
            } else {
                $scope.heroClasses[h.id] = 'card-hero-icon-selected';
            }
        }

        $scope.toggleMemberSelection = function (m) {
            //$scope.currentHero = h;
            //$scope.currentHeroClass = h.role;
            //$scope.clearHeroClasses();
            //$scope.clearRoleClasses();
            if ($scope.memberClasses[m] == 'card-hero-icon-selected') {
                $scope.memberClasses[m] = 'card-hero-icon';
            } else {
                $scope.memberClasses[m] = 'card-hero-icon-selected';
            }
        }

        $scope.setCurrentClass = function (c) {
            $scope.currentHero = null;
            $scope.currentHeroClass = c;
            $scope.clearHeroClasses();
            $scope.clearRoleClasses();
            $scope.roleClasses[c] = 'img-circle-card-selected';
            for (var i = 0; i < $scope.heroes.length; i++) {
                var h = $scope.heroes[i];
                if (h.role === c) {
                    $scope.heroClasses[h.id] = 'card-hero-icon-selected';
                }
            }
        }

        $scope.clearHeroClasses = function () {
            for (var i = 0; i < $scope.heroOptions.length; i++) {
                $scope.heroClasses[$scope.heroOptions[i].id] = 'card-hero-icon';
            }
        }

        $scope.clearMemberClasses = function () {
            for (var i = 0; i < $scope.clanMembers.length; i++) {
                $scope.memberClasses[$scope.clanMembers[i]] = 'card-hero-icon';
            }
        }

        $scope.clearRoleClasses = function () {
            var keys = Object.keys($scope.ROLES);
            for (var i = 0; i < keys.length; i++) {
                $scope.roleClasses[$scope.ROLES[keys[i]]] = 'img-circle-card';
            }
        }

        // Selected clan members
        $scope.selectedMembers = ['noj', 'Nuuga', 'Zaralus', 'Nemisari', 'Isoulle', 'Lawbringer'];

        // Toggle selection for a given member by name
        $scope.toggleSelection = function toggleSelection(member) {
            var idx = $scope.selectedMembers.indexOf(member);

            // Is currently selected
            if (idx > -1) {
                $scope.selectedMembers.splice(idx, 1);
            }

                // Is newly selected
            else {
                $scope.selectedMembers.push(member);
            }
        };

        $scope.getSelectedHeroes = function() {
            var selectedHeroes = [];
            for (var i = 0; i < $scope.heroes.length; i++) {
                var h = $scope.heroes[i];
                if ($scope.heroClasses[h.id] === 'card-hero-icon-selected') {
                    selectedHeroes.push(h.id);
                }
            }
            return selectedHeroes;
        }

        $scope.getSelectedMembers = function () {
            var selectedMembers = [];
            for (var i = 0; i < $scope.clanMembers.length; i++) {
                var m = $scope.clanMembers[i];
                if ($scope.memberClasses[m] === 'card-hero-icon-selected') {
                    selectedMembers.push(m);
                }
            }
            return selectedMembers;
        }

        $scope.getBestFit = function () {
            var currPlayers = $scope.getSelectedMembers();
            var currHeroes = $scope.getSelectedHeroes();
            var currPlayersStr = currPlayers.join("_");
            var currHeroesStr = currHeroes.join("_");

            var div = angular.element(document.querySelector("#results"));

            // Clear previous results
            div.html('')


            $http({ method: 'GET', url: '/bestfit?comp=' + currHeroesStr + '&players=' + currPlayersStr + "&timeplayed=" + $scope.timePlayed + "&type=maxteam&gamemode=" + $scope.gameMode }).then(function successCallback(response) {
                var data = response.data;

                div.append('<h3> Maximizing Overall Team Skill</h3>');
                var teamSkill = 0.0;
                for (var i = 0; i < Object.keys(data).length; i++) {
                    var txtResults = '';
                    txtResults += "Hero: " + data[i].heroName + '<br/>';
                    txtResults += "Player: " + data[i].name + '<br/>';

                    var currSkill = parseFloat(data[i].overall);
                    teamSkill += currSkill;

                    txtResults += "Skill: " + currSkill.toFixed(4).toString() + '<br/>';
                    txtResults += "Time: " + data[i].time_played + ' mins<br/>';

                    //var heroNode = angular.element(document.querySelector("#" + data[i].heroName + "_hero"));
                    //var memberNode = angular.element(document.querySelector("#" + data[i].name + "_member"));
                    var divLine = angular.element('<div class="col-md-2"></div>');
                    divLine.append('<div class="card-hero-icon" style="background-image: url(\'imgs/heroes/' + data[i].heroName + '.png\')" ></div>');
                    divLine.append('<div class="card-hero-icon" title="' + data[i].name + '" style="background-image: url(\'imgs/members/' + data[i].name.toLowerCase() + '.jpg\')" ></div>');
                    divLine.append('<p>' + txtResults + '</p>');

                    div.append(divLine);

                }
                div.append('<div><b>Team Skill = </b>' + teamSkill.toFixed(4).toString() + '</div>');
            });

            $http({ method: 'GET', url: '/bestfit?comp=' + currHeroesStr + '&players=' + currPlayersStr + "&timeplayed=" + $scope.timePlayed + "&type=maxhero&gamemode=" + $scope.gameMode }).then(function successCallback(response) {
                var data = response.data;

                div.append('<h3> Maximizing Individaul Hero Skill</h3>');
                var teamSkill = 0.0;
                for (var i = 0; i < Object.keys(data).length; i++) {
                    var txtResults = '';
                    txtResults += "Hero: " + data[i].heroName + '<br/>';
                    txtResults += "Player: " + data[i].name + '<br/>';

                    var currSkill = parseFloat(data[i].overall);
                    teamSkill += currSkill;

                    txtResults += "Skill: " + currSkill.toFixed(4).toString() + '<br/>';
                    txtResults += "Time: " + data[i].time_played + ' mins<br/>';

                    //var heroNode = angular.element(document.querySelector("#" + data[i].heroName + "_hero"));
                    //var memberNode = angular.element(document.querySelector("#" + data[i].name + "_member"));
                    var divLine = angular.element('<div class="col-md-2"></div>');
                    divLine.append('<div class="card-hero-icon" style="background-image: url(\'imgs/heroes/' + data[i].heroName + '.png\')" ></div>');
                    divLine.append('<div class="card-hero-icon" title="' + data[i].name + '" style="background-image: url(\'imgs/members/' + data[i].name.toLowerCase() + '.jpg\')" ></div>');
                    divLine.append('<p>' + txtResults + '</p>');

                    div.append(divLine);

                    remove(currHeroes, data[i].heroName);
                    remove(currPlayers, data[i].name);

                }

                for (var i = 0; i < currHeroes.length; i++) {

                    var txtResults = '';
                    txtResults += "Hero: " + currHeroes[i] + '<br/>';
                    txtResults += "Player: " + currPlayers[i] + '<br/>';
                    txtResults += "Skill: N/A" + '<br/>';
                    txtResults += "Time: N/A" + '<br/>';

                    var divLine = angular.element('<div class="col-md-2"></div>');
                    //var heroNode = angular.element(document.querySelector("#" + data[i].heroName + "_hero"));
                    //var memberNode = angular.element(document.querySelector("#" + data[i].name + "_member"));
                    divLine.append('<div class="card-hero-icon" style="background-image: url(\'imgs/heroes/' + currHeroes[i] + '.png\')" ></div>');
                    divLine.append('<div class="card-hero-icon" title="' + data[i].name + '" style="background-image: url(\'imgs/members/' + currPlayers[i].toLowerCase() + '.jpg\')" ></div>');
                    divLine.append('<p>' + txtResults + '</p>');

                    div.append(divLine);

                }

                div.append('<div><b>Team Skill = </b>' + teamSkill.toFixed(4).toString() + '</div>');
            });
        }

        $scope.init = function () {
            $scope.clearHeroClasses();
            $scope.clearRoleClasses();

            $scope.isDataReady = false;

            //$scope.setCurrentClass($scope.ROLES.OFFENSE);

            $http({ method: 'GET', url: '/clan/members' }).then(function successCallback(response) {
                var tmpData = response.data;
                for (var i = 0; i < tmpData.length; i++) {
                    $scope.clanMembers.push(tmpData[i].slice(0, tmpData[i].indexOf("-")));
                }
                $scope.clearMemberClasses();
            });
        }

    });

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}
