import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const RedirectHandler = () => {
  const { shortId } = useParams();

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/${shortId}`);
        const data = await res.json();

        if (res.ok && data.data) {
          window.location.replace(data.data); // Redirect to actual URL
        } else {
          alert("Invalid short URL");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        alert("An error occurred while redirecting.");
      }
    };

    fetchOriginalUrl();
  }, [shortId]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
