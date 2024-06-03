function signupController($scope, $http) {
    $scope.ctrl = this;
    $scope.ctrl.signupForm = {};

    $scope.ctrl.signup = function (event) {
        console.log(event)
        event.preventDefault();
        if ($scope.signupForm.$valid) {
            // Form is valid, you can perform your signup logic here
            console.log($scope.ctrl.user);
            console.log('Form submitted successfully');
            if ($scope.ctrl.user.password != $scope.ctrl.user.confirmPassword) {
                alert('Password and Confirm Password do not match');
                return;
            }

            $http({
                method: 'POST',
                url: 'https://xmeter.onrender.com/api/signup',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify($scope.ctrl.user)
            }).then(function (response) {
                console.log(response);
                if (response.data.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    document.cookie = 'user=' + JSON.stringify(response.data.user) + '; path=/' + '; max-age=' + 60 * 60 * 24 * 7 + ';' + 'SameSite=None; Secure' + ';' + 'expires=' + new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000).toUTCString() + ';';
                    window.location.href = '/dashboard.html';
                    localStorage.setItem('xmeterToken', response.data.token);
                } else {
                    alert('Signup failed');
                }
            }, function (error) {
                console.error('Error occurred:', error);
                alert('Signup failed: ' + error.data.message || 'Server error occurred');
            });
        } else {
            // Form is invalid, handle validation errors
            alert('Form submission failed. Please check the form fields.');
        }
    };
}