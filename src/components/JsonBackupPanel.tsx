import { useState } from "react";
import type { ChangeEvent } from "react";
import { exportTrips, importTrips } from "../db";

interface JsonBackupPanelProps {
  onImportComplete: () => void;
}

export function JsonBackupPanel({ onImportComplete }: JsonBackupPanelProps) {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    try {
      const json = await exportTrips();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `travel-log-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage("エクスポートが完了しました");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      setMessage("エクスポートに失敗しました");
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage("");

    try {
      const text = await file.text();
      const count = await importTrips(text);
      setMessage(`${count}件の記録をインポートしました`);
      onImportComplete();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Import failed:", error);
      setMessage("インポートに失敗しました。ファイル形式を確認してください。");
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="json-backup-panel">
      <h3>データのバックアップ</h3>
      <p className="backup-description">
        旅行記録をJSONファイルとしてエクスポート/インポートできます。
      </p>

      <div className="backup-actions">
        <button onClick={handleExport} className="export-button">
          エクスポート
        </button>
        <label className="import-button">
          {importing ? "インポート中..." : "インポート"}
          <input
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            disabled={importing}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {message && <div className="backup-message">{message}</div>}
    </div>
  );
}
