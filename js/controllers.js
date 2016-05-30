spotifyExplorerApp.controller('homeCtrl', function($scope, $http, $timeout) {

    var artist = [];
    var localartist = [];
    var artistid;
    var artistIdHolder;
    var getArtist;
    var getPreviewTrack;
    var obj;
    var artist_track;
    var getRelatedArtists;
    var related_artists;
    var preview_track;
    var waveForm;
    var $grid = $('.grid');
    var selectLatestObject;
    var $pillwrapper = $('.artist-pillwrapper');
    var widthHolder = [100];
    var containmentx1 = -1000;
    var containmenty1 = 0;
    var containmentx2 = $('.artistcard').width();
    var containmenty2 = 0; 
    var counts = 0;
    var opacityToUse;
    $scope.activeartist = "Mr. Bungle";
    $scope.fromlocal = false;

    function GetArtistInfo(artistIdHolder, endPoint, callback) {
        if (localStorage.getItem(artistIdHolder)) {
            console.log(artist)
            angular.forEach(artist, function(a) {
                if (a.artist_id === artistIdHolder) {
                    $scope.fromlocal = true;
                    localartist.length = 0;
                    localartist.push(a);
                    $scope.localartist = localartist;
                    console.log("localartist")
                    console.log(localartist)
                    preview_track = a.artist_track;
                    $timeout(function() {
                        getTrack(preview_track);

                    }, 10)
                }
            })
        } else {
            $scope.fromlocal = false;
            this.data = $http({
                method: 'GET',
                url: "https://api.spotify.com/v1/artists/" + artistIdHolder + '/' + endPoint //endpoint "/top-tracks?country=US"
            }).success(function(success) {
                callback(success);

            }).error(function(error) {
                return error;
            });
        }
    }

    GetArtistInfo.prototype.get = function() {
        return this.data
    };
    artistIdHolder = "2zq0uqN9Wq12tqrQQt1ozw";
    getArtist = new GetArtistInfo(artistIdHolder, "", spotifyGet_Artist);
    getArtist.get();


    function showControls() {
        $(".related-artist-box, .artist-pill").hover(function() {
            $(this).find('.related-controls-wrapper').fadeIn(200);
            $(this).find('.h4-wrapper').fadeIn(200)

        }, function() {
            $(this).find('.related-controls-wrapper').fadeOut(200);
            $(this).find('.h4-wrapper').fadeOut(200)
        });
    }


    function spotifyGet_Artist(success) {
       console.log(success)
        related_artists = [];
        obj = {
            artist_name: success.name,
            artist_image: success.images[1].url,
            artist_id: success.id
        }
        artist.push(obj)
        getPreviewTrack = new GetArtistInfo(artistIdHolder, "top-tracks?country=US", spotifyGet_Preview);
        getPreviewTrack.get();
        selectLatestObject = artist.slice(-1)[0];

    }


    function spotifyGet_Preview(success) {

        artist_track = success.tracks[0].preview_url;
        selectLatestObject["artist_track"] = artist_track;
        getRelatedArtists = new GetArtistInfo(artistIdHolder, "related-artists", spotifyGet_Related);
        getRelatedArtists.get();
        //initialArtist.getRelatedArtists("2zq0uqN9Wq12tqrQQt1ozw");

    }

    function spotifyGet_Related(success) {

        related_artists = success.artists;
        selectLatestObject["related_artists"] = related_artists;

        $scope.artist = artist;
        localStorage.setItem(selectLatestObject.artist_id, JSON.stringify(selectLatestObject))
        console.log(artist)



        $timeout(function() {
            preview_track = selectLatestObject.artist_track;
            getTrack(preview_track);

        }, 10)

    }

    function getTrack(preview_track) {
       pushLeft(0);

        console.log(preview_track)
        waveForm = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#333',
            pixelRatio: 1,
            progressColor: '#24CF5F',
            height: 30
        });
        //var waveWidth = $(window).width() - 340;
        waveForm.load(preview_track);
        //$('#waveform').width(waveWidth)

        localStorage.setItem('track', preview_track)
        showControls();
        $scope.playArtist = function($event) {

            if (angular.element(event.currentTarget).attr('data-audio') != localStorage.getItem('track')){
             preview_track = angular.element(event.currentTarget).attr('data-audio')
              localStorage.setItem('track', preview_track)
             waveForm.empty();
             waveForm.load(preview_track);
             $timeout(function(){waveForm.playPause()}, 500)
             
            }else{
            waveForm.playPause()
            }
        }
        $scope.openRelated = function(event) { 
            $('.activeartist').removeClass('activeartist')
            artistIdHolder = angular.element(event.currentTarget).parent().parent().attr('data-artistid');
            artistname = angular.element(event.currentTarget).parent().parent().attr('data-artist')
            if (localStorage.getItem(artistIdHolder)) {
                console.log('id exists')
                $scope.fromlocal = true;

                // $scope.localartist = [];
                //$scope.localartist.push(localStorage.getItem(JSON.parse(localStorage.getItem(artistIdHolder))));
            }
           $scope.activeartist = artistname;
            waveForm.destroy()
            getArtist = new GetArtistInfo(artistIdHolder, "", spotifyGet_Artist);
            getArtist.get();
            pushLeft(100);
                
               
        

        
               // $( ".artist-pillwrapper" ).sortable({axis: "x"});

            

        }
    }

    function add(a, b) {
        return a + b;
    }

    function pushLeft(width) {
        widthHolder.push(width)
        var totalWidth = widthHolder.reduce(add, 0);
        var moveDragger = totalWidth - 115;
        $pillwrapper.width(totalWidth + 40)
        $pillwrapper.css('left', '-' + moveDragger + 'px')
        containmentx2 = $('.artistcard').width();
        $pillwrapper.draggable({
            handle: '.pill-grabber',
            containment: [containmentx1, containmenty1, containmentx2, containmenty2],

            drag: function(event, ui) {
                console.log(ui)
                var percentageOp = ui.position.left;
                if (percentageOp >= 0 && percentageOp < 30){
                    opacityToUse = 1;
                    $('.artist-info').fadeTo(0, opacityToUse)

                }                 
                else if (percentageOp >= 30 && percentageOp < 80){
                    opacityToUse = 0.9;
                    $('.artist-info').fadeTo(0, opacityToUse)

                } 
                else if (percentageOp >= 80 && percentageOp < 130) {
                    opacityToUse = 0.8;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                }
                else if (percentageOp >= 130 && percentageOp < 180) {
                    opacityToUse = 0.7;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                }
                else if (percentageOp >= 180 && percentageOp < 230) {
                    opacityToUse = 0.5;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                }
                else if (percentageOp >= 230 && percentageOp < 280) {
                    opacityToUse = 0.4;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                } 
                else if (percentageOp >= 280 && percentageOp < 330) {
                    opacityToUse = 0.3;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                } 
                else if (percentageOp >= 330 && percentageOp < 380) {
                    opacityToUse = 0.2;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                } 
                else if (percentageOp >= 430) {
                    opacityToUse = 0.1;
                    $('.artist-info').fadeTo(0, opacityToUse)
                    
                } 
                                                                                                             



            },

        });

    }

});