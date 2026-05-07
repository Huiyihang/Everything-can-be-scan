import {
  HISTORY_STORAGE_KEY,
  LATEST_RESULT_STORAGE_KEY,
  type HistoryRecord,
  type UploadSource
} from "@/lib/types";

const HISTORY_LIMIT = 20;

function canUseStorage() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function canUseSessionStorage() {
  try {
    return typeof window !== "undefined" && Boolean(window.sessionStorage);
  } catch {
    return false;
  }
}

function isHistoryRecord(value: unknown): value is HistoryRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<HistoryRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.objectName === "string" &&
    typeof record.diary === "string" &&
    typeof record.imageDataUrl === "string" &&
    typeof record.createdAt === "string" &&
    isUploadSource(record.source)
  );
}

function isUploadSource(value: unknown): value is UploadSource {
  return value === "album" || value === "camera" || value === "example";
}

function writeHistoryRecords(records: HistoryRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
  } catch {
    const compactRecords = records.slice(0, 8);
    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(compactRecords)
      );
    } catch {
      // Ignore storage quota/security errors. The scan flow should keep working.
    }
  }
}

export function readHistoryRecords(): HistoryRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isHistoryRecord).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function readHistoryRecordById(recordId: string): HistoryRecord | null {
  return (
    readHistoryRecords().find((record) => record.id === recordId) ?? null
  );
}

export function saveHistoryRecord(record: HistoryRecord) {
  const records = readHistoryRecords();
  const nextRecords = [
    record,
    ...records.filter((historyRecord) => historyRecord.id !== record.id)
  ].slice(0, HISTORY_LIMIT);

  writeHistoryRecords(nextRecords);
}

export function clearHistoryRecords() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function saveLatestResult(record: HistoryRecord) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      LATEST_RESULT_STORAGE_KEY,
      JSON.stringify(record)
    );
  } catch {
    // Ignore storage quota/security errors. History still preserves the result.
  }
}

export function readLatestResult(): HistoryRecord | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(LATEST_RESULT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    return isHistoryRecord(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function clearLatestResult() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(LATEST_RESULT_STORAGE_KEY);
}
