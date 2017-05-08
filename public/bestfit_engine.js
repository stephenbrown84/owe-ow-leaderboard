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

        $scope.heroClasses = {};
        $scope.roleClasses = {};
        $scope.clanMembers = [];

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

        $scope.getBestFit = function () {
            var currPlayers = $scope.selectedMembers.join("_");
            var currHeroes = $scope.getSelectedHeroes().join("_");
            $http({ method: 'GET', url: '/bestfit?comp=' + currHeroes + '&players=' + currPlayers }).then(function successCallback(response) {
                var results = '';
                var data = response.data;
                for (var i = 0; i < Object.keys(data).length; i++) {
                    results += "Hero: " + data[i].heroName + '\n';
                    results += "Player: " + data[i].name + '\n';
                    results += "Skill: " + data[i].overall + '\n';
                    results += "Time Player: " + data[i].time_played + ' mins\n\n';
                }
                $scope.bestfitResults = results;
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
            });
        }

    });
