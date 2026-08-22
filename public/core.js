/* global angular */

angular.module("app", ["googlechart", "rzModule", 'ui.bootstrap', 'ngSanitize', 'highcharts-ng'])
    .controller("GenericChartCtrl", function($http, $scope, $timeout, $q) {

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

        var sliderUpdateTimer = null;
        $scope.slider = {
            minValue: 1,
            maxValue: 4,
            options: {
                floor: 1,
                ceil: 11,
                step: 1,
                showTicks: true,
                showTicksValues: true,
                translate: function(value) {
                    if (isNaN(value)) return '';
                    if (value == 1) return '1st';
                    if (value == 2) return '2nd';
                    if (value == 3) return '3rd';
                    return value + 'th';
                },
                onChange: function() {
                    $scope.updateAllChartsVisibility();
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
            if ($scope.clanMembers && $scope.clanMembers.length > 0) {
                $scope.slider.options.ceil = $scope.clanMembers.length;
                if ($scope.slider.maxValue > $scope.clanMembers.length) {
                    $scope.slider.maxValue = $scope.clanMembers.length;
                }
            }
            $timeout(function() {
                $scope.$broadcast('rzSliderForceRender');
            });
        };

        $scope.updateAllChartsVisibility = function () {
            if (sliderUpdateTimer) {
                $timeout.cancel(sliderUpdateTimer);
            }
            sliderUpdateTimer = $timeout(function () {
                var playMode = $scope.selectedMode.id;
                var data = $scope[playMode + 'Data'];
                if (!data) return;

                for (var i = 0; i < $scope.heroes.length; i++) {
                    var heroId = $scope.heroes[i].id;
                    var chartObj = $scope["myChartObject_" + playMode + "_" + heroId];
                    if (chartObj && chartObj.show && chartObj.chartConfig && data[heroId]) {
                        $scope.hideUnwantedPeople(data, chartObj.chartConfig, heroId);
                    }
                }
            }, 80);
        };

        $scope.$watch('slider.minValue', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.updateAllChartsVisibility();
            }
        });

        $scope.$watch('slider.maxValue', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.updateAllChartsVisibility();
            }
        });

        $scope.selectedMode = $scope.modes[0];
        //$scope.maxNumOfPlayers = 4;

        $scope.quickplayData;
        $scope.competitiveData;
        $scope.data = null;
        $scope.isDataReady = false;
        $scope.currentHeroClass = $scope.ROLES.ALL;

        var touchTimer = null;
        var longPressActive = false;

        $scope.handleTouchStart = function(h, $event) {
            longPressActive = false;
            if (touchTimer) $timeout.cancel(touchTimer);

            touchTimer = $timeout(function() {
                longPressActive = true;
                if (navigator.vibrate) {
                    try { navigator.vibrate(65); } catch(e) {}
                }
                $scope.toggleHeroMultiSelect(h);
            }, 350);
        };

        $scope.handleTouchEnd = function(h, $event) {
            if (touchTimer) {
                $timeout.cancel(touchTimer);
                touchTimer = null;
            }
        };

        $scope.handleTouchCancel = function() {
            if (touchTimer) {
                $timeout.cancel(touchTimer);
                touchTimer = null;
            }
        };

        $scope.toggleHeroMultiSelect = function(h) {
            if (h.id === 'all') {
                $scope.selectedHeroes = [];
                $scope.currentHero = $scope.heroOptions[0];
                $scope.currentHeroClass = $scope.ROLES.ALL;
            } else {
                var idx = $scope.selectedHeroes.indexOf(h.id);
                if (idx > -1) {
                    $scope.selectedHeroes.splice(idx, 1);
                } else {
                    $scope.selectedHeroes.push(h.id);
                }

                if ($scope.selectedHeroes.length === 0) {
                    $scope.currentHero = $scope.heroOptions[0];
                } else {
                    $scope.currentHero = null;
                }
            }

            $scope.updateHeroClassHighlights();
            $scope.loadVisibleCharts();
        };

        $scope.setCurrentHero = function(h, $event) {
            if (longPressActive) {
                longPressActive = false;
                if ($event && typeof $event.preventDefault === 'function') {
                    $event.preventDefault();
                }
                return;
            }

            var isCtrl = $event && ($event.ctrlKey || $event.metaKey);

            if (isCtrl) {
                $scope.toggleHeroMultiSelect(h);
                return;
            }

            if (h.id === 'all') {
                $scope.selectedHeroes = [];
                $scope.currentHero = $scope.heroOptions[0];
                $scope.currentHeroClass = $scope.ROLES.ALL;
            } else {
                $scope.selectedHeroes = [h.id];
                $scope.currentHero = h;
                $scope.currentHeroClass = h.role;
            }

            $scope.updateHeroClassHighlights();
            $scope.loadVisibleCharts();
        };

        $scope.setCurrentClass = function(c) {
            $scope.selectedHeroes = [];
            for (var i = 0; i < $scope.heroes.length; i++) {
                var h = $scope.heroes[i];
                if (h.role === c) {
                    $scope.selectedHeroes.push(h.id);
                }
            }
            $scope.currentHero = null;
            $scope.currentHeroClass = c;
            $scope.updateHeroClassHighlights();
            $scope.loadVisibleCharts();
        };

        $scope.isAllSelected = function() {
            if ($scope.selectedHeroes && $scope.selectedHeroes.length > 0) {
                return $scope.selectedHeroes.length === $scope.heroes.length;
            }
            return !!($scope.currentHero && $scope.currentHero.id === 'all');
        };

        $scope.updateHeroClassHighlights = function() {
            $scope.clearHeroClasses();
            $scope.clearRoleClasses();

            if ($scope.isAllSelected()) {
                for (var i = 0; i < $scope.heroOptions.length; i++) {
                    $scope.heroClasses[$scope.heroOptions[i].id] = 'card-hero-icon-selected';
                }
                $scope.roleClasses['all'] = 'role-all-selected';
            } else if ($scope.selectedHeroes && $scope.selectedHeroes.length > 0) {
                for (var i = 0; i < $scope.selectedHeroes.length; i++) {
                    $scope.heroClasses[$scope.selectedHeroes[i]] = 'card-hero-icon-selected';
                }
                $scope.roleClasses['all'] = '';
            } else if ($scope.currentHero) {
                $scope.heroClasses[$scope.currentHero.id] = 'card-hero-icon-selected';
                $scope.roleClasses['all'] = '';
            } else {
                $scope.roleClasses['all'] = '';
            }

            if ($scope.currentHeroClass && !$scope.isAllSelected()) {
                $scope.roleClasses[$scope.currentHeroClass] = 'img-circle-card-selected';
            }
        };

        $scope.clearHeroClasses = function() {
            for (var i = 0; i < $scope.heroOptions.length; i++) {
                $scope.heroClasses[$scope.heroOptions[i].id] = 'card-hero-icon';
            }
        };

        $scope.clearRoleClasses = function() {
            var keys = Object.keys($scope.ROLES);
            for (var i = 0; i < keys.length; i++) {
                $scope.roleClasses[$scope.ROLES[keys[i]]] = 'img-circle-card';
            }
        };

        $scope.shouldShow = function(hero, playMode) {
            if ($scope.selectedMode.id !== playMode) return false;
            if ($scope.selectedHeroes && $scope.selectedHeroes.length > 0) {
                return $scope.selectedHeroes.indexOf(hero.id) !== -1;
            }
            if (!$scope.currentHero || $scope.currentHero.id === 'all') return true;
            return $scope.currentHero.id === hero.id;
        };

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
            if (!data || !data[hero] || !chartConfig || !chartConfig.series) return;

            var maxbarCount = $scope.slider.maxValue;
            var minbarCount = $scope.slider.minValue;
            if (maxbarCount > data[hero].length)
                maxbarCount = data[hero].length;

            var changed = false;
            for (var i = 0; i < data[hero].length; i++) {
                if (!chartConfig.series[i]) continue;
                var shouldBeVisible = (i >= (minbarCount - 1)) && (i < maxbarCount);
                if (chartConfig.series[i].visible !== shouldBeVisible) {
                    chartConfig.series[i].setVisible(shouldBeVisible, false);
                    changed = true;
                }
            }

            if (changed && typeof chartConfig.redraw === 'function') {
                chartConfig.redraw();
            }
        };

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

            if (currSelectedSeason === 'all') {
                $scope.competitiveData = $scope.combineAllSeasonsStats();
            } else if (currSelectedSeason === '0') {
                $scope.competitiveData = $scope.season0;
            } else {
                $scope.competitiveData = $scope['season' + currSelectedSeason.toString()] || {};
            }

            $scope.loadVisibleCharts(true);
            $scope.loadRemainingChartsAsync(true);
        }

        $scope.combineAllSeasonsStats = function() {
            var allSeasonsData = {};
            var loadedSeasons = [];
            if ($scope.season0) loadedSeasons.push($scope.season0);

            for (var s = 0; s < $scope.seasons.length; s++) {
                var sKey = 'season' + $scope.seasons[s];
                if ($scope[sKey]) {
                    loadedSeasons.push($scope[sKey]);
                }
            }

            var heroKeys = {};
            for (var i = 0; i < loadedSeasons.length; i++) {
                if (!loadedSeasons[i]) continue;
                for (var hero in loadedSeasons[i]) {
                    heroKeys[hero] = true;
                }
            }

            for (var hero in heroKeys) {
                var playerMap = {};
                var sampleFields = null;

                for (var i = 0; i < loadedSeasons.length; i++) {
                    var seasonData = loadedSeasons[i];
                    if (!seasonData || !seasonData[hero]) continue;

                    var playerList = seasonData[hero];
                    for (var p = 0; p < playerList.length; p++) {
                        var pData = playerList[p];
                        if (!pData || !pData.name || pData.name === 'N/A') continue;

                        if (!sampleFields && pData.fields) {
                            sampleFields = pData.fields;
                        }

                        if (!playerMap[pData.name]) {
                            playerMap[pData.name] = {
                                name: pData.name,
                                totalTime: 0,
                                weightedStats: {},
                                fields: pData.fields || {}
                            };
                        }

                        var pObj = playerMap[pData.name];
                        var tp = pData.time_played || 1;
                        pObj.totalTime += tp;

                        if (pData.stats) {
                            for (var statKey in pData.stats) {
                                if (statKey === 'OVERALL') continue;
                                var actualVal = pData.stats[statKey].actual || 0;
                                if (!pObj.weightedStats[statKey]) {
                                    pObj.weightedStats[statKey] = 0;
                                }
                                pObj.weightedStats[statKey] += actualVal * tp;
                            }
                        }
                    }
                }

                var combinedPlayers = [];
                for (var pName in playerMap) {
                    var pObj = playerMap[pName];
                    var avgStats = {};
                    var sumWeightedOverall = 0;

                    for (var statKey in pObj.weightedStats) {
                        var avgActual = pObj.totalTime > 0 ? (pObj.weightedStats[statKey] / pObj.totalTime) : 0;
                        avgStats[statKey] = {
                            relative: 1.0,
                            actual: avgActual
                        };
                        sumWeightedOverall += avgActual;
                    }

                    combinedPlayers.push({
                        name: pObj.name,
                        overall: sumWeightedOverall,
                        time_played: pObj.totalTime,
                        fields: pObj.fields || sampleFields || {},
                        stats: avgStats
                    });
                }

                combinedPlayers.sort(function(a, b) {
                    return b.overall - a.overall;
                });

                if (combinedPlayers.length > 0) {
                    var statKeys = Object.keys(combinedPlayers[0].stats);
                    for (var k = 0; k < statKeys.length; k++) {
                        var sk = statKeys[k];
                        var maxVal = 0;
                        for (var p = 0; p < combinedPlayers.length; p++) {
                            if (combinedPlayers[p].stats[sk].actual > maxVal) {
                                maxVal = combinedPlayers[p].stats[sk].actual;
                            }
                        }
                        if (maxVal > 0) {
                            for (var p = 0; p < combinedPlayers.length; p++) {
                                combinedPlayers[p].stats[sk].relative = combinedPlayers[p].stats[sk].actual / maxVal;
                            }
                        }
                    }
                }

                allSeasonsData[hero] = combinedPlayers;
            }

            return allSeasonsData;
        };

        $scope.getDataFromServer = function () {
            var reqPromise1 = $http({ method: 'GET', url: '/stats/sorted' });
            var reqPromise2 = $http({ method: 'GET', url: '/clan/members' });
            var reqPromiseSeasons = $http({ method: 'GET', url: '/seasons' });

            $q.all([reqPromise1, reqPromise2, reqPromiseSeasons]).then(function successCallback(responses) {
                if (!responses[0].data || Object.keys(responses[0].data).length < 1) {
                    setTimeout($scope.getDataFromServer, 1000);
                    return;
                }

                $scope.quickplayData = responses[0].data.quickplay || {};
                $scope.competitiveData = responses[0].data.competitive || {};
                $scope.season0 = $scope.competitiveData;

                $scope.clanMembers = responses[1].data || [];
                $scope.selectedClanMember = $scope.clanMembers[0] || '';

                if (responses[2] && Array.isArray(responses[2].data) && responses[2].data.length > 0) {
                    $scope.seasons = responses[2].data;
                }

                // Fetch historical seasons data
                var seasonReqs = [];
                for (var i = 0; i < $scope.seasons.length; i++) {
                    seasonReqs.push($http({ method: 'GET', url: '/stats/sorted/' + $scope.seasons[i].toString() }));
                }

                $q.all(seasonReqs).then(function(sResponses) {
                    for (var i = 0; i < $scope.seasons.length; i++) {
                        $scope['season' + $scope.seasons[i]] = (sResponses[i] && sResponses[i].data) ? sResponses[i].data.competitive : {};
                    }

                    $scope.refreshSlider();
                    $scope.isDataReady = true;
                    $scope.dataLastFetched = Date.now();
                    $scope.setCurrentClass($scope.ROLES.OFFENSE);
                    $scope.loadRemainingChartsAsync();
                });
            }, function errorCallback(responses) {
                console.error("Failed to load data from server:", responses);
                setTimeout($scope.getDataFromServer, 2000);
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
            if ($qProvider && typeof $qProvider.errorOnUnhandledRejections === 'function') {
                $qProvider.errorOnUnhandledRejections(false);
            }
        }
    ]);

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
    }, 300);
});
