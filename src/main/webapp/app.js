'use strict';

/*
 * Copyright 2016 Stormpath, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

angular.module('shiroExample', [
  'ui.router',
  'ui.bootstrap',
  'ui.gravatar',
  'ngResource',
  'ngAnimate',
  'ngSanitize',
  'stormpath',
  'stormpath.templates',
  'angular-authz'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $userProvider, STORMPATH_CONFIG) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    /*
     At the moment, JSON is not the default content type when posting forms, but
     most of our framework integrations are expecting JSON, so we need to manually set
     this.  JSON will be the default in the next major release of the Angular SDK.
    */
    STORMPATH_CONFIG.FORM_CONTENT_TYPE = 'application/json';
  })
  .run(function($stormpath,$rootScope,$state,authz, permissionsService){

    /*
      In this example we use UI router, and this
      is how we tell the Stormpath module which
      states we would like to use to use for login
      and post-login
     */
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'home'
    });

    /*
      We want reset the permissions and redirect
      users back to the home state after they logout,
      so we watch for the logout event and then
      transition them to the login state
     */
    $rootScope.$on('$sessionEnd',function () {
      authz.setPermissions([]);
      $state.transitionTo('home');
    });

    /*
      After login we need to get the users permissions from /api/permissions
      and then set then via authz.setPermissions()
     */
    $rootScope.$on('$currentUser',function() {
      permissionsService.get().then(function(permissions) {
        authz.setPermissions(permissions);
      });
    });

  });