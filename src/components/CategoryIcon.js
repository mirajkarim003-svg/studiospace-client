import { FiCamera, FiFilm, FiMic, FiMusic, FiPenTool } from "react-icons/fi";

const map = { camera: FiCamera, film: FiFilm, mic: FiMic, music: FiMusic, brush: FiPenTool };

export default function CategoryIcon({ name, className = "h-6 w-6" }) {
  const Icon = map[name] || FiCamera;
  return <Icon className={className} aria-hidden="true" />;
}
