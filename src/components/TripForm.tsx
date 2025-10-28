import { useState } from "react";
import type { FormEvent } from "react";
import type { Trip, TripInput } from "../types";
import { COUNTRIES, searchCountries } from "../data/countries";
import { createTrip, updateTrip } from "../db";

interface TripFormProps {
  trip?: Trip; // If provided, this is edit mode
  onSave: () => void;
  onCancel: () => void;
}

export function TripForm({ trip, onSave, onCancel }: TripFormProps) {
  const [countryIso2, setCountryIso2] = useState(trip?.country_iso2 || "");
  const [startDate, setStartDate] = useState(trip?.start_date || "");
  const [days, setDays] = useState(trip?.days?.toString() || "");
  const [note, setNote] = useState(trip?.note || "");
  const [showCountryList, setShowCountryList] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredCountries = countryQuery
    ? searchCountries(countryQuery)
    : COUNTRIES;

  const selectedCountry = COUNTRIES.find((c) => c.iso2 === countryIso2);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!countryIso2) {
      setError("国を選択してください");
      return;
    }
    if (!startDate) {
      setError("開始日を入力してください");
      return;
    }
    if (days && (isNaN(Number(days)) || Number(days) < 1)) {
      setError("滞在日数は1以上の数値で入力してください");
      return;
    }

    setSaving(true);
    try {
      if (trip) {
        // Edit mode
        await updateTrip(trip.id, {
          country_iso2: countryIso2,
          start_date: startDate,
          days: days ? Number(days) : undefined,
          note: note || undefined,
        });
      } else {
        // Create mode
        const input: TripInput = {
          country_iso2: countryIso2,
          start_date: startDate,
          days: days ? Number(days) : undefined,
          note: note || undefined,
        };
        await createTrip(input);
      }
      onSave();
    } catch (err) {
      setError("保存に失敗しました");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectCountry = (iso2: string) => {
    setCountryIso2(iso2);
    setShowCountryList(false);
    setCountryQuery("");
  };

  return (
    <div className="trip-form">
      <h2>{trip ? "旅行を編集" : "新しい旅行を記録"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>国 *</label>
          <div className="country-select">
            <div
              className="country-input"
              onClick={() => setShowCountryList(!showCountryList)}
            >
              {selectedCountry ? (
                <span>
                  {selectedCountry.emoji} {selectedCountry.name_ja || selectedCountry.name_en}
                </span>
              ) : (
                <span className="placeholder">国を選択...</span>
              )}
            </div>
            {showCountryList && (
              <div className="country-dropdown">
                <input
                  type="text"
                  className="country-search"
                  placeholder="国名で検索..."
                  value={countryQuery}
                  onChange={(e) => setCountryQuery(e.target.value)}
                  autoFocus
                />
                <div className="country-list">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.iso2}
                      className="country-option"
                      onClick={() => selectCountry(country.iso2)}
                    >
                      <span className="country-emoji">{country.emoji}</span>
                      <span className="country-name">
                        {country.name_ja || country.name_en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>開始日 *</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>滞在日数</label>
          <input
            type="number"
            min="1"
            placeholder="例: 3"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>メモ</label>
          <input
            type="text"
            placeholder="一言メモ（任意）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={saving}>
            キャンセル
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "保存中..." : trip ? "更新" : "記録する"}
          </button>
        </div>
      </form>
    </div>
  );
}
