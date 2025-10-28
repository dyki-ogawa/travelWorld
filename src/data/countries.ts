import type { Country } from "../types";

// 内蔵国データ（v0: 最小10件）
export const COUNTRIES: Country[] = [
  { iso2: "JP", name_en: "Japan", name_ja: "日本", emoji: "🇯🇵", region: "Asia" },
  { iso2: "FR", name_en: "France", name_ja: "フランス", emoji: "🇫🇷", region: "Europe" },
  { iso2: "US", name_en: "United States", name_ja: "アメリカ合衆国", emoji: "🇺🇸", region: "Americas" },
  { iso2: "GB", name_en: "United Kingdom", name_ja: "イギリス", emoji: "🇬🇧", region: "Europe" },
  { iso2: "DE", name_en: "Germany", name_ja: "ドイツ", emoji: "🇩🇪", region: "Europe" },
  { iso2: "IT", name_en: "Italy", name_ja: "イタリア", emoji: "🇮🇹", region: "Europe" },
  { iso2: "ES", name_en: "Spain", name_ja: "スペイン", emoji: "🇪🇸", region: "Europe" },
  { iso2: "AU", name_en: "Australia", name_ja: "オーストラリア", emoji: "🇦🇺", region: "Oceania" },
  { iso2: "CN", name_en: "China", name_ja: "中国", emoji: "🇨🇳", region: "Asia" },
  { iso2: "KR", name_en: "South Korea", name_ja: "韓国", emoji: "🇰🇷", region: "Asia" },
];

// 国コードから国情報を取得
export function getCountryByIso2(iso2: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso2 === iso2);
}

// オートコンプリート用：国名で検索
export function searchCountries(query: string): Country[] {
  const q = query.toLowerCase();
  return COUNTRIES.filter(
    (c) =>
      c.name_en.toLowerCase().includes(q) ||
      c.name_ja?.toLowerCase().includes(q) ||
      c.iso2.toLowerCase().includes(q)
  );
}
