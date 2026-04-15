import React from "react";

function SettingRow({ label, description, checked, onChange }) {
  return (
    <label className="setting-row">
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
      <span className={`toggle ${checked ? "active" : ""}`}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-track" />
      </span>
    </label>
  );
}

function SettingsPanel({ settings, onSettingsChange, onBack, onOpenUpload }) {
  const updateSetting = (key) => (event) => {
    onSettingsChange((current) => ({
      ...current,
      [key]: event.target.checked,
    }));
  };

  return (
    <main className="settings-shell">
      <section className="settings-card">
        <div className="surface-heading">
          <div>
            <p className="eyebrow">Settings</p>
            <h2>Workspace preferences</h2>
          </div>
          <div className="settings-actions">
            <button type="button" className="ghost-button" onClick={onOpenUpload}>
              Upload
            </button>
            <button type="button" className="primary-button" onClick={onBack}>
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="settings-grid">
          <SettingRow
            label="Notifications"
            description="Show status feedback for uploads and document indexing."
            checked={settings.notifications}
            onChange={updateSetting("notifications")}
          />
          <SettingRow
            label="Compact mode"
            description="Reduce spacing in the dashboard to fit more content on screen."
            checked={settings.compactMode}
            onChange={updateSetting("compactMode")}
          />
          <SettingRow
            label="Auto summaries"
            description="Generate a ready-to-skim summary card after each successful upload."
            checked={settings.autoSummaries}
            onChange={updateSetting("autoSummaries")}
          />
          <SettingRow
            label="Citation highlights"
            description="Emphasize grounded snippets and evidence-focused answer fragments."
            checked={settings.citationHighlights}
            onChange={updateSetting("citationHighlights")}
          />
        </div>
      </section>
    </main>
  );
}

export default SettingsPanel;
