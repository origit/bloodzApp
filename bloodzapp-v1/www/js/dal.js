/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('bloodApp.dal', [])

.factory('appStorage', function() {
    return {
        putItem: function(key, jsonObj) {
            if(key !== null && jsonObj !== null) {
                this.key = key;
                window.localStorage.setItem(this.key, JSON.stringify(jsonObj));
            }
        },        
        getItem:function(key) {
            if(key !== null) {
                this.key =  key;
                return JSON.parse(window.localStorage.getItem(this.key));
            }
        }, 
        removeItem: function(key) {
            if(key !== null) {
                this.key = key;
                return window.localStorage.removeItem(this.key);
            }
        }
    };
});

