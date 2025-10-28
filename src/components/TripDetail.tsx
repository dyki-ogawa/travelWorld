import { useState } from "react";
import type { Trip } from "../types";
import { getCountryByIso2 } from "../data/countries";
import { deleteTrip } from "../db";
import { TripForm } from "./TripForm";

interface TripDetailProps {
  trip: Trip;
  onBack: () => void;
  onUpdate: () => void;
}

export function TripDetail({ trip, onBack, onUpdate }: TripDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const country = getCountryByIso2(trip.country_iso2);

  const handleDelete = async () => {
    try {
      await deleteTrip(trip.id);
      onUpdate();
      onBack();
    } catch (error) {
      console.error("Failed to delete trip:", error);
      alert("削除に失敗しました");
    }
  };

  const formatDateRange = () => {
    if (trip.end_date) {
      return `${trip.start_date} — ${trip.end_date}`;
    }
    return trip.start_date;
  };

  if (isEditing) {
    return (
      <TripForm
        trip={trip}
        onSave={() => {
          setIsEditing(false);
          onUpdate();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="trip-detail">
      <div className="trip-detail-header">
        <button onClick={onBack} className="back-button">
          ← 戻る
        </button>
        <div className="trip-detail-actions">
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={() => setShowDeleteConfirm(true)} className="delete-button">
            削除
          </button>
        </div>
      </div>

      <div className="trip-detail-content">
        <div className="trip-detail-hero">
          <div className="country-emoji-large">{country?.emoji || "🌍"}</div>
          <h1 className="country-name">
            {country?.name_ja || country?.name_en || trip.country_iso2}
          </h1>
        </div>

        <div className="trip-detail-section">
          <h2>訪問記録</h2>
          <div className="detail-item">
            <span className="detail-label">期間:</span>
            <span className="detail-value">{formatDateRange()}</span>
          </div>
          {trip.note && (
            <div className="detail-item">
              <span className="detail-label">メモ:</span>
              <span className="detail-value">{trip.note}</span>
            </div>
          )}
        </div>

        <div className="trip-detail-section">
          <h2>国の基本情報</h2>
          <div className="detail-item">
            <span className="detail-label">国名（英語）:</span>
            <span className="detail-value">{country?.name_en || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">ISO コード:</span>
            <span className="detail-value">{trip.country_iso2}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">地域:</span>
            <span className="detail-value">{country?.region || "N/A"}</span>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>この旅行記録を削除しますか？</h3>
            <p>この操作は取り消せません。</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(false)}>キャンセル</button>
              <button onClick={handleDelete} className="delete-button">
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
