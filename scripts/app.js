const app = angular.module('expenseTrackerApp', ['ngRoute']).run(async function ($rootScope, $http) {
    $rootScope.hostUrl = 'xmeter.netlify.app';
    $rootScope.showExpenseModal = false;
    $rootScope.showBudgetIncomeModal = false;
    $rootScope.token = localStorage.getItem('xmeterToken');
    if (!$rootScope.token && localStorage.getItem('xmeterToken') === null) {
        location.href = $rootScope.hostUrl + 'signin.html';
        location.refresh();
    }
    $rootScope.openExpenseModal = function () {
        console.log('Opening expense modal');
        $rootScope.showExpenseModal = true;
    };
    $rootScope.closeExpenseModal = function () {
        $rootScope.showExpenseModal = false;
    };
    $rootScope.openIncomeModal = function () {
        $rootScope.showBudgetIncomeModal = true;
    };
    $rootScope.closeIncomeModal = function () {
        $rootScope.showBudgetIncomeModal = false;
    };

    $rootScope.dateToday = function () {
        return new Date().toISOString().split("T")[0];
    }

    //get date and convert it into formate "dd/mm/yyyy"
    $rootScope.getRemainderFormattedDate = function (date) {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }


    // set user data
    $rootScope.user = JSON.parse(localStorage.getItem('user'));


    $rootScope.recentExpenses = [];

    // get expenses
    $rootScope.getExpenses = function () {
        const user = JSON.parse(localStorage.getItem('user'));
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-expenses/3',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                token: $rootScope.token
            }
        }).then(function successCallback(response) {
            $rootScope.recentExpenses = response.data.expenses;
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };



    //get time on AM and PM
    $rootScope.getTime = function (date) {
        const dateD = new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return dateD;
    }

    $rootScope.getMonthYear = function (id) {
        // id have month and year
        if (id === undefined) return "month, year";
        const month = id.month;
        const year = id.year;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[month - 1]}, ${year}`;
    }

    // calculate time difference
    $rootScope.calculateTimeDiff = function (date) {
        const expenseDate = new Date(date).getTime();
        const currentDate = new Date().getTime();

        const diff = currentDate - expenseDate;

        //if less than a minute
        if (diff < 60000) {
            return 'Just now';
        }

        //if less than an hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} m`;
        }

        //if less than a day
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} h`;
        }

        //if less than a week
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days} d`;
        }

        //if more than a week
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        //if more than a month
        if (days > 30) {
            const months = Math.floor(days / 30);
            return `${months} month`;
        }

        //if more than a year
        if (days > 365) {
            const years = Math.floor(days / 365);
            return `${years} year`;
        }

        return days;
    }



    // get monthly expenses
    $rootScope.monthlyExpenses = [];
    $rootScope.getMonthlyExpenses = function () {
        const user = JSON.parse(localStorage.getItem('user'));
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/get-monthly-expenses/4',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: $rootScope.token
            }
        }).then(function successCallback(response) {
            $rootScope.monthlyExpenses = response.data.expenses;
            $rootScope.currentExpenses = response.data.expenses.pop().total;
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };


    $rootScope.lastMonthIncome = 0;
    $rootScope.getMonthIncome = function (month) {
        month = month || 1;
        const user = JSON.parse(localStorage.getItem('user'));
        $http({
            method: 'POST',
            url: `https://xmeter.onrender.com/api/get-monthly-income/${parseInt(month)}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: $rootScope.token
            }
        }).then(function successCallback(response) {
            console.log(response);
            $rootScope.lastMonthIncome = response.data.income[0].total;
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    }

    $rootScope.logout = function () {
        localStorage.removeItem('user');
        //send logout request
        $http({
            method: 'POST',
            url: 'https://xmeter.onrender.com/api/logout',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ token: $rootScope.token || localStorage.getItem('xmeterToken') })
        }).then(function successCallback(response) {
            localStorage.removeItem('xmeterToken');
            localStorage.removeItem('user');
            window.location.href = `${$rootScope.hostUrl}/signin.html`;
            console.log(response);
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };

    $rootScope.getMonthIncome();
    $rootScope.getExpenses();
    $rootScope.getMonthlyExpenses();
});





app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../components/dashboardCmp.html',
        })
        .when('/today', {
            templateUrl: '../components/today.html',
            controller: 'TodayController',
            controllerUrl: '../controllers/TodayController.js'
        })
        .when('/payment-Remainder', {
            templateUrl: '../components/paymentRemainder.html',
            controller: 'RemainderController',
            controllerUrl: '../controllers/PaymentRemainderController.js'
        })
        .when('/recieved-Remainder', {
            templateUrl: '../components/recievedRemainder.html',
            controller: 'receivedRemainderController',
            controllerUrl: '../controllers/receivedRemainderController.js'
        })
        .when('/sent-Remainder', {
            templateUrl: '../components/sentRemainder.html',
            controller: 'sentRemainderController',
            controllerUrl: '../controllers/sentRemainderController.js'
        })
        .when('/payment-split', {
            templateUrl: '../components/paymentSplit.html'
        })
        .when('/my-profile', {
            templateUrl: '../components/myProfile.html',
            controller: 'ProfileController',
            controllerUrl: '../controllers/ProfileController.js'
        })
        .otherwise({
            redirectTo: '/' // Redirect to dashboard if no matching route found
        });
});