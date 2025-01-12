const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to fetch the list of music files for a given emotion
app.get("/music/:emotion", (req, res) => {
  const { emotion } = req.params;
  const musicDir = path.join(__dirname, "musicfiles", emotion);

  fs.access(musicDir, fs.constants.F_OK, (err) => {
    if (err) {
      return res
        .status(404)
        .json({ error: `Emotion folder '${emotion}' not found` });
    }

    fs.readdir(musicDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Unable to read music files" });
      }

      const musicFiles = files
        .filter((file) => file.endsWith(".mp3"))
        .map(
          (file) =>
            `http://localhost:${port}/music/${emotion}/${encodeURIComponent(
              file
            )}`
        );

      res.json(musicFiles);
    });
  });
});

// Endpoint to serve individual music files
app.get("/music/:emotion/:file", (req, res) => {
  const { emotion, file } = req.params;
  const filePath = path.join(__dirname, "musicfiles", emotion, file);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: `File '${file}' not found` });
    }

    res.sendFile(filePath);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
