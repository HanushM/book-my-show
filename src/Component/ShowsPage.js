import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/shows") // Ensure backend is running on this port
      .then((response) => {
        setShows(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shows:", error);
        setError("Failed to load shows.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading shows...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Select a Show</h1>
      {shows.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          {shows.map((show) => (
            <button
              key={show.timeId}
              onClick={() => navigate(`/seats/${show.timeId}`)}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {`Show at ${show.startTime} - ${show.endTime} (Movie ID: ${show.movieId})`}
            </button>
          ))}
        </div>
      ) : (
        <p>No shows available.</p>
      )}
    </div>
  );
};

export default ShowsPage;
