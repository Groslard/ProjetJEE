var app = angular.module('flapperNews', ['ui.router']);

app.factory('animations', ['$http', 'auth', function ($http, auth) {
    var o = {
        animations: []
    };
    $http.get('/animations').success(function (data) {
        angular.copy(data, o.animations);
    });

    o.getAll = function () {
        return $http.get('/animations').success(function (data) {
            angular.copy(data, o.animations);
        });
    };

    o.create = function (animation) {
        return $http.post('/animations', animation, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function (data) {
            o.animations.push(data);
        });
    };

    return o;
}]);


app.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};

    auth.saveToken = function (token) {
        $window.localStorage['flapper-news-token'] = token;
    };

    auth.getToken = function () {
        return $window.localStorage['flapper-news-token'];
    };

    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;

        } else {
            return false;
        }
    };

    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.nom;
        }
    };

    auth.register = function (user) {
        return $http.post('/register', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function (user) {
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function () {
        $window.localStorage.removeItem('flapper-news-token');
    };

    return auth;
}]);

// Les controllers sont appelé depuis l ejs
app.controller('MainCtrl', [
    '$scope',
    'animations',
    'auth',
    '$compile',
    function ($scope, animations, auth, $compile) {
        $scope.anim = null;
        $scope.animations = animations.animations;
       // $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addAnimations = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }


            var arrayOptions =  [{ titre: "option1" }, { titre: "option2" }];

            animations.create({
                titre: $scope.title,
                descriptif: $scope.description,
                imgPath:$scope.link
            });

            $scope.title = '';
            $scope.link = '';
            $scope.description = '';
        };
        $scope.getData = function(idAnimation){
            // find anim
            $scope.anim = animations.animations[0];
//            animations.getAll().then(function (data) {
//                // Grab the template
//                $.get('/detailAnim.ejs', function (template) {
//                    // Compile the EJS template.
//                    $scope.anim = animations.animations[0];
//                    var content = $compile(template)($scope);
//console.log(animations.animations[0]);
//
//                    $('#detail-container').html(content);
//
//                });
//             });

        }
    }

]);

app.directive("detailcontainer", function($compile){
    return{
        link: function(scope, element){
            $.get('/detailAnim.ejs', function (template) {
                var template = "<button ng-click='doSomething()'>{{anim.titre}}</button>";
                var linkFn = $compile(template);
                var content = linkFn(scope);
                element.html(content);

            });

        }
    }
});

app.directive('modal', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            scope.dismiss = function() {
                element.modal('hide');
            };
        }
    }
});
app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    '$element',
    function ($scope, $state, auth, $element) {
        $scope.user = {};
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.register = function () {
            auth.register($scope.user).
                error(function (error) {
                    $scope.error = error;
                    $scope.success = false;
                }).
                success(function(data) {
                    $scope.error = false;
                    $scope.success = true;
                });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).success(function(data){
                $scope.dismiss();
            });
        };

        $scope.logOut = function () {
            auth.logOut();
            };
    }]);
