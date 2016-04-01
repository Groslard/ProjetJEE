var app = angular.module('flapperNews', ['ui.router']);

var getCreaneaux = function(heureDebut, heureFin, dureeMin) {
    var listeCreneaux = [];
    var j=0;
    for (var i = heureDebut; i <= heureFin; i += (dureeMin / 60 + 5 / 60)){
        var heureParse = heureDebut - (heureDebut % 1);
        var minParse = (heureDebut % 1) / 60;
        listeCreneaux[j++] = {heureParse,minParse};
    }
    return listeCreneaux;
}

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
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addAnimations = function () {
            if (!$scope.titre || $scope.titre === '') {
                return;
            }
            var arrayOptions =  [{ titre: "option1" }, { titre: "option2" }];

            var anim ={
                titre: $scope.titre,
                descriptif: $scope.descriptif,
                imgPath:$scope.imgPath,
                typeAnim: $scope.typeAnim,
                date: $scope.date
            };

            animations.create(anim).then(function(data){
                console.log(animations.animations[animations.animations.length-1]);

            });

            $scope.titre = '';
            $scope.imgPath = '';
            $scope.descriptif = '';

            $scope.title = '';
            $scope.link = '';
            $scope.description = '';

            var nbOption = 0;

            //$scope.addComment = function () {
            //    if ($scope.body === '') {
            //        return;
            //    }
            //    posts.addComment(post._id, {
            //        body: $scope.body,
            //    }).success(function (comment) {
            //        $scope.post.comments.push(comment);
            //    });
            //    $scope.body = '';
            //};
            //
            //$scope.addOption = function () {
            //    var inputOption = $("");
            //    $(".accordion" ).append(inputOption);
            //    $compile(inputOption)($scope);
            //
            //    $("#creneauOption"+nbOption+"").editRangeSlider({
            //        bounds: {min: 8, max: 20},
            //        defaultValues:{min: 9, max: 18}
            //    });
            //
            //    $("#btnDel0").on("click", function () {
            //        $("#accordion0").remove();
            //    });
            //    $("#btnDel1").on("click", function () {
            //        $("#accordion1").remove();
            //    });
            //    $("#btnDel2").on("click", function () {
            //        $("#accordion2").remove();
            //    });
            //    $("#btnDel3").on("click", function () {
            //        $("#accordion3").remove();
            //    });
            //    $("#btnDel4").on("click", function () {
            //        $("#accordion4").remove();
            //    });
            //    $("#btnDel5").on("click", function () {
            //        $("#accordion5").remove();
            //    });
            //    $("#btnDel6").on("click", function () {
            //        $("#accordion6").remove();
            //    });
            //    $("#btnDel7").on("click", function () {
            //        $("#accordion7").remove();
            //    });
            //    $("#btnDel8").on("click", function () {
            //        $("#accordion8").remove();
            //    });
            //    nbOption++;
            //}
        };


        $scope.addReservation = function(idCreneau){
            // find anim
        //user ajour creneau
        //

        }

        $scope.getDetailAnim = function(idAnimation){
            // find anim

            $scope.anim = animations.animations[0];
            console.log($scope.anim);
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
                var content =  $compile(template)(scope);
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
