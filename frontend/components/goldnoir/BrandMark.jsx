"use client";

import { useState } from "react";

export function BrandMark({ className = "", alt = "GoldNoir logo", src = "/logo.svg" }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`grid place-items-center rounded-[1rem] bg-[radial-gradient(circle_at_top,rgba(210,177,93,0.22),rgba(0,0,0,0.08))] p-1.5 shadow-[0_0_26px_rgba(210,177,93,0.14)] ${className}`}
        aria-hidden="true"
      >
        <div className="grid h-full w-full place-items-center rounded-[0.75rem] bg-black/55">
          <span className="block h-5 w-5 rounded-full bg-[radial-gradient(circle,rgba(210,177,93,0.98)_0,rgba(210,177,93,0.5)_48%,transparent_55%)] shadow-[0_0_18px_rgba(210,177,93,0.22)]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-[1rem] bg-black/55 shadow-[0_0_26px_rgba(210,177,93,0.12)] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain p-1"
        onError={() => setHasError(true)}
      />
    </div>
  );
}