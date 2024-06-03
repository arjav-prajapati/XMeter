
angular.module('expenseTrackerApp').controller('RemainderController', function ($scope, $http, $rootScope) {
    console.log('Remainder controller loaded!');
    $scope.newRemainder = {
        subject: '',
        amount: '',
        datetime: '',
        sentTo: ''
    };

    $scope.isAddingRemainder = false;
    $scope.sentRemainders = [];
    $scope.receivedRemainders = [];

    // Function to add a new Remainder
    $scope.newRemainder.addRemainder = function (event) {
        event.preventDefault();
        $scope.isAddingRemainder = true;
        console.log('Adding new Remainder:', $scope.newRemainder);
        // Check if the form is valid
        if ($scope.RemainderForm.$valid) {
            // Form is valid, perform HTTP request to add Remainder
            $http({
                method: 'POST',
                url: 'https://xmeter.onrender.com/api/add-remainder',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    subject: $scope.newRemainder.subject,
                    amount: $scope.newRemainder.amount,
                    date: $scope.newRemainder.datetime,
                    sentTo: $scope.newRemainder.sentTo,
                    token: $rootScope.token || localStorage.getItem('xmeterToken')
                }
            }).then(function successCallback(response) {
                console.log(response);
                // Reset the form
                $scope.newRemainder = {
                    subject: '',
                    amount: '',
                    date: {},
                    sentTo: ''
                };
                //set undirty
                $scope.RemainderForm.$setPristine();
                $scope.RemainderForm.$setUntouched();
                $scope.isAddingRemainder = false;
                alert('Remainder added successfully!');
            }).catch(function errorCallback(response) {
                console.error(response);
                $scope.isAddingRemainder = false;
                alert(response.data.message);
            })
        } else {
            // Form is invalid, display error messages
            alert('Form submission failed. Please check the form fields.');
        }
    };


    //get remainders 
    $scope.getSentRemainders = function () {
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-sent-remainders/2',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                token: $rootScope.token
            }
        }).then(function successCallback(response) {
            $scope.sentRemainders = response.data.remainders;
            console.log($scope.sentRemainders)
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };


    $scope.getReceivedRemainders = function () {
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-received-remainders/2',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                token: $rootScope.token
            }
        }).then(function successCallback(response) {
            $scope.receivedRemainders = response.data.remainders;
            console.log($scope.receivedRemainders)
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };

    $scope.getSentRemainders();
    $scope.getReceivedRemainders();

    $scope.addRemainder = function () {
        // Logic to add a new Remainder
    };
});