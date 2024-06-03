angular.module('expenseTrackerApp').controller('TodayController', function ($scope, $location, $http, $rootScope) {

    $scope.isIncomeLoading = true;
    $scope.isExpenseLoading = true;
    //return date in date month(in words) year format (eg. 12 January, 2021)
    $scope.currentDate = new Date();
    $scope.getDate = function () {
        const dateD = new Date($scope.currentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return dateD;
    }

    $scope.date = $scope.getDate(new Date());

    $scope.dateExpense = [];
    $scope.dateIncome = [];

    //get all expenses for the date
    $scope.getDateExpenses = function () {
        $scope.isExpenseLoading = true;
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-date-expense',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: $rootScope.token,
                date: $scope.currentDate
            }
        }).then(function successCallback(response) {
            $scope.dateExpense = response.data.expenses;
            $scope.isExpenseLoading = false;
        }).catch(function errorCallback(response) {
            console.error(response);
            $scope.isExpenseLoading = false;
        });
    }


    //get all incomes for the date
    $scope.getDateIncome = function () {
        $scope.isIncomeLoading = true;
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-date-income',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: $rootScope.token,
                date: $scope.currentDate
            }
        }).then(function successCallback(response) {
            $scope.dateIncome = response.data.income;
            $scope.isIncomeLoading = false;
        }).catch(function errorCallback(response) {
            console.error(response);
            $scope.isIncomeLoading = false;
        });
    }


    $scope.getNextDate = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
        if ($scope.currentDate > new Date()) {
            $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
            return;
        }
        $scope.date = $scope.getDate();
        $scope.getDateExpenses();
        $scope.getDateIncome();
    }

    $scope.getPreviousDate = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
        if ($scope.currentDate < new Date('2021-01-01')) {
            $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
            return;
        }
        $scope.date = $scope.getDate();
        $scope.getDateExpenses();
        $scope.getDateIncome();
    }


    $scope.getDateExpenses();
    $scope.getDateIncome();
});