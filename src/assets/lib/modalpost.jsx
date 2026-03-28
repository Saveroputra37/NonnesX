import ReactDOM from "react-dom";
import { X, Image, List, Smile, Calendar, MapPin, Globe2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const Modal = ({ isOpen, onClose, onPostSubmit }) => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Reset content & height saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
      setContent("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Fungsi untuk menangani pemilihan file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Membuat URL sementara untuk <img>
    }
  };

  // Fungsi untuk menghapus gambar yang dipilih
  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    setContent(target.value);
  };

  const handlePost = () => {
    if (content.trim() && content.length <= 280) {
      onPostSubmit?.(content);
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center p-0 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Konten Modal */}
      <div className="relative w-full max-w-[600px] bg-black sm:border border-zinc-800 sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 min-h-screen sm:min-h-fit">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b-2 border-b-gray-100/10 mb-3">
          <button
            onClick={onClose}
            className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
          <button className="text-blue-500 font-bold text-sm hover:bg-blue-500/10 px-4 py-1.5 rounded-full transition-colors">
            Drafts
          </button>
        </div>

        {/* Isi Modal */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            {/* Avatar User */}
            <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0 overflow-hidden">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-700" />
              )}
            </div>

            {/* Form Area */}
            <div className="flex-1">
              {/* Audience Selector */}
              <div className="flex items-center gap-1 text-blue-500 text-[13px] font-bold px-3 py-0.5 border border-zinc-800 rounded-full hover:bg-blue-500/10 transition-colors mb-2 w-fit">
                <p className="text-lg capitalize">{user?.username}</p>
                <Globe2 size={14} />
              </div>
              <div></div>
              <textarea
                ref={textareaRef}
                placeholder="What is happening?!"
                value={content}
                onChange={handleInput}
                className="w-full bg-transparent text-zinc-100 text-xl placeholder:text-zinc-500 outline-none resize-none py-2 leading-relaxed min-h-[120px]"
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {previewUrl && (
                  <div className="relative mt-3 mb-2 group">
                    <button
                      onClick={removeImage}
                      className="absolute top-2 left-2 p-1.5 bg-zinc-900/80 hover:bg-zinc-800 rounded-full text-white z-10 transition-all"
                    >
                      <X size={18} />
                    </button>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-80 object-cover rounded-2xl border border-zinc-800"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-blue-500 text-[13px] font-bold mb-4 hover:bg-blue-500/10 w-fit px-2 py-1 rounded-full cursor-pointer">
                <Globe2 size={16} />
                <span>Everyone can reply</span>
              </div>

              <div className="h-[1px] bg-zinc-800 mb-3 w-full" />

              {/* Bottom Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center -ml-2 text-blue-500">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-blue-500/10 rounded-full cursor-pointer"
                  >
                    <Image size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {content.length > 0 && (
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <span
                        className={`text-[10px] ${content.length > 280 ? "text-red-500" : "text-zinc-500"}`}
                      >
                        {280 - content.length}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handlePost}
                    disabled={!content.trim() || content.length > 280}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all
                    ${
                      content.trim() && content.length <= 280
                        ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                        : "bg-blue-500/50 text-white/50 cursor-not-allowed"
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
};;

export default Modal;
