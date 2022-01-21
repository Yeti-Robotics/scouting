export function toBase64(arr: Uint8ClampedArray): string {
	return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
