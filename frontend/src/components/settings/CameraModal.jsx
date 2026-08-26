import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { cn } from '../../utils/utils';

export const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      stopCamera();
      document.body.style.overflow = ''; // Restore scrolling
    }
    return () => {
      stopCamera();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have given permission.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // To handle the mirror effect, we flip the context horizontally
    // before drawing the image, since the video element is mirrored via CSS
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
        onCapture(file);
        onClose();
      }
    }, 'image/jpeg', 0.9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 z-10">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Camera size={18} className="text-green-400" />
            Take a Selfie
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative aspect-[4/5] sm:aspect-video bg-black/20 flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center p-6">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              
              {/* Camera Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between opacity-40">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                  <div className="w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                  <div className="w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls Area */}
        <div className="p-5 bg-black/20 flex justify-center border-t border-white/5">
          <button
            onClick={handleCapture}
            disabled={!!error}
            className={cn(
              "w-16 h-16 rounded-full border-4 border-gray-500/50 flex items-center justify-center backdrop-blur-md",
              !error && "hover:border-green-400/80 transition-colors cursor-pointer group"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full bg-white/90 shadow-lg transition-transform",
              !error && "group-hover:scale-95 group-active:scale-90 group-hover:bg-white"
            )}></div>
          </button>
        </div>
      </div>
    </div>
  );
};
