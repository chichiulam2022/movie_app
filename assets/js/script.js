const searchInput = document.querySelector('.search-input');
const searchList = document.querySelector('.search-list');
const searchResult = document.querySelector('#result');
const ClearHistoryBtn = document.querySelector('.clear-history-btn')
const historyElement = document.querySelector('.history-element')
const OmdApiKey = "db0da826";
const imdbApiKEy = 'k_bwduzyr8';

function movieSearch(searchTerm) {
    const queryURL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${OmdApiKey}`
    axios.get(queryURL)
        .then(res => {
            listMovies(res.data.Search)
        })
        .catch(error => { error })
};
// creates a list to be populated as the user types the search input
function movieSearchProgress() {
    let searchTerm = (searchInput.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-list');
        movieSearch(searchTerm);
    } else {
        searchList.classList.add('hide-list');
    };
};
// populates the list with suggested movies with their title, year, and trailer
function listMovies(movies) {
    searchList.innerHTML = "";
    for (let result of movies) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = result.imdbID;
        movieListItem.classList.add('search-list-item');
        moviePoster = result.Poster;
        movieListItem.innerHTML = `
            <div class = "search-item-thumbnail">
                <img src = "${moviePoster}">
            </div>
            <div class = "search-item-info">
                <h3>${result.Title}</h3>
                <p>${result.Year}</p>
            </div>
            `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails()
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-list');
            searchInput.value = "";
            //grab data from omdbapi
            const res = await axios.get(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${OmdApiKey}`);
            showMovieDetails(res);

            //pass movie ID from Omdbapi API for IMDb-API
            showRottenTomatoes(movie.dataset.id)

            //search history
            const searchTitle = res.data.Title
            displayHistory(searchTitle)
        });
    });
}
// renders elements of the API call on the page under specific headings
function showMovieDetails(res) {
    const data = res.data
    searchResult.removeAttribute("style");

    //get movie poster
    const moviePoster = document.querySelector('.movie-poster');
    moviePoster.src = data.Poster

    //get movie title
    const movieTitle = document.querySelector('.movie-title');
    movieTitle.innerHTML = data.Title

    //get movie year
    const MovieYear = document.querySelector('.year');
    MovieYear.innerHTML = `Year:&nbsp${data.Year}`

    //get director
    const director = document.querySelector('.director');
    director.innerHTML = `Director:&nbsp${data.Director}`

    //get movie genre
    const genre = document.querySelector('.genre');
    genre.innerHTML = `Genre:&nbsp${data.Genre}`

    //get writer
    const writer = document.querySelector('.writer');
    writer.innerHTML = `Writer(s):&nbsp${data.Writer}`

    //get actors
    const actors = document.querySelector('.actors');
    actors.innerHTML = `Actors:&nbsp${data.Actors}`

    //get nomination
    const awards = document.querySelector('.awards');
    awards.innerHTML = `Award(s):&nbsp${data.Awards}`

    //get language
    const language = document.querySelector('.language');
    language.innerHTML = `Language(s):&nbsp${data.Language}`

    //get plot
    const plot = document.querySelector('.plot');
    plot.innerHTML = `Plot:&nbsp${data.Plot}`
};

//grab info from IMDb-API for rotten tomatoes
function showRottenTomatoes(movieID) {
    const rottenTomatoesURL = `https://imdb-api.com/en/API/Ratings/${imdbApiKEy}/${movieID}`
    axios.get(rottenTomatoesURL)
        .then(res => {
            //get rotten tomatoes
            const rating = res.data.rottenTomatoes;
            const rottenTomatoesRating = document.querySelector('.rotten-tomatoes-rating')
            rottenTomatoesRating.innerHTML = rating;
            if (rating > 60) {
                rottenTomatoesRating.style.backgroundColor = 'red'
            }
            else if (!rating) {
                rottenTomatoesRating.style.backgroundColor = 'transparent'
                rottenTomatoesRating.style.color = 'red'
                rottenTomatoesRating.innerHTML = `N/A, ${res.data.errorMessage}`
            }
            else {
                rottenTomatoesRating.style.backgroundColor = 'green'
            }
        })
        .catch(error => {
            error
        })
};

// checks for items in localstorage and renders elements on the page
function displayHistory(searchValue) {
    historyElement.removeAttribute('style')
    const historyText = document.querySelector('.history-element');
    historyText.innerHTML = ""
    let dataArr = [];
    if (localStorage.getItem('title') != undefined) {
        dataArr = JSON.parse(localStorage.getItem('title'));
    }
    dataArr.push(searchValue);
    localStorage.setItem('title', JSON.stringify(dataArr));
    for (let i = 0; i < dataArr.length; i++) {
        const historyItem = document.createElement("div");
        historyItem.textContent = dataArr[i]
        historyText.append(historyItem);
    }
}
// clears localstorage of all values
ClearHistoryBtn.onclick = () => {
    localStorage.clear();
    dataArr = []
    displayHistory()
}