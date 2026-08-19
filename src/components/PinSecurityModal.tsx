import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PROFILE_PIN } from '../data/profile';

interface PinSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinSecurityModal: React.FC<PinSecurityModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      setErrorMessage('');

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
    setErrorMessage('');
  };

  const handleClear = () => {
    setPin('');
    setError(false);
    setErrorMessage('');
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === PROFILE_PIN) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } else {
      setError(true);
      setErrorMessage('PIN salah! Silakan masukkan PIN yang benar (1309).');
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      handleDelete();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center space-y-6 ${
          error ? 'animate-shake' : 'animate-scale-up'
        }`}
      >
        {/* Header Icon */}
        <div className="relative">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isSuccess 
              ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-200' 
              : error 
              ? 'bg-red-100 text-red-600 ring-4 ring-red-200'
              : 'bg-violet-100 text-violet-700 ring-4 ring-violet-200'
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            ) : error ? (
              <AlertCircle className="w-8 h-8" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="font-heading font-black text-xl text-slate-900">
            {isSuccess ? 'PIN Terverifikasi!' : 'Autentikasi Edit Profil'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Masukkan 4 digit PIN keamanan untuk mengedit profil
          </p>
        </div>

        {/* PIN 4 Dots Display */}
        <div className="flex items-center justify-center gap-4 py-2">
          {[0, 1, 2, 3].map((index) => {
            const filled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-500 scale-110 ring-2 ring-emerald-300'
                    : error
                    ? 'bg-red-500 scale-110 ring-2 ring-red-300'
                    : filled
                    ? 'bg-violet-600 scale-115 ring-2 ring-violet-300'
                    : 'bg-slate-200 border border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="text-xs font-bold text-red-600 animate-fade-in">
            {errorMessage}
          </p>
        )}

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="w-16 h-14 rounded-2xl bg-slate-100 hover:bg-violet-100 hover:text-violet-900 active:scale-95 text-slate-900 font-heading font-black text-lg shadow-xs transition-all flex items-center justify-center cursor-pointer mx-auto"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="w-16 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 text-xs font-extrabold shadow-xs transition-all flex items-center justify-center cursor-pointer mx-auto"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="w-16 h-14 rounded-2xl bg-slate-100 hover:bg-violet-100 hover:text-violet-900 active:scale-95 text-slate-900 font-heading font-black text-lg shadow-xs transition-all flex items-center justify-center cursor-pointer mx-auto"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-14 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 active:scale-95 text-slate-600 text-xs font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer mx-auto"
          >
            ⌫
          </button>
        </div>

        {/* Default PIN Hint & Close */}
        <div className="pt-2 w-full flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] font-mono text-slate-500">
            PIN: <strong className="text-violet-600 font-bold">1309</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
