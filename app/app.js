/*jshint esversion: 6 */
(function () {
    // Get elements from DOM
    var input_text = document.getElementById('input_txt');
    var max_results = document.getElementById('max_results');

    var app = angular.module('myApp', []);

    app.controller('mainController', ['$scope', function ($scope) {
        $scope.input_text = "";
        $scope.max_results = "";


        // Events Handlers \\

        // max_results ng-keypress
        $scope.isNumber = function ($event) {
            $event = ($event) ? $event : window.event;
            var charCode = ($event.which) ? $event.which : $event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                alert("Please insert a number.");
                $event.preventDefault();
            }
        };

        // ng-show table 
        $scope.isDone = function () {
            return $scope.dict !== undefined;
        };

        // disable/enable analysis btn 
        $scope.isReady = function () {
            return ($scope.input_text === '');
        };

        // reset text
        $scope.resetText = function () {
            $scope.input_text = "";
            $scope.max_results = "";
            $scope.dict = undefined;
            $scope.max_results = undefined;
        };

        // analysis_btn ng-click
        $scope.analiseText = function () {
            var max = ($scope.max_results !== "") ? parseInt($scope.max_results) : Number.MAX_VALUE;
            // FILTER
            // Lowercase 
            // Remove Symbols
            var text = $scope.input_text.toLowerCase().replace(/[^a-z ]/g, " "); // O(n)
            // Words Array
            var words = text.split(/\s+/); // O(n)

            // HashMap<word, frequency> $scope.dict
            $scope.dict = new Map();
            // Split text into words 
            words.forEach(function (word) { // O(n)
                if (word !== '') {
                    // hash the word => increment frequency 
                    $scope.dict.set(word, ($scope.dict.get(word) || 0) + 1); // O(1) 
                }
            });

            // SORT (Bucket Sort with Bucket Size = 1)
            // Sort the keys(word) of the Map according to the values(frequency)
            // Group words into nested arrays (or buckets) indexed by the word frequency.
            // i.e. wordsByFrequency[2] will be an array of all words found 2 times in the text.
            // Record the max frequency (in order to apply counting sort)
            var wordsByFrequency = [];
            var maxFreq = 0;

            for (var word of $scope.dict.keys()) { // O(k) where k the number of distinct words k<=n
                var freq = $scope.dict.get(word);
                // Initialise new bucket if not defined
                wordsByFrequency[freq] = wordsByFrequency[freq] || [];
                // Add element to bucket 
                wordsByFrequency[freq].push(word);
                // Keep track of maxFreq
                if (freq > maxFreq) maxFreq = freq;
            }

            $scope.sortedKeys = [];
            for (var i = maxFreq; i > 0; --i) { // O(k) 
                if (($scope.sortedKeys.length < max) && (wordsByFrequency[i])) { // skip undefined entries of the array
                    for (var item of wordsByFrequency[i]) {
                        if ($scope.sortedKeys.length >= max) break;
                        $scope.sortedKeys.push(item);
                    }
                }
            }
            //            // Console Tests
            //            console.log("$scope.dict: \n<word, frequency>");
            //            console.log($scope.dict);
            //            console.log("wordsByFrequency: ");
            //            console.log(wordsByFrequency);
        };
    }]);

} ());