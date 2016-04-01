var app = angular.module('flapperNews', ['ui.router']);

//var getCreaneaux = function(heureDebut, heureFin, dureeMin) {
//    var listeCreneaux = [];
//    var j=0;
//    for (var i = heureDebut; i <= heureFin; i += (dureeMin / 60 + 5 / 60)){
//        var heureParse = heureDebut - (heureDebut % 1);
//        var minParse = (heureDebut % 1) / 60;
//        listeCreneaux[j++] = {heureParse,minParse};
//    }
//    return listeCreneaux;
//};

app.factory('animations', ['$http', 'auth', function ($http, auth) {
    var o = {
        animations: [],
        animationAdded : null
    };

    $http.get('/animations').success(function (data) {
        angular.copy(data, o.animations);
    });

    o.getAll = function () {
        return $http.get('/animations').success(function (data) {
            angular.copy(data, o.animations);
        });
    };

    o.get = function (id) {
        return $http.get('/animations/' + id).then(function (res) {
            return res.data;
        });
    };

    o.create = function (animation) {
        return $http.post('/animations', animation, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function (data) {
            o.animationAdded = data;
            o.animations.push(data);
        });
    };

    o.addOption = function (id, option) {
        return $http.post('/animations/' + id + '/options', option, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
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
            console.log(payload);
            return payload.exp > Date.now() / 1000;

        } else {
            return false;
        }
    };

    auth.isAdmin = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.nom == "admin";
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
    function ($scope, animations, auth) {
        $scope.animations = animations.animations;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.nbOption=0;

        $scope.options = [];

        var getCreneaux = function(heureDebut, heureFin, dureeMin) {
            var listeCreneaux = [];
            var j=0;
            for (; heureDebut < heureFin; heureDebut += (dureeMin / 60 + 5 / 60)){
                var heureParse = heureDebut - (heureDebut % 1);
                var minParse = heureDebut % 1;
               listeCreneaux[j++] = [heureParse,minParse];
            }
            return listeCreneaux;
        };

        $scope.addAnimations = function () {
            if (!$scope.titre || $scope.titre === '') {
                return;
            }
            var anim ={
                titre: $scope.titre,
                descriptif: $scope.descriptif,
                imgPath:$scope.imgPath,
                typeAnim: $scope.typeAnim,
                date: $scope.date
            };

            animations.create(anim).then(function(data){
                var animAdded = data.data;
                angular.forEach($scope.options, function(value, key) {
                    animations.addOption(animAdded._id, value);
                });
                //animations.addOption(animAdded._id, $scope.options)
            });

            $scope.titre = '';
            $scope.imgPath = '';
            $scope.descriptif = '';
        };


        $scope.addReservation = function(idCreneau){
            //    if ($scope.body === '') {
            //        return;
            //    }
            //    posts.addComment(post._id, {
            //        body: $scope.body,
            //    }).success(function (comment) {
            //        $scope.post.comments.push(comment);
            //    });
            //    $scope.body = '';
        };


        $scope.removeOption = function(id) {
            $("#accordion"+id).remove();
        };

    }

]);

app.directive("tuile", ['$compile', 'animations', function($compile, animations){
    var template;
    $.get('/detailAnim.ejs', function (generatedTemplate) {
        template = generatedTemplate;
    });
    return{
        link: function(scope, element){
            element.on("click", function() {
                scope.$apply(function() {
                    var id = element.attr("idAnim");
                    animations.get(id).then(function(data) {
                        scope.animation = data;
                        var content = $compile(template)(scope);
                        $("#detailcontainer").html(content);
                        $("#animtitle").html(data.titre);
                        $("#animdescription").html(data.descriptif);
                    })

                });
            });
        }
    }
}]);


app.directive("addanimation", function($compile) {
    var id=-1;
    var template;
    $.get('/addOption.ejs', function (generatedTemplate) {
        template = generatedTemplate;
    });
    return{
        //scope: { data: '=' },
        link: function(scope, element){
            element.on("click", function() {
                scope.$apply(function() {

                    template = template.replace("["+id+"]", "["+(id+1)+"]");
                    template = template.replace("["+id+"]", "["+(id+1)+"]");
                    template = template.replace("["+id+"]", "["+(id+1)+"]");
                    template = template.replace("["+id+"]", "["+(id+1)+"]");
                    template = template.replace("removeOption("+id+")", "removeOption("+(id+1)+")");
                    template = template.replace("["+id+"]", "["+(id+1)+"]");
                    template = template.replace("["+id+"]", "["+(id+1)+"]");

                    scope.id = scope.nbOption;
                    var content =  $compile(template)(scope);
                    $(".accordion" ).append(content);
                    scope.nbOption++;
                    id++;
                   //$('#creneauOption0').editRangeSlider({
                   //     bounds: {min: 8, max: 20},
                   //     defaultValues:{min: 9, max: 18}
                   //});
                })
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
