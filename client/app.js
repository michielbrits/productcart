
var labTutorApp = angular.module('labTutorApp', []);
var cities = [
    {
        place : 'India',
        desc : 'A country of culture and tradition!',
        lat : 23.200000,
        long : 79.225487
    },
    {
        place : 'New Delhi',
        desc : 'Capital of India...',
        lat : 28.500000,
        long : 77.250000
    },
    {
        place : 'Kolkata',
        desc : 'City of Joy...',
        lat : 22.500000,
        long : 88.400000
    },
    {
        place : 'Mumbai',
        desc : 'Commercial city!',
        lat : 19.000000,
        long : 72.90000
    },
    {
        place : 'Bangalore',
        desc : 'Silicon Valley of India...',
        lat : 12.9667,
        long : 77.5667
    }
];
/*app.controller('StartCtrl', function ($scope, $location) {
    $scope.goToNextPage = function() {
        $location.path('/page2/p090949');
    };
}); */



labTutorApp.controller('productctrl', [ '$scope', '$http', function ($scope, $http) {
}]);


labTutorApp.controller('StartCtrl', [ '$scope', '$http', function ($scope, $http) {
  $scope.counter = 0;
  $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCk5aEkui4cKZW3ET7Cts-KaY2b4a5MOoY";
  parseParams = function() {
    var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  };

  params = parseParams();

  $scope.name = "Name will be inflated here";
  $scope.cars = ["Audi", "BMW", "Ford"];
  $scope.images = [];
  $scope.brand = [];
  $scope.ingredients = [];
  $scope.productbarcode = ["80135463", "5053827111218"];
  $scope.productamount = [0,1];
  $scope.producten = $scope.productbarcode.length;
  if (params.access_token) {
    $http({
      method: 'GET',
      url: 'https://graph.facebook.com/v2.5/me?fields=id,likes,name&access_token=' + params.access_token
    }).then(function (response) {
      $scope.name = response.data.name;
      $scope.likes = response.data.likes;
      $scope.id = response.data.id;
    }, function (err) {
      $scope.name = err;
    });
  }
  $scope.getproducts = function() {
      $scope.images = [];
      $scope.brand = [];
      $scope.ingredients = [];
    for (var i = 0; i < $scope.productbarcode.length; i++) {
      console.log(i);
     $http({
      method: 'GET',
      url: "https://world.openfoodfacts.org/api/v0/product/" + $scope.productbarcode[i] + ".json"
    }).then(function (response) {
      $scope.images.push(response.data.product.image_front_small_url);
      $scope.brand.push(response.data.product.brands_tags);
      $scope.ingredients.push(response.data.product.ingredients_text_en);
      //$scope.name = err;
    });
  }
};
    $scope.$on('$viewContentLoaded', function() {
        getproducts();
    });

$scope.addproduct = function() {

  $scope.counter++;
}


$scope.login = function() {
  window.location.href = "https://www.facebook.com/dialog/oauth?client_id=335794203482762&response_type=token&redirect_uri=http://localhost:5000/"
};

//Stripe
 var getToken = function(successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/tokens',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer pk_test_ODDJCynHwuYNPBlptXzc4wTs'
            },
            data: 'card[number]=' + $scope.cardNumber + '&card[exp_month]=' + $scope.cardExpMonth + '&card[exp_year]=' + $scope.cardExpYear + '&card[cvc]=' + $scope.cardCvc
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            debugger;
            successCb(data["data"]["id"]); // Of data.data.id, is hetzelfde
          }, errCb).catch(errCb);
        };

        var createCustomer = function(token, successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/customers',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer sk_test_WyzxrtpuVfA9c7pJaKDzCFXz'
            },
            data: 'source=' + token
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            successCb(data.data.id);
          }, errCb).catch(errCb);
        };

        var createSubscription = function(customer, plan, successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/subscriptions',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer sk_test_WyzxrtpuVfA9c7pJaKDzCFXz'
            },
            data: 'plan=' + plan + '&customer=' + customer
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            successCb()
          }, errCb).catch(errCb);
        };

        var subscribe = function (plan) {
          getToken(function (token) {
            createCustomer(token, function (customer) {
              createSubscription(customer, plan, function (status) {
                alert("Subscribed!");
              });
            });
          });
        };

        $scope.subscribeGVA = function() {
          subscribe('gva');
        };

        $scope.subscribeHLN = function() {
          subscribe('hln');
        };

        $scope.subscribeDM = function() {
          subscribe('dm');
        };

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(25,80),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.place
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '<br />' + info.lat + ' E,' + info.long +  ' N, </div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' +
                marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
      
}]);
/*labTutorApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'index.html',
            controller: 'StartCtrl'
        })
        .when('/producten', {
            template: '<h1>I am page 2</h1>',
            controller: function ($scope, $location, $routeParams) {
                console.log("I am called with " + $routeParams.studentId);
                var studentId = $routeParams.studentId;
            }
        })
        .otherwise({
            redirectTo: '/papa'
        });
}); */
