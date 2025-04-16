import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./contact.css";

export default function Contact() {
  const [feedback, setFeedback] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setFeedback("Thank you for reaching out! We’ll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFeedback("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback("Server error. Please try later.");
    }
  };

  return (
    <div className="contact-page">
      <Sidebar />
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>
          We’d love to hear from you! Whether you have questions, feedback, or
          ideas, reach out to us.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-cards">
          {[
            {
              icon: "📧",
              title: "Email Us",
              content: "Reach us for support or business inquiries.",
              details: "support@emotionecho.com",
              link: "mailto:support@emotionecho.com",
            },
            {
              icon: "📞",
              title: "Call Us",
              content: "Available 9 AM - 6 PM (Mon-Sat).",
              details: "+91 98765 43210",
              link: "tel:+919876543210",
            },
            {
              icon: "📍",
              title: "Visit Us",
              content: "Emotion Echo HQ, 123 Music Lane, India",
              details: "Google Maps",
              link: "#",
            },
          ].map((item, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.details}
              </a>
            </div>
          ))}
        </div>
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
          {feedback && <p className="feedback-msg">{feedback}</p>}
        </div>
      </div>
    </div>
  );
}
