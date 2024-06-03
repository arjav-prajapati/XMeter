angular.module('expenseTrackerApp').controller('IncomeController', function ($scope, $rootScope, $http) {
    // Income controller logic
    $scope.formData = {
        source: '',
        amount: '',
        date: ''
    };

    // Budget & Income controller logic
    $scope.submitIncome = function ($event) {
        $event.preventDefault();
        // Implement form submission logic here

        // if the form is not valid, return
        if (!$scope.formData.source || !$scope.formData.amount || !$scope.formData.date) {
            alert('Please fill all the required fields');
            return;
        }

        // do api call to add income
        const user = JSON.parse(localStorage.getItem('user'));

        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/add-income',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: $rootScope.token,
                incomeName: $scope.formData.source,
                amount: $scope.formData.amount,
                source: $scope.formData.source,
                date: $scope.formData.date
            }
        }).then(function successCallback(response) {
            //clear the form
            $scope.formData = {
                source: '',
                amount: '',
                date: ''
            };
            console.log(response);
            $rootScope.getMonthIncome();
        }).catch(function errorCallback(response) {
            console.error(response);
        });

        // Close the income modal after submission
        $scope.closeIncomeModal();
    };
});