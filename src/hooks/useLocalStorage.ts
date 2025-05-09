"use client";

import { VoucherData } from "@/types/voucher";
import { useState, useEffect, useCallback } from "react";

type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorage(): [VoucherData, SetValue<VoucherData>] {
	// Initialize state with initialValue. This value will be used for server-side rendering
	// and the first client-side render before the useEffect runs.
	const [storedValue, setStoredValue] = useState<VoucherData>({});
	const key = "voucherData"; // Key for localStorage

	useEffect(() => {
		// This effect runs only on the client after hydration.
		try {
			const item = window.localStorage.getItem(key);
			console.log("useLocalStorage item", item);
			if (item) {
				// If item exists in localStorage, update state.
				setStoredValue(JSON.parse(item));
			}
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);
			// If error reading, ensure initialValue is in localStorage (if it wasn't already).
			// The state `storedValue` remains `initialValue`.
			// if (typeof window !== "undefined") {
			// 	// Check again if item is null before writing, to avoid overwriting valid data if JSON.parse failed
			// 	if (window.localStorage.getItem(key) === null) {
			// 		window.localStorage.setItem(key, JSON.stringify(initialValue));
			// 	}
			// }
		}
		// Dependency array includes only `key`. This means the effect runs when `key` changes.
		// `initialValue` is treated as a true initial default, only used if localStorage is empty.
		// It does not cause the effect to re-run if its reference changes but key remains same.
	}, [key]);

	const setValue: SetValue<VoucherData> = useCallback(
		(value) => {
			try {
				// Allow value to be a function so we have the same API as useState
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				if (typeof window !== "undefined") {
					window.localStorage.setItem(key, JSON.stringify(valueToStore));
				}
			} catch (error) {
				console.error(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue]
	);

	return [storedValue, setValue];
}

export default useLocalStorage;
