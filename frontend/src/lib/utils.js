// src/lib/utils.js
// Utility function to conditionally join class names

export function cn(...args) {
  return args
    .flat(Infinity)
    .filter(Boolean)
    .join(' ');
}
