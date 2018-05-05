angular.module('contactControllers', [])
.controller('contactCtrl',function($http, $location){
    var app = this;

    this.newContact = function(contactData){
        app.errorMsg = false;
        app.loading= true;
        $http.post('/api/contacts', this.contactData).then(function(data){
            console.log(data.data.message);
            console.log(data.data.success);
            if(data.data.success)
            {
                app.loading= false;
                app.successMsg = data.data.message;
                $location.path('/ContactManagement');
            }else{
                app.loading= false;
                app.errorMsg = data.data.errorMsg;
            }
        })
    }
});
















