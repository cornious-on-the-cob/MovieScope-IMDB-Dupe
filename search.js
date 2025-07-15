const APIKEY = "fa480c9";
let currentMovies = [];

async function fetchData() {
  const loadingEl = document.getElementById("loading");
  const resultsEl = document.getElementById("results");
  loadingEl.style.display = "block";
  resultsEl.innerHTML = "";

  try {
    const query = document.getElementById("movieName").value.trim();
    if (!query) {
      alert("Please enter a movie or show name!");
      return;
    }


    const searchRes = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${APIKEY}`
    );
    const searchData = await searchRes.json();
    if (searchData.Response === "False") {
      alert(searchData.Error);
      return;
    }

    const shortlist = searchData.Search.slice(0, 10).map((m) => m.imdbID);


    currentMovies = await Promise.all(
      shortlist.map((id) =>
        fetch(`https://www.omdbapi.com/?i=${id}&apikey=${APIKEY}`).then((r) =>
          r.json()
        )
      )
    );


    renderMovies();
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check the console.");
  } finally {
    loadingEl.style.display = "none";
  }
}

function renderMovies() {
  const resultsEl = document.getElementById("results");
  const order = document.getElementById("sortYear").value;
  let moviesToShow = [...currentMovies];

  if (order === "asc") {
    moviesToShow.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (order === "desc") {
    moviesToShow.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  }

  resultsEl.innerHTML = moviesToShow
    .map(
      (d) => `
    <div class="movie__card">
      <img
        src="${d.Poster !== "N/A" ? d.Poster : "placeholder.jpg"}"
        alt="${d.Title}"
        class="movie-card__poster"
      />
      <div class="movie__description".
      <h4 class="movie-card__title">${d.Title} (${d.Year})</h4>
      <p class="movie-card__info"><strong>Actors:</strong> ${d.Actors}</p>
      <p class="movie-card__info"><strong>IMDb Rating:</strong> ${
        d.imdbRating
      }</p>
      </div>
    </div>
  `
    )
    .join("");
}


document.getElementById("searchBtn").addEventListener("click", fetchData);
document.getElementById("movieName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchData();
});
document.getElementById("sortYear").addEventListener("change", renderMovies);
