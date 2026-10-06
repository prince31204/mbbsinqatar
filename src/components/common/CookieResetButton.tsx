"use client";

export default function CookieResetButton() {
  const handleReset = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      className="whitespace-nowrap px-8 py-3 bg-[#BC002D] text-white rounded-xl font-bold hover:bg-[#8F0023] transition-all shadow-lg active:scale-95"
    >
      Reset Cookie Settings
    </button>
  );
}
