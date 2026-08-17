/**
 * SettingsPanel
 *
 * This panel appears when the user clicks the settings button in the navbar.
 * It lets the user toggle the sidebar hover behavior on or off while keeping
 * the overall app theme and glass styling consistent.
 */
import { Check, SlidersHorizontal, Sparkles, X } from "lucide-react";

export default function SettingsPanel({ isOpen, onClose, hoverEnabled, onToggleHover }) {
  if (!isOpen) return null;

  return (
    <div className="ui-settings-backdrop" onClick={onClose}>
      <div
        className="ui-settings-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar settings"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ui-settings-header">
          <div>
            <p className="ui-settings-kicker">Preferences</p>
            <h2>Interface settings</h2>
          </div>
          <button type="button" className="ui-settings-close" onClick={onClose} aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        <div className="ui-settings-body">
          <div className="ui-settings-card">
            <div className="ui-settings-icon-wrap">
              <SlidersHorizontal size={18} />
            </div>
            <div className="ui-settings-copy">
              <strong>Hover sidebar</strong>
              <span>Open the dock automatically when the cursor touches the left edge.</span>
            </div>
            <button
              type="button"
              className={`ui-toggle ${hoverEnabled ? "is-on" : ""}`}
              onClick={onToggleHover}
              aria-pressed={hoverEnabled}
            >
              <span className="ui-toggle__thumb" />
            </button>
          </div>

          <div className="ui-settings-card ui-settings-card--accent">
            <div className="ui-settings-icon-wrap ui-settings-icon-wrap--accent">
              <Sparkles size={18} />
            </div>
            <div className="ui-settings-copy">
              <strong>Ambient mode</strong>
              <span>Warm green accents and glassmorphism stay active across the app.</span>
            </div>
            <span className="ui-settings-check">
              <Check size={15} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
