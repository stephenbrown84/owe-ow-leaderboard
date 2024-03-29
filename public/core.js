/* global angular */

angular.module("app", ["googlechart", "rzModule", 'ui.bootstrap', 'ngSanitize', 'highcharts-ng'])
    .controller("GenericChartCtrl", function($http, $scope, $timeout, $q) {

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
                id: 'soldier',
                label: 'Soldier',
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
                id: 'doomfist',
                label: 'Doomfist',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'ashe',
                label: 'Ashe',
                role: $scope.ROLES.OFFENSE
            },
            {
                id: 'echo',
                label: 'Echo',
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
                id: 'hammond',
                label: 'Wrecking Ball',
                role: $scope.ROLES.TANK
            },
            {
                id: 'sigma',
                label: 'Sigma',
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
                id: 'brigitte',
                label: 'Brigitte',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'moira',
                label: 'Moira',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'baptiste',
                label: 'Baptiste',
                role: $scope.ROLES.SUPPORT
            },
            {
                id: 'symmetra',
                label: 'Symmetra',
                role: $scope.ROLES.SUPPORT
            }
        ];
        $scope.heroes = $scope.heroOptions.slice(1);

        $scope.modes = [
            {
                id: 'quickplay',
                label: 'Quick Play'
            },
            {
                id: 'competitive',
                label: 'Competitive'
            }
        ];

        $scope.clanMembers = [];
        $scope.seasons = ['4'];
        $scope.selectedSeason = '0';
        $scope.selectedClanMember = '';

        $scope.slider = {
            minValue: 1,
            maxValue: 4,
            options: {
                floor: 1,
                ceil: 12,
                step: 1,
                showTicksValues: true,
                translate: function(value) {
                    if (isNaN(value))
                        return 'NaN';
                    else if (value == 1)
                        return value + '<sup>st</sup>';
                    else if (value == 2)
                        return value + '<sup>nd</sup>';
                    else if (value == 3)
                        return value + '<sup>rd</sup>';
                    else
                        return value + '<sup>th</sup>';
                }
            }
        };

        $scope.heroClasses = {};
        $scope.roleClasses = {};
        $scope.dataLastFetched = null;

        $scope.seagullAllowedModel = false;

        $scope.isCurrentHero = function(h) {
            return ($scope.currentHero.id == h);
        };

        $scope.getDataRowClass = function(hasData) {
            if (hasData)
                return 'data-row';
            else
                return 'data-row-empty';
        };

        $scope.getPlaceForNum = function(value) {
            if (isNaN(value))
                return 'NaN'
            else if (value == 1)
                return value + 'st';
            else if (value == 2)
                return value + 'nd';
            else if (value == 3)
                return value + 'rd';
            else
                return value + 'th';
        }

        $scope.getTimePlayedString = function(value) {
            var hours = Math.floor(value / 60);
            var mins = value - (hours * 60);
            return hours + 'h ' + mins + 'm';
        }

        $scope.refreshSlider = function() {
            $timeout(function() {
                $scope.$broadcast('rzSliderForceRender');
            });
        };

        $scope.$watch('slider.minValue', function() {
            $scope.loadVisibleCharts();
            console.log('Charts loaded from slider.minValue');
        });

        $scope.$watch('slider.maxValue', function() {
            $scope.loadVisibleCharts();
            console.log('Charts loaded from slider.maxValue');
        });

        $scope.selectedMode = $scope.modes[0];
        //$scope.maxNumOfPlayers = 4;

        $scope.quickplayData;
        $scope.competitiveData;
        $scope.data = null;
        $scope.isDataReady = false;
        $scope.currentHeroClass = $scope.ROLES.ALL;

        $scope.setCurrentHero = function(h) {
            $scope.currentHero = h;
            $scope.currentHeroClass = h.role;
            $scope.clearHeroClasses();
            $scope.clearRoleClasses();
            $scope.heroClasses[h.id] = 'card-hero-icon-selected';
            $scope.loadVisibleCharts();
            console.log("charts loaded by setCurrentHero");
        }

        $scope.setCurrentClass = function(c) {
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
            $scope.loadVisibleCharts();
            console.log("charts loaded by setCurrentClass");
        }

        $scope.clearHeroClasses = function() {
            for (var i = 0; i < $scope.heroOptions.length; i++) {
                $scope.heroClasses[$scope.heroOptions[i].id] = 'card-hero-icon';
            }
        }

        $scope.clearRoleClasses = function() {
            var keys = Object.keys($scope.ROLES);
            for (var i = 0; i < keys.length; i++) {
                $scope.roleClasses[$scope.ROLES[keys[i]]] = 'img-circle-card';
            }
        }

        $scope.shouldShow = function(hero, playMode) {
            if (!$scope.currentHero) {
                if ($scope.currentHeroClass === hero.role)
                    return true;
                return false;
            }
            return ($scope.selectedMode.id == playMode) && ($scope.currentHero.id === 'all') || ($scope.currentHero.id === hero.id);
        }

        $scope.fillOutMissingData = function(data) {
            var count = data.length;
            for (var i = (count); i < 2; i++) {
                data.push({});
                data[i].name = "N/A";
                data[i].overall = 0.0;
                data[i].stats = {};

                var keys = Object.keys(data[0].stats);
                for (var j = 0; j < keys.length; j++) {
                    data[i].stats[keys] = 0.0;
                }
            }
        }

        $scope.getColorOrder = function(data, hero, minBarCount, maxBarCount) {
            var colors = [];
            for (var i = minBarCount - 1; i < maxBarCount; i++) {
                var player = data[hero][i].name;
                if (player == 'Zaralus')
                    colors.push('#F17CB0');
                else if (player == 'NorthernYeti')
                    colors.push('sienna');
                else if (player == 'MegaArcon')
                    colors.push('#9b7ef1');
                else if (player == 'noj')
                    colors.push('#5DA5DA');
                else if (player == 'Nuuga')
                    colors.push('#60BD68');
                else if (player == 'Nemisari')
                    colors.push('#FAA43A');
                else if (player == 'MajorYeehaw')
                    colors.push('#FFE135')
                else if (player == 'Praetorian')
                    colors.push('#FFE135')
                else if (player == 'Nick')
                    colors.push('#B2912F')
                else if (player == 'Dirtnapper')
                    colors.push('grey');
                else if (player == 'Isoulle')
                    colors.push('lightblue');
                else if (player == 'Suracis')
                    colors.push('tomato');
                else if (player == 'Chesley')
                    colors.push('#007D75');
                else if (player == 'Jay')
                    colors.push('#7ef1f1');
                else if (player == 'StephyCakes')
                    colors.push('#ff1493');
                else if (player == 'Leunam')
                    colors.push('#b8f17e');
                else if (player == 'WiseOldGamer')
                    colors.push('#B9264F');
                else if (player == 'CrackdCrayon')
                    colors.push('#B9264F');
                else if (player == 'Jamie')
                    colors.push('#3ffd1c');
                else if (player == 'Tasslehoff')
                    colors.push('#FF33E6');
                else if (player == 'Shankus')
                    colors.push('#004C99');
                else if (player == 'NFLDPunk')
                    colors.push('#524461');
                else if (player == 'Dutchy')
                    colors.push('#037BFC');
                else
                    colors.push('black');
            }
            //console.log(colors);
            return colors;
            //return ['red', 'blue'];
        }

        $scope.loadChart = function (hero, playMode, isSeasonChange) {
            var data = $scope[playMode + 'Data'];
            console.log(data);
            /*
            if (typeof (needsReflow) === 'undefined') needsReflow = false;

            if (needsReflow)
                $scope["myChartObject_" + playMode + "_" + hero].needsReflow = needsReflow;

            if ($scope["myChartObject_" + playMode + "_" + hero].show && $scope["myChartObject_" + playMode + "_" + hero].needsReflow) {
                $timeout(function () { $scope.doReflow(playMode, hero); }, 0, false);
                $scope["myChartObject_" + playMode + "_" + hero].needsReflow = false;
            }
            */


            // Only recreate chart if the data changed since last time it was created.
            if (!('lastUpdated' in $scope["myChartObject_" + playMode + "_" + hero]) || ($scope["myChartObject_" + playMode + "_" + hero].lastUpdated !== $scope.dataLastFetched)) {
                $scope["myChartObject_" + playMode + "_" + hero].lastUpdated = $scope.dataLastFetched;
            }
            else if (!isSeasonChange) {
                if (data && (hero in data)) {
                    $scope.hideUnwantedPeople(data, $scope["myChartObject_" + playMode + "_" + hero].chartConfig, hero);
                }
                return;
            }

            $scope["myChartObject_" + playMode + "_" + hero].chartConfig = {};
            $scope["myChartObject_" + playMode + "_" + hero].hasData = true;

            if (!data || !(hero in data)) {
                $scope["myChartObject_" + playMode + "_" + hero].hasData = false;
                return;
            }

            var maxbarCount = $scope.slider.maxValue;
            var minbarCount = $scope.slider.minValue;
            if (maxbarCount > data[hero].length)
                maxbarCount = data[hero].length;

            if (minbarCount > maxbarCount) {
                $scope["myChartObject_" + playMode + "_" + hero].hasData = false;
                return;
            }

            var colors = $scope.getColorOrder(data, hero, 1, data[hero].length);
            //var colors = $scope.getColorOrder(hero, minbarCount, maxbarCount);


            // Set up column labels
            var categories = [];
            var keys = Object.keys(data[hero][0]['stats'])
            for (var j = 0; j < keys.length; j++) {
                var weight = ''

                if (keys[j].toLocaleLowerCase() !== 'overall') {
                    if (keys[j].toLocaleLowerCase() == 'win_percentage') {
                        weight = '(ln(tp/60 + 0.5))';
                    }
                    else {
                        weight = data[hero][0]['fields'][keys[j]].weight.toString();
                        weight = '(' + weight + ')';
                    }
                }

                // Data Column
                categories.push(keys[j].replace(/_/g, ' ') + weight);
            }
            var xAxis = { categories: categories };

            // Set up number data
            var series = [];
            $scope["myChartObject_" + playMode + "_" + hero].actualDataVals = {};
            for (var i = 0; i < data[hero].length; i++) {

                var current = {};
                current.name = data[hero][i].name + ' (' + $scope.getTimePlayedString(data[hero][i]['time_played']) + ')';
                /*
            $scope["myChartObject_" + playMode + "_" + hero].data.cols.push({
                id: "s", label: ($scope.data[hero][i].name + ' (' + $scope.getTimePlayedString($scope.data[hero][i]['time_played']) + ')'), type: "number"
            });



            $scope["myChartObject_" + playMode + "_" + hero].data.cols.push({
                role: 'tooltip', type: "string", p: { 'html': true }
            });
                        */

                var vals = [];
                var actVals = [];
                for (var j = 0; j < keys.length; j++) {

                    var relValue = data[hero][i]['stats'][keys[j]]['relative'];
                    var actValue = data[hero][i]['stats'][keys[j]]['actual'];

                    vals.push(relValue);
                    actVals.push($scope.formatActualDataValue(keys[j], actValue));
                    //$scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({ v: relValue });
                    //$scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({ v: $scope.createHTMLTooltip($scope.data[hero][i].name, keys[j], actValue) });

                }
                current.data = vals;
                $scope["myChartObject_" + playMode + "_" + hero].actualDataVals[current.name] = actVals;
                series.push(current);
            }

            //$scope["myChartObject_" + playMode + "_" + hero].series = series;

            $scope["myChartObject_" + playMode + "_" + hero].chartConfig =
                new Highcharts.Chart({
                    chart: {
                        renderTo: "myChartObject_" + playMode + "_" + hero,
                        type: 'column',
                        height: 300
                    },
                    tooltip: {
                        formatter: function() {
                            var index = categories.indexOf(this.x);
                            return '<span style="color:' + this.point.color + '">\u25CF' + this.series.name + ': <b>' + $scope["myChartObject_" + playMode + "_" + hero].actualDataVals[this.series.name][index] + '</b><br/></span>';
                            //return 'The value for <b>' + this.x + '</b> is <b>' + this.y + '</b>, in series '+ this.series.name;
                        }
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        floating: false,
                        /*
                        labelFormatter: function () {
                            return '<span style="color:' + this.color + '">' + this.name + '</span>';
                        },
                        itemhiddenStyle: "red"
                        */
                        //borderWidth: 1,
                        //backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        //shadow: true
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        tickInterval: 0.5,
                        labels: {
                            formatter: function () {
                                var pcnt = this.value * 100;
                                return pcnt.toString() + '%';
                            }
                        }
                    },
                    xAxis: xAxis,
                    colors: colors,
                    plotOptions: {
                        colorByPoint: true,
                        column: {

                        }
                    },
                    series: series
                });

            $timeout($scope.doReflow, 0, false, playMode, hero);
            $scope.hideUnwantedPeople(data, $scope["myChartObject_" + playMode + "_" + hero].chartConfig, hero);
        }

        $scope.hideUnwantedPeople = function (data, chartConfig, hero) {

            var maxbarCount = $scope.slider.maxValue;
            var minbarCount = $scope.slider.minValue;
            if (maxbarCount > data[hero].length)
                maxbarCount = data[hero].length;

            for (var i = 0; i < data[hero].length; i++) {
                if ((i < (minbarCount - 1)) || (i >= maxbarCount)) {
                    if (chartConfig.series[i].visible) {
                        chartConfig.series[i].setVisible(false, false);
                    }
                } else if (!chartConfig.series[i].visible) {
                    chartConfig.series[i].setVisible(true, false);
                }
            }

            //chartConfig.options.colors = chartConfig.options.colors.slice(minbarCount - 1, maxbarCount);
            chartConfig.redraw();
        }

        $scope.doReflow = function(playMode, hero) {
            $scope["myChartObject_" + playMode + "_" + hero].chartConfig.reflow();
        }

        $scope.changeChartOptions = function(chartId) {
            var options = $scope[chartId].chartConfig.options;
            options.plotOptions.column.stacking = 'normal';
            $scope[chartId] = new Highcharts.Chart(options);
        }

        $scope.formatActualDataValue = function(fieldName, value) {
            value = value.toFixed(2);
            if ((value > 100) || (fieldName == 'win_percentage'))
                value = Math.floor(value);

            if (fieldName == 'win_percentage')
                value = value.toString() + '%';
            else if (value > 999)
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return value.toString() //.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        $scope.loadCharts = function(playMode, isSeasonChange) {
            //$scope.data = $scope[playMode + 'Data'];
            for (var i = 0; i < $scope.heroes.length; i++) {
                var hero = $scope.heroes[i];
                if ($scope["myChartObject_" + playMode + "_" + hero.id].show) {
                    $scope.loadChart($scope.heroes[i].id, playMode, isSeasonChange);
                }
            }
        }

        $scope.loadVisibleCharts = function (isSeasonChange) {
            var isSeasonChange = isSeasonChange || false;

            if (!$scope.isDataReady) return;

            for (var i = 0; i < $scope.heroes.length; i++) {
                var hero = $scope.heroes[i];
                $scope["myChartObject_quickplay_" + hero.id].show = $scope.shouldShow(hero, 'quickplay');
                $scope["myChartObject_competitive_" + hero.id].show = $scope.shouldShow(hero, 'competitive');
            }

            $scope.loadCharts($scope.selectedMode.id, isSeasonChange);

            for (var i = 0; i < $scope.heroes.length; i++) {
                var hero = $scope.heroes[i];
                if ($scope["myChartObject_quickplay_" + hero.id].show && $scope["myChartObject_quickplay_" + hero.id].hasData) {
                    $timeout($scope.doReflow, 0, false, 'quickplay', hero.id);
                }
                if ($scope["myChartObject_competitive_" + hero.id].show && $scope["myChartObject_competitive_" + hero.id].hasData) {
                    $timeout($scope.doReflow, 0, false, 'competitive', hero.id);
                }
            }
        }

        $scope.changeActivePlayMode = function(ind) {
            $scope.selectedMode = $scope.modes[ind];
            $scope.loadVisibleCharts();
            console.log("charts loaded by changeActivePlayMode");
        }

        $scope.loadRemainingChartsAsync = function (compOnly) {
            var isCompOnly = compOnly || false;

            var delay = 250;
            var step = 250;
            for (var i = 0; i < $scope.heroes.length; i++) {
                var hero = $scope.heroes[i];
                if (!isCompOnly) {
                    $timeout($scope.loadChart, delay, false, hero.id, 'quickplay');
                    delay += step;
                }
                $timeout($scope.loadChart, delay, false, hero.id, 'competitive');
                delay += step;
            }
        }

        $scope.init = function() {
            $scope.clearHeroClasses();
            $scope.clearRoleClasses();

            $scope.isDataReady = false;
            $scope.selectedMode = $scope.modes[0];

            //Initial holder dictionary for all possible charts
            for (var i = 0; i < $scope.heroes.length; i++) {
                var hero = $scope.heroes[i];

                if (!(("myChartObject_quickplay_" + hero.id) in $scope)) {
                    $scope["myChartObject_quickplay_" + hero.id] = {};
                    $scope["myChartObject_quickplay_" + hero.id].hasData = false;
                    $scope["myChartObject_quickplay_" + hero.id].show = false;
                }
                if (!(("myChartObject_competitive_" + hero.id) in $scope)) {
                    $scope["myChartObject_competitive_" + hero.id] = {};
                    $scope["myChartObject_competitive_" + hero.id].hasData = false;
                    $scope["myChartObject_competitive_" + hero.id].show = false;
                }
            }
            $scope.getDataFromServer();
        };

        $scope.changeSelectedCompetitiveSeason = function (currSelectedSeason) {

            $scope.competitiveData = $scope['season' + currSelectedSeason.toString()];

            //$scope.dataLastFetched = Date.now();
            $scope.loadVisibleCharts(true);
            $scope.loadRemainingChartsAsync(true);

            /*
            var reqPromise1;
            if (currSelectedSeason == '0') {
                reqPromise1 = $http({ method: 'GET', url: '/stats/sorted' });
            } else {
                reqPromise1 = $http({ method: 'GET', url: '/stats/sorted/' + currSelectedSeason });
            }

            reqPromise1.then(function successCallback(response) {
                if (Object.keys(response.data) < 1) {
                    setTimeout($scope.changeSelectedCompetitiveSeason, 250);
                    return;
                }

                $scope.competitiveData = response.data.competitive;
                $scope.isDataReady = true;

                $scope.refreshSlider();

                $scope.dataLastFetched = Date.now();
                $scope.loadRemainingChartsAsync();
            }, function errorCallback(responses) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            */

        }

        $scope.getDataFromServer = function () {
            var reqPromise1 = $http({ method: 'GET', url: '/stats/sorted' });
            var reqPromise2 = $http({ method: 'GET', url: '/clan/members' });

            // Previous competitive season data requests
            var seasonReqs = [];
            for (var i = 0; i < $scope.seasons.length; i++) {
                seasonReqs.push($http({ method: 'GET', url: '/stats/sorted/' + $scope.seasons[i].toString() }));
            }

            $q.all([reqPromise1, reqPromise2].concat(seasonReqs)).then(function successCallback(responses) {
                if (Object.keys(responses[0].data) < 1) {
                    setTimeout($scope.getDataFromServer, 250);
                    return;
                }

                $scope.quickplayData = responses[0].data.quickplay;
                $scope.competitiveData = responses[0].data.competitive;
                $scope.season0 = $scope.competitiveData;

                for (var i = 0; i < $scope.seasons.length; i++) {
                    $scope['season' + $scope.seasons[i]] = responses[2 + i].data.competitive;
                }

                $scope.clanMembers = responses[1].data;
                $scope.selectedClanMember = $scope.clanMembers[0];

                $scope.refreshSlider();

                $scope.isDataReady = true;
                $scope.dataLastFetched = Date.now();
                $scope.setCurrentClass($scope.ROLES.OFFENSE);
                $scope.loadRemainingChartsAsync();
            }, function errorCallback(responses) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        $scope.getInitChartConfig = function() {
            return {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Stephen Initial'
                },
                subtitle: {
                    text: 'Test options by dragging the sliders below'
                },
                xAxis: {
                    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },
                plotOptions: {
                    column: {
                        stacking: 'percent'
                    }
                },
                series: [
                    {
                        name: 'John',
                        data: [5, 3, 4, 7, 10]
                    }, {
                        name: 'Jane',
                        data: [2, 2, 3, 2, 15]
                    }, {
                        name: 'Joe',
                        data: [3, 4, 4, 2, 5]
                    }
                ]
            };
        }

    })
    .filter('range', function() {
        return function(input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i = min; i < max; i++)
                input.push(i);
            return input;
        };
    })
    .config([
        '$qProvider', function($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        }
    ]);
