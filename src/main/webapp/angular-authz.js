(function () {
    'use strict';
    angular.module('angular-authz', []);
    angular.module('angular-authz').factory('SimplePermission', function () {
        function SimplePermission(permString) {
            this.asString = function () {
                return permString;
            };
            this.implies = function (permission) {
                return this.asString() === permission.asString();
            };
        }
        return SimplePermission;
    });
    angular.module('angular-authz').factory('simplePermissionResolver', [
        'SimplePermission',
        function (SimplePermission) {
            return {
                resolve: function (permissionString) {
                    return new SimplePermission(permissionString);
                }
            };
        }
    ]);
    angular.module('angular-authz').factory('WildcardPermission', function () {
        function toParts(permissionString) {
            var parts = [];
            var levels = permissionString.split(':');
            for (var i = 0; i < levels.length; ++i) {
                parts.push(levels[i].split(','));
            }
            return parts;
        }
        function containsAll(source, vals) {
            for (var i = 0; i < vals.length; ++i) {
                if (source.indexOf(vals[i]) === -1) {
                    return false;
                }
            }
            return true;
        }
        function WildcardPermission(permissionString) {
            var parts = toParts(permissionString);
            this.asString = function () {
                return permissionString;
            };
            this.asParts = function () {
                return parts;
            };
            this.implies = function (other) {
                var i;
                for (i = 0; i < other.asParts().length; ++i) {
                    if (parts.length - 1 < i) {
                        return true;
                    } else {
                        if (parts[i].indexOf('*') === -1 && !containsAll(parts[i], other.asParts()[i])) {
                            return false;
                        }
                    }
                }
                for (; i < parts.length; ++i) {
                    if (parts[i].indexOf('*') === -1) {
                        return false;
                    }
                }
                return true;
            };
        }
        return WildcardPermission;
    });
    angular.module('angular-authz').factory('wildcardPermissionResolver', [
        'WildcardPermission',
        function (WildcardPermission) {
            return {
                resolve: function (permissionString) {
                    return new WildcardPermission(permissionString);
                }
            };
        }
    ]);
    angular.module('angular-authz').provider('authz', function () {
        var providedPermissionResolver;
        this.setResolver = function (resolver) {
            providedPermissionResolver = resolver;
        };
        var providedHasPermissionResolver;
        this.setHasResolver = function (resolver) {
            providedHasPermissionResolver = resolver;
        };
        var providedPermissionsStringArray;
        this.setPermissions = function (perms) {
            providedPermissionsStringArray = perms;
        };
        this.$get = [
            'wildcardPermissionResolver', '$rootScope',
            function (wildcardPermissionResolver, $rootScope) {
                var resolver = providedPermissionResolver || wildcardPermissionResolver;
                var hasResolver = providedHasPermissionResolver || providedPermissionResolver || wildcardPermissionResolver;
                var permissions = [];
                function resolvePermissions(permissionsStringArray) {
                    permissions.length = 0;
                    for (var i = 0; i < permissionsStringArray.length; ++i) {
                        var permission = resolver.resolve(permissionsStringArray[i]);
                        permissions.push(permission);
                    }
                }
                function permissionsChangedEvent() {
                    $rootScope.$broadcast("$permissionsSetEvent",permissions);
                }
                if (providedPermissionsStringArray) {
                    resolvePermissions(providedPermissionsStringArray);
                }
                return {
                    setPermissions: function (permissionsStringArray) {
                        resolvePermissions(permissionsStringArray);
                        permissionsChangedEvent();
                    },
                    addPermission: function (permissionString) {
                        permissions.push(resolver.resolve(permissionString));
                        permissionsChangedEvent();
                    },
                    hasPermission: function (permissionString) {
                        var permission = hasResolver.resolve(permissionString);
                        for (var i = 0; i < permissions.length; ++i) {
                            if (permissions[i].implies(permission)) {
                                return true;
                            }
                        }
                        return false;
                    }
                };
            }
        ];
    });
    angular.module('angular-authz').directive('hasPermission', [
        'authz',
        '$rootScope',
        function (authz, $rootScope) {
            return {
                link: function(scope, element, attrs) {

                    var permExpr = attrs.hasPermission;

                    function evalElement(){
                        if(authz.hasPermission(permExpr)) {
                            element.removeClass('ng-hide');
                        }
                        else {
                            element.addClass('ng-hide');
                        }
                    }

                    if(permExpr) {
                        $rootScope.$watchCollection('permissions', function() {
                            evalElement();
                        });
                    }
                }
            };
        }
    ]);
    angular.module('angular-authz').directive('hasNotPermission', [
        'authz',
        '$rootScope',
        function (authz, $rootScope) {
            return {

                link: function(scope, element, attrs) {

                    var permExpr = attrs.hasNotPermission;

                    function evalElement(){
                        if(!authz.hasPermission(permExpr)) {
                            element.removeClass('ng-hide');
                        }
                        else {
                            element.addClass('ng-hide');
                        }
                    }

                    if(permExpr) {
                        $rootScope.$watchCollection('permissions', function() {
                            evalElement();
                        });
                    }
                }
            };
        }
    ]);

angular.module('angular-authz').run(['$rootScope',function($rootScope){

        // update the scope to re-eval the hidden/shown elements
        $rootScope.$on('$permissionsSetEvent',function(event, permissions){
            $rootScope.permissions = permissions;
        });
    }])

}());