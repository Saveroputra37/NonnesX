import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination as SwiperPagination } from "swiper/modules";
import { X, Heart, MessageCircle, Share2, Music, Eye } from "lucide-react";

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

  if (!isOpen || !data) return null;

  const handleSlideChange = (swiper) => {
    // Matikan semua video
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    // Putar video yang sedang aktif
    const activeVideo = videoRefs.current[swiper.activeIndex];
    if (activeVideo) {
      activeVideo.play().catch((err) => console.log("Autoplay blocked:", err));
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
      >
        <X size={24} />
      </button>

      <div className="h-full w-full md:h-[95vh] md:max-w-[450px] relative overflow-hidden md:rounded-3xl shadow-2xl bg-black">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          initialSlide={initialSlide}
          mousewheel={true}
          modules={[Mousewheel, SwiperPagination]}
          onSlideChange={handleSlideChange}
          className="h-full w-full"
        >
          {data.map((item, index) => (
            <SwiperSlide key={item.id || index} className="bg-black">
              <div className="relative h-full w-full flex items-center justify-center">
                {/* SINKRONISASI: 
                  Gunakan item.url LANGSUNG karena di Querydb sudah jadi URL lengkap 
                */}
                {item.url ? (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={item.url}
                    className="h-full w-full object-contain"
                    loop
                    playsInline
                    autoPlay={index === initialSlide}
                  />
                ) : (
                  <div className="text-white/40 text-xs italic">
                    Video URL tidak ditemukan
                  </div>
                )}

                {/* Overlay UI */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full border-2 border-white/20 overflow-hidden bg-zinc-900 shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${item.creator}`}
                        alt="avatar"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[16px] truncate">
                        {item.creator}
                      </span>
                      <span className="text-xs opacity-60">
                        @{item.creator.toLowerCase().replace(/\s+/g, "")}
                      </span>
                    </div>
                  </div>

                  <p className="text-[14px] leading-relaxed mb-4 line-clamp-2 text-gray-200">
                    {item.title}
                  </p>

                  <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/5">
                    <Music
                      size={14}
                      className="animate-pulse text-fuchsia-400"
                    />
                    <span className="text-[11px] font-medium tracking-wide truncate max-w-[150px]">
                      Original Sound - {item.creator}
                    </span>
                  </div>
                </div>

                {/* Sidebar Interaction */}
                <div className="absolute right-4 bottom-32 flex flex-col gap-7 text-white items-center z-10">
                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-3 bg-white/10 rounded-full group-hover:bg-red-500/20 transition-all">
                      <Heart
                        size={28}
                        className="group-hover:text-red-500 transition-colors"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase">
                      Like
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-3 bg-white/10 rounded-full group-hover:bg-blue-500/20 transition-all">
                      <MessageCircle size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase">
                      Chat
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Eye size={28} />
                    </div>
                    <span className="text-[10px] font-black">{item.views}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-3 bg-white/10 rounded-full group-hover:bg-green-500/20 transition-all">
                      <Share2 size={26} />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>,
    document.body,
  );
};

export default VideoFeedModal;
