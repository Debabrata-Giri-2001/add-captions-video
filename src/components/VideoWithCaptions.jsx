import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

// Utility function to convert time "HH:MM:SS" to seconds
const timeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Utility function to convert seconds to "HH:MM:SS"
const secondsToTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

function VideoWithCaptions() {
  const [videoUrl, setVideoUrl] = useState('');
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Add a new caption
  const handleAddCaption = () => {
    if (newCaption && startTime && endTime) {
      const startSeconds = timeToSeconds(startTime);
      const endSeconds = timeToSeconds(endTime);

      if (startSeconds < endSeconds) {
        const newEntry = {
          text: newCaption,
          startTime: startSeconds,
          endTime: endSeconds,
        };
        setCaptions([...captions, newEntry]);
        setNewCaption('');
        setStartTime('');
        setEndTime('');
      } else {
        alert('Start time must be less than end time.');
      }
    } else {
      alert('Please enter valid caption text and timestamps.');
    }
  };

  // Update current time from the player
  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  // Find the current caption based on the video's current time
  useEffect(() => {
    const current = captions.find(
      (caption) => currentTime >= caption.startTime && currentTime <= caption.endTime
    );
    setCurrentCaption(current ? current.text : '');
  }, [currentTime, captions]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">YouTube Video with Captions</h2>

      {/* Video URL Input */}
      <input
        type="text"
        placeholder="Enter Valid YouTube video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Video Player */}
      {videoUrl && (
        <div className="mb-4">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            controls
            playing={false}
            onProgress={handleProgress} // Updates the current time
            width="100%"
          />
        </div>
      )}

      {/* Caption Form */}
      <div className="mb-4">
        <textarea
          className="w-full h-20 p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter caption text"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
        ></textarea>
        <div className="flex gap-4">
          <input
            type="time"
            step="1"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="time"
            step="1"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleAddCaption}
          className="w-full mt-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Caption
        </button>
      </div>

      {/* Captions List */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Captions List:</h3>
        <ul className="list-disc pl-6">
          {captions.map((caption, index) => (
            <li key={index}>
              {secondsToTime(caption.startTime)} - {secondsToTime(caption.endTime)}: "{caption.text}"
            </li>
          ))}
        </ul>
      </div>

      {/* Current Caption */}
      {videoUrl && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-semibold">Current Caption:</h3>
          <p className="text-blue-500 text-xl">{currentCaption}</p>
        </div>
      )}
    </div>
  );
}

export default VideoWithCaptions;
