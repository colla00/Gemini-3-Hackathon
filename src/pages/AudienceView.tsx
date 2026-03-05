import { useState, useEffect } from "react";

const TOTAL_SLIDES = 31;
const getSlideSrc = (i: number) => `/slides/slide-${String(i + 1).padStart(2, "0")}.jpg`;

const CHANNEL_NAME = "vitasignal-presenter";

function AudienceView() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (e) => {
      if (e.data?.type === "slide-change" && typeof e.data.slide === "number") {
        setCurrent(e.data.slide);
      }
    };

    // Request current slide from presenter
    channel.postMessage({ type: "audience-ready" });

    return () => channel.close();
  }, []);

  // Hide cursor after inactivity
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const hide = () => {
      document.body.style.cursor = "none";
    };
    const show = () => {
      document.body.style.cursor = "default";
      clearTimeout(timeout);
      timeout = setTimeout(hide, 2000);
    };
    window.addEventListener("mousemove", show);
    timeout = setTimeout(hide, 2000);
    return () => {
      window.removeEventListener("mousemove", show);
      clearTimeout(timeout);
      document.body.style.cursor = "default";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center select-none">
      <img
        src={getSlideSrc(current)}
        alt={`Slide ${current + 1}`}
        className="max-w-full max-h-full object-contain"
        draggable={false}
      />
      {/* Subtle slide indicator */}
      <div className="absolute bottom-3 right-4 text-white/20 text-xs font-mono">
        {current + 1} / {TOTAL_SLIDES}
      </div>
    </div>
  );
}

export default AudienceView;
