const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.get("/music/all", (req, res) => {
  const musicDir = path.join(__dirname, "musicfiles");

  fs.readdir(musicDir, (err, emotionFolders) => {
    if (err) {
      console.error("Unable to read music directory:", err);
      return res.status(500).json({ error: "Unable to read music directory" });
    }

    let allSongs = [];

    let pending = emotionFolders.length;
    if (!pending) return res.json(allSongs);

    emotionFolders.forEach((emotion) => {
      const emotionPath = path.join(musicDir, emotion);

      fs.readdir(emotionPath, (err, files) => {
        if (!err) {
          const musicFiles = files.filter((file) => file.endsWith(".mp3"));
          musicFiles.forEach((file) => {
            allSongs.push({ emotion, file });
          });
        }

        pending -= 1;
        if (pending === 0) {
          res.json(allSongs);
        }
      });
    });
  });
});
app.post("/api/contact", (req, res) => {
  const newMessage = req.body;

  fs.readFile("messages.json", "utf8", (err, data) => {
    let messages = [];

    if (!err && data) {
      try {
        messages = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return res.status(500).json({ message: "Error reading messages file" });
      }
    }

    messages.push(newMessage);

    fs.writeFile("messages.json", JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).json({ message: "Error saving message" });
      }
      res.status(200).json({ message: "Message saved successfully" });
    });
  });
});
app.get("/music/:emotion", (req, res) => {
  const emotion = sanitize(req.params.emotion);
  const musicDir = path.join(__dirname, "musicfiles", emotion);

  fs.access(musicDir, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Emotion folder not found: ${emotion}`);
      return res
        .status(404)
        .json({ error: `Emotion folder '${emotion}' not found` });
    }

    fs.readdir(musicDir, (err, files) => {
      if (err) {
        console.error("Unable to read music files:", err);
        return res.status(500).json({ error: "Unable to read music files" });
      }

      const musicFiles = files.filter((file) => file.endsWith(".mp3"));
      res.json(musicFiles);
    });
  });
});

app.get("/music/:emotion/:file", (req, res) => {
  const emotion = sanitize(req.params.emotion);
  const file = sanitize(req.params.file);
  const filePath = path.join(__dirname, "musicfiles", emotion, file);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${file}`);
      return res.status(404).json({ error: `File '${file}' not found` });
    }

    res.sendFile(filePath);
  });
});

app.get("/album/:movie", (req, res) => {
  let movieName = decodeURIComponent(req.params.movie.trim());
  if (!movieName) {
    return res.status(400).json({ error: "Invalid movie name" });
  }
  const albumPath = path.join(__dirname, "albumcovers", `${movieName}.jpg`);
  fs.access(albumPath, fs.constants.F_OK, () => {
    res.sendFile(albumPath);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
