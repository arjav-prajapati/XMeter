angular.module('expenseTrackerApp').controller('sentRemainderController', function ($scope, $http, $rootScope) {

    $scope.sentRemainders = [];

    //get all sent remainders
    $scope.getSentRemainders = function () {
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-sent-remainders/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                token: $rootScope.token || localStorage.getItem('xmeterToken')
            })
        }).then(function successCallback(response) {
            $scope.sentRemainders = response.data.remainders;
            console.log($scope.sentRemainders)
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };

    $scope.getSentRemainders();
});