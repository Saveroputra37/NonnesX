import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Autoplay } from "swiper/modules";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import VideoFeedModal from "./modalVideoFeed";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { fetchVideos } from "../../data/db/Querydb";

const VideoList = ({ title = "Shorts" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

      const {
        data: videos = [],
        isLoading,
        isError,
        error,
      } = useQuery({
        queryKey: ["shorts-videos"],
        queryFn: fetchVideos,
        staleTime: 1000 * 60 * 5,
      });
    
    if (videos.length === 0 && !isLoading) {
      return (
        <div className="w-full h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl m-4">
          <p className="text-zinc-500 text-xs tracking-widest uppercase">
            No Videos Available
          </p>
        </div>
      );
    }
    


    console.log(videos)
    
  const openModal = (index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (isError)
    return <div className="text-red-500 p-4">Error: {error.message}</div>;

  // SOLUSI: Jangan gunakan displayVideos yang diduplikasi jika data masih sedikit
  // Gunakan data murni 'videos' untuk render awal agar tidak konflik
  const hasEnoughData = videos && videos.length > 5;

 return (
   <div className="w-full py-4 flex flex-col select-none bg-black">
     {/* Header */}
     <div className="px-6 mb-4 flex items-center gap-3">
       <h2 className="text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
         {title}
       </h2>
       <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
     </div>

     {/* Container Swiper dengan Tinggi Pasti */}
     <div className="w-full h-[280px] relative px-2">
       <Swiper
         key={videos.length} // KUNCI: Memaksa Swiper hancur & buat ulang saat data masuk
         modules={[Navigation, FreeMode, Autoplay]}
         spaceBetween={12}
         slidesPerView={2.4}
         loop={videos.length > 5} // Hanya loop jika data banyak
         freeMode={true}
         breakpoints={{
           640: { slidesPerView: 3.4 },
           1024: { slidesPerView: 5.4 },
         }}
         className="h-full w-full"
       >
         {videos.map((video, index) => (
           <SwiperSlide
             key={video.id || index} // PERBAIKAN: id_rels -> id
             className="h-full"
             onClick={() => openModal(index)}
           >
             <div className="group flex flex-col gap-3 h-full cursor-pointer">
               <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 shadow-2xl">
                 {/* PERBAIKAN: thumbnail_rels -> thumbnail */}
                 {video.thumbnail ? (
                   <img
                     src={video.thumbnail}
                     className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                     alt={video.title}
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">
                     No Image
                   </div>
                 )}

                 {/* ... Overlay Play ... */}

                 <div className="absolute bottom-2 left-3 text-[10px] text-white font-bold drop-shadow-md">
                   {video.views} {/* PERBAIKAN: views_rels -> views */}
                 </div>
               </div>

               <h3 className="text-zinc-300 text-[11px] font-medium line-clamp-1 px-1 opacity-80 group-hover:opacity-100 transition-all">
                 {video.title || "Untitled"}{" "}
                 {/* PERBAIKAN: title_rels -> title */}
               </h3>
             </div>
           </SwiperSlide>
         ))}
       </Swiper>
     </div>

     {/* Modal */}
     {isModalOpen && (
       <VideoFeedModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         initialSlide={selectedIndex}
         data={videos}
       />
     )}
   </div>
 );
};

export default VideoList;
