import { STATUSES } from "../utils/constants";

export default function StatusSelect({ value, onChange }) {
  return (
    <select
      className="status-select"
      data-status={value}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Reading status"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
