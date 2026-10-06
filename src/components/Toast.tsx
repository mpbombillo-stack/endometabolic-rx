import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#33302d] text-[#f7efeb] px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 border border-[#6e7977]/30 animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <span className="material-symbols-outlined text-[#80d5cb] text-[18px]">
        info
      </span>
      <span className="text-[12px] font-medium leading-tight">{message}</span>
    </div>
  );
};
