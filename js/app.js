var spotifyExplorerApp = angular.module('spotifyExplorerApp', [])
.directive('getName', function(){
	   return{
	   	  restrict: 'A',
           link: function(scope, elm, attr){
           	setTimeout(function(){
           	var artistName = $('.activeartist').attr('data-name');	
               elm.text(artistName)
           }, 1000)
          	  
          }
	   }
});