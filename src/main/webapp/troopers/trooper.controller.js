(function () {
    'use strict';

    angular
        .module('shiroExample')
        .controller('TrooperController', TrooperController);

    TrooperController.$inject = ['TrooperService', '$scope', '$stateParams', '$state', '$uibModal', '$log'];

    function TrooperController(TrooperService, $scope, $stateParams, $state, $uibModal, $log) {

        TrooperService.getTrooper({id: $stateParams.id}, function (response) {
            $scope.trooper = response;
        });

        $scope.deleteTrooper = function () {
            $scope.trooper.$delete(function() {
                $state.go('troopers');
            });
        };

        var $trooperModal = this;

        $trooperModal.open = function (trooper) {

            $trooperModal.originalTrooper = trooper;

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'editTrooperModal.html',
                controller: 'EditModalInstanceCtrl',
                controllerAs: '$trooperModal',
                resolve: {
                    trooper: function () {
                        return angular.copy(trooper);
                    }
                }
            });

            modalInstance.result.then(
                function save(trooper) {
                    trooper.$save(function(resultTrooper) {
                        $scope.trooper = resultTrooper;
                    });
                },
                function cancel() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        };
    }
})();

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular
    .module('shiroExample')
    .controller('EditModalInstanceCtrl', function ($uibModalInstance, trooper) {

        var $trooperModal = this;
        $trooperModal.trooper = trooper;

        $trooperModal.save = function () {
            $uibModalInstance.close($trooperModal.trooper);
        };

        $trooperModal.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

angular
    .module('shiroExample')
    .component('editTrooperModal', {

        templateUrl: 'editTrooperModal.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $trooperModal = this;

            $trooperModal.$onInit = function () {
                $trooperModal.trooper = $trooperModal.resolve.trooper;
            };

            $trooperModal.ok = function () {
                $trooperModal.close({$value: $trooperModal.trooper});
            };

            $trooperModal.cancel = function () {
                $trooperModal.dismiss({$value: 'cancel'});
            };
        }
    });