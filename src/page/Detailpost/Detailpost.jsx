import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDocumentById } from "../../data/db/Querydb";
import {
  ChevronLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Bookmark,
} from "lucide-react";

const Detailpost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDocumentById(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <div className="animate-pulse text-blue-400">Loading Article...</div>
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-red-400">
        Artikel tidak ditemukan.
      </div>
    );

  // Format Tanggal
  const datePublished = new Date(data.$createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30 capitalize">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Kembali</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-blue-400 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="text-slate-400 hover:text-yellow-500 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-6 py-12">
        {/* Category / Badge (Optional) */}
        <div className="mb-6">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Article
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
          {data.content_post.substring(0, 50)}...
        </h1>

        {/* Author Metadata */}
        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-800">
          <img
            src={data.avatar_user || "https://via.placeholder.com/100"}
            className="w-12 h-12 rounded-full ring-2 ring-slate-800"
            alt={data.name_user}
          />
          <div className="flex flex-col">
            <span className="text-white font-medium flex items-center gap-1">
              {data.name_user}
              {data.isverified_user && (
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              )}
            </span>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {datePublished}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> 5 min read
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {data.url_image_post && data.url_image_post !== "minus" && (
          <figure className="mb-12">
            <img
              src={data.url_image_post}
              className="w-full rounded-2xl shadow-2xl object-contain max-h-[500px]"
              alt="Featured"
            />
            <figcaption className="text-center text-sm text-slate-500 mt-4 italic">
              Dokumentasi visual postingan oleh {data.name_user}
            </figcaption>
          </figure>
        )}

        {/* Main Content Body */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-slate-300 leading-relaxed text-xl mb-6">
            {data.content_post}
          </p>

          {/* Contoh Dummy Paragraf Tambahan Agar Terasa Seperti Blog Panjang */}
          <p className="text-slate-400 leading-relaxed mb-6">
            Konten di atas adalah inti dari informasi yang dibagikan. Dalam
            konteks yang lebih luas, diskusi ini mencakup berbagai perspektif
            yang relevan dengan perkembangan teknologi saat ini. Appwrite
            sebagai backend memudahkan pengelolaan data ini secara efisien.
          </p>
        </div>

        {/* Footer Blog */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-wrap gap-2 mb-8">
            {["Teknologi", "Appwrite", "React", "Modern UI"].map((tag) => (
              <span
                key={tag}
                className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-sm hover:bg-slate-700 cursor-pointer transition"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Card Mini */}
          <div className="bg-slate-800/50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
            <img
              src={data.avatar_user}
              className="w-20 h-20 rounded-full"
              alt=""
            />
            <div>
              <h4 className="text-white font-bold text-lg">
                Ditulis oleh {data.name_user}
              </h4>
              <p className="text-slate-400 text-sm mt-1">
                Kontributor aktif yang fokus pada pengembangan ekosistem web
                modern. Hubungi penulis di {data.email_user}.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Detailpost;
