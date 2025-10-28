import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { Trip, TripInput, ListTripsParams } from "./types";

// IndexedDB schema
interface TravelLogDB extends DBSchema {
  trips: {
    key: string;
    value: Trip;
    indexes: {
      "by-country": string;
      "by-start-date": string;
      "by-created-at": number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<TravelLogDB>> | null = null;

// Initialize database
function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<TravelLogDB>("travel-log-db", 1, {
      upgrade(db) {
        const tripStore = db.createObjectStore("trips", { keyPath: "id" });
        tripStore.createIndex("by-country", "country_iso2");
        tripStore.createIndex("by-start-date", "start_date");
        tripStore.createIndex("by-created-at", "created_at");
      },
    });
  }
  return dbPromise;
}

// Generate simple UUID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new trip
export async function createTrip(input: TripInput): Promise<Trip> {
  const db = await getDB();
  const now = Date.now();
  const trip: Trip = {
    ...input,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  await db.add("trips", trip);
  return trip;
}

// List all trips with optional filtering and sorting
export async function listTrips(params?: ListTripsParams): Promise<Trip[]> {
  const db = await getDB();
  let trips = await db.getAll("trips");

  // Filter by search query
  if (params?.q) {
    const query = params.q.toLowerCase();
    trips = trips.filter((trip) =>
      trip.country_iso2.toLowerCase().includes(query)
    );
  }

  // Sort
  if (params?.sort === "recent") {
    // Sort by start_date descending (most recent first)
    trips.sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return dateB - dateA;
    });
  } else if (params?.sort === "country") {
    // Sort by country ISO code A→Z
    trips.sort((a, b) => a.country_iso2.localeCompare(b.country_iso2));
  } else {
    // Default: sort by created_at descending
    trips.sort((a, b) => b.created_at - a.created_at);
  }

  return trips;
}

// Get a single trip by ID
export async function getTrip(id: string): Promise<Trip | undefined> {
  const db = await getDB();
  return await db.get("trips", id);
}

// Update a trip
export async function updateTrip(
  id: string,
  patch: Partial<Omit<Trip, "id" | "created_at">>
): Promise<Trip> {
  const db = await getDB();
  const existing = await db.get("trips", id);
  if (!existing) {
    throw new Error(`Trip with id ${id} not found`);
  }
  const updated: Trip = {
    ...existing,
    ...patch,
    updated_at: Date.now(),
  };
  await db.put("trips", updated);
  return updated;
}

// Delete a trip
export async function deleteTrip(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("trips", id);
}

// Export all trips as JSON
export async function exportTrips(): Promise<string> {
  const trips = await listTrips();
  return JSON.stringify(trips, null, 2);
}

// Import trips from JSON
export async function importTrips(jsonString: string): Promise<number> {
  const trips = JSON.parse(jsonString) as Trip[];
  const db = await getDB();

  let imported = 0;
  for (const trip of trips) {
    // Preserve IDs if present, or generate new ones
    if (!trip.id) {
      trip.id = generateId();
    }
    // Ensure timestamps exist
    if (!trip.created_at) {
      trip.created_at = Date.now();
    }
    if (!trip.updated_at) {
      trip.updated_at = Date.now();
    }
    await db.put("trips", trip);
    imported++;
  }

  return imported;
}

// Clear all trips (for testing)
export async function clearAllTrips(): Promise<void> {
  const db = await getDB();
  await db.clear("trips");
}
