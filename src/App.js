import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "9e8cfe2baf80459dbf937a0cb723d861";
const API_BASE_URL = "https://api.themoviedb.org/3";

function App() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [activeSection, setActiveSection] = useState("trending");
  const [mediaType, setMediaType] = useState("movie"); // 'movie' or 'tv'

  // Added these two state declarations
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 10]);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          fetch(
            `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `${API_BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`
          ),
        ]);

        const movieData = await movieGenres.json();
        const tvData = await tvGenres.json();

        // Combine and deduplicate genres
        const allGenres = [...movieData.genres, ...tvData.genres];
        const uniqueGenres = Array.from(
          new Map(allGenres.map((genre) => [genre.id, genre])).values()
        );

        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Add new function to fetch movies by section
  const fetchMoviesBySection = async (section) => {
    setIsLoading(true);
    try {
      let endpoint;
      switch (section) {
        case "trending":
          endpoint = `${API_BASE_URL}/trending/${mediaType}/week?api_key=${API_KEY}`;
          break;
        case "top_rated":
          endpoint = `${API_BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}`;
          break;
        case "upcoming":
          endpoint =
            mediaType === "movie"
              ? `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}`
              : `${API_BASE_URL}/tv/on_the_air?api_key=${API_KEY}`;
          break;
        default:
          endpoint = `${API_BASE_URL}/${mediaType}/popular?api_key=${API_KEY}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(`Error fetching ${section} content:`, error);
      return [];
    }
  };

  // Update the movie fetching useEffect
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        let movies;
        if (searchQuery) {
          const response = await fetch(
            `${API_BASE_URL}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(
              searchQuery
            )}`
          );
          const data = await response.json();
          movies = data.results;
        } else {
          movies = await fetchMoviesBySection(activeSection);
        }

        const formattedMovies = movies
          .filter((movie) => {
            const year = new Date(
              mediaType === "movie" ? movie.release_date : movie.first_air_date
            ).getFullYear();
            const rating = movie.vote_average;

            return (
              year >= yearRange[0] &&
              year <= yearRange[1] &&
              rating >= ratingRange[0] &&
              rating <= ratingRange[1]
            );
          })
          .map((movie) => ({
            id: movie.id,
            title: mediaType === "movie" ? movie.title : movie.name,
            year: new Date(
              mediaType === "movie" ? movie.release_date : movie.first_air_date
            ).getFullYear(),
            rating: movie.vote_average,
            genre: movie.genre_ids[0],
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster",
          }));

        setMovies(formattedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeSection, mediaType, yearRange, ratingRange]);

  // Get genre name from genre ID
  const getGenreName = (genreId) => {
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name.toLowerCase() : "";
  };

  // Filter movies (now just for display, actual filtering happens in API)
  const filteredMovies = movies.map((movie) => ({
    ...movie,
    genre: getGenreName(movie.genre),
  }));
  // Add this new function to handle genre changes
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setSearchQuery(""); // Optional: clear search when changing genres
  };

  // Add this new function to fetch movie details
  const fetchMovieDetails = async (movieId) => {
    setIsLoading(true);
    try {
      const [detailsResponse, creditsResponse] = await Promise.all([
        fetch(
          `${API_BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}&language=en-US`
        ),
        fetch(
          `${API_BASE_URL}/${mediaType}/${movieId}/credits?api_key=${API_KEY}`
        ),
      ]);

      const details = await detailsResponse.json();
      const credits = await creditsResponse.json();

      setMovieDetails({
        ...details,
        cast: credits.cast.slice(0, 5),
        director:
          mediaType === "movie"
            ? credits.crew.find((person) => person.job === "Director")?.name
            : credits.crew.find((person) => person.job === "Series Director")
                ?.name ||
              credits.crew.find(
                (person) => person.known_for_department === "Directing"
              )?.name,
      });
    } catch (error) {
      console.error(`Error fetching ${mediaType} details:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add handler for opening movie details
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowDetailsModal(true);
    fetchMovieDetails(movie.id);
  };

  // Update the movie details modal component
  const movieDetailsModal = (
    <>
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl w-full max-w-4xl shadow-2xl relative my-4 sm:my-8">
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedMovie(null);
                setMovieDetails(null);
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white z-10 p-2"
            >
              ✕
            </button>

            {isLoading || !movieDetails ? (
              <div className="h-72 sm:h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="relative">
                {/* Backdrop Image */}
                <div className="h-36 sm:h-48 md:h-64 relative overflow-hidden rounded-t-xl">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                    alt={
                      mediaType === "movie"
                        ? movieDetails.title
                        : movieDetails.name
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 md:p-6 -mt-6 sm:-mt-8 md:-mt-16 relative">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Poster */}
                    <div className="w-24 sm:w-32 md:w-48 mx-auto sm:mx-0 flex-shrink-0">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                        alt={
                          mediaType === "movie"
                            ? movieDetails.title
                            : movieDetails.name
                        }
                        className="rounded-lg shadow-lg w-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
                        {mediaType === "movie"
                          ? movieDetails.title
                          : movieDetails.name}
                      </h2>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                        <span className="text-accent font-semibold">
                          {movieDetails.vote_average.toFixed(1)}
                        </span>
                        <span className="text-sm sm:text-base text-gray-400">
                          {mediaType === "movie"
                            ? new Date(movieDetails.release_date).getFullYear()
                            : `${new Date(
                                movieDetails.first_air_date
                              ).getFullYear()} - ${movieDetails.status}`}
                        </span>
                        {mediaType === "movie" ? (
                          <span className="text-sm sm:text-base text-gray-400">
                            {Math.floor(movieDetails.runtime / 60)}h{" "}
                            {movieDetails.runtime % 60}m
                          </span>
                        ) : (
                          <span className="text-sm sm:text-base text-gray-400">
                            {movieDetails.number_of_seasons} Season
                            {movieDetails.number_of_seasons !== 1 ? "s" : ""} •{" "}
                            {movieDetails.number_of_episodes} Episode
                            {movieDetails.number_of_episodes !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {movieDetails.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 sm:px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      {/* Overview */}
                      <p className="text-sm sm:text-base text-gray-300 text-center sm:text-left line-clamp-4 sm:line-clamp-none">
                        {movieDetails.overview}
                      </p>

                      {/* Cast & Crew */}
                      <div className="space-y-3">
                        {movieDetails.director && (
                          <p className="text-sm sm:text-base text-gray-400 text-center sm:text-left">
                            <span className="text-white font-semibold">
                              {mediaType === "movie"
                                ? "Director: "
                                : "Created By: "}
                            </span>
                            {mediaType === "movie"
                              ? movieDetails.director
                              : movieDetails.created_by
                                  ?.map((creator) => creator.name)
                                  .join(", ") || movieDetails.director}
                          </p>
                        )}
                        {movieDetails.cast.length > 0 && (
                          <div>
                            <h3 className="text-white font-semibold mb-2 text-center sm:text-left">
                              Cast
                            </h3>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                              {movieDetails.cast.map((actor) => (
                                <span
                                  key={actor.id}
                                  className="px-2 sm:px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm"
                                >
                                  {actor.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  // Update the movie card component for a more polished look
  const movieCard = (movie) => (
    <div
      key={movie.id}
      className="group bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-700/30 hover:border-accent/30"
    >
      <div className="relative pb-[150%]">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span className="text-sm bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg font-bold border border-accent/20">
            ⭐ {movie.rating.toFixed(1)}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 p-4 w-full">
            <button
              onClick={() => handleMovieClick(movie)}
              className="w-full bg-accent/90 hover:bg-accent text-white py-3 rounded-lg font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {movie.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{movie.year}</span>
          <span className="text-sm text-gray-400 capitalize px-3 py-1 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-700/30">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );

  // Define the filter bar component with a simpler, cleaner design
  const filterBar = (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700/50">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <h3 className="text-lg font-semibold text-white">Filter Movies</h3>
          </div>
          <button
            onClick={() => {
              setYearRange([1900, new Date().getFullYear()]);
              setRatingRange([0, 10]);
            }}
            className="text-sm px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            Reset Filters
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-6">
          {/* Year Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Year Input Fields */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Release Year
              </label>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    From
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={yearRange[1]}
                    value={yearRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value <= yearRange[1]) {
                        setYearRange([value, yearRange[1]]);
                      }
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">To</label>
                  <input
                    type="number"
                    min={yearRange[0]}
                    max={new Date().getFullYear()}
                    value={yearRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= yearRange[0]) {
                        setYearRange([yearRange[0], value]);
                      }
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Rating Input Fields */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Rating (⭐)
              </label>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    From
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={ratingRange[1]}
                    step="0.5"
                    value={ratingRange[0]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value <= ratingRange[1]) {
                        setRatingRange([value, ratingRange[1]]);
                      }
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">To</label>
                  <input
                    type="number"
                    min={ratingRange[0]}
                    max="10"
                    step="0.5"
                    value={ratingRange[1]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value >= ratingRange[0]) {
                        setRatingRange([ratingRange[0], value]);
                      }
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Filters Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="text-sm text-gray-400">
              Showing movies from {yearRange[0]} to {yearRange[1]} with ratings{" "}
              {ratingRange[0]} to {ratingRange[1]}⭐
            </div>
            <div className="text-sm text-gray-400">
              Found: {filteredMovies.length} movies
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Update the section navigation component
  const sectionNavigation = (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-700/30">
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { id: "trending", icon: "🔥", label: "Trending" },
            { id: "top_rated", icon: "⭐", label: "Top Rated" },
            { id: "upcoming", icon: "🎬", label: "Upcoming" },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-accent/90 text-white shadow-lg scale-105 border border-accent/30"
                  : "bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:scale-102 border border-gray-700/30"
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Update the main content section
  const mainContent = (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white capitalize">
          {activeSection === "top_rated" ? "Top Rated" : activeSection}{" "}
          {mediaType === "tv" ? "TV Shows" : "Movies"}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No results found. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => movieCard(movie))}
        </div>
      )}
    </main>
  );

  // Update the footer component
  const footer = (
    <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-700/30 py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          Created By{" "}
          <a
            href="https://github.com/rohan7408"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium hover:text-accent/80 transition-colors cursor-pointer"
          >
            Rohan
          </a>
        </p>
      </div>
    </footer>
  );

  // Combine all sections into one organized layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Movie<span className="text-accent">DB</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 p-1 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/30">
                {["movie", "tv"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMediaType(type)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      mediaType === type
                        ? "bg-accent/90 text-white shadow-md"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    {type === "movie" ? "Movies" : "TV Shows"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder={`Search ${
                mediaType === "tv" ? "TV shows" : "movies"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all placeholder-gray-500 shadow-lg"
            />
          </div>
        </div>
      </header>

      <div className="flex-1">
        {sectionNavigation}
        {filterBar}
        {mainContent}
      </div>

      {footer}
      {movieDetailsModal}
    </div>
  );
}

export default App;
