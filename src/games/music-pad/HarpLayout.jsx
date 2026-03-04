import React from 'react';
import { NATURAL_NOTES } from './noteData';

// Graduated heights: longest on left (low note) to shortest on right (high note)
const STRING_HEIGHTS = ['95%', '87%', '79%', '71%', '63%', '55%', '47%', '39%'];

// Color gradient from gold (#fbbf24) to silver (#c0c0c0) across 8 strings
const STRING_COLORS = [
  '#fbbf24', // pure gold
  '#e4be42', // warm gold
  '#cdbf60', // muted gold
  '#b8bf7e', // gold-silver transition
  '#b0b890', // warm silver
  '#adb3a0', // silver-ish
  '#b8b8b0', // light silver
  '#c0c0c0', // pure silver
];

export default function HarpLayout({ active, onTap }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 to-slate-950 overflow-hidden rounded-2xl">
      {/* Curved frame hint on the left side */}
      <div
        className="absolute left-3 top-4 bottom-4 pointer-events-none"
        style={{
          width: 3,
          borderRadius: 9999,
          background: 'linear-gradient(to bottom, #f59e0b, #d97706)',
          boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)',
        }}
      />

      {/* Strings container */}
      <div className="flex w-full h-full items-end px-10 py-4 gap-0">
        {NATURAL_NOTES.map((noteObj, i) => {
          const isActive = active === noteObj.note;
          const stringColor = STRING_COLORS[i];
          const height = STRING_HEIGHTS[i];

          return (
            <button
              key={noteObj.note}
              className="flex-1 flex flex-col items-center justify-end h-full outline-none border-none bg-transparent cursor-pointer select-none"
              onPointerDown={(e) => onTap(noteObj, e)}
              aria-label={`Harp string ${noteObj.note}`}
            >
              {/* The string */}
              <div
                className="flex flex-col items-center justify-end"
                style={{ height }}
              >
                <div
                  style={{
                    width: 3,
                    height: '100%',
                    borderRadius: 9999,
                    background: stringColor,
                    boxShadow: isActive
                      ? `0 0 12px ${stringColor}, 0 0 24px ${stringColor}`
                      : 'none',
                    animation: isActive
                      ? 'stringWobble 0.4s ease-out'
                      : 'none',
                    transition: 'box-shadow 0.15s ease-out',
                  }}
                />
              </div>

              {/* Note label */}
              <span
                className="mt-2 text-xs font-bold tracking-wide"
                style={{
                  color: isActive ? stringColor : 'rgba(255,255,255,0.6)',
                  textShadow: isActive
                    ? `0 0 8px ${stringColor}`
                    : 'none',
                  transition: 'color 0.15s, text-shadow 0.15s',
                }}
              >
                {noteObj.note}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
