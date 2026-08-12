import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton({ label = "Back", fallback = "/" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there is browser history, go back.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Otherwise return to the specified fallback page.
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:text-green-700 transition"
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;