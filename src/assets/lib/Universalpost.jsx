import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  X,
  Image,
  Video,
  Globe2,
  ArrowRight,
  Loader2,
  Camera,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewPost, createNewVideoPost } from "../../data/db/Querydb";

const UniversalPost = ({ isOpen, onClose, mode = "tweet" }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const isVideoMode = mode === "video";

  // --- MUTATION UNTUK TWEET (Post Collection) ---
  const tweetMutation = useMutation({
    mutationFn: async (data) => {
      return await createNewPost(data.content, data.file, data.user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      handleClose();
    },
  });

  // --- MUTATION UNTUK REEL (Video Collection) ---
  const videoMutation = useMutation({
    mutationFn: async (data) => {
      return await createNewVideoPost({
        content: data.content,
        file: data.file,
        thumbnail: thumbnailFile, // Mengambil state thumbnailFile
        user: data.user,
      });
    },
    onSuccess: () => {
      // Pastikan queryKey ini sama dengan yang ada di useGetVideos
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      handleClose();
    },
  });

  // Pilih mutation mana yang sedang aktif
  const currentMutation = isVideoMode ? videoMutation : tweetMutation;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    setContent(target.value);
  };

  const handleClose = () => {
    setContent("");
    setSelectedFile(null);
    setThumbnailFile(null);
    setPreviewUrl(null);
    setThumbPreviewUrl(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isVideoMode && !file.type.startsWith("video/")) {
      return alert("Please select a video file");
    }
    if (!isVideoMode && !file.type.startsWith("image/")) {
      return alert("Please select an image file");
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
      setThumbPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    const postData = {
      content,
      file: selectedFile,
      user: user
    };

    currentMutation.mutate(postData);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-black sm:border border-zinc-800 sm:rounded-2xl shadow-2xl overflow-hidden min-h-screen sm:min-h-fit transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white flex items-center gap-2"
          >
            <ArrowRight size={20} className="rotate-180" />
            <span className="text-sm">Cancel</span>
          </button>
          <h2 className="text-white font-bold">
            {isVideoMode ? "New Reel" : "New Tweet"}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-4 flex gap-3">
          <img
            src={user?.imageUrl}
            className="w-10 h-10 rounded-full bg-zinc-800 shrink-0"
            alt="avatar"
          />

          <div className="flex-1">
            <textarea
              ref={textareaRef}
              placeholder={
                isVideoMode ? "Write a caption..." : "What is happening?!"
              }
              value={content}
              onChange={handleInput}
              className="w-full bg-transparent text-white text-xl outline-none resize-none min-h-[100px] py-1"
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={isVideoMode ? "video/*" : "image/*"}
              className="hidden"
            />

            {previewUrl && (
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black rounded-full text-white z-20"
                >
                  <X size={18} />
                </button>
                {isVideoMode ? (
                  <video
                    src={previewUrl}
                    className="w-full aspect-video object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    className="w-full max-h-80 object-cover"
                    alt="preview"
                  />
                )}
              </div>
            )}

            {isVideoMode && (
              <div className="space-y-4">
                {!previewUrl && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 w-full aspect-video border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-900 transition-all"
                  >
                    <Video size={32} />
                    <span className="text-xs font-bold uppercase">
                      Select Video
                    </span>
                  </button>
                )}

                <div className="mt-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/20">
                  <p className="text-zinc-500 text-[10px] font-black mb-3 uppercase tracking-widest">
                    Thumbnail Cover
                  </p>
                  <input
                    type="file"
                    ref={thumbInputRef}
                    onChange={handleThumbChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {!thumbPreviewUrl ? (
                    <button
                      onClick={() => thumbInputRef.current?.click()}
                      className="flex items-center gap-3 p-3 w-full border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-all border-dashed"
                    >
                      <Camera size={20} className="text-blue-500" />
                      <span className="text-sm">Add custom thumbnail</span>
                    </button>
                  ) : (
                    <div className="relative w-24 aspect-[9/16] rounded-lg overflow-hidden border border-zinc-700">
                      <button
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbPreviewUrl(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white z-20"
                      >
                        <X size={12} />
                      </button>
                      <img
                        src={thumbPreviewUrl}
                        className="w-full h-full object-cover"
                        alt="Thumb"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isVideoMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full transition-all"
                  >
                    <Image size={22} />
                  </button>
                )}
                <div className="flex items-center gap-1 text-blue-500 text-xs font-bold px-2 py-1 rounded-full hover:bg-blue-500/10 cursor-pointer">
                  <Globe2 size={14} />
                  <span>Everyone can see</span>
                </div>
              </div>

              <button
                onClick={handlePost}
                disabled={
                  currentMutation.isPending ||
                  (isVideoMode && !selectedFile) ||
                  (!isVideoMode && !content.trim() && !selectedFile)
                }
                className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                  currentMutation.isPending ||
                  (isVideoMode && !selectedFile) ||
                  (!isVideoMode && !content.trim() && !selectedFile)
                    ? "bg-blue-500/50 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {currentMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : isVideoMode ? (
                  "Post Reel"
                ) : (
                  "Post Tweet"
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

export default UniversalPost;
