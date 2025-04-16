import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Albums.css";

const defaultAlbumCover = "/default-cover.jpg";

const Albums = ({ playMusic }) => {
  const [albums, setAlbums] = useState({});
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImage, setAlbumImage] = useState(defaultAlbumCover);
  const [activeSong, setActiveSong] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/music/all")
      .then((response) => {
        const songs = response.data;

        const groupedAlbums = songs.reduce((acc, song) => {
          if (!song.file || !song.emotion) return acc;

          const match = song.file.match(/(.+?)\s*\((.+)\)\.mp3/);
          if (!match) {
            console.warn("⚠️ Skipping song due to invalid format:", song.file);
            return acc;
          }

          const songName = match[1].trim();
          const movieName = match[2].trim();

          if (!acc[movieName]) {
            acc[movieName] = [];
          }
          acc[movieName].push({
            songName,
            emotion: song.emotion,
            file: song.file,
          });

          return acc;
        }, {});

        setAlbums(groupedAlbums);
      })
      .catch((error) => console.error("Error fetching music:", error));
  }, []);

  const handleAlbumClick = (movie) => {
    setSelectedAlbum(movie);

    const albumImgURL = `http://localhost:3000/album/${encodeURIComponent(
      movie
    )}`;

    axios
      .get(albumImgURL)
      .then((response) => {
        if (response.status === 200) {
          setAlbumImage(albumImgURL);
        } else {
          setAlbumImage(defaultAlbumCover);
        }
      })
      .catch(() => setAlbumImage(defaultAlbumCover));
  };

  const handleSongClick = (song) => {
    if (!song || !song.file) {
      return;
    }
    setActiveSong(song);
    const songData = {
      songName: song.songName,
      emotion: song.emotion,
      file: song.file,
    };
    playMusic(songData);
  };

  return (
    <div className="container">
      {!selectedAlbum ? (
        <>
          <h2 style={{ color: "white" }}>🎵 Albums</h2>
          <div className="album-grid">
            {Object.keys(albums).map((movie) => (
              <div
                key={movie}
                onClick={() => handleAlbumClick(movie)}
                className="album-card"
              >
                <div className="album-cover">
                  <img
                    src={`http://localhost:3000/album/${encodeURIComponent(
                      movie
                    )}`}
                    alt={movie}
                    className="album-img"
                    onError={(e) => (e.target.src = defaultAlbumCover)}
                  />
                </div>
                <div className="album-info">
                  <h3 className="album-name">{movie}</h3>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="Album-container">
          <button onClick={() => setSelectedAlbum(null)} className="back-btn">
            ← Back to Albums
          </button>
          <h2 className="title" style={{ color: "white" }}>
            {selectedAlbum} Songs
          </h2>
          <div className="album-cover-container">
            <img
              src={albumImage}
              alt={selectedAlbum}
              className="album-img-large"
            />
          </div>
          <ul className="songs-list">
            {albums[selectedAlbum].map((song, index) => (
              <li
                key={index}
                className={`music-item ${activeSong === song ? "active" : ""}`}
                onClick={() => handleSongClick(song)}
              >
                {song.songName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Albums;
