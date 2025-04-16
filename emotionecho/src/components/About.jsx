import React from "react";
import Sidebar from "./Sidebar";
import "./about.css";

export default function About() {
  return (
    <div className="about-container">
      <Sidebar />
      <div className="about-content">
        <h2>About Emotion Echo</h2>
        <p>
          Welcome to <strong>Emotion Echo</strong>, the revolutionary music
          player that understands your emotions. Our platform enhances your
          listening experience by detecting your mood and playing songs that
          match your emotions in real-time.
        </p>

        <p>
          Using advanced AI-based facial recognition and emotion detection,
          Emotion Echo creates a personalized playlist based on how you're
          feeling. Whether you're happy, sad, relaxed, or excited, we ensure the
          perfect soundtrack is always playing.
        </p>

        <h3>Key Features</h3>
        <div className="feature-cards">
          {[
            {
              icon: "🎭",
              title: "Emotion Detection",
              description:
                "AI-powered recognition to analyze your facial expressions.",
            },
            {
              icon: "🎵",
              title: "Personalized Playlists",
              description: "Automatically generates music based on your mood.",
            },
            {
              icon: "⚡",
              title: "Seamless Experience",
              description:
                "A user-friendly interface for quick and smooth music transitions.",
            },
            {
              icon: "🌎",
              title: "Wide Music Library",
              description:
                "Access to a diverse collection of songs across genres.",
            },
            {
              icon: "📊",
              title: "Emotion History",
              description:
                "Track your moods and see how music has influenced your emotions.",
            },
          ].map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <p>
          Emotion Echo is more than just a music player; it's an experience
          designed to uplift and resonate with you. Join us and let music echo
          your emotions!
        </p>
      </div>
    </div>
  );
}
