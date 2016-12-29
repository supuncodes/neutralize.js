(function(m){

    m.directive ("nuClick", function(){
        
        return {
            restrict :"A",
            scope: {
                func : "="
            },
            controller: function($scope){
                alert ($scope.func);
                alert (sc.func);
            },
            link: function (scope,el){
                var self = this;
                

                el.bind ("click", function(){
                    alert (self.$scope);
                    if (func)
                        func();
                });
            }
        }
    });


})(angular.module ("ngNeutralize",[]))