import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export const GuestInteractionBlocker = ({ children }) => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const handleInteraction = (e) => {
    if (user?.isGuest) {
      if (e.target.closest('.guest-allow-click')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      alert('Please register first you are now guest');
      navigate('/register');
    }
  };

  return (
    <div 
      className="w-full h-full relative" 
      onClickCapture={handleInteraction}
      onKeyDownCapture={handleInteraction}
    >
      {children}
    </div>
  );
};
