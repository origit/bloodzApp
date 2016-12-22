// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bloodApp',['ionic', 'ngCordova','bloodApp.controllers','bloodApp.services'])

.run(function($ionicPlatform,$rootScope,$ionicHistory,$cordovaToast) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });  
  
    $ionicPlatform.registerBackButtonAction(function(e){
        if($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
        }
        else if($ionicHistory.backView()) {
            $ionicHistory.goBack();
        }
        else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.show("Press once again to close", 'short', 'bottom');
            setTimeout(function() {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        
        return false;
    }, 101);
})
.config(function($stateProvider,$urlRouterProvider, $ionicConfigProvider) {
    
    $stateProvider
    
        //ROUTER CONTROL 
        .state('router', {
            cache: false,
            url: '/router',
            controller: 'RouterCtrl'
        })  
  
        .state('welcome', {
            cache:false,
            url: '/welcome',
            templateUrl: 'templates/welcome.html',
            controller:'welcomeCtrl'
        })
        
        .state('login', {
            cache:false, 
            url: '/login',
            templateUrl: 'templates/login.html',
            controller:'loginCtrl'
        }) 
            
        .state('verify', {
            cache:false, 
            url: '/verify',
            templateUrl: 'templates/verify.html',
            controller:'verifyCtrl'
        }) 
        
        .state('forgotPassword', {
            cache:false,
            url: '/forgotPassword',
            templateUrl: 'templates/forgotPassword.html',
            controller:'forgotPasswordCtrl'
        }) 
            
        .state('signUp', {
            url: '/signUp',
            templateUrl: 'templates/signUp.html',
            controller:'signUpCtrl' 
        })
                
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller:'menuCtrl'
        })    
    
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/home.html',
                    controller:'dashboardCtrl'
                }
            }
        })
        
        .state('app.searchDonor', {
            url: '/searchDonor',
            views: {
                 'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/searchDonor.html',
                    controller:'searchDonarListCtrl'
                }
            }
        })
        
        .state('app.myDonor', {
            url: '/myDonor',
            views: {
                 'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/myDonor.html',
                    controller:'addDonorCtrl'
                    
                }
            }
        })
        
        .state('app.requestBlood', {
            url: '/requestBlood',
            views: {
                 'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/requestBlood.html',
                    controller:'requestBloodCtrl'
                  
                }
            }
        })
        
        .state('app.help', {
            url: '/help',
            views: {
                'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/help.html',
                    controller:'helpCtrl'
                }
            }
        })
        
        .state('app.searchBloodBank', {
            url: '/searchBloodBank',
            views: {
                'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/searchBloodBank.html',
                    controller:'bloodBankCtrl'
                }
            }
        })
    
        .state('app.faq', {
            url: '/faq',
            views: {
                'menuContent': {
                    cache:false, 
                    templateUrl: 'templates/faq.html',
                    controller:'faqCtrl'
                }
            }
        })
        
        .state('app.about', {
          url: '/about',
          views: {
            'menuContent': {
                cache:false, 
                templateUrl: 'templates/about.html'
            }
          }
        }) 
        
        .state('app.editProfile', {
          url: '/editProfile',
          views: {
            'menuContent': {
                cache:false, 
                templateUrl: 'templates/editProfile.html',
                controller:'editProfileCtrl'
            }
          }
        })
        
        .state('app.changePassword', {
          url: '/changePassword',
          views: {
            'menuContent': {
                cache:false, 
                templateUrl: 'templates/changePassword.html',
                controller:'changePasswordCtrl'
            }
          }
        })
       
        .state('app.profile', {
          url: '/profile',
          views: {
            'menuContent': {
              templateUrl: 'templates/profile.html',
              controller:'profileCtrl'
            }
          }
        });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/router');  
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
});