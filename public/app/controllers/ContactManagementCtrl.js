angular.module('ContactManagementController', ['contactServices'])

// Controller: User to control the management page and managing of user accounts
.controller('ContactManagementCtrl', function(Contact, User, $scope) {
    var app = this;

    app.loading = true; // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    app.editAccess = false; // Clear access on load
    app.deleteAccess = false; // CLear access on load
    app.limit = 5; // Set a default limit to ng-repeat
    app.searchLimit = 0; // Set the default search page results limit to zero

    // Function: get all the users from database
    function getContact() {
        // Runs function to get all the users from database
        Contact.getContacts().then(function(data) {
            // Check if able to get data from database
            
            if (data.data.success) {
                // Check which permissions the logged in user has
                if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                    app.users = data.data.contacts; // Assign users from database to variable
                    app.loading = false; // Stop loading icon
                    app.accessDenied = false; // Show table
                    // Check if logged in user is an admin or moderator
                    if (data.data.permission === 'admin') {
                        app.editAccess = true; // Show edit button
                        app.deleteAccess = true; // Show delete button
                    } else if (data.data.permission === 'moderator') {
                        app.editAccess = true; // Show edit button
                    }
                } else {
                    app.errorMsg = 'Insufficient Permissions'; // Reject edit and delete options
                    app.loading = false; // Stop loading icon
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getContact(); // Invoke function to get users from databases



    // Function: Delete a user
    app.deleteUser = function(number) {
        // Run function to delete a user
        Contact.deleteContact(number).then(function(data) {
            // Check if able to delete user
            console.log('data.data.success: '+data.data.success)
            if (data.data.success) {
                getContact(); // Reset users on page
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

})

// Controller: Used to edit users
.controller('editContactCtrl', function($scope, $routeParams,Contact, User, $timeout) {
    var app = this;
    $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
    app.phase1 = true; // Set the 'name' tab to default view

    // Function: get the user that needs to be edited
    Contact.getContact($routeParams.id).then(function(data) {
        // Check if the user's _id was found in database
        if (data.data.success) {
            $scope.newName = data.data.user.name; // Display user's name in scope
            $scope.newNumber = data.data.user.number; // Display user's e-mail in scope
            $scope.newJob = data.data.user.job; // Display user's username in scope
            $scope.newLocation = data.data.user.location; // Display user's permission in scope
            app.currentContact = data.data.user._id; // Get user's _id for update functions
        } else {
            app.errorMsg = data.data.message; // Set error message
            $scope.alert = 'alert alert-danger'; // Set class for message
        }
    });

    // Function: Set the name pill to active
    app.namePhase = function() {
        
        $scope.numberTab = 'default'; // Clear username class
        $scope.jobTab = 'default'; // Clear email class
        $scope.locationTab = 'default'; // Clear permission class
        app.phase1 = true; // Set name tab active
        app.phase2 = false; // Set username tab inactive
        app.phase3 = false; // Set e-mail tab inactive
        app.phase4 = false; // Set permission tab inactive
        app.errorMsg = false; // Clear error message
    };

    // Function: Set the e-mail pill to active
    app.jobPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.numberTab = 'default'; // Clear username class
        $scope.jobTab = 'active'; // Set e-mail list to active
        $scope.locationTab = 'default'; // Clear permissions class
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = false; // Set username tab to inactive
        app.phase3 = true; // Set e-mail tab to active
        app.phase4 = false; // Set permission tab to inactive
        app.errorMsg = false; // Clear error message
    };

    // Function: Set the username pill to active
    app.numberPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.numberTab = 'active'; // Set username list to active
        $scope.jobTab = 'default'; // CLear e-mail class
        $scope.locationTab = 'default'; // CLear permissions tab
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = true; // Set username tab to active
        app.phase3 = false; // Set e-mail tab to inactive
        app.phase4 = false; // Set permission tab to inactive
        app.errorMsg = false; // CLear error message
    };

    // Function: Set the permission pill to active
    app.locationPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.numberTab = 'default'; // Clear username class
        $scope.jobTab = 'default'; // Clear e-mail class
        $scope.locationTab = 'active'; // Set permission list to active
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = false; // Set username to inactive
        app.phase3 = false; // Set e-mail tab to inactive
        app.phase4 = true; // Set permission tab to active
        app.disableUser = false; // Disable buttons while processing
        app.disableModerator = false; // Disable buttons while processing
        app.disableAdmin = false; // Disable buttons while processing
        app.errorMsg = false; // Clear any error messages
        // Check which permission was set and disable that button
        if ($scope.newPermission === 'user') {
            app.disableUser = true; // Disable 'user' button
        } else if ($scope.newPermission === 'moderator') {
            app.disableModerator = true; // Disable 'moderator' button
        } else if ($scope.newPermission === 'admin') {
            app.disableAdmin = true; // Disable 'admin' button
        }
    };

    // Function: Update the contact's name
    app.updateName = function(newName, valid) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
        
        if (valid) {
            
            var userObject = {}; // Create a user object to pass to function
            userObject._id = app.currentContact; // Get _id to search database
            userObject.name = $scope.newName; // Set the new name to the user
            // Runs function to update the user's name
            
            Contact.editContact(userObject).then(function(data) {
                // Check if able to edit the user's name
                console.log('data.data.success: '+data.data.success)
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.nameForm.name.$setPristine(); // Reset name form
                        app.nameForm.name.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.alert = 'alert alert-danger'; // Set class for message
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's e-mail
    app.updateJob = function(newJob, valid) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Lock form while processing
        // Check if submitted e-mail is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass in function
            userObject._id = app.currentContact; // Get the user's _id in order to edit
            userObject.job = $scope.newJob; // Pass the new e-mail to save to user in database
            // Run function to update the user's e-mail
            Contact.editContact(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.jobForm.job.$setPristine(); // Reset e-mail form
                        app.jobForm.job.$setUntouched(); // Reset e-mail form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    app.errorMsg = data.data.message; // Set error message
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.alert = 'alert alert-danger'; // Set class for message
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's username
    app.updateNumber = function(newNumber, valid) {
        app.errorMsg = false; // Clear any error message
        app.disabled = true; // Lock form while processing
        // Check if number submitted is valid
        console.log('valid: '+valid)
        if (valid) {
            var userObject = {}; // Create the user object to pass to function
            userObject._id = app.currentContact; // Pass current user _id in order to edit
            userObject.number = $scope.newNumber; // Set the new number provided
            // Runs function to update the user's number
            Contact.editContact(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.numberForm.number.$setPristine(); // Reset number form
                        app.numberForm.number.$setUntouched(); // Reset number form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };


    // Function: Update the contact's location
    app.updateLocation = function(newLocation, valid) {
        app.errorMsg = false; // Clear any error message
        app.disabled = true; // Lock form while processing
        // Check if location submitted is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass to function
            userObject._id = app.currentContact; // Pass current user _id in order to edit
            userObject.location = $scope.newLocation; // Set the new location provided
            // Runs function to update the user's location
            Contact.editContact(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.locationForm.location.$setPristine(); // Reset location form
                        app.locationForm.location.$setUntouched(); // Reset location form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

});
