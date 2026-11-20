"use client";

import { useState } from "react";

type ItemGalleryProps = {
  name: string;
  emoji: string;
  images: string[]; // full image URLs
};

// Big picture + small thumbnails. If a picture fails to load (or there are
// none), the big emoji is shown instead.
export default function ItemGallery({ name, emoji, images }: ItemGalleryProps) {
  const [active, setActive] = useState(0);
  // Remember which pictures failed to load
  const [failed, setFailed] = useState<string[]>([]);

  const working = images.filter((src) => !failed.includes(src));
  const current = working[active] ?? working[0];

  return (
    <div>
      <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl bg-accent/30 text-9xl">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={name}
            className="size-full object-cover"
            onError={() => setFailed((list) => [...list, current])}
          />
        ) : (
          <span role="img" aria-label={name}>
            {emoji}
          </span>
        )}
      </div>

      {working.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {working.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Show picture ${index + 1}`}
                aria-pressed={src === current}
                onClick={() => setActive(index)}
                className={`size-20 cursor-pointer overflow-hidden rounded-2xl border-2 ${
                  src === current ? "border-primary" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
