import React, { useEffect, useRef, useState } from "react";
import Button from "./Button.jsx";
import { subscription } from "../data/subscription.js";

const skipOptions = ["Skip 1 week", "Skip 2 weeks", "Skip 4 weeks"];
const founderVideoSrc = "/assets/omni-founder-message.mp4";

export default function CancelIntroVideoModal({ open, onClose, onContinue, onSkipNextOrder }) {
  const [selectedSkip, setSelectedSkip] = useState(skipOptions[0]);
  const videoRef = useRef(null);

  const stopVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  const closeAndStop = () => {
    stopVideo();
    onClose();
  };

  const continueAndStop = () => {
    stopVideo();
    onContinue();
  };

  const skipAndStop = () => {
    stopVideo();
    onSkipNextOrder(selectedSkip);
  };

  useEffect(() => {
    if (!open || !videoRef.current) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const video = videoRef.current;
    video.muted = false;
    video.volume = 1;
    video.currentTime = 0;
    const playAttempt = video.play();
    if (playAttempt?.catch) playAttempt.catch(() => {});
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="cancel-intro-backdrop" role="presentation" onClick={closeAndStop}>
      <section
        className="cancel-intro-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-intro-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="cancel-intro-close" type="button" aria-label="Close" onClick={closeAndStop}>
          ×
        </button>

        <div className="cancel-intro-copy">
          <span>Before you cancel</span>
          <h2 id="cancel-intro-title">A quick note from OMNI</h2>
          <p>Watch this short founder message, or skip the next order and keep your member setup active.</p>
        </div>

        <div className="cancel-intro-plan">
          <img src="/assets/omni-product-peach.png" alt="" />
          <div>
            <strong>Every 4 weeks</strong>
            <span>Next on {subscription.nextOrderDate.replace(", 2026", "")}</span>
          </div>
          <strong>${subscription.total.toFixed(2)}</strong>
        </div>

        <video
          ref={videoRef}
          className="cancel-intro-video"
          autoPlay
          controls
          playsInline
          preload="metadata"
          poster="/assets/omni-product-peach.png"
          onLoadedMetadata={() => {
            if (!videoRef.current) return;
            videoRef.current.muted = false;
            videoRef.current.volume = 1;
            videoRef.current.play().catch(() => {});
          }}
        >
          <source src={founderVideoSrc} type="video/mp4" />
        </video>

        <div className="cancel-intro-options" aria-label="Skip options">
          {skipOptions.map((option) => (
            <label className={`cancel-intro-option ${selectedSkip === option ? "selected" : ""}`} key={option}>
              <input
                type="radio"
                name="cancel-intro-skip"
                value={option}
                checked={selectedSkip === option}
                onChange={() => setSelectedSkip(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="cancel-intro-actions">
          <Button variant="outline" onClick={continueAndStop}>Continue to cancellation</Button>
          <Button variant="primary" onClick={skipAndStop}>Skip next order</Button>
        </div>
      </section>
    </div>
  );
}
