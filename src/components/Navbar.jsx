import { IconDownload, IconMoon, IconPlus, IconSun } from "./Icons";

export default function Navbar({ theme, onToggleTheme, onAdd, onExport }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">P</span>
          <div>
            <h1>Pustak</h1>
            <span className="brand-sub">your personal library</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={onExport} title="Export as JSON">
            <IconDownload />
          </button>
          <button className="icon-btn" onClick={onToggleTheme} title="Switch theme">
            {theme === "light" ? <IconMoon /> : <IconSun />}
          </button>
          <button className="btn btn-primary" onClick={onAdd}>
            <IconPlus /> Add book
          </button>
        </div>
      </div>
    </header>
  );
}
