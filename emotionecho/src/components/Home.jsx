import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import EmotionDetector from "./EmotionDetection";
import Album from "./Album";
import axios from "axios";
import "./style.css";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicData, setMusicData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mood, setMood] = useState("relaxed");
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [emotionDetected, setEmotionDetected] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    console.log("Detected Mood:", mood);
  }, [mood]);

  const DEFAULT_IMAGE_URL =
    "https://tse4.mm.bing.net/th?id=OIP.W16wVtj9WrOJf8Eit9kQsQHaHa&pid=Api&P=0&h=180";
  const [albumImage, setAlbumImage] = useState(DEFAULT_IMAGE_URL);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (musicData.length > 0) {
      setCurrentSong(musicData[currentSongIndex]);
    }
  }, [musicData, currentSongIndex]);

  useEffect(() => {
    if (musicData.length > 0 && !loading) {
      setCurrentSongIndex(0);
      playMusic(musicData[0]);
    }
  }, [musicData, loading]);

  // Play the selected song
  useEffect(() => {
    if (currentSong) {
      playMusic(currentSong);
    }
  }, [currentSong]);

  const playMusic = (music) => {
    // Check if music object and file exist
    if (!music || !music.file) return;

    const audio = audioRef.current;

    // If audio already has a source, stop it before playing a new song
    if (audio.src) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Construct the song URL using the music data
    const songURL = `http://localhost:3000/music/${encodeURIComponent(
      music.emotion
    )}/${encodeURIComponent(music.file)}`;
    audio.src = songURL;

    // Extract movie name from the music file name using regex
    const match = music.file.match(/\((.*?)\)/);
    const movieName = match ? match[1] : null;

    // Handle album image fetching
    if (movieName) {
      const albumImgURL = `http://localhost:3000/album/${encodeURIComponent(
        movieName
      )}`;

      axios
        .get(albumImgURL)
        .then((response) => {
          if (response.status === 200) {
            setAlbumImage(albumImgURL);
            setCurrentSong(music);
          } else {
            setAlbumImage(DEFAULT_IMAGE_URL);
          }
        })
        .catch(() => setAlbumImage(DEFAULT_IMAGE_URL)); // Handle errors fetching album image
    } else {
      setAlbumImage(DEFAULT_IMAGE_URL); // Fallback when no movie name is found
    }

    // Set up audio metadata when it's loaded
    audio.onloadedmetadata = () => {
      setDuration(audio.duration); // Set the duration of the audio
      audio.play().then(() => setIsPlaying(true)); // Play audio and update the playing state
    };

    // Track the current time of the song
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);

    // Handle the end of the song to move to the next one
    audio.onended = () => handleNext();
  };

  const handleNext = () => {
    if (musicData.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % musicData.length;
    setCurrentSong(musicData[nextIndex]);
    setCurrentSongIndex(nextIndex);
  };

  const handlePrev = () => {
    if (musicData.length === 0) return;
    const prevIndex =
      (currentSongIndex - 1 + musicData.length) % musicData.length;
    setCurrentSong(musicData[prevIndex]);
    setCurrentSongIndex(prevIndex);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleTimelineChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const filteredSongs = musicData.filter((song) =>
    song.file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Home-container">
      <Sidebar />
      <div className="Home">
        {!emotionDetected ? (
          <EmotionDetector
            setMood={(newMood) => {
              setMood(newMood);
              setEmotionDetected(true);
              setLoading(true);
              axios
                .get(`http://localhost:3000/music/${newMood}`)
                .then((response) => {
                  const formattedSongs = response.data.map((fileName) => ({
                    emotion: newMood,
                    file: fileName,
                  }));
                  setMusicData(formattedSongs);
                  setLoading(false);
                })
                .catch(() => setLoading(false));
            }}
          />
        ) : (
          <div className="Hero">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <h2 className="mood-display">
              Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </h2>
            <div className="search-results">
              {filteredSongs.length > 0 ? (
                <ul className="songs-list">
                  {filteredSongs.map((song, index) => (
                    <li
                      key={index}
                      onClick={() => setCurrentSong(song)}
                      className={`music-item ${
                        currentSong === song ? "current-song" : ""
                      }`}
                    >
                      {song.file.split(".")[0]}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No songs found</p>
              )}
            </div>
            <Album playMusic={playMusic} />
          </div>
        )}

        {emotionDetected && (
          <div className="player">
            <img src={albumImage} alt="Player" id="album-img" />
            <div className="controls-container">
              {currentSong && (
                <p style={{ color: "black" }}>
                  <b>{currentSong?.file.split(".")[0]}</b>
                </p>
              )}

              <div className="timeline-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / duration) * 100 || 0}
                  onChange={handleTimelineChange}
                  className="timeline-slider"
                />
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="controls">
                <button onClick={handlePrev}>
                  <i className="ri-skip-back-fill"></i>
                </button>
                <button onClick={togglePlayPause}>
                  <i
                    className={`ri-${isPlaying ? "pause-line" : "play-fill"}`}
                  ></i>
                </button>
                <button onClick={handleNext}>
                  <i className="ri-skip-forward-fill"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
