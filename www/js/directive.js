/**
 * Created by zhuchaochao on 2016/7/2.
 */
var directiveMod=angular.module("ss.directive", []);


directiveMod.directive('hideTabs',function($rootScope){
    return {
        restrict:'AE',
        link:function($scope){
            $rootScope.hideTabs = 'tabs-item-hide';
            $scope.$on('$destroy',function(){
                $rootScope.hideTabs = '';
            })
        }
    } })


