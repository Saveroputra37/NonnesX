import { useState } from "react";
import Feed from "./lib/Feed";
import VideoList from "./lib/Videolistfeed";
import VideoFeedModal from "./lib/modalVideoFeed"; // Impor modal baru kita

const Indexpage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleOpenVideo = (index) => {
    setInitialIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-black flex flex-col items-center no-scrollbar">
      <main className="w-full max-w-[900px] flex flex-col items-center">
        {/* Oper fungsi handleOpenVideo ke dalam VideoList */}
        <section className="w-full shrink-0 border-b border-neutral-900 py-4">
          <VideoList title="Recommended" onVideoClick={handleOpenVideo} />
        </section>

        <section className="w-full max-w-[400px] pt-6">
          <Feed />
        </section>
      </main>

      {/* Modal Portal */}
      <VideoFeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSlide={initialIndex}
      />
    </div>
  );
};

export default Indexpage;
