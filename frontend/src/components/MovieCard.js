import "../styles/MovieCard.css";

const MovieCard = ({ movie, onClick }) => {
  if (!movie) return <div>Loading...</div>;

  const {
    imageBase64,
    name,
    genre,
    releaseDate,
    rating,
    cast,
    comments,
    linkToTrailer,
  } = movie;

  const imageUrl = imageBase64
    ? `data:image/jpeg;base64,${imageBase64}`
    : 'path_to_default_image_or_placeholder.png';

return (
  <div className="movie-card" onClick={onClick}>
    <div className="card-inner">
      {/* Front Side - Image */}
      <div className="card-front">
        <img
          src={imageUrl ? imageUrl : '/public/alternateOfMoviePoster.png'}
          alt={name || 'Movie Poster'}
          className="movie-image"
        />
      </div>


      {/* Back Side - Details */}
      <div className="card-back">
        <h3>{name || 'Unnamed Movie'}</h3>
        <p><strong>Genre:</strong> {genre || 'N/A'}</p>
        <p><strong>Release:</strong> {releaseDate ? new Date(releaseDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Rating:</strong> {rating || 'N/A'}</p>
        <p><strong>Cast:</strong> {cast && cast.length > 0 ? cast.join(', ') : 'N/A'}</p>
        {linkToTrailer && (
          <a href={linkToTrailer} target="_blank" rel="noopener noreferrer">🎬 Watch Trailer</a>
        )}
      </div>
    </div>
  </div>
);
};

export default MovieCard;
