import { useState, useEffect } from "react";
import type { Trip, SortOption } from "../types";
import { listTrips } from "../db";
import { TripCard } from "./TripCard";

interface TripListProps {
  onTripClick: (trip: Trip) => void;
  refresh: number; // Used to trigger refresh
}

export function TripList({ onTripClick, refresh }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  useEffect(() => {
    loadTrips();
  }, [searchQuery, sortOption, refresh]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await listTrips({ q: searchQuery, sort: sortOption });
      setTrips(data);
    } catch (error) {
      console.error("Failed to load trips:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (trips.length === 0 && !searchQuery) {
    return (
      <div className="empty-state">
        <p>まだ旅の記録がありません</p>
        <p>最初の1件を記録しましょう</p>
      </div>
    );
  }

  return (
    <div className="trip-list-container">
      <div className="trip-list-controls">
        <input
          type="text"
          className="search-input"
          placeholder="国名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
        >
          <option value="recent">最新訪問順</option>
          <option value="country">国名順（A→Z）</option>
        </select>
      </div>

      {trips.length === 0 ? (
        <div className="no-results">該当する記録が見つかりません</div>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={() => onTripClick(trip)} />
          ))}
        </div>
      )}
    </div>
  );
}
