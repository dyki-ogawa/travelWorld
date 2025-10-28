import type { Trip } from "../types";
import { getCountryByIso2 } from "../data/countries";

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const country = getCountryByIso2(trip.country_iso2);

  const formatDateRange = () => {
    if (trip.days) {
      return `${trip.start_date} (${trip.days}日間)`;
    }
    return trip.start_date;
  };

  return (
    <div className="trip-card" onClick={onClick}>
      <div className="trip-card-emoji">{country?.emoji || "🌍"}</div>
      <div className="trip-card-content">
        <h3 className="trip-card-country">
          {country?.name_ja || country?.name_en || trip.country_iso2}
        </h3>
        <div className="trip-card-date">{formatDateRange()}</div>
        {trip.note && <div className="trip-card-note">{trip.note}</div>}
      </div>
    </div>
  );
}
