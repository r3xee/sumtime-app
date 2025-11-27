import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Toast = ({ type = 'success', heading, description, onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
      progressColor: 'bg-green-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
      progressColor: 'bg-yellow-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
      progressColor: 'bg-red-500'
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor, progressColor } = config[type];

  return (
    <div 
      className={`${bgColor} ${borderColor} border-l-4 rounded-lg shadow-lg mb-4 min-w-[320px] max-w-md overflow-hidden transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      style={{
        animation: isExiting ? 'none' : 'slideIn 0.3s ease-out'
      }}
    >
      <div className="p-4 flex items-start gap-3">
        <Icon className={`${iconColor} w-6 h-6 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`${textColor} font-semibold text-sm mb-1`}>{heading}</h3>
          <p className={`${textColor} text-sm opacity-90`}>{description}</p>
        </div>
        <button
          onClick={handleClose}
          className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
     
      <div className="h-1 bg-gray-200 bg-opacity-30">
        <div 
          className={`h-full ${progressColor} transition-all duration-50 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast