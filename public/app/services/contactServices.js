angular.module('contactServices', [])

.factory('Contact', function($http) {
    var userFactory = {}; // Create the contactFactory object

  

    // Get the current contact's permission
    userFactory.getPermission = function() {
        return $http.get('/api/permission/');
    };

   

    // Get all the contacts from database
    userFactory.getContacts = function() {
        return $http.get('/api/contactmanagement/');
    };


    // Get contact to then edit
    userFactory.getContact = function(id) {
        return $http.get('/api/editContact/' + id);
        
    };

    // Delete a contact
    userFactory.deleteContact = function(number) {
        return $http.delete('/api/contactmanagement/' + number);
    };

    // Edit a contact
    userFactory.editContact = function(id) {
        return $http.put('/api/editContact', id);
    };

    return userFactory; // Return userFactory object
});
