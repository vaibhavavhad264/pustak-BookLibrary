import { IconStar } from "./Icons";

export default function Rating({ value = 0, onChange, size = 16 }) {
  return (
    <div className="rating" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            type="button"
            key={n}
            className={"star" + (n <= value ? " on" : "")}
            onClick={() => onChange(n === value ? 0 : n)}
            aria-label={`Rate ${n}`}
          >
            <IconStar filled={n <= value} width={size} height={size} />
          </button>
        ) : (
          <span key={n} className={"star" + (n <= value ? " on" : "")}>
            <IconStar filled={n <= value} width={size} height={size} />
          </span>
        )
      )}
    </div>
  );
}
