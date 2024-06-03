angular.module('expenseTrackerApp').controller('ExpenseController', function ($scope, $http, $rootScope) {
    // Expense controller logic
    $scope.formData = {
        name: '',
        amount: '',
        date: '',
        category: '',
        paymentMethod: ''
    };

    $scope.submitExpense = function ($event) {
        // Implement form submission logic here
        $event.preventDefault();

        // if the form is not valid, return
        if (!$scope.formData.name || !$scope.formData.amount || !$scope.formData.date || !$scope.formData.category || !$scope.formData.paymentMethod) {
            alert('Please fill all the required fields');
            return;
        }

        // do api call to add expense
        const user = JSON.parse(localStorage.getItem('user'));

        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/add-expense',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: $rootScope.token,
                expenseName: $scope.formData.name,
                amount: $scope.formData.amount,
                category: $scope.formData.category,
                paymentMethod: $scope.formData.paymentMethod,
                date: $scope.formData.date
            }
        }).then(function successCallback(response) {
            //clear the form
            $scope.formData = {
                name: '',
                amount: '',
                date: '',
                category: '',
                paymentMethod: ''
            };
            $rootScope.getExpenses();
        }).catch(function errorCallback(response) {
            console.error(response);
        });

        // Close the expense modal after submission
        $scope.closeExpenseModal();
    };
});