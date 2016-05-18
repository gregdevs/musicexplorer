spotifyExplorerApp.controller('homeCtrl', function($scope, $http){

	function getArtist() {
		var artist = [];
		this.getInitial = function(artistId) {
			$http({
				method: 'GET',
				url: "https://api.spotify.com/v1/artists/" + artistId
			}).success(function(success) {
				var obj = {
					artist_name: success.name,
					artist_image: success.images[2].url
				}
               artist.push(obj)
			})
		},
		this.getRelated = function(artistId){
			$http({
				method: 'GET',
				url: "https://api.spotify.com/v1/artists/" + artistId  +  "/top-tracks?country=US"
			}).success(function(success) {
				var artist_track = success.tracks[0].preview_url;
				artist[0].artist_track = artist_track
				console.log(artist)

			})			
		}
	}
	var initialArtist = new getArtist();
    
    initialArtist.getInitial("2zq0uqN9Wq12tqrQQt1ozw");
    initialArtist.getRelated("2zq0uqN9Wq12tqrQQt1ozw");
	//https://api.spotify.com/v1/artists/2zq0uqN9Wq12tqrQQt1ozw/top-tracks?country=US
	
})