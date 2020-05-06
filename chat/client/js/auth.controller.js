'user strict';

app.controller('authController', function ($scope, $location, $timeout, appService) {

    $scope.data = {
        regUsername : '',
        regPassword : '',
        usernameAvailable : false,
        loginUsername : '',
        loginPassword : ''
    };

    /* usernamme check variables starts*/
    let TypeTimer;
    const TypingInterval = 800;
    /* usernamme check variables ends*/
    
    $scope.initiateCheckUserName = () => {
        $scope.data.usernameAvailable = false;
        $timeout.cancel(TypeTimer);
        TypeTimer = $timeout( () => {
            appService.httpCall({
                url: '/usernameCheck',
                params: {
                    'username': $scope.data.regUsername
                }
            })
            .then((response) => {
                $scope.$apply( () =>{
                    $scope.data.usernameAvailable = response.error ? true : false;
                });
            })
            .catch((error) => {
                $scope.$apply(() => {
                    $scope.data.usernameAvailable = true;
                });
               
            });
        }, TypingInterval);
    }

    $scope.clearCheckUserName = () => {
        $timeout.cancel(TypeTimer);
    }

    $scope.registerUser = () => {
        appService.httpCall({
            url: '/registerUser',
            params: {
                'username': $scope.data.regUsername,
                'password': $scope.data.regPassword
            }
        })
        .then((response) => {
            $location.path(`/home/${response.userId}`);
            $scope.$apply();
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    $scope.loginUser = () => {
        appService.httpCall({
            url: '/login',
            params: {
                'username': $scope.data.loginUsername,
                'password': $scope.data.loginPassword
            }
        })
        .then((response) => {
            $location.path(`/home/${response.userId}`);
            $scope.$apply();
        })
        .catch((error) => {
            alert(error.message);
        });
    }
});