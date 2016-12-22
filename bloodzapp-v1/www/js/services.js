angular.module('bloodApp.services', [])

//COMMON BASE-URL
.factory('baseURL', function($rootScope) { 
    
    $rootScope.web_url  = 'http://bloodzapp.com/apps/mobile/bloodzapp/v1/api'; 
    return $rootScope.web_url; 
});
