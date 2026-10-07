"use client";

export default function CookieResetButton() {
  const handleReset = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      className="whitespace-nowrap px-8 py-3 bg-[#8A1538] text-white rounded-xl font-bold hover:bg-[#5B0F26] transition-all shadow-lg active:scale-95"
    >
      Reset Cookie Settings
    </button>
  );
}
