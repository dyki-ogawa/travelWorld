// Country（内蔵マスタ）
export type Country = {
  iso2: string;        // "FR"
  name_en: string;     // "France"
  name_ja?: string;    // "フランス"
  emoji: string;       // "🇫🇷"
  region?: string;     // "Europe"
};

// Trip（ユーザー入力）
export type Trip = {
  id: string;          // uuid
  country_iso2: string;// "FR"
  start_date: string;  // "2019-05-01" (YYYY-MM-DD)
  end_date?: string;   // optional
  note?: string;       // 一言メモ
  created_at: number;  // epoch ms
  updated_at: number;  // epoch ms
};

// User（将来の拡張用・v0はguestで固定でも可）
export type User = {
  id: string;          // "local-guest"
  locale: "ja" | "en";
};

// Trip creation input
export type TripInput = Omit<Trip, "id" | "created_at" | "updated_at">;

// Sort options
export type SortOption = "recent" | "country";

// List params
export type ListTripsParams = {
  sort?: SortOption;
  q?: string;
};
