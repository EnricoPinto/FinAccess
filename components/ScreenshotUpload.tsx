"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  ShieldCheck,
} from "lucide-react";

export interface ParsedReceipt {
  amount: number | null;
  merchant: string;
  date: string;
  category: string;
  ocrConfidence?: "high" | "medium" | "low" | string;
  confidence?: "HIGH" | "MEDIUM" | "LOW" | string;
  rawOcrText?: string;
  rawText?: string;
}

interface ScreenshotUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: ParsedReceipt) => void;
}

export function ScreenshotUpload({ isOpen, onClose, onParsed }: ScreenshotUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setError(null);
      setParsing(true);

      // Read as data URL / base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);

        try {
          const res = await fetch("/api/parse-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64 }),
          });

          const data: ParsedReceipt = await res.json();
          onParsed(data);
          onClose();
        } catch (err) {
          console.error("Parse request error:", err);
          setError("Failed to extract details. Using offline fallback.");
        } finally {
          setParsing(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("Error processing image file.");
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-[250] bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-plate max-w-lg w-full p-6 sm:p-7 border border-glassEdge space-y-5 relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glassEdge pb-3">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-frostGlow" />
            <h3 className="font-display text-base font-medium text-pureWhite">
              Scan Payment Receipt or UPI Screenshot
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-fogVeil hover:text-pureWhite hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-moonMist leading-relaxed">
          Upload a payment screenshot from GPay, PhonePe, Paytm, or a digital invoice. Our Google Cloud Vision OCR engine will automatically extract amount, merchant, date, and category.
        </p>

        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? "border-frostGlow bg-white/[0.08]"
              : "border-glassEdge hover:border-frostGlow/40 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          {imagePreview ? (
            <div className="space-y-3">
              <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-glassEdge shadow-md relative">
                <img
                  src={imagePreview}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-mono text-frostGlow">Image loaded</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-pureWhite">
                  Click to upload or drag & drop receipt screenshot
                </p>
                <p className="text-[11px] text-fogVeil font-mono mt-0.5">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </>
          )}

          {parsing && (
            <div className="pt-2 flex items-center space-x-2 text-xs font-mono text-frostGlow">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blueprintBlue" />
              <span>Extracting transaction details via Vision OCR...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-negativeCoral/10 border border-negativeCoral/30 text-xs text-negativeCoral flex items-center space-x-2 font-mono">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Privacy & security badge */}
        <div className="flex items-center space-x-1 pt-2 border-t border-glassEdge text-[11px] font-mono text-fogVeil">
          <ShieldCheck className="w-3.5 h-3.5 text-blueprintBlue" />
          <span>Private &amp; secure • Server-side OCR processing</span>
        </div>
      </div>
    </div>
  );
}

export default ScreenshotUpload;
