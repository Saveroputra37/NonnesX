import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const rotateSize = (width, height, rotation) => {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

const getCroppedImage = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const rotRad = getRadianAngle(rotation);

  const { width, height } = rotateSize(image.width, image.height, rotation);

  canvas.width = width;
  canvas.height = height;

  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = pixelCrop.width;
  outputCanvas.height = pixelCrop.height;
  outputCanvas.getContext("2d").putImageData(data, 0, 0);

  return new Promise((resolve) => {
    outputCanvas.toBlob(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
};

const readFileDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

const StepProfileMedia = ({ form, onChange, onImageChange }) => {
  const [profileSrc, setProfileSrc] = useState(form.user_image_url || "");
  const [rawHeaderSrc, setRawHeaderSrc] = useState(form.header_url || "");
  const [previewHeader, setPreviewHeader] = useState(form.header_url || "");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [error, setError] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const validateFile = (file) => {
    if (!file) return "File tidak ditemukan.";
    if (!allowedImageTypes.includes(file.type)) {
      return "Hanya file JPG, PNG, atau WEBP yang diperbolehkan.";
    }
    if (file.size > maxFileSize) {
      return "Ukuran file maksimal 5MB.";
    }
    return null;
  };

  const handleProfileFile = async (event) => {
    const file = event.target.files?.[0];
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    const dataUrl = await readFileDataUrl(file);
    setProfileSrc(dataUrl);
    onImageChange("user_image_url")(dataUrl);
  };

  const handleHeaderFile = async (event) => {
    const file = event.target.files?.[0];
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    const dataUrl = await readFileDataUrl(file);
    setRawHeaderSrc(dataUrl);
    setPreviewHeader(dataUrl);
    setIsCropModalOpen(true);
  };

  const onCropComplete = useCallback((_, croppedAreaPixelsArg) => {
    setCroppedAreaPixels(croppedAreaPixelsArg);
  }, []);

  const applyCrop = async () => {
    if (!rawHeaderSrc || !croppedAreaPixels) return;
    const croppedDataUrl = await getCroppedImage(rawHeaderSrc, croppedAreaPixels, rotation);
    setRawHeaderSrc(croppedDataUrl);
    setPreviewHeader(croppedDataUrl);
    onChange("header_url")({ target: { value: croppedDataUrl } });
    setIsCropModalOpen(false);
  };

  const resetCropSettings = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(1);
    setCroppedAreaPixels(null);
  };

  const closeModal = () => {
    resetCropSettings();
    setIsCropModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Foto & Header</h2>
        <p className="mt-2 text-sm text-slate-400">
          Unggah foto profil dan header. Header dapat dipangkas di modal setelah diupload.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Upload Foto Profil</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileFile}
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white file:cursor-pointer file:rounded-2xl file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Upload Header</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleHeaderFile}
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white file:cursor-pointer file:rounded-2xl file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-blue-500/10">
          <div className="mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Preview Profil</p>
              <p className="text-xs text-slate-500">Foto profil tampil di sini tanpa crop.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt="preview profil"
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center text-slate-500">
                Pilih foto profil untuk preview
              </div>
            )}
          </div>
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-blue-500/10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Preview Header</p>
              <p className="text-xs text-slate-500">Banner header dapat dipangkas di modal.</p>
            </div>
            <button
              type="button"
              disabled={!previewHeader}
              onClick={() => setIsCropModalOpen(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              Edit Header
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950">
            {previewHeader ? (
              <img
                src={previewHeader}
                alt="header preview"
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="flex h-44 items-center justify-center text-slate-500">
                Pilih header untuk preview
              </div>
            )}
          </div>
        </div>
      </div>

      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-6 sm:px-6">
          <div className="w-full max-w-4xl overflow-hidden rounded-4xl border border-slate-700 bg-slate-950 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Crop Header Banner</h3>
                <p className="text-sm text-slate-400">Atur banner header sebelum menyimpan.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-slate-200 transition hover:border-blue-500"
              >
                Tutup
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] px-5 py-6">
              <div className="relative h-96 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                {rawHeaderSrc ? (
                  <Cropper
                    image={rawHeaderSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    objectFit="horizontal-cover"
                    showGrid={true}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    Tidak ada gambar untuk di-crop.
                  </div>
                )}
              </div>

              <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Kontrol Crop</p>
                  <p className="text-xs text-slate-500">Zoom, rotasi, dan aspect ratio.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Zoom</label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Rotasi</label>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={1}
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
                    />
                    <p className="mt-1 text-xs text-slate-500">{rotation}°</p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-300">Aspect Ratio</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {[{ label: "1:1", value: 1 }, { label: "4:3", value: 4 / 3 }, { label: "16:9", value: 16 / 9 }].map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setAspect(option.value)}
                          className={`rounded-2xl border px-3 py-2 text-sm transition ${aspect === option.value ? "border-blue-500 bg-blue-500/10 text-white" : "border-slate-700 bg-slate-900 text-slate-300"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={applyCrop}
                    className="w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    Simpan Crop
                  </button>
                  <button
                    type="button"
                    onClick={resetCropSettings}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500"
                  >
                    Reset Setting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepProfileMedia;
