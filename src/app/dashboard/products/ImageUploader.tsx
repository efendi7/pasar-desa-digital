'use client';
import { X, ImagePlus } from 'lucide-react';

interface Props {
  slots: (File | null)[];
  previews: (string | null)[];
  onChange: (index: number, file: File | null) => void;
}

export function ImageUploader({ slots, previews, onChange }: Props) {
  const removeImage = (i: number) => onChange(i, null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {slots.map((file, i) => (
        <div key={i} className="relative">
          <input
            type="file"
            accept="image/*"
            id={`image-${i}`}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              onChange(i, f);
            }}
          />
          <label
            htmlFor={`image-${i}`}
            className={`block aspect-square rounded-2xl border-2 border-dashed cursor-pointer ${
              previews[i]
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-green-400'
            }`}
          >
            {previews[i] ? (
              <div className="relative w-full h-full">
                <img
                  src={previews[i]!}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow"
                >
                  <X className="w-4 h-4" />
                </button>
                {i === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-lg">
                    Utama
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ImagePlus className="w-8 h-8 mb-2" />
                <span className="text-xs font-medium">
                  {i === 0 ? 'Foto Utama' : `Foto ${i + 1}`}
                </span>
              </div>
            )}
          </label>
        </div>
      ))}
    </div>
  );
}
