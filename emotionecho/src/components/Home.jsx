import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function Home() {
  const [isPlaying, setPlay] = useState(false);
  const [musicData, setMusicList] = useState([]);
  const [audio, setAudio] = useState(null);
  const [mood,setmood]=useState("happy");
  const [currentSong, setCurrentSong] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/music/happy")
      .then((response) => setMusicList(response.data))
      .catch((err) => {
        console.error("Error fetching music list:", err);
      });
  }, []);

  const playMusic = (fileName) => {
    const songURL = `http://localhost:3000/music/${mood}/${encodeURIComponent(fileName)}`;

    if (audio) {
      audio.pause();
      audio.currentTime = 0; 
    }

    const newAudio = new Audio(songURL);
    setAudio(newAudio);
    setCurrentSong(fileName);

    newAudio.play()
      .then(() => {
        setPlay(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });

    newAudio.onloadedmetadata = () => {
      setDuration(newAudio.duration);
    };

    newAudio.ontimeupdate = () => {
      setCurrentTime(newAudio.currentTime);
    };

    newAudio.onended = () => {
      setPlay(false);
    };
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setPlay(false);
      } else {
        audio.play();
        setPlay(true);
      }
    }
  };

  const handleTimelineChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="Home">
      <div className="home-main">
        <h2>Music List</h2>
        <ul>
          {musicData.map((file, index) => (
            <li
              key={index}
              onClick={() => playMusic(file)}
              className={currentSong === file ? "active-song" : "inactive-song"}
            >
              {file.split('.')[0]}
            </li>
          ))}
        </ul>
      </div>

      <div className="player">
        <img
          src="https://tse4.mm.bing.net/th?id=OIP.W16wVtj9WrOJf8Eit9kQsQHaHa&pid=Api&P=0&h=180"
          alt="Player"
        />
        <div className="controls-container">
          {currentSong && <p>{currentSong}</p>}
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
            <button>
              <i className="ri-skip-back-fill"></i>
            </button>
            <button onClick={togglePlayPause}>
              <i className={`ri-${isPlaying ? "pause-circle" : "play-circle"}-fill`}></i>
            </button>
            <button>
              <i className="ri-skip-forward-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
