'use client';

import React, { useState, useRef } from 'react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion } from 'motion/react';
import { Download, Check } from 'lucide-react';
import localFont from 'next/font/local';

// LOAD FONT VIA NEXT.JS (Path diarahkan ke app/fonts/)
const myriadPro = localFont({
  src: [
    {
      path: '../../app/fonts/MYRIADPRO-REGULAR.OTF',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../app/fonts/MYRIADPRO-SEMIBOLD.OTF',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../app/fonts/MYRIADPRO-BOLD.OTF',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-myriad',
});

