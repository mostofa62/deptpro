import React, { useRef } from 'react';

interface VideoComponentProps {
  src: string;
  width?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean; // New prop to show/hide Play/Stop buttons
}

const VideoComponent: React.FC<VideoComponentProps> = ({ 
  src, 
  width = '400', 
  controls = true, 
  autoplay = false, 
  loop = false, 
  showControls = true  // Default is to show the custom controls
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Play the video
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // Stop the video (pause and reset to the beginning)
  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to the start
    }
  };

  return (
    <div>
      <video 
        ref={videoRef} 
        width={width} 
        controls={controls} 
        autoPlay={autoplay} 
        loop={loop}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Conditionally render custom Play/Stop buttons based on `showControls` */}
      {showControls && (
        <div className='flex justify-center items-center gap-3 mt-3'>
            <button className='py-1 px-2 border rounded' onClick={handlePlay}>Play</button>
            <button className='py-1 px-2 border rounded' onClick={handleStop}>Stop</button>
        </div>
      )}
    </div>
  );
};

export default VideoComponent;
