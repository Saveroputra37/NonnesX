import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { X, Video, Loader2, Globe2, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewVideoPost } from "../../data/db/Querydb";

const VideoPostModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // TanStack Mutation
  const mutation = useMutation({
    mutationFn: createNewVideoPost,
    onSuccess: () => {
      // Refresh list video setelah berhasil post
      queryClient.invalidateQueries({ queryKey: ["shorts-videos"] });
      handleClose();
    },
    onError: (error) => {
      alert("Failed to post video: " + error.message);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid video file.");
    }
  };

  const handlePostAction = () => {
    if (!selectedFile) return;

    mutation.mutate({
      content,
      file: selectedFile,
      user: {
        id: user.id,
        username: user.username || user.firstName,
        email: user.primaryEmailAddress.emailAddress,
      },
    });
  };

  const handleClose = () => {
    setContent("");
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <button
            onClick={handleClose}
            className="text-white flex items-center gap-2 opacity-60 hover:opacity-100"
          >
            <ArrowRight size={20} className="rotate-180" />
            <span className="text-sm">Cancel</span>
          </button>
          <h2 className="text-white font-bold">New Reel</h2>
        </div>

        <div className="p-4 flex gap-3">
          <img
            src={user?.imageUrl}
            className="w-10 h-10 rounded-full bg-zinc-800"
            alt="avatar"
          />

          <div className="flex-1">
            <textarea
              placeholder="Write a caption for your video..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent text-white text-lg outline-none resize-none min-h-[100px]"
            />

            {/* Video Preview */}
            <div className="mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />

              {!previewUrl ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-900 transition-all"
                >
                  <Video size={32} />
                  <span className="text-xs uppercase tracking-widest font-bold">
                    Select Video
                  </span>
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                  <video
                    src={previewUrl}
                    className="w-full aspect-video object-cover"
                    controls
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black rounded-full text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-1 text-blue-500 text-xs font-bold">
                <Globe2 size={14} />
                <span>Everyone can see</span>
              </div>

              <button
                onClick={handlePostAction}
                disabled={!selectedFile || mutation.isPending}
                className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                  !selectedFile || mutation.isPending
                    ? "bg-blue-500/50 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-all`}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Posting...
                  </>
                ) : (
                  "Post Reel"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
};

export default VideoPostModal;
