// Every section pulls from here. If a date or name ever needs to change,
// this is the ONLY file you touch. Never hardcode "Ayshath Afra" inside a
// component — always import it from here. This is what separates a
// maintainable invite from a template you're afraid to edit later.

import { ArrivalIcon, NikahIcon, LunchIcon } from '@/config/timelineIcons';

export const timeline = [
  { label: 'Guest Arrival', time: '10:45 AM', icon: ArrivalIcon, emphasis: false },
  { label: 'Nikah', time: '11:30 AM', icon: NikahIcon, emphasis: true },
  { label: 'Lunch', time: 'Immediately After Nikah', icon: LunchIcon, emphasis: false },
];

export const couple = {
  brideName: 'Ayshath Afra',
  groomName: 'Muhammad Ibrahim Swafwan',
  initials: 'A ❤ S',
  brideParents: 'D/O Mr. & Mrs. Abdul Kunhi K',
  groomParents: 'S/O Abdul Hameed Madani',
};

export const event = {
  dayName: 'Sunday',
  // ISO date used by the countdown + structured data. Keep this and the
  // display strings below in sync manually — there's only one date in
  // this whole project, it's not worth over-engineering a date library for.
  dateISO: '2026-08-02T11:30:00+05:30',
  dateDisplay: 'August 2, 2026',
  nikahTime: '11:30 AM',
  lunchNote: 'Immediately After Nikah',
  venueName: 'Janapriya Garden',
  venueAddress: 'Neralakatte, Mani',
  mapsUrl: 'https://maps.app.goo.gl/EMgrSHdK7ayeoCgX9',
};

export const rsvp = {
  whatsappNumber: '917411785313', // <-- replace with real number, no + or spaces
  whatsappMessage: encodeURIComponent(
    "Assalamu Alaikum! I'd love to confirm my presence at Afra & Swafwan's Nikah."
  ),
  callNumber: '+917411785313',
};


export const audio = {
  src: '/audio/bismillah.mp3',
  title: 'Bismillah — Salim Sulaiman & Kailash Kher',
  defaultVolume: 0.5,
};

// Swap these placeholder paths for the real couple photos before launch.
// Keep them as 3:4 portrait crops, already compressed to <300KB each —
// the Gallery component does NOT resize images for you.
export const galleryImages = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
];

export const heroMedia = {
  videoSrc: '/videos/hero.MP4', // e.g. '/videos/hero.mp4' — leave empty to use image only
  imageSrc: '/images/hero-balcony.jpg',
};

