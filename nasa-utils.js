(function () {
  const STORAGE_KEY = "covertfily_nasa_api_key";
  const DEFAULT_KEY = "DEMO_KEY";
  const API_BASE = "https://api.nasa.gov";

  function getApiKey() {
    const input = document.getElementById("nasaApiKey");
    const val = input?.value?.trim();
    if (val) return val;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_KEY;
  }

  function saveApiKey(key) {
    const trimmed = (key || "").trim();
    if (trimmed && trimmed !== DEFAULT_KEY) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function initApiKeyInput() {
    const input = document.getElementById("nasaApiKey");
    if (!input) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) input.value = saved;
    input.addEventListener("change", () => saveApiKey(input.value));
  }

  async function fetchEarthImagery({ lat, lon, date, dim = 0.1, apiKey }) {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      date,
      dim: String(dim),
      api_key: apiKey,
    });
    const res = await fetch(`${API_BASE}/planetary/earth/imagery?${params}`);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const err = await res.json();
      throw new Error(err.msg || "No satellite imagery available for this location and date.");
    }

    if (!res.ok) {
      throw new Error(`Imagery request failed (${res.status})`);
    }

    return res.blob();
  }

  async function fetchApod({ apiKey, date }) {
    const params = new URLSearchParams({ api_key: apiKey });
    if (date) params.set("date", date);
    const res = await fetch(`${API_BASE}/planetary/apod?${params}`);
    if (!res.ok) {
      let msg = `APOD request failed (${res.status})`;
      try {
        const err = await res.json();
        if (err.msg || err.error?.message) msg = err.msg || err.error.message;
      } catch (_) {}
      throw new Error(msg);
    }
    return res.json();
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    });
  }

  async function blobToImage(blob) {
    const url = URL.createObjectURL(blob);
    try {
      return await loadImage(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function urlToImage(url) {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      return blobToImage(blob);
    } catch (_) {
      return loadImage(url);
    }
  }

  function drawToCanvas(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  function downloadCanvas(canvas, format, filename) {
    const mime =
      format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
    const quality = format === "png" ? undefined : 0.92;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      },
      mime,
      quality
    );
  }

  function setLoading(el, isLoading, message) {
    if (!el) return;
    if (isLoading) {
      el.innerHTML =
        '<div class="nasa-loading"><i class="fas fa-spinner fa-spin"></i><span>' +
        (message || "Loading…") +
        "</span></div>";
    }
  }

  function showError(el, message) {
    if (!el) return;
    el.innerHTML =
      '<div class="nasa-error"><i class="fas fa-exclamation-circle"></i><span>' +
      message +
      "</span></div>";
  }

  function defaultEarthDate() {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 10);
  }

  window.NasaUtils = {
    STORAGE_KEY,
    DEFAULT_KEY,
    getApiKey,
    saveApiKey,
    initApiKeyInput,
    fetchEarthImagery,
    fetchApod,
    loadImage,
    blobToImage,
    urlToImage,
    drawToCanvas,
    downloadCanvas,
    setLoading,
    showError,
    defaultEarthDate,
  };
})();