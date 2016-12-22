angular.module('bloodApp.controllers', ['bloodApp.dal'])

/**
 * RouterCtrl
 * welcomeCtrl
 * loginCtrl 
 * menuCtrl
 * verifyCtrl
 * signUpCtrl
 * dashboardCtrl
 * searchDonarListCtrl
 * addDonorCtrl
 * bloodBankCtrl
 * listDonorCtrl
 * requestBloodCtrl
 * faqCtrl
 * help
 * forgotPasswordCtrl
 * profileCtrl
 * changePasswordCtrl
 * editProfileCtrl
 */
.directive('onlyDigits', function (ctrl,undefined) {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function () {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9.]/g, '');

            if (digits.split('.').length > 2) {
              digits = digits.substring(0, digits.length - 1);
            }

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseFloat(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
 })
 
.directive("passwordVerify", function() {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;
                
                if (scope.passwordVerify || ctrl.$viewValue) {
                   combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            },
            function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        }
                        else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
})

.controller('RouterCtrl', function(appStorage, $state) {
   
    if (appStorage.getItem('APPID') === 1 && appStorage.getItem('TOKEN') !== null && appStorage.getItem('VERIFY') === 'DONE'  ) 
    {
        $state.go('app.home');
    }
    else if (appStorage.getItem('APPID') === 1 && appStorage.getItem('TOKEN') === null && appStorage.getItem('VERIFY') !== 'DONE')
    {
        $state.go('login');
    }
    else if (appStorage.getItem('APPID') === 1 && appStorage.getItem('TOKEN') === null && appStorage.getItem('VERIFY') === 'DONE')
    {
        $state.go('login');
    } 
    else if (appStorage.getItem('APPID') === 1 && appStorage.getItem('TOKEN') === null && appStorage.getItem('VERIFY') === null) 
    {
        $state.go('login');
    }
    else if (appStorage.getItem('APPID') === 1 && appStorage.getItem('TOKEN') !== null && appStorage.getItem('VERIFY') !== 'DONE') 
    {
        $state.go('login');
    }
    else {
        $state.go('welcome');
    }
})

.controller('welcomeCtrl', function(appStorage, $state, $scope, $cordovaToast, $ionicHistory) {
    $ionicHistory.clearHistory();

    $scope.dosaveappid = function() {
        appStorage.putItem("APPID", 1);
        appStorage.putItem("APPNEW", "NEW");

        $cordovaToast.show("Welcome to Bloodz App", 'long', 'center');
        $state.go('login');
    };
})
.controller("loginCtrl", function($scope, appStorage, $http, $ionicLoading, $state, $ionicPopup, $cordovaToast, baseURL, $ionicHistory) {
    $ionicHistory.clearHistory();
    
    $scope.login = {};
    $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/auth_json.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                UNAME: $scope.login.username,
                UPASS: $scope.login.password
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {  
                if (data.RETURN === true) {
                    var userDetails = data.USER_DETAILS;
                    appStorage.putItem("name", userDetails.NAME);
                    appStorage.putItem("email", userDetails.EMAIL);
                    appStorage.putItem("ph_no", userDetails.PH_NO);
                    appStorage.putItem("bg", userDetails.BLOD_GRUP);
                    appStorage.putItem("area", userDetails.AREA);
                    appStorage.putItem("city", userDetails.CITY);
                    appStorage.putItem("state", userDetails.STATE);
                    appStorage.putItem("country", userDetails.COUNTRY);
                    appStorage.putItem("countryId", userDetails.COUNTRYID);
                    appStorage.putItem("cityId", userDetails.CITYID);
                    appStorage.putItem("stateId", userDetails.STATEID);
                    appStorage.putItem("img_url", userDetails.IMG_URL);
                    appStorage.putItem("address", userDetails.ADDRESS);
                    appStorage.putItem("gender", userDetails.GENDER);
                    appStorage.putItem("isdonor", userDetails.ISDONOR);
                    appStorage.putItem("joindate" ,userDetails.JOINDATE);
                    appStorage.putItem("TOKEN", userDetails.TOKEN);
                    appStorage.putItem("zipcode", userDetails.ZIPCODE);                   
                    appStorage.putItem("VERIFY", userDetails.VERIFIED);                    
                    var verification = userDetails.VERIFIED;                    
                    $ionicLoading.hide();
                    if(verification === 'DONE')
                    { 
                        $state.go('app.home');                       
                    }else{
                        $state.go('verify');
                    }                   
                } else if (data.RETURN === false) {                    
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Authentication Failed',
                        template: data.MESSAGE
                    });
                } else {                   
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {             
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
    };
})

.controller('menuCtrl', function(appStorage, $scope) {
    $scope.$on('userName', function(name) {
        console.log(name)
    });
    
    $scope.USERNAME = appStorage.getItem("name");
    $scope.USERBLODGP = appStorage.getItem("bg");
    $scope.GENDER = appStorage.getItem("gender");
    $scope.IMGURL = appStorage.getItem("img_url");
})

.controller('verifyCtrl', function(appStorage, $state, $ionicLoading, $cordovaToast, baseURL, $http, $scope) {
    
    $scope.EMAIL = appStorage.getItem("email"); 
    $scope.verify = {};
    $scope.submit = function() {  
        
        var verification =  appStorage.getItem("VERIFY");
        $scope.APPCODE   =  $scope.verify.appcode;        
        
        if(verification === 'DONE' && verification !== $scope.APPCODE)
        {           
            $state.go('app.home');                       
        }
        else if(verification !== 'DONE' && verification !== $scope.APPCODE)
        { 
            $cordovaToast.show("Check your Verification code.", 'long', 'center');
        }
        else if(verification === $scope.APPCODE)
        {                       
            $ionicLoading.show({
                template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
            });            
            var request = {
                method: 'POST',
                url: baseURL + "/verify_user.php",
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: {
                    TOKEN  : appStorage.getItem("TOKEN"),
                    STATUS : 'VERIFY_CODE',
                    APPCODE: $scope.APPCODE
                },z
                timeout: 30000
            };
            $http(request)
            .success(function(data) {
                if (data.RETURN === true) {   
                    appStorage.putItem("VERIFY", "DONE");
                    $ionicLoading.hide();                  
                    $cordovaToast.show("Verified done successfully", 'sort', 'center');                    
                    $state.go('app.home'); 
                } 
                else if (data.RETURN === false) 
                {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } 
                else
                {                  
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {          
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
        }      
    };
    
    $scope.Resend = function() {       
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/verify_user.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                TOKEN  : appStorage.getItem("TOKEN"),
                STATUS : 'RESEND_CODE'             
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {
                if (data.RETURN === true) {                     
                    $cordovaToast.show("Verify Code Sent.Check your email", 'long', 'center');
                    $ionicLoading.hide();
                } 
                else if (data.RETURN === false) 
                {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } 
                else
                {                  
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {              
                $ionicLoading.hide();               
                $cordovaToast.show("Network Error!", 'short', 'center');
            });      
    };
})

.controller("signUpCtrl", function($scope, $ionicLoading, $http, $state, appStorage, baseURL, $cordovaToast) {

    $scope.basicdiv = true;
    $scope.addressdiv = false;
    $scope.regdiv = false;
    
    $scope.AddressBtn = function() {
        $scope.basicdiv = false;
        $scope.addressdiv = true;
        $scope.regdiv = false;
    };
         
    $scope.regdivbtn = function() {
        $scope.basicdiv = false;
        $scope.addressdiv = false;
        $scope.regdiv = true;
    };
    $scope.backBasicbtn = function() {
        $scope.basicdiv = true;
        $scope.addressdiv = false;
        $scope.regdiv = false;
    };
    $scope.backregdivbtn = function() {
        $scope.basicdiv = false;
        $scope.addressdiv = true;
        $scope.regdiv = false;
    };
     
    $scope.signUp = {};

    $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        
        var request = {
            method: 'POST',
            url: baseURL + "/register_user.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                NAME: $scope.signUp.username,
                EMAIL: $scope.signUp.email,
                PH_NO: $scope.signUp.ph_no,
                BLOD_GRUP: $scope.signUp.bg,
                AREA: $scope.signUp.area,
                CITY: $scope.signUp.cityId,
                STATE: $scope.signUp.stateId,
                COUNTRY: $scope.signUp.countryId,
                PSWD: $scope.signUp.password,
                GENDER: $scope.signUp.gender,
                ISDONOR: $scope.signUp.toggle,
                ZIPCODE: ''
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {
                if (data.RETURN === true) {                    
                    appStorage.putItem("name", $scope.signUp.username);
                    appStorage.putItem("email", $scope.signUp.email);
                    appStorage.putItem("ph_no", $scope.signUp.ph_no);
                    appStorage.putItem("bg", $scope.signUp.bg);
                    appStorage.putItem("countryId", $scope.signUp.countryId);
                    appStorage.putItem("cityId", $scope.signUp.cityId);
                    appStorage.putItem("stateId", $scope.signUp.stateId);
                    appStorage.putItem("img_url", data.IMG_URL);
                    appStorage.putItem("gender", $scope.signUp.gender);
                    appStorage.putItem("toggle", $scope.signUp.ISDONOR);
                    $ionicLoading.hide();
                    $cordovaToast.show("Registration has been done successfully", 'sort', 'center'); 
                    $state.go('login'); 
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {                  
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {              
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
    };
    
    //get cuntry list, state , city    
    $scope.getcountry = function () {
        var getCountryList = {
            method: 'POST',
            url: baseURL + "/getLocations.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCOUNTRY'               
            },
            timeout: 30000
        };
        $http(getCountryList)
            .success(function(data) {           
                if (data.RETURN === true) {                    
                    appStorage.putItem("COUNTRY_LIST", data.COUNTRY);                 
                }else{
                    console.log('List is empty');
                } 
            }).error(function(error) {
                console.log(error);
            });
    };
    $scope.getcountry(); 
    $scope.countryList = appStorage.getItem("COUNTRY_LIST");    
    
    $scope.onCountryChange = function () {
        $scope.countryIdVal = $scope.signUp.countryId; 
        console.log($scope.countryIdVal);        
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETSTATE',
                COUNTRYID: $scope.countryIdVal           
            }         
        }).success(function (data) { 
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.stateList = data.STATE;               
            }else{
                console.log('List is empty');
            }           
        }).error(function(error) {
            console.log(error);
        });
    };
 
    $scope.onStateChange = function () {
        $scope.stateIdVal = $scope.signUp.stateId;
        console.log($scope.stateIdVal);  
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCITY',
                STATEID: $scope.stateIdVal        
            }  
        }).success(function (data) {
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.cityList = data.CITY;         
            }else{
                console.log('List is empty');
            }
          
        }).error(function(error) {
            console.log(error);
        });
    };
})

.controller('dashboardCtrl', function($scope, $ionicLoading, $http, appStorage, $ionicHistory, $cordovaToast, baseURL) {

    $ionicHistory.clearHistory();
    $scope.NEW = appStorage.getItem("APPNEW");
    $ionicLoading.show({
        template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
    });
    var request = {
        method: 'POST',
        url: baseURL + "/dashboard_counters.php",
        headers: {
            'Content-Type': 'text/plain'
        },
        data: {
            TOKEN: appStorage.getItem("TOKEN")
        },
        timeout: 30000
    };
    $http(request)
        .success(function(data) {         
            if (data.RETURN === true)
            {
                var dashboarddata = data.DASHBOARD_DATA;
                $scope.TOTAL_DONORS = dashboarddata.TOTAL_DONORS;
                $scope.TOTAL_BANKS = dashboarddata.TOTAL_BANKS;
                $scope.TOTAL_USERS = dashboarddata.TOTAL_USERS;
                $scope.CITY_LIST = dashboarddata.TOP_CITY;                
                $ionicLoading.hide();
                
            } else if (data.RETURN === false) {
                
                $ionicLoading.hide();
                $cordovaToast.show("Oops! Failed to fetch try again.", 'long', 'center');
                
            } else {
                $ionicLoading.hide();
                $cordovaToast.show("Oops! Something went wrong, try again.", 'short', 'center');
            }
        }).error(function() {           
            $ionicLoading.hide();
            $cordovaToast.show("Network Error!", 'short', 'center');

        });

    //ON DOUBLE TAP
    $scope.onDoubleTap = function() {
        appStorage.putItem("APPNEW", "OLD");
        $scope.NEW = appStorage.getItem("APPNEW");
        $cordovaToast.show("hurrah! Your Done.", 'long', 'center');
    };
    
    //get cuntry list    
    if(appStorage.getItem("COUNTRY_LIST") !== null)   {
        var getCountryList = {
            method: 'POST',
            url: baseURL + "/getLocations.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCOUNTRY'               
            },
            timeout: 30000
        };
        $http(getCountryList)
            .success(function(data) {
                console.log(data);
                if (data.RETURN === true) {                    
                    appStorage.putItem("COUNTRY_LIST", data.COUNTRY);                 
                }else{
                    console.log('List is empty');
                } 
            }).error(function(error) {
                console.log(error);
            });       
    }
})

.controller("searchDonarListCtrl", function($scope, $http, $ionicLoading, appStorage, baseURL, $cordovaToast, $ionicPopup) {

    $scope.showdiv = true;
    $scope.searchDonor = {};
    
    $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/search_donor.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                BLOD_GRUP: $scope.searchDonor.bg,
                COUNTRY: $scope.searchDonor.countryId,
                STATE: $scope.searchDonor.stateId,
                CITY: $scope.searchDonor.cityId,
                TOKEN: appStorage.getItem("TOKEN")
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {               
                if (data.RETURN === true) {
                    $ionicLoading.hide();
                    $scope.showdiv = false;
                    $scope.DonorDetails = data.DONOR_LIST;
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $scope.DonorDetails = null;
                    $scope.showdiv = false;
                    $cordovaToast.show(data.MESSAGE, 'short', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {                
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
    };
    
    $scope.BackList = function(){
        $scope.showdiv = true;
    }
    
    //get state and city
    $scope.countryList = appStorage.getItem("COUNTRY_LIST");    
   
    $scope.onCountryChange = function () {
        $scope.countryIdVal = $scope.searchDonor.countryId; 
        console.log($scope.countryIdVal);        
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETSTATE',
                COUNTRYID: $scope.countryIdVal           
            }         
        }).success(function (data) { 
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.stateList = data.STATE;               
            }else{
                console.log('List is empty');
            }           
        }).error(function(error) {
            console.log(error);
        });
    };
 
    $scope.onStateChange = function () {
        $scope.stateIdVal = $scope.searchDonor.stateId;
        console.log($scope.stateIdVal);  
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCITY',
                STATEID: $scope.stateIdVal        
            }  
        }).success(function (data) {
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.cityList = data.CITY;         
            }else{
                console.log('List is empty');
            }          
        }).error(function(error) {
            console.log(error);
        });
    };  

    $scope.callDonor = function(phone) {
        $ionicPopup.confirm({
            title: phone,
            template: 'Are you want to make a call?',
            buttons: [

                {
                    text: 'No',
                    type: 'button-stable button-outline'
                }, {
                    text: 'call',
                    type: 'button-balanced',
                    onTap: function() {
                        window.location.href = "tel:" + phone;
                    }
                }
            ]

        });
    };
})


.controller("addDonorCtrl", function($scope, $ionicLoading, $http, $state, baseURL, appStorage, $cordovaToast) {

    $scope.basicdiv = true;
    $scope.addressdiv = false;

    $scope.AddressBtn = function() {
        $scope.basicdiv = false;
        $scope.addressdiv = true;
    };
    $scope.ShowParentDiv = function() {
        $scope.basicdiv = true;
        $scope.addressdiv = false;
    };
    $scope.addDonor = {};
    $scope.donorsubmit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/add_donor.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                NAME: $scope.addDonor.username,
                EMAIL: $scope.addDonor.email,
                PH_NO: $scope.addDonor.ph_no,
                BLOD_GRUP: $scope.addDonor.bg,
                GENDER: $scope.addDonor.gender,
                CITY: $scope.addDonor.cityId,
                STATE: $scope.addDonor.stateId,
                COUNTRY: $scope.addDonor.countryId,
                TOKEN: appStorage.getItem("TOKEN")
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {
                console.log(data);
                if (data.RETURN === true) 
                {                    
                    $state.reload();
                    $scope.basicdiv = true;
                    $scope.addressdiv = false;                    
                    $scope.addDonor = {};
                    $ionicLoading.hide();      
                    $scope.listmydonors();
                    $cordovaToast.show("Donor Added Successfully.", 'long', 'center');
                    
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
    };
  
    //get state and city
    $scope.countryList = appStorage.getItem("COUNTRY_LIST");    
   
    $scope.onCountryChange = function () {
        $scope.countryIdVal = $scope.addDonor.countryId; 
        console.log($scope.countryIdVal);        
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETSTATE',
                COUNTRYID: $scope.countryIdVal           
            }         
        }).success(function (data) { 
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.stateList = data.STATE;               
            }else{
                console.log('List is empty');
            }           
        }).error(function(error) {
            console.log(error);
        });
    };
 
    $scope.onStateChange = function () {
        $scope.stateIdVal = $scope.addDonor.stateId;
        console.log($scope.stateIdVal);  
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCITY',
                STATEID: $scope.stateIdVal        
            }  
        }).success(function (data) {
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.cityList = data.CITY;         
            }else{
                console.log('List is empty');
            }          
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.listmydonors = function() {       
    
    var mydonors = {
            method: 'POST',
            url: baseURL + "/list_Mydonors.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                TOKEN: appStorage.getItem("TOKEN")
            },
            timeout: 30000
        };
        $http(mydonors)
            .success(function(data) {

                if (data.RETURN === true) {
                    console.log(data.MYDONOR_LIST);
                    $scope.mydonor_details = data.MYDONOR_LIST;
                    $ionicLoading.hide();
                    
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'short', 'center');
                } else {
                    console.log(data);
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {
                console.log('error');
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
            
            $scope.doRefresh = function() {        
                $state.reload();
            };            
        };
        $scope.listmydonors();
})

.controller("bloodBankCtrl", function($scope, $http, $ionicLoading, appStorage, baseURL, $cordovaToast, $ionicPopup) {
    
    $scope.showdiv = true;
    
    $scope.BackList = function(){
        $scope.showdiv = true;
    };
    
    $scope.searchBank = {};
    $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/search_bloodbank.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                COUNTRY: $scope.searchBank.countryId,
                STATE: $scope.searchBank.stateId,
                CITY: $scope.searchBank.cityId,
                TOKEN: appStorage.getItem("TOKEN")
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {                
                if (data.RETURN === true) {
                    $scope.bloodBankList = data.BANK_LIST;
                    $scope.showdiv = false;
                    $ionicLoading.hide();
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $scope.bloodBankList = null;
                    $scope.showdiv = false;
                    $cordovaToast.show(data.MESSAGE, 'short', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {                
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
    };
   
   
     //get state and city
    $scope.countryList = appStorage.getItem("COUNTRY_LIST");    
   
    $scope.onCountryChange = function () {
        $scope.countryIdVal = $scope.searchBank.countryId; 
        console.log($scope.countryIdVal);        
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETSTATE',
                COUNTRYID: $scope.countryIdVal           
            }         
        }).success(function (data) { 
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.stateList = data.STATE;               
            }else{
                console.log('List is empty');
            }           
        }).error(function(error) {
            console.log(error);
        });
    };
 
    $scope.onStateChange = function () {
        $scope.stateIdVal = $scope.searchBank.stateId;
        console.log($scope.stateIdVal);  
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCITY',
                STATEID: $scope.stateIdVal        
            }  
        }).success(function (data) {
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.cityList = data.CITY;         
            }else{
                console.log('List is empty');
            }          
        }).error(function(error) {
            console.log(error);
        });
    };  


    $scope.callBloodBank = function(phone) {
        $ionicPopup.confirm({
            title: phone,
            template: 'Are you want to make a call?',
            buttons: [

                {
                    text: 'No',
                    type: 'button-stable button-outline'
                }, {
                    text: 'call',
                    type: 'button-balanced',
                    onTap: function() {
                        window.location.href = "tel:" + phone;
                    }
                }
            ]

        });

    };
})

.controller("requestBloodCtrl", function($scope, $http, $ionicLoading,$state, appStorage, baseURL, $cordovaToast) {

    $scope.requestBlood = {};
    
    $scope.submit = function() {
        
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/request_blood.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                BLOD_GRUP: $scope.requestBlood.bg,
                COUNTRY: $scope.requestBlood.countryId,
                STATE: $scope.requestBlood.stateId,
                CITY: $scope.requestBlood.cityId,
                TOKEN: appStorage.getItem("TOKEN")
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {                            
                if (data.RETURN === true) { 
                    $ionicLoading.hide();
                    $state.reload();
                    $cordovaToast.show("Request Sent, Wait for donor calls.", 'long', 'center');                   
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {               
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'short', 'center');
            });
    };
    
    //get state and city
    $scope.countryList = appStorage.getItem("COUNTRY_LIST");    
   
    $scope.onCountryChange = function () {
        $scope.countryIdVal = $scope.requestBlood.countryId; 
        console.log($scope.countryIdVal);        
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETSTATE',
                COUNTRYID: $scope.countryIdVal           
            }         
        }).success(function (data) { 
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.stateList = data.STATE;               
            }else{
                console.log('List is empty');
            }           
        }).error(function(error) {
            console.log(error);
        });
    };
 
    $scope.onStateChange = function () {
        $scope.stateIdVal = $scope.requestBlood.stateId;
        console.log($scope.stateIdVal);  
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCITY',
                STATEID: $scope.stateIdVal        
            }  
        }).success(function (data) {
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.cityList = data.CITY;         
            }else{
                console.log('List is empty');
            }          
        }).error(function(error) {
            console.log(error);
        });
    };  
})

.controller('faqCtrl', function($scope) {
    $scope.items = [{
        title: 'How does the blood donation process work?',
        text: 'Donating blood is a simple thing to do, but can make a big difference in the lives of others.\n\
             The donation process from the time you arrive until the time you leave takes about an hour. '
    }, {
        title: 'What should I do after donating blood?',
        text: 'Take the following precautions:Drink an extra four glasses (eight ounces each) of non-alcoholic liquids.Keep your bandage on and dry for the next five hours, and do not do heavy exercising or lifting.'
    }, {
        title: 'Why this app? ',
        text: 'BloodApp gives you direct communication with Donor and banks in one touch.'
    }, {
        title: 'How long does a blood donation take?',
        text: 'The entire process takes about one hour and 15 minutes; the actual donation of a pint of whole blood unit takes eight to 10 minutes. However, the time varies slightly with each person depending on several factors including the donor’s health history and attendance at the blood drive.'
    }, {
        title: 'How long will it take to replenish the pint of blood I donate?',
        text: 'The plasma from your donation is replaced within about 24 hours. \n\
            Red cells need about four to six weeks for complete replacement.\n\
            That’s why at least eight weeks are required between whole blood donations.'
    }, {
        title: 'Can I add my friend and relatives as a donor with out there login Registration?',
        text: 'Yes, we can add the donor with their basic details on click.'
    }, {
        title: 'What is eligiblity criteria for blood donation?',
        text: 'Age between 18 and 60 years.Haemoglobin not less than 12.5 g/dl.Pulse between 50 and 100/minute with no irregularities'
    }, {
        title: 'Is it safe to give blood?',
        text: 'Donating blood is a safe process. Each donor’s blood is collected through a new, sterile needle that is used once and then discarded. Although most people feel fine after donating blood, a small number of people may feel lightheaded or dizzy, have an upset stomach or experience a bruise or pain where the needle was inserted. Extremely rarely, \n\
            loss of consciousness, nerve damage or artery damage occur.'
    }, {
        title: 'Can I get HIV from donating blood?',
        text: 'No. Sterile procedures and disposable equipment are used in all Red Cross donor centers. We use a needle only once and then dispose of it.\n\
         You cannot contract HIV or other viral disease by donating blood.'
    }];
    $scope.toggleItem = function(item) {
        if ($scope.isItemShown(item)) {
            $scope.shownItem = null;
        } else {
            $scope.shownItem = item;
        }
    };
    $scope.isItemShown = function(item) {
        return $scope.shownItem === item;
    };
})
   
.controller('helpCtrl', function(baseURL,$http,$ionicLoading,appStorage, $scope, $cordovaToast, $ionicHistory) {
    $ionicHistory.clearHistory();

    $scope.sendmessage = {};
    
    $scope.submit = function() {
        console.log($scope.sendmessage.message);
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/help.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
               MESSAGE:$scope.sendmessage.message,
               TOKEN: appStorage.getItem("TOKEN")
            },
            timeout: 30000
        };
        $http(request)
            .success(function(data) {               
                if (data.RETURN === true) {  
                    $ionicLoading.hide();
                    $cordovaToast.show("Message Sent Successfully", 'long', 'center');                   
                 } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {               
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'long', 'center');
            });        
        };
})

.controller('forgotPasswordCtrl', function($scope, $ionicLoading,$state, $http ,baseURL,$cordovaToast) {
    
    $scope.forgotPassword = {};
    
    $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });       
        var request = {
            method: 'POST',
            url: baseURL+"/forgot_password.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                EMAIL: $scope.forgotPassword.email,
                PH_NO:$scope.forgotPassword.ph_no
            },
            timeout: 30000
             
        };
        $http(request)
            .success(function(data) {
                if (data.RETURN === true) {                     
                    $ionicLoading.hide();
                    $cordovaToast.show("Email has been sent successfully.", 'long', 'center');
                    $state.go('login');
                   
                } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'long', 'center');
            });
    };

})

.controller("profileCtrl", function($scope,baseURL, $cordovaToast,$ionicLoading, $state,$http, $ionicPopover, $ionicModal, appStorage) {
    
    $scope.name     = appStorage.getItem("name");
    $scope.ph_no    = appStorage.getItem("ph_no");
    $scope.email    = appStorage.getItem("email");
    $scope.bg       = appStorage.getItem("bg");
    $scope.area     = appStorage.getItem("area");
    $scope.city     = appStorage.getItem("city");
    $scope.state    = appStorage.getItem("state");
    $scope.address  = appStorage.getItem("address");
    $scope.gender   = appStorage.getItem("gender");
    $scope.isdonor  = appStorage.getItem("isdonor");
    $scope.joindate = appStorage.getItem("joindate"); 
    $scope.image    = appStorage.getItem("img_url");    
    
    $scope.signOut = function(){
        
        appStorage.removeItem("username");
        appStorage.removeItem("email");
        appStorage.removeItem("ph_no");
        appStorage.removeItem("bg");
        appStorage.removeItem("country");
        appStorage.removeItem("city");
        appStorage.removeItem("state");
        appStorage.removeItem("img_url");
        appStorage.removeItem("gender");
        appStorage.removeItem("toggle");
        appStorage.removeItem("TOKEN");
        appStorage.removeItem("isdonor");
        appStorage.removeItem("joindate");
        appStorage.removeItem("img_url");
        $cordovaToast.show("Signout Successfull!", 'long', 'center');
        $state.go('login');
    };
    // POPOVER
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });
})

  
.controller('changePasswordCtrl', function($scope,$ionicLoading,$state, appStorage, baseURL,$http,$cordovaToast) {    
    $scope.NAME = appStorage.getItem("name");    
    $scope.changePass={};
     $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/change_password.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
              TOKEN : appStorage.getItem("TOKEN"),
              OLD_PASS: $scope.changePass.old_pass,
              NEW_PASS: $scope.changePass.password
            },
            timeout: 30000
        };
        
        $http(request)
            .success(function(data) {
                if (data.RETURN === true) {
                    $ionicLoading.hide();   
                    $cordovaToast.show("Password Changed Successfully", 'long', 'center'); 
                    $state.go('profile');                                      
                 } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {               
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'long', 'center');
            });         
        };
})

.controller("editProfileCtrl", function($scope,baseURL, $cordovaToast,$rootScope ,$ionicLoading, $state,$http, $ionicPopover, $ionicModal, appStorage) {
   
    $scope.editProfile ={};    
    $scope.editProfile.countryId  = appStorage.getItem("countryId");
    $scope.editProfile.stateId    = appStorage.getItem("stateId");
    $scope.editProfile.name       = appStorage.getItem("name");
    $scope.editProfile.ph_no      = appStorage.getItem("ph_no");
    $scope.editProfile.email      = appStorage.getItem("email");
    $scope.editProfile.bg         = appStorage.getItem("bg");
    $scope.editProfile.area       = appStorage.getItem("area");
    $scope.editProfile.cityId     = appStorage.getItem("cityId"); 
    $scope.editProfile.address    = appStorage.getItem("address");
    $scope.editProfile.gender     = appStorage.getItem("gender"); 
    $scope.editProfile.zipcode    = appStorage.getItem("zipcode"); 
    var isdonor    = appStorage.getItem("isdonor"); 
    if(isdonor === 'YES'){
        $scope.editProfile.checked    = true;
    }else{
        $scope.editProfile.checked    = false;
    }   
       
    $scope.submit = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        });
        var request = {
            method: 'POST',
            url: baseURL + "/edit_profile.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                TOKEN: appStorage.getItem('token'),
                NAME : $scope.editProfile.name, 
                EMAIL : $scope.editProfile.email,
                PHONE : $scope.editProfile.ph_no,
                GENDER : $scope.editProfile.gender,
                BLOD_GRUP : $scope.editProfile.bg,
                CITY : $scope.editProfile.cityId,
                STATE : $scope.editProfile.stateId,
                COUNTRY : $scope.editProfile.countryId,
                ADDRESS : $scope.editProfile.address,
                AREA : $scope.editProfile.area,
                ZIPCODE : $scope.editProfile.zipcode, 
                ISDONOR: $scope.editProfile.isdonor       
            },
            timeout: 30000         
        };
        $http(request)
            .success(function(data) {
                if (data.RETURN === true) {
                    appStorage.putItem("name", $scope.editProfile.name);
                    appStorage.putItem("email", $scope.editProfile.email);
                    appStorage.putItem("ph_no", $scope.editProfile.ph_no);
                    appStorage.putItem("bg", $scope.editProfile.bg);
                    appStorage.putItem("countryId", $scope.editProfile.countryId);
                    appStorage.putItem("cityId", $scope.editProfile.cityId);
                    appStorage.putItem("stateId", $scope.editProfile.stateId);   
                    appStorage.putItem("gender", $scope.editProfile.gender);
                    appStorage.putItem("country", data.country);
                    appStorage.putItem("city", data.city);
                    appStorage.putItem("state", data.state);                
                    appStorage.putItem("toggle", data.ISDONOR);
                    appStorage.putItem("zipcode", $scope.editProfile.zipcode); 
                    
                    $rootScope.$broadcast('userName', $scope.editProfile.name);
                    
                    $cordovaToast.show("Updated Successfully", 'short', 'center');  
                    $ionicLoading.hide();
                    $state.reload();                  
                 } else if (data.RETURN === false) {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.MESSAGE, 'long', 'center');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show("Oops! Something wrong, try again.", 'short', 'center');
                }
            }).error(function() {              
                $ionicLoading.hide();
                $cordovaToast.show("Network Error!", 'long', 'center');
            });         
        };
        
         //get state and city
    $scope.countryList = appStorage.getItem("COUNTRY_LIST");    
   
    $scope.onCountryChange = function () {
        $scope.countryIdVal = $scope.editProfile.countryId; 
        console.log($scope.countryIdVal);        
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETSTATE',
                COUNTRYID: $scope.countryIdVal           
            }         
        }).success(function (data) { 
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.stateList = data.STATE;               
            }else{
                console.log('List is empty');
            }           
        }).error(function(error) {
            console.log(error);
        });
    };
 
    $scope.onStateChange = function () {
        $scope.stateIdVal = $scope.editProfile.stateId;
        console.log($scope.stateIdVal);  
        $http({
            method: 'POST',
            url: baseURL + "/getLocations.php",    
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                STATUS: 'GETCITY',
                STATEID: $scope.stateIdVal        
            }  
        }).success(function (data) {
            console.log(data);
            if (data.RETURN === true) {                    
                $scope.cityList = data.CITY;         
            }else{
                console.log('List is empty');
            }          
        }).error(function(error) {
            console.log(error);
        });
    };  
});