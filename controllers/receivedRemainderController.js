angular.module('expenseTrackerApp').controller('receivedRemainderController', function ($scope, $http, $rootScope) {


    $scope.receivedRemainders = [];

    //get all received remainders
    $scope.getReceivedRemainders = function () {
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-received-remainders/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                token: $rootScope.token || localStorage.getItem('xmeterToken')
            })
        }).then(function successCallback(response) {
            $scope.receivedRemainders = response.data.remainders;
            console.log($scope.receivedRemainders)
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };

    $scope.getReceivedRemainders();
});