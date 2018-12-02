var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var spotifyURL = "https://api.spotify.com/v1/";
var omdbURL = "http://www.omdbapi.com/"; 
// accept these commands

var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

switch(command){
    case "concert-this":
        //concert-this  -- from "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
        //Name of the venue
        //Venue location
        //Date of the Event (use moment to format this as "MM/DD/YYYY")
        console.log("haven't get API key for bandsintown. :(");
        break;
    case "spotify-this-song":
        //spotify-this-song -- spotify
        //Artist(s)
        //The song's name
        //A preview link of the song from Spotify
        //The album that the song is from
        if(term.length == 0){
            term = "The%20Sign";
        }
        spotifyURL = spotifyURL + "search?q=" + term + "&type=track";
        searchSpotify(spotifyURL);
        break;
    case "movie-this":    
        //movie-this -- omdb
        /* Title of the movie.
        * Year the movie came out.
        * IMDB Rating of the movie.
        * Rotten Tomatoes Rating of the movie.
        * Country where the movie was produced.
        * Language of the movie.
        * Plot of the movie.
        * Actors in the movie.*/
        if(term.length ==0 ){
            term = "Mr.%20Nobody";
        }

        omdbURL = omdbURL+ "?t=" + term + "&apikey=" + keys.omdb.id;
        searchOmdb(omdbURL);
        break;
    case "do-what-it-says":    
        //do-what-it-says
        fs.readFile("random.txt","UTF-8",function(err,data){
            if(err){console.log("Can't open file.");}
            var action = data.split(",");
            
            if(action[0] =="spotify-this-song"){
                spotifyURL = spotifyURL + "search?q=" + action[1] + "&type=track";
                console.log(spotifyURL);
                searchSpotify(spotifyURL);
            }else if (action[0] == "movie-this"){
                omdbURL = omdbURL+ "?t=" + action[1] + "&apikey=" + keys.omdb.id;
                searchOmdb(omdbURL);
            }
        });
        break;
}

function searchOmdb(URL){
    request.get(URL,function(err, response,data) {
        //get first item from index
        data = JSON.parse(data);
        var rottenRating = 0;
        for ( var i=  0; i < data.Ratings.length; i ++){
            if(data.Ratings[i].source == "Rotten Tomatoes"){
                rottenRating = data.Ratings[i].value;
            }
        }
        var info = ["Title: " + data.Title,
                    "Year: " + data.Year,
                    "Rating: " + data.imdbRating,
                    "Rotten Tomatoes Rating: " + rottenRating,
                    "Country: " + data.Country].join("\n\n");
        
        console.log(info);
    });
}

function searchSpotify(URL){
    var spotify = new Spotify(keys.spotify);
    spotify
    .request(URL).then(function(response) {
        data = response.tracks.items[0];
        //get first item from index
        var info = ["Artist(s): " + data.artists[0].name,
                    "The song's name: " + data.album.name,
                    "Preview link: " + data.preview_url,
                    "Album: " + data.album.name].join("\n\n");
        
        console.log(info);
    })
    .catch(function(err) {
        console.log(err);
    });
}