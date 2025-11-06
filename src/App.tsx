import { useState } from "react";
import type { Trip } from "./types";
import { TripList } from "./components/TripList";
import { TripForm } from "./components/TripForm";
import { TripDetail } from "./components/TripDetail";
import { JsonBackupPanel } from "./components/JsonBackupPanel";
import "./App.css";

type View = "list" | "create" | "detail" | "settings";

function App() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refresh = () => setRefreshCounter((c) => c + 1);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setCurrentView("detail");
  };

  const handleCreateNew = () => {
    setCurrentView("create");
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
    setCurrentView("list");
    refresh();
  };

  const handleSettings = () => {
    setCurrentView("settings");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>✈️ 旅行ログ</h1>
        {currentView === "list" && (
          <div className="header-actions">
            <button onClick={handleSettings} className="settings-button">
              ⚙️ 設定
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {currentView === "list" && (
          <>
            <div className="list-header">
              <h2>旅行コレクション</h2>
              <button onClick={handleCreateNew} className="create-button">
                + 新規作成
              </button>
            </div>
            <TripList onTripClick={handleTripClick} refresh={refreshCounter} />
          </>
        )}

        {currentView === "create" && (
          <div className="modal-overlay" onClick={handleBackToList}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <TripForm onSave={handleBackToList} onCancel={handleBackToList} />
            </div>
          </div>
        )}

        {currentView === "detail" && selectedTrip && (
          <TripDetail
            trip={selectedTrip}
            onBack={handleBackToList}
            onUpdate={refresh}
          />
        )}

        {currentView === "settings" && (
          <div className="settings-view">
            <div className="settings-header">
              <button onClick={handleBackToList} className="back-button">
                ← 戻る
              </button>
              <h2>設定</h2>
            </div>
            <JsonBackupPanel onImportComplete={refresh} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>旅行ログ v0.1 - あなたの旅の記録</p>
      </footer>
    </div>
  );
}

export default App;
