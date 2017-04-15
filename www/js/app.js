// Ionic ss App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ss' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ss.services' is found in services.js
// 'ss.controllers' is found in controllers.js
angular.module('ss', ['ionic', 'ss.controllers', 'ss.pluginServices','ss.services','ss.config','ss.directive','LocalStorageModule','ngCordova','ngResource'], function ($httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  

    var param = function (obj) {  
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;  
  
        for (name in obj) {  
            value = obj[name];  
  
            if (value instanceof Array) {  
                for (i = 0; i < value.length; ++i) {  
                    subValue = value[i];  
                    fullSubName = name + '[' + i + ']';  
                    innerObj = {};  
                    innerObj[fullSubName] = subValue;  
                    query += param(innerObj) + '&';  
                }  
            }  
            else if (value instanceof Object) {  
                for (subName in value) {  
                    subValue = value[subName];  
                    fullSubName = name + '[' + subName + ']';  
                    innerObj = {};  
                    innerObj[fullSubName] = subValue;  
                    query += param(innerObj) + '&';  
                }  
            }  
            else if (value !== undefined && value !== null)  
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';  
        }  
  
        return query.length ? query.substr(0, query.length - 1) : query;  
    };  
  
    // Override $http service's default transformRequest  
    $httpProvider.defaults.transformRequest = [function (data) {  
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;  
    }];  
})
.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
    return {
        require: '^form',
        restrict: 'A',
        link: function(scope, element, attrs, form) {
            form.$submitted = false;
            var fn = $parse(attrs.onValidSubmit);
            element.on('submit', function(event) {
                scope.$apply(function() {
                    element.addClass('ng-submitted');
                    form.$submitted = true;
                    if (form.$valid) {
                        if (typeof fn === 'function') {
                            fn(scope, {$event: event});
                        }
                    }
                });
            });
        }
    }

}])
.directive('validated', ['$parse', function($parse) {
    return {
        restrict: 'AEC',
        require: '^form',
        link: function(scope, element, attrs, form) {
            var inputs = element.find("*");
            for(var i = 0; i < inputs.length; i++) {
                (function(input){
                    var attributes = input.attributes;
                    if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                        var field = form[attributes.name.value];
                        if (field != void 0) {
                            scope.$watch(function() {
                                return form.$submitted + "_" + field.$name + "_" + field.$valid;
                            }, function() {
                                if (form.$submitted != true) return;
                                if (!field.$valid) {
                                    element.removeClass('has-success');
                                    element.addClass('has-error');
                                } else {
                                    element.removeClass('has-error').addClass('has-success');
                                }
                            });
                        }
                    }
                })(inputs[i]);
            }
        }
    }
}])
.run(function($ionicPlatform,$rootScope,$state,$timeout,$ionicHistory,ToastService,localStorageService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

			// Ë«»÷ÍË³ö
        $ionicPlatform.registerBackButtonAction(function (e) {
            if ($state.includes('tab.sheTuan')) {
                if ($rootScope.backButtonPressedOnceToExit) {
					localStorageService.remove('User');
					localStorageService.remove('message');
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    ToastService.showShortBottom();
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }else if($state.includes('login')){
				if ($rootScope.backButtonPressedOnceToExit) {
					localStorageService.remove('User');
					localStorageService.remove('message');
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    ToastService.showShortBottom();
                    setTimeout(function () {
                      $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
			
			} else if ($state.includes('zhuCe')) {
                $state.go('login');
            }
            else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                if ($rootScope.backButtonPressedOnceToExit) {
					localStorageService.remove('User');
					localStorageService.remove('message');
                    ionic.Platform.exitApp();
                }
                $rootScope.backButtonPressedOnceToExit = true;
                ToastService.showShortBottom();
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  // Each tab has its own nav history stack:
  .state('tab.sheTuan', {
    url: '/sheTuan',
    views: {
      'tab-sheTuan': {
        templateUrl: 'templates/tab-sheTuan.html',
        controller: 'SheTuanCtrl'
      }
    }
  })
  .state('tab.zuiXinHuoDong_content', {
          url: '/zuiXinHuoDong_content/:id',
          views: {
              'tab-sheTuan': {
                  templateUrl: "templates/tab-zuiXinHuoDong_content.html",
                  controller: 'ZxhdContentCtrl'
              }
          }
      })
.state('tab.sheTuanYiLan_content', {
          url: '/sheTuanYiLan_content/:id',
          views: {
              'tab-sheTuan': {
                  templateUrl: "templates/tab-sheTuanYiLan_content.html",
                  controller: 'StylContentCtrl'
              }
          }
      })
  .state('tab.shiWuZhaoLing', {
      url: '/shiWuZhaoLing',
      views: {
        'tab-shiWuZhaoLing': {
          templateUrl: 'templates/tab-shiWuZhaoLing.html',
          controller: 'ShiWuZhaoLingCtrl'
        }
      }
    })
  .state('tab.shiWuZhaoLing_content', {
          url: '/shiWuZhaoLing_content/:id',
          views: {
              'tab-shiWuZhaoLing': {
                  templateUrl: "templates/tab-shiWuZhaoLing_content.html",
                  controller: 'shiWuZhaoLingContentCtrl'
              }
          }
      })
   .state('tab.chuXing', {
      url: '/chuXing',
      views: {
        'tab-chuXing': {
         templateUrl: 'templates/tab-chuXing.html',
         controller: 'ChuXingCtrl'
                         }
             }
    })
.state('tab.chuXing_content', {
          url: '/chuXing_content/:id',
          views: {
              'tab-chuXing': {
                  templateUrl: "templates/tab-chuXing_content.html",
                  controller: 'chuXingContentCtrl'
              }
          }
   })
 .state('tab.xiaoYuanJiaoYi', {
        url: '/xiaoYuanJiaoYi',
        views: {
        'tab-xiaoYuanJiaoYi': {
        templateUrl: 'templates/tab-xiaoYuanJiaoYi.html',
        controller: 'XiaoYuanJiaoYiCtrl'
                         }
                }
     })
.state('tab.jiaoYi_content', {
          url: '/jiaoYi_content/:id',
          views: {
              'tab-xiaoYuanJiaoYi': {
                  templateUrl: "templates/tab-jiaoYi_content.html",
                  controller: 'jiaoYiContentCtrl'
              }
          }
   })
.state('zhuCe', {
    url:'/zhuCe',
     templateUrl: 'templates/zhuCe.html',
	controller:'ZhuCeCtrl'
  })
.state('login', {
    url:'/login',
     templateUrl: 'templates/login.html',
	controller:'LoginCtrl'
  })
  .state('Msg', {
    url:'/Msg',
     templateUrl: 'templates/Msg.html',
	controller:'MsgCtrl'
  })
  .state('mySheTuan', {
    url:'/mySheTuan',
     templateUrl: 'templates/mySheTuan.html',
	controller:'MySheTuanCtrl'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
