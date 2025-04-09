import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const ShowsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [shows, setShows] = useState([]);

  const movieName = location.state?.movieName   

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
              startTime: show.startTime, // "14:30:00"
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
    fetchShowtimes(selectedDate);
  }, [selectedDate, movieName]);

  const generateNext7Days = () => {
    return Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day"));
  };

  // Group and sort shows by time
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

  // Sort each group by startTime
  Object.values(groupedShows).forEach((group) => {
    group.shows.sort((a, b) =>
      a.startTime.localeCompare(b.startTime) // "14:00:00" < "18:30:00"
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Showtimes for: {movieName}</h2>

      {/* Date Row */}
      <div className="flex space-x-4 overflow-x-auto mb-6">
        {generateNext7Days().map((dateObj) => {
          const dateStr = dateObj.format("YYYY-MM-DD");
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`min-w-[80px] text-center py-2 rounded ${
                isSelected ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
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
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <p className="text-lg font-semibold">{group.theaterName}</p>
              <p className="text-sm text-gray-600">{group.place}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {group.shows.map((show) => (
                  <button
                    key={show.timeId}
                    onClick={() => navigate(`/seats/${show.timeId}`)}
                    style={{
                      padding: "10px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
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
  );
};

export default ShowsPage;
