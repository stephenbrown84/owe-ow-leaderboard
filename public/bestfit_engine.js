/* global angular */
angular.module("app", [])
    .controller("BestFitCtrl", function($http, $scope, $timeout, $q) {

        $scope.ROLES = {
            OFFENSE: 'OFFENSE',
            TANK: 'TANK',
            SUPPORT: 'SUPPORT',
            ALL: 'ALL'
        };

        $scope.heroOptions = [
            { id: 'all', label: 'All Heroes', role: $scope.ROLES.OFFENSE },

            // DAMAGE (ATTACK)
            { id: 'anran', label: 'Anran', role: $scope.ROLES.OFFENSE },
            { id: 'ashe', label: 'Ashe', role: $scope.ROLES.OFFENSE },
            { id: 'bastion', label: 'Bastion', role: $scope.ROLES.OFFENSE },
            { id: 'mccree', label: 'Cassidy', role: $scope.ROLES.OFFENSE },
            { id: 'echo', label: 'Echo', role: $scope.ROLES.OFFENSE },
            { id: 'emre', label: 'Emre', role: $scope.ROLES.OFFENSE },
            { id: 'freja', label: 'Freja', role: $scope.ROLES.OFFENSE },
            { id: 'genji', label: 'Genji', role: $scope.ROLES.OFFENSE },
            { id: 'hanzo', label: 'Hanzo', role: $scope.ROLES.OFFENSE },
            { id: 'junkrat', label: 'Junkrat', role: $scope.ROLES.OFFENSE },
            { id: 'mei', label: 'Mei', role: $scope.ROLES.OFFENSE },
            { id: 'pharah', label: 'Pharah', role: $scope.ROLES.OFFENSE },
            { id: 'reaper', label: 'Reaper', role: $scope.ROLES.OFFENSE },
            { id: 'shion', label: 'Shion', role: $scope.ROLES.OFFENSE },
            { id: 'sierra', label: 'Sierra', role: $scope.ROLES.OFFENSE },
            { id: 'sojourn', label: 'Sojourn', role: $scope.ROLES.OFFENSE },
            { id: 'soldier', label: 'Soldier: 76', role: $scope.ROLES.OFFENSE },
            { id: 'sombra', label: 'Sombra', role: $scope.ROLES.OFFENSE },
            { id: 'symmetra', label: 'Symmetra', role: $scope.ROLES.OFFENSE },
            { id: 'torbjorn', label: 'Torbjörn', role: $scope.ROLES.OFFENSE },
            { id: 'tracer', label: 'Tracer', role: $scope.ROLES.OFFENSE },
            { id: 'vendetta', label: 'Vendetta', role: $scope.ROLES.OFFENSE },
            { id: 'venture', label: 'Venture', role: $scope.ROLES.OFFENSE },
            { id: 'widowmaker', label: 'Widowmaker', role: $scope.ROLES.OFFENSE },

            // TANK
            { id: 'dmon', label: 'D.Mon', role: $scope.ROLES.TANK },
            { id: 'domina', label: 'Domina', role: $scope.ROLES.TANK },
            { id: 'doomfist', label: 'Doomfist', role: $scope.ROLES.TANK },
            { id: 'dva', label: 'D.Va', role: $scope.ROLES.TANK },
            { id: 'hazard', label: 'Hazard', role: $scope.ROLES.TANK },
            { id: 'junkerqueen', label: 'Junker Queen', role: $scope.ROLES.TANK },
            { id: 'mauga', label: 'Mauga', role: $scope.ROLES.TANK },
            { id: 'orisa', label: 'Orisa', role: $scope.ROLES.TANK },
            { id: 'ramattra', label: 'Ramattra', role: $scope.ROLES.TANK },
            { id: 'reinhardt', label: 'Reinhardt', role: $scope.ROLES.TANK },
            { id: 'roadhog', label: 'Roadhog', role: $scope.ROLES.TANK },
            { id: 'sigma', label: 'Sigma', role: $scope.ROLES.TANK },
            { id: 'winston', label: 'Winston', role: $scope.ROLES.TANK },
            { id: 'hammond', label: 'Wrecking Ball', role: $scope.ROLES.TANK },
            { id: 'zarya', label: 'Zarya', role: $scope.ROLES.TANK },

            // SUPPORT
            { id: 'ana', label: 'Ana', role: $scope.ROLES.SUPPORT },
            { id: 'baptiste', label: 'Baptiste', role: $scope.ROLES.SUPPORT },
            { id: 'brigitte', label: 'Brigitte', role: $scope.ROLES.SUPPORT },
            { id: 'illari', label: 'Illari', role: $scope.ROLES.SUPPORT },
            { id: 'jetpackcat', label: 'Jetpack Cat', role: $scope.ROLES.SUPPORT },
            { id: 'juno', label: 'Juno', role: $scope.ROLES.SUPPORT },
            { id: 'kiriko', label: 'Kiriko', role: $scope.ROLES.SUPPORT },
            { id: 'lifeweaver', label: 'Lifeweaver', role: $scope.ROLES.SUPPORT },
            { id: 'lucio', label: 'Lúcio', role: $scope.ROLES.SUPPORT },
            { id: 'mercy', label: 'Mercy', role: $scope.ROLES.SUPPORT },
            { id: 'mizuki', label: 'Mizuki', role: $scope.ROLES.SUPPORT },
            { id: 'moira', label: 'Moira', role: $scope.ROLES.SUPPORT },
            { id: 'wuyang', label: 'Wuyang', role: $scope.ROLES.SUPPORT },
            { id: 'zenyatta', label: 'Zenyatta', role: $scope.ROLES.SUPPORT }
        ];

        $scope.selectedType = "maxteam";
        $scope.heroClasses = {};
        $scope.roleClasses = {};
        $scope.memberClasses = {};
        $scope.gameMode = 'quickplay';
        $scope.disableOverallSkillResult = false;

        $scope.clanMembers = [];
        $scope.timePlayed = 30;

        $scope.heroes = $scope.heroOptions.slice(1);

        $scope.bestfitResults = '';

        $scope.toggleAllHeroSelection = function () {
            var allSelected = $scope.isAllSelected();
            var targetHeroClass = allSelected ? 'card-hero-icon' : 'card-hero-icon-selected';
            var targetRoleClass = allSelected ? 'img-circle-card' : 'img-circle-card-selected';

            for (var i = 0; i < $scope.heroOptions.length; i++) {
                var h = $scope.heroOptions[i];
                $scope.heroClasses[h.id] = targetHeroClass;
            }

            var roleKeys = Object.keys($scope.roleClasses);
            for (var i = 0; i < roleKeys.length; i++) {
                $scope.roleClasses[roleKeys[i]] = targetRoleClass;
            }
        };

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

        $scope.toggleClassSelection = function (c) {
            //$scope.currentHero = null;
            //$scope.currentHeroClass = c;
            //$scope.clearHeroClasses();
            //$scope.clearRoleClasses();
            if ($scope.roleClasses[c] == 'img-circle-card-selected') {
                $scope.roleClasses[c] = 'img-circle-card';
            }
            else {
                $scope.roleClasses[c] = 'img-circle-card-selected';
            }

            for (var i = 0; i < $scope.heroes.length; i++) {
                var h = $scope.heroes[i];
                if (h.role === c) {
                    if ($scope.heroClasses[h.id] == 'card-hero-icon-selected') {
                        $scope.heroClasses[h.id] = 'card-hero-icon';
                    }
                    else {
                        $scope.heroClasses[h.id] = 'card-hero-icon-selected';
                    }
                }
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

        $scope.isAllSelected = function () {
            for (var i = 0; i < $scope.heroes.length; i++) {
                if ($scope.heroClasses[$scope.heroes[i].id] !== 'card-hero-icon-selected') {
                    return false;
                }
            }
            return true;
        };

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
        };

        $scope.getBestFit = function () {
            var currPlayers = $scope.getSelectedMembers();
            var currHeroes = $scope.getSelectedHeroes();
            if (currHeroes.length === 0 || currPlayers.length === 0) {
                alert("Please select at least 1 hero and 1 clan member.");
                return;
            }
            var currPlayersStr = currPlayers.join("_");
            var currHeroesStr = currHeroes.join("_");

            var div = angular.element(document.querySelector("#results"));
            div.html('');

            if (!$scope.disableOverallSkillResult) {
                $http({ method: 'GET', url: '/bestfit?comp=' + currHeroesStr + '&players=' + currPlayersStr + "&timeplayed=" + $scope.timePlayed + "&type=maxteam&gamemode=" + $scope.gameMode }).then(function successCallback(response) {
                    var data = response.data;
                    var sectionCard = angular.element('<div class="bestfit-section-card"></div>');
                    sectionCard.append('<h3 class="bestfit-section-title">🏆 Maximizing Overall Team Skill</h3>');

                    if ('error' in data) {
                        sectionCard.append('<p class="errorMessage">' + data.error + '</p>');
                        div.append(sectionCard);
                        return;
                    }

                    var grid = angular.element('<div class="bestfit-grid"></div>');
                    var teamSkill = 0.0;
                    for (var i = 0; i < Object.keys(data).length; i++) {
                        var item = data[i];
                        var currSkill = parseFloat(item.overall || 0);
                        teamSkill += currSkill;

                        var matchCard = angular.element('<div class="bestfit-match-item"></div>');
                        var iconsRow = angular.element('<div class="bestfit-icons-row"></div>');
                        iconsRow.append('<div class="card-hero-icon" title="' + item.heroName + '" style="background-image: url(\'imgs/heroes/' + item.heroName + '.png\')"></div>');
                        iconsRow.append('<div class="card-hero-icon" title="' + item.name + '" style="background-image: url(\'imgs/members/' + (item.name ? item.name.toLowerCase() : '') + '.jpg\')"></div>');

                        var details = angular.element('<div class="bestfit-details"></div>');
                        details.append('<div class="bestfit-hero-name">' + item.heroName.toUpperCase() + '</div>');
                        details.append('<div class="bestfit-player-name">' + item.name + '</div>');
                        details.append('<div class="bestfit-skill-score">Skill: ' + (currSkill > 0 ? currSkill.toFixed(4) : 'N/A') + '</div>');
                        details.append('<div>Time: ' + (item.time_played !== undefined ? item.time_played + (typeof item.time_played === 'number' ? ' mins' : '') : 'N/A') + '</div>');

                        matchCard.append(iconsRow);
                        matchCard.append(details);
                        grid.append(matchCard);
                    }
                    sectionCard.append(grid);
                    sectionCard.append('<div class="bestfit-team-total"><b>Total Combined Team Skill:</b> ' + teamSkill.toFixed(4) + '</div>');
                    div.append(sectionCard);
                    $scope.scrollToResults();
                });
            }

            $http({ method: 'GET', url: '/bestfit?comp=' + currHeroesStr + '&players=' + currPlayersStr + "&timeplayed=" + $scope.timePlayed + "&type=maxhero&gamemode=" + $scope.gameMode }).then(function successCallback(response) {
                var data = response.data;
                var sectionCard = angular.element('<div class="bestfit-section-card"></div>');
                sectionCard.append('<h3 class="bestfit-section-title">⭐ Maximizing Individual Hero Skill</h3>');

                var grid = angular.element('<div class="bestfit-grid"></div>');
                var teamSkill = 0.0;
                var remainingHeroes = currHeroes.slice();
                var remainingPlayers = currPlayers.slice();

                for (var i = 0; i < Object.keys(data).length; i++) {
                    var item = data[i];
                    var currSkill = parseFloat(item.overall || 0);
                    teamSkill += currSkill;

                    var matchCard = angular.element('<div class="bestfit-match-item"></div>');
                    var iconsRow = angular.element('<div class="bestfit-icons-row"></div>');
                    iconsRow.append('<div class="card-hero-icon" title="' + item.heroName + '" style="background-image: url(\'imgs/heroes/' + item.heroName + '.png\')"></div>');
                    iconsRow.append('<div class="card-hero-icon" title="' + item.name + '" style="background-image: url(\'imgs/members/' + (item.name ? item.name.toLowerCase() : '') + '.jpg\')"></div>');

                    var details = angular.element('<div class="bestfit-details"></div>');
                    details.append('<div class="bestfit-hero-name">' + item.heroName.toUpperCase() + '</div>');
                    details.append('<div class="bestfit-player-name">' + item.name + '</div>');
                    details.append('<div class="bestfit-skill-score">Skill: ' + currSkill.toFixed(4) + '</div>');
                    details.append('<div>Time: ' + item.time_played + ' mins</div>');

                    matchCard.append(iconsRow);
                    matchCard.append(details);
                    grid.append(matchCard);

                    remove(remainingHeroes, item.heroName);
                    remove(remainingPlayers, item.name);
                }

                for (var i = 0; i < remainingHeroes.length; i++) {
                    if (i >= remainingPlayers.length) break;
                    var matchCard = angular.element('<div class="bestfit-match-item"></div>');
                    var iconsRow = angular.element('<div class="bestfit-icons-row"></div>');
                    iconsRow.append('<div class="card-hero-icon" title="' + remainingHeroes[i] + '" style="background-image: url(\'imgs/heroes/' + remainingHeroes[i] + '.png\')"></div>');
                    iconsRow.append('<div class="card-hero-icon" title="' + remainingPlayers[i] + '" style="background-image: url(\'imgs/members/' + remainingPlayers[i].toLowerCase() + '.jpg\')"></div>');

                    var details = angular.element('<div class="bestfit-details"></div>');
                    details.append('<div class="bestfit-hero-name">' + remainingHeroes[i].toUpperCase() + '</div>');
                    details.append('<div class="bestfit-player-name">' + remainingPlayers[i] + '</div>');
                    details.append('<div class="bestfit-skill-score">Skill: N/A</div>');
                    details.append('<div>Time: N/A</div>');

                    matchCard.append(iconsRow);
                    matchCard.append(details);
                    grid.append(matchCard);
                }

                sectionCard.append(grid);
                sectionCard.append('<div class="bestfit-team-total"><b>Total Combined Team Skill:</b> ' + teamSkill.toFixed(4) + '</div>');
                div.append(sectionCard);
                $scope.scrollToResults();
            });
        };

        $scope.scrollToResults = function() {
            $timeout(function() {
                var resultsEl = document.getElementById("results");
                if (resultsEl) {
                    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        };

        $scope.init = function () {
            $scope.clearHeroClasses();
            $scope.clearRoleClasses();

            // Default pre-select a standard 5v5 team (1 Tank, 2 Damage, 2 Support)
            var defaultHeroes = ['reinhardt', 'mccree', 'genji', 'ana', 'lucio'];
            for (var h = 0; h < defaultHeroes.length; h++) {
                $scope.heroClasses[defaultHeroes[h]] = 'card-hero-icon-selected';
            }

            $scope.isDataReady = false;

            $http({ method: 'GET', url: '/clan/members' }).then(function successCallback(response) {
                var tmpData = response.data;
                $scope.clanMembers = [];
                for (var i = 0; i < tmpData.length; i++) {
                    var mName = tmpData[i].slice(0, tmpData[i].indexOf("-"));
                    if ($scope.clanMembers.indexOf(mName) === -1) {
                        $scope.clanMembers.push(mName);
                    }
                }
                $scope.clearMemberClasses();

                // Pre-select 5 active clan members by default
                var defaultMembers = ['Nuuga', 'Zaralus', 'Nemisari', 'MajorYeehaw', 'MegaArcon'];
                for (var m = 0; m < defaultMembers.length; m++) {
                    if ($scope.clanMembers.indexOf(defaultMembers[m]) !== -1) {
                        $scope.memberClasses[defaultMembers[m]] = 'card-hero-icon-selected';
                    }
                }
            });
        };

    });

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}
