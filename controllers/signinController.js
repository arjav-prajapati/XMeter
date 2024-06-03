function signinController($scope, $http) {
    $scope.ctrl = this;
    $scope.ctrl.user = {};

    $scope.ctrl.signin = function (event) {
        event.preventDefault();
        if ($scope.signinForm.$valid) {
            // Form is valid, you can perform your signin logic here
            console.log($scope.ctrl.user);
            console.log('Form submitted successfully');

            // Perform HTTP request to authenticate user
            $http({
                method: 'POST',
                url: 'https://xmeter.onrender.com/api/signin',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify($scope.ctrl.user)
            }).then(function (response) {
                console.log(response);
                if (response.data.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('xmeterToken', response.data.token);
                    window.location.href = '/dashboard.html';
                } else {
                    alert('Signin failed');
                }
            }).catch(function (error) {
                console.error('Error occurred:', error);
                alert('Signin failed: ' + error.data.message || 'Server error occurred');
            });
        } else {
            // Form is invalid, handle validation errors
            alert('Form submission failed. Please check the form fields.');
        }
    };
}