import { useEffect, useRef, useState } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/utils';

export const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async (facing = facingMode) => {
    setError(null);
    // Stop any existing stream first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
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

  const switchCamera = () => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startCamera();
      document.body.style.overflow = 'hidden';
    } else {
      stopCamera();
      document.body.style.overflow = '';
    }
    return () => {
      stopCamera();
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror only for front camera
    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        }
        setIsCapturing(false);
      },
      'image/jpeg',
      0.9
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Mobile: Full screen camera | Desktop: Centered card */}
      <div className="w-full h-full md:w-auto md:h-auto md:max-w-md md:max-h-[90vh] md:rounded-3xl md:border md:border-white/10 md:shadow-2xl bg-black flex flex-col overflow-hidden relative">
        {/* Close button - always visible, top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-colors"
        >
          <X size={22} />
        </button>

        {/* Video Area - takes all available space */}
        <div className="flex-1 min-h-0 relative bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Camera size={28} className="text-red-400" />
              </div>
              <p className="text-red-400 text-sm mb-4 max-w-xs">{error}</p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium"
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
                className={cn(
                  'w-full h-full object-cover',
                  facingMode === 'user' && 'transform scale-x-[-1]'
                )}
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>

              {/* Face guide overlay - subtle circular guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-white/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]"></div>
              </div>

              {/* Corner guides */}
              <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between opacity-30 md:p-10">
                <div className="flex justify-between">
                  <div className="w-7 h-7 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                  <div className="w-7 h-7 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-7 h-7 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                  <div className="w-7 h-7 border-b-2 border-r-2 border-white rounded-br-lg"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls Area - bottom bar */}
        {!error && (
          <div className="shrink-0 py-6 px-6 bg-black/90 backdrop-blur-md flex items-center justify-center gap-8 safe-area-bottom">
            {/* Switch Camera */}
            <button
              onClick={switchCamera}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-90"
              title="Switch Camera"
            >
              <RotateCcw size={20} />
            </button>

            {/* Capture button */}
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className={cn(
                'w-[72px] h-[72px] rounded-full border-[3px] border-white/60 flex items-center justify-center transition-all',
                !isCapturing && 'hover:border-white active:scale-90 cursor-pointer'
              )}
            >
              <div
                className={cn(
                  'w-[60px] h-[60px] rounded-full bg-white shadow-lg transition-transform',
                  !isCapturing && 'hover:scale-95 active:scale-90',
                  isCapturing && 'animate-pulse bg-white/70'
                )}
              ></div>
            </button>

            {/* Spacer for symmetry */}
            <div className="w-12 h-12" />
          </div>
        )}
      </div>
    </div>
  );
};
