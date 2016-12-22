

//ROUTER CONTROLLER : APP HANDLER FOR LOGIN AND UID PAGE
































/////////////****************************************************************?///////

angular.module('bloodApp.controllers', ['bloodApp.dal'])


.controller('forgotPasswordCtrl', function($scope,$ionicLoading,$http,$ionicPopup,baseURL) {
    $scope.showdiv = true;
    $scope.forgotPassword = {};    
    $scope.submit = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner>'
        }); 
       
        var request = {
            method: 'POST',
            url : baseURL+"forgot_password.php",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {  
                    EMAIL:$scope.forgotPassword.email
            },
            timeout:30000
        };
        $http(request)
            .success(function(data) {console.log(data);              
            
                if(data.RETURN === true) {   
                    $ionicPopup.alert( {
                        title: 'Changed Password',
                        template: data.MESSAGE
                    });                  
                    
                }
                else if(data.RETURN === false)
                {   
                    $ionicLoading.hide();
                    $ionicPopup.alert( {
                        title: 'Authentication Failed',
                        template: data.MESSAGE
                    });                  
                }
                else 
                {  
                    $ionicLoading.hide();
                    //$cordovaToast.show("Oops! Something wrong, try again.", 'long', 'center');
                }
            }).error(function() {         
                console.log('error');     
                $ionicLoading.hide();
               // $cordovaToast.show("Network Error!", 'long', 'center');
            });
    }; 

})



.controller("profileCtrl", function($scope ,$ionicPopover ,$ionicModal,appStorage) {
    
    $scope.Name     = appStorage.getItem("name");
    $scope.ph_no    = appStorage.getItem("ph_no");
    $scope.email    = appStorage.getItem("email"); 
    $scope.bg       = appStorage.getItem("bg"); 
    $scope.area     = appStorage.getItem("area"); 
    $scope.city     = appStorage.getItem("city"); 
    $scope.state    = appStorage.getItem("state"); 
    $scope.address  = appStorage.getItem("address"); 
    $scope.gender   = appStorage.getItem("gender");
    
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.hidepopover = function() {
        $scope.popover.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    }); 
    
     
    $scope.closeModal = function() {
        $scope.editProfileModal.hide();
        $scope.changePasswordModal.hide();
        
    };
     
         
    $ionicModal.fromTemplateUrl('templates/editProfileModal.html', {
        scope: $scope
    })
    .then(function(editProfileModal) {
            $scope.editProfileModal = editProfileModal;
    });

    $scope.openEditProfileModal = function(){
        $scope.editProfileModal.show();        
    };
      
      
    $ionicModal.fromTemplateUrl('templates/changePassword.html', {
        scope: $scope
    })
    .then(function(changePasswordModal) {
            $scope.changePasswordModal = changePasswordModal;
    });

    $scope.doChangePasswordModal = function(){
        $scope.changePasswordModal.show();        
    };
    
    $scope.getstatusModal = function($scope,baseURL,$http,$ionicLoading,alerts,appStorage){

                var getstatus = {
                    method: 'POST',
                    url : baseURL+"/",
                    headers: {'Content-Type': 'text/plain'},
                    data : {
                       TOKEN     : appStorage.getItem('token')
                      
                    },
                    timeout:30000
                };
                $http(getstatus)
                    .success(function(data) {
                       if(data.RETURN === "TRUE") {
                           
                            $ionicLoading.hide();
                            var statuslistObject = JSON.parse(data.LIST);
                               $scope.statuslist = statuslistObject.filter(function (name) {
                               return name.NAME !== status;
                            });
                       }
                       else {
                            alerts.errorMessage();
                            $ionicLoading.hide();
                       }
                    }).error(function() {
                        $ionicLoading.hide();
                        $scope.showImg = true;
                        alerts.networkImgError();

                    }).finally(function() {
                            $scope.$broadcast('scroll.refreshComplete');
                    });
            };
    
})

.controller('changePasswordCtrl', function($scope) {
      
    $scope.getstatusModal = function($scope,baseURL,$http,$ionicLoading,alerts,appStorage){

                var getstatus = {
                    method: 'POST',
                    url : baseURL+"/",
                    headers: {'Content-Type': 'text/plain'},
                    data : {
                       TOKEN     : appStorage.getToken('token')
                      
                    },
                    timeout:30000
                };
                $http(getstatus)
                    .success(function(data) {
                       if(data.RETURN === "TRUE") {
                           
                            $ionicLoading.hide();
                            var statuslistObject = JSON.parse(data.LIST);
                               $scope.statuslist = statuslistObject.filter(function (name) {
                               return name.NAME !== status;
                            });
                       }
                       else {
                            alerts.errorMessage();
                            $ionicLoading.hide();
                       }
                    }).error(function() {
                        $ionicLoading.hide();
                        $scope.showImg = true;
                        alerts.networkImgError();

                    }).finally(function() {
                            $scope.$broadcast('scroll.refreshComplete');
                    });
            };
})


    

        