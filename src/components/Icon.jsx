const paths = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5',
  flask: 'M9 3h6M10 3v5.5L4.8 17.2a1.5 1.5 0 0 0 1.3 2.3h11.8a1.5 1.5 0 0 0 1.3-2.3L14 8.5V3M7.5 14.5h9',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  sparkles: 'm12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8zM5 15l.7 1.9L7.6 17.6l-1.9.7L5 20.2l-.7-1.9-1.9-.7 1.9-.7z',
  arrowRight: 'M4 12h16m0 0-6-6m6 6-6 6',
  dollar: 'M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.4-5 3.5S9.2 10 12 10s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5',
  fileText: 'M14 2H6a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 2v6h6M8 13h8M8 17h8M8 9h2',
  cpu: 'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M7 7h10v10H7z',
  cash: 'M2 7h20v10H2zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM6 9v.01M18 15v.01',
  target: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  alertTriangle: 'M10.3 3.5 1.8 18a1 1 0 0 0 .9 1.5h18.6a1 1 0 0 0 .9-1.5L13.7 3.5a1 1 0 0 0-1.7 0ZM12 9v4m0 4h.01',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14.01l-3-3',
  loader: 'M12 2v4m0 12v4m10-10h-4M6 12H2m15.5-7.5-2.8 2.8M9.3 14.7l-2.8 2.8m11-0-2.8-2.8M9.3 9.3 6.5 6.5',
  chevronDown: 'm6 9 6 6 6-6',
  server: 'M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01',
  code: 'm8 6-6 6 6 6M16 6l6 6-6 6',
}

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
