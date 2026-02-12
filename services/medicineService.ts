import { RAW_MEDICINE_DATA } from '../constants';

// A map to store normalized medicine name -> location
let medicineDatabase: Map<string, string> | null = null;

/**
 * Initializes the database by parsing the raw string.
 * Format expected: "Medicine Name=Location Info" per line.
 */
export const initializeDatabase = () => {
  if (medicineDatabase) return;

  medicineDatabase = new Map<string, string>();
  
  const lines = RAW_MEDICINE_DATA.split('\n');
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#')) continue;

    const parts = line.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim().toLowerCase();
      // Join the rest back in case the location itself has an = sign (unlikely but safe)
      const location = parts.slice(1).join('=').trim();
      medicineDatabase.set(name, location);
    }
  }
  console.log(`Database initialized with ${medicineDatabase.size} entries.`);
};

/**
 * Search for a medicine in the local database.
 * @param query The medicine name to search for.
 * @returns The location string if found, or null if not found.
 */
export const searchMedicineLocally = (query: string): string | null => {
  if (!medicineDatabase) {
    initializeDatabase();
  }
  const normalizedQuery = query.trim().toLowerCase();
  
  // 1. Exact match
  if (medicineDatabase?.has(normalizedQuery)) {
    return medicineDatabase.get(normalizedQuery) || null;
  }

  // 2. Partial match (optional, but helpful for typos)
  // We can iterate, but for performance with a large list, exact match is preferred first.
  // If exact fails, we check if the query is contained in a key.
  /* 
  for (const [key, value] of medicineDatabase!.entries()) {
    if (key.includes(normalizedQuery)) {
      return value;
    }
  }
  */

  return null;
};