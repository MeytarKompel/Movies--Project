// global var
let titleName;
let page;
// let totalPage;
let sortByName;
const api_key = "api_key=2c46288716a18fb7aadcc2a801f3fc6b";
const baseUrl = "https://api.themoviedb.org/3/movie";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const URL = `${baseUrl}/${sortByName}?${api_key}&language=en-US`;


const select = document.getElementById("sort");
const title = document.getElementById("title");
const pagination = document.getElementById("pagination");
const movies = document.getElementById("movies");
const notFound = document.getElementById("not-found");

// Checking routes
function checkingRoutes() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  sortByName = urlParams.get("sortBy");

  document.getElementById("sort").value = sortByName;
}

function setTitle() {
  checkingRoutes();
  if (sortByName == "now_playing") {
    title.innerHTML = "Now Playing Movies";
  } else if (sortByName == "my_favorites") {
    title.innerHTML = "My Favorites Movies";
  } else if (sortByName == "popular") {
    title.innerHTML = "Popular Movies";
  }
}


select.addEventListener("change", selectSort);

function selectSort(e) {
  page = 1;
  switch (e.target.value) {
    case "popular":
      movies.innerHTML = "";
      sortByName = "popular";
      history.replaceState(
        {},
        "",
        `index.html?sortBy=${sortByName}&page=${page}`
      );
      getMovies(URL);
      break;
    case "now_playing":
      movies.innerHTML = "";
      sortByName = "now_playing";
      history.replaceState(
        {},
        "",
        `index.html?sortBy=${sortByName}&page=${page}`
      );
      getMovies(URL);
      break;
    case "my_favorites":
      title.innerHTML = "My Favorites Movies";
      movies.innerHTML = "";
      sortByName = "my_favorites";
      history.replaceState(
        {},
        "",
        `index.html?sortBy=${sortByName}&page=${page}`
      );
      getFavoritesMovie();
      break;
    default:
      break;
  }
}


//Get Movies by selected sort
const getMovies = url => {
  setTitle();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  querySort = urlParams.get("sortBy");

  if (querySort == "my_favorites") {
    getFavoritesMovie();
  } else {
    if (queryString === "") {
      page = 1;
      sortByName = "popular";
      document.getElementById("sort").value = "popular";
    } else {
      const urlParams = new URLSearchParams(queryString);
      page = urlParams.get("page");
    }
    url = `${baseUrl}/${sortByName}?${api_key}&language=en-US&page=${page}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        data.results.forEach(movie => {
            movieCard(movie);
        });
        paginationOption(page);
        checkPagination(data.total_pages);
        notFound.style.display = "none";
      })
      .catch(error => {
        let template =
          "<div class='not-found' >Sorry! The movies not found:(</div>";
        notFound.innerHTML = template;
        notFound.style.display = "block";
        console.log(error);
      });
  }
};

// Movie Card Build
function movieCard(movie) {
  let card = "";
  card = `
  <div class="movie-item" onclick="goToMovie(${movie.id})">
          <div class="movie-image">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="movie img" />
          </div>
          <div class="movie-body">
            <h2 class="movie-rating"> ⭐️ ${
              movie.vote_average
            }</h2>
            <h3 class="movie-name">${movie.title}</h3>
          </div>
        </div>`;

  movies.innerHTML += card;
}


// Navigation to Selected Movie

const goToMovie = id => (window.location = `movie.html?id=${id}`);

// set pagination for results
function paginationOption(currentPage) {
  let paginationOption = `<button class="prev" id="prev" onclick="prevPage(${currentPage})">⬅️</button>
  <div class="current">${currentPage}</div>
  <button class="next" id="next" onclick="nextPage(${currentPage})">➡️</button>`;
  pagination.innerHTML = paginationOption;
}

// checking pagination function
function checkPagination(totalPages) {
  if (page == 1) {
    document.getElementById("prev").disabled = true;
    document.getElementById("prev").style.cursor = "auto";
  } else if (page == totalPages) {
    document.getElementById("next").disabled = true;
    document.getElementById("next").style.cursor = "auto";
  }
}

function nextPage(page) {
  page++;
  movies.innerHTML = "";
  history.replaceState({}, "", `index.html?sortBy=${sortByName}&page=${page}`);
  getMovies(URL);
}
function prevPage(page) {
  page--;
  movies.innerHTML = "";
  history.replaceState({}, "", `index.html?sortBy=${sortByName}&page=${page}`);
  getMovies(URL);
}


// get favorites movies
function getFavoritesMovie() {
  let favorites = JSON.parse(localStorage.getItem("my_favorites"));
  if (favorites !== null) {
    if (favorites.length !== 0) {
      favorites.forEach(movie => {
        movieCard(movie);
      });
    } else {
      notFound.innerHTML = "No favorite movies";
      notFound.style.display = "block";
    }
  } else {
    notFound.innerHTML = "No favorite movies";
    notFound.style.display = "block";
  }
  pagination.innerHTML = "";
}
