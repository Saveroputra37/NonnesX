import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination as SwiperPagination } from "swiper/modules";
import { X, Heart, MessageCircle, Share2, Music } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const VideoFeedModal = ({ isOpen, onClose, initialSlide, data }) => {
  const videoRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSlideChange = (swiper) => {
    // Matikan semua video
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });

console.log(data)

    // Putar video yang aktif
    const activeVideo = videoRefs.current[swiper.activeIndex];
    if (activeVideo) {
      activeVideo.play().catch(() => {});
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer"
      >
        <X size={28} />
      </button>

      {/* Container Video */}
      <div className="h-full w-full md:h-[90vh] md:max-w-[420px] relative overflow-hidden md:rounded-3xl border border-white/10 shadow-2xl">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          initialSlide={initialSlide}
          mousewheel={true}
          modules={[Mousewheel, SwiperPagination]}
          onSlideChange={handleSlideChange}
          className="h-full w-full"
        >
          {data.map((video, index) => (
            <SwiperSlide
              key={`${video.id}-modal-${index}`}
              className="bg-black"
            >
              <div className="relative h-full w-full flex items-center justify-center">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.url || video.video} // Fallback jika key-nya berbeda
                  className="h-full w-full object-cover"
                  loop
                  playsInline
                  muted={false} // Biasanya user ingin suara saat modal dibuka
                  autoPlay={index === initialSlide}
                />

                {/* Overlay UI */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.id}`}
                          alt="avatar"
                        />
                      </div>
                    </div>
                    <span className="font-bold text-sm">
                      @creator_{video.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium mb-3 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-80 text-xs">
                    <Music size={14} className="animate-pulse" />
                    <span className="truncate">
                      Original Sound - Audio {video.id}
                    </span>
                  </div>
                </div>

                {/* Sidebar Buttons */}
                <div className="absolute right-3 bottom-24 flex flex-col gap-6 text-white items-center z-10">
                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <Heart
                      size={28}
                      className="group-active:scale-125 transition-transform"
                    />
                    <span className="text-[10px] font-bold">1.2k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <MessageCircle size={28} />
                    <span className="text-[10px] font-bold">45</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <Share2 size={28} />
                    <span className="text-[10px] font-bold">Share</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>,
    document.body, // Menggunakan document.body lebih aman jika modal-root belum di-setup
  );
};

export default VideoFeedModal;
