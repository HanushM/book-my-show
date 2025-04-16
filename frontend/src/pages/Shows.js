import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Shows.css"; // Import your external styles
import Header from "../components/Header";
import Footer from "../components/Footer";

const Shows = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [shows, setShows] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);

  const movieName = location.state?.movieName;

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8080/movies/search", {
        params: { name: movieName },
      });
      if (response.data && response.data.length > 0) {
        console.log(response.data);
        setMovieDetails(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching movie details: ", err);
    }
  };

  const fetchShowtimes = async (date) => {
    try {
      const response = await axios.get("http://localhost:8080/shows/screen-times", {
        params: { movieName, date },
      });

      const showData = await Promise.all(
        response.data.map(async (show) => {
          try {
            const theaterRes = await axios.get(
              `http://localhost:8080/screen/theater-id/${show.screenId}`
            );
            const theaterId = theaterRes.data.theaterId;
            const theaterName = theaterRes.data.theaterName;

            const theaterDetailsRes = await axios.get(
              `http://localhost:8080/theater/${theaterId}`
            );
            const place = theaterDetailsRes.data.place.city;

            return {
              timeId: show.timeId,
              showId: show.timeId,
              screenId: show.screenId,
              startTime: show.startTime,
              screenName: show.screenName || `Screen ${show.screenId}`,
              theaterId,
              theaterName: theaterName || "Unknown Theater",
              place: place || "Unknown Location",
            };
          } catch (err) {
            return {
              timeId: show.timeId,
              showId: show.timeId,
              screenId: show.screenId,
              startTime: show.startTime,
              screenName: show.screenName || `Screen ${show.screenId}`,
              theaterName: "Unknown Theater",
              place: "Unknown Location",
            };
          }
        })
      );

      setShows(showData);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchShowtimes(selectedDate);
  }, [selectedDate, movieName]);

  const generateNext7Days = () => {
    return Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day"));
  };

  const groupedShows = shows.reduce((acc, show) => {
    const key = `${show.theaterName}-${show.place}`;
    if (!acc[key]) {
      acc[key] = {
        theaterName: show.theaterName,
        place: show.place,
        shows: [],
      };
    }
    acc[key].shows.push(show);
    return acc;
  }, {});

  Object.values(groupedShows).forEach((group) => {
    group.shows.sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="page-container">
      <Header/>
    <div className="shows-container">
      {movieDetails && (
  <div className="movie-header">
    <div className="movie-poster">
      <img
        src={`data:image/jpeg;base64,${movieDetails.imageBase64}`}
        alt={movieDetails.name}
      />
    </div>
    <div className="movie-info">
      <h2>{movieDetails.name}</h2>
      {movieDetails.genre && <p><strong>Genre:</strong> {movieDetails.genre}</p>}
      {movieDetails.rating && <p><strong>Rating:</strong> {movieDetails.rating}</p>}
      {movieDetails.releaseDate && (
        <p>
          <strong>Release Date:</strong>{" "}
          {dayjs(movieDetails.releaseDate).format("MMMM D, YYYY")}
        </p>
      )}
      {movieDetails.cast?.length > 0 && (
        <p><strong>Cast:</strong> {movieDetails.cast.join(", ")}</p>
      )}
      {movieDetails.languages?.length > 0 && (
        <p><strong>Languages:</strong> {movieDetails.languages.join(", ")}</p>
      )}
      {movieDetails.linkToTrailer && (
        <a
          href={movieDetails.linkToTrailer}
          target="_blank"
          rel="noopener noreferrer"
        >
          🎬 Watch Trailer
        </a>
      )}
    </div>
  </div>
)}
      {/* Date Row */}
      <div className="date-scroll">
        {generateNext7Days().map((dateObj) => {
          const dateStr = dateObj.format("YYYY-MM-DD");
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`date-btn ${isSelected ? "selected" : ""}`}
            >
              <div className="text-sm font-bold">{dateObj.format("ddd")}</div>
              <div className="text-lg">{dateObj.format("DD")}</div>
              <div className="text-sm">{dateObj.format("MMM")}</div>
            </button>
          );
        })}
      </div>

      {/* Showtimes */}
      {Object.keys(groupedShows).length === 0 ? (
        <p>No showtimes available.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedShows).map(([key, group], index) => (
            <div key={index} className="theater-card">
              <p className="theater-name">{group.theaterName}</p>
              <p className="theater-location">{group.place}</p>
              <div className="showtime-grid">
                {group.shows.map((show) => (
                  <button
                    key={show.timeId}
                    onClick={() => navigate(`/seats/${show.timeId}`)}
                    className="showtime-btn"
                  >
                    {dayjs(`${selectedDate}T${show.startTime}`).format("h:mm A")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default Shows;
