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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
