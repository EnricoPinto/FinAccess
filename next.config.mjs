/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_CLOUD_VISION_API_KEY) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "[FinAccess] No OCR API key set (GEMINI_API_KEY or GOOGLE_CLOUD_VISION_API_KEY) — screenshot logging will use mock fallback data."
  );
}

export default nextConfig;
