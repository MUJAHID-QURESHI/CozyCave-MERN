import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { removeToast } from '../../redux/slices/uiSlice';

function ToastItem({ toast }) {
  const dispatch = useDispatch();
  const { id, message, type } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle size={18} className="text-emerald-500" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200',
      text: 'text-rose-800',
      icon: <AlertCircle size={18} className="text-rose-500" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: <AlertTriangle size={18} className="text-amber-500" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info size={18} className="text-blue-500" />,
    },
  };

  const style = config[type] || config.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg} ${style.text} min-w-[280px] max-w-sm transition-all duration-300 anim-fade-up`}>
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <p className="text-[13px] font-semibold flex-1 leading-snug">{message}</p>
      <button 
        onClick={() => dispatch(removeToast(id))}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5 rounded-full hover:bg-gray-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
