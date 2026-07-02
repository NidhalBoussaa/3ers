"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getPresignedUploadUrl, recordAsset } from "../actions";
import { UploadCloud, X, Check, Loader2, ImageIcon } from "lucide-react";

type Photo = {
  id: string;
  type: string;
  originalName: string | null;
  sizeBytes: number | null;
  url: string | null;
};

type Pending =
  | { status: "uploading"; progress: number; name: string; preview: string }
  | { status: "error"; message: string; name: string };

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 20 * 1024 * 1024;

export function PhotoManager({ orderId, initial }: { orderId: string; initial: Photo[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function setPendingAt(index: number, state: Pending | null) {
    setPending((prev) => {
      const next = [...prev];
      if (state === null) next.splice(index, 1);
      else next[index] = state;
      return next;
    });
  }

  async function handleFiles(files: FileList) {
    const list = Array.from(files).slice(0, 10);

    for (const file of list) {
      const base = pending.length;
      const preview = URL.createObjectURL(file);

      if (!ACCEPTED.includes(file.type)) {
        setPending((p) => [...p, { status: "error", message: "Format non supporté", name: file.name }]);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setPending((p) => [...p, { status: "error", message: "Fichier trop lourd (max 20 Mo)", name: file.name }]);
        continue;
      }

      const idx = base;
      setPending((p) => [...p, { status: "uploading", progress: 0, name: file.name, preview }]);

      try {
        const { url, objectKey } = await getPresignedUploadUrl(orderId, file.name, file.type);
        await uploadWithProgress(url, file, (pct) =>
          setPendingAt(idx, { status: "uploading", progress: pct, name: file.name, preview }),
        );
        await recordAsset(orderId, objectKey, file.name, file.type);

        // Move from pending into the gallery using the local preview URL.
        setPending((p) => p.filter((_, i) => i !== idx));
        setPhotos((prev) => [
          { id: objectKey, type: "couple_photo", originalName: file.name, sizeBytes: file.size, url: preview },
          ...prev,
        ]);
      } catch {
        setPendingAt(idx, { status: "error", message: "Erreur d'envoi", name: file.name });
        URL.revokeObjectURL(preview);
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Ajouter des photos"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed p-9 text-center transition-colors ${
          dragOver ? "border-gold bg-gold/8" : "border-gold/40 bg-white/50 hover:border-gold/70"
        }`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/35 bg-gold/8 text-gold-deep">
          <UploadCloud size={22} strokeWidth={1.5} />
        </span>
        <p className="font-body text-[1.14rem] text-ink">
          Glissez vos photos ici, ou{" "}
          <span className="text-gold-deep underline decoration-gold/40 underline-offset-2">
            parcourez vos fichiers
          </span>
        </p>
        <p className="font-cinzel text-[9.5px] uppercase tracking-[0.16em] text-ink-soft/70">
          JPG · PNG · WebP — 20 Mo max
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* In-flight uploads */}
      {pending.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pending.map((u, i) => (
            <li
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl border border-gold/25 bg-white/60"
            >
              {u.status === "uploading" ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.preview} alt="" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 grid place-items-center bg-night/25">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 rounded-full bg-night/70 px-2 py-0.5 font-cinzel text-[9px] text-cream">
                    {u.progress}%
                  </span>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
                  <X size={18} className="text-[#a15a4d]" />
                  <span className="font-body text-[0.95rem] italic text-[#a15a4d]">{u.message}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Uploaded gallery */}
      {photos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <li
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gold/25 bg-white/60"
            >
              {p.url ? (
                <Image
                  src={p.url}
                  alt={p.originalName ?? "Photo confiée à l'atelier"}
                  fill
                  sizes="(min-width: 640px) 220px, 45vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="grid h-full place-items-center text-gold-deep/40">
                  <ImageIcon size={22} strokeWidth={1.4} />
                </div>
              )}
              <span className="absolute left-1.5 top-1.5 rounded-full bg-night/60 px-2 py-0.5 font-cinzel text-[8px] uppercase tracking-[0.14em] text-cream opacity-0 transition-opacity group-hover:opacity-100">
                <Check size={9} className="mr-1 inline" strokeWidth={2.5} />
                Reçue
              </span>
            </li>
          ))}
        </ul>
      ) : (
        pending.length === 0 && (
          <p className="py-4 text-center font-body text-[1.06rem] italic text-ink-soft">
            Aucune photo pour l&rsquo;instant. Vos images apparaîtront ici une fois
            envoyées.
          </p>
        )
      )}
    </div>
  );
}

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(String(xhr.status))));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
