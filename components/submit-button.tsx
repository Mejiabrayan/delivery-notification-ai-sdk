'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { SubmitButtonProps } from '@/types';

const variants = {
  initial: { opacity: 0, y: -25 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 25 },
  transition: { type: "spring", duration: 0.3, bounce: 0 }
}

const Spinner = () => {
  return (
    <div className="h-4 w-4">
      <div className="relative h-full w-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-2 border-slate-300 border-t-slate-950 rounded-full"
        />
      </div>
    </div>
  );
};

export default function SubmitButton({
  onSubmitAction,
  idleText = 'View Notifications',
  successText = 'Success!',
  className,
}: SubmitButtonProps) {
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (buttonState !== 'idle') return;
    
    setButtonState('loading');
    try {
      await onSubmitAction();
      setButtonState('success');
      setTimeout(() => setButtonState('idle'), 2000);
    } catch {
      setButtonState('idle');
    }
  };

  const buttonContent = {
    idle: idleText,
    loading: <Spinner />,
    success: successText,
  };

  return (
    <Button
      variant={'default'}
      disabled={buttonState !== 'idle'}
      onClick={handleClick}
      className={className}
    >
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.span
          key={buttonState}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center justify-center min-w-[140px]"
        >
          {buttonContent[buttonState]}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
} 