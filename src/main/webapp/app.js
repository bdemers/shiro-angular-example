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
  'ngResource',
  'ui.bootstrap',
  'ui.gravatar',
  // 'ngAnimate',
  // 'ngSanitize',
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
      We want to redirect users back to the home
      state after they logout, so we watch for the
      logout event and then transition them to the
      login state
     */
    $rootScope.$on('$sessionEnd',function () {
      $state.transitionTo('home');
    });



    $rootScope.$on('$currentUser',function() {
      permissionsService.get().then(function(permissions) {
        authz.setPermissions(permissions);
      });
    });

    $rootScope.$on('$sessionEnd',function() {
      authz.setPermissions([]);
    });

    // var customDataPermisionsKey = 'apacheShiroPermissions';
    //
    // $rootScope.$on('$currentUser',function($stateParams, user) {
    //   authz.setPermissions( user.customData[customDataPermisionsKey] );
    // });

  });