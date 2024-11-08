'use client';

import { useState, useCallback } from 'react';
import { getNotifications } from './actions';
import SubmitButton from '@/components/submit-button';
import { NotificationData } from '@/types';
import { readStreamableValue } from 'ai/rsc';

export const maxDuration = 30;

export default function Home() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const handleNotificationFetch = useCallback(async () => {
    try {
      const { object } = await getNotifications('Messages during finals Week');

      for await (const partialObject of readStreamableValue(object)) {
        if (!partialObject?.notifications) continue;

        setNotifications((prev) => {
          const newNotifications = partialObject.notifications;
          return JSON.stringify(prev) === JSON.stringify(newNotifications)
            ? prev
            : newNotifications;
        });
      }
    } catch (error) {
      console.error('Streaming error:', error);
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen max-w-xl mx-auto'>
      <SubmitButton
        onSubmitAction={handleNotificationFetch}
        className='ring-1 ring-offset-1 ring-offset-zinc-800 shadow-lg shadow-zinc-800/20 mb-6 bg-gradient-to-r from-black via-zinc-900 to-zinc-950 ring-inset ring-white/10'
        idleText='View Notifications'
        successText='Notifications Loaded!'
      />
      {notifications.length > 0 && (
        <ul className='space-y-4 w-full'>
          {notifications.map((notification, index) => (
            <li
              key={`${notification.orderNumber}-${index}`}
              className='bg-white rounded-lg shadow-sm p-4 border border-slate-200'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <p className='font-medium text-slate-900'>
                    {notification.firstName} {notification.lastName}
                  </p>
                  <p className='text-sm text-slate-500'>{notification.city}</p>
                  <p className='text-sm text-slate-700 mt-2'>
                    {notification.message}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-mono text-slate-600'>
                    #{notification.orderNumber}
                  </p>
                  {notification.timeStamp && (
                    <p className='text-xs text-slate-400'>
                      {new Date(notification.timeStamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
