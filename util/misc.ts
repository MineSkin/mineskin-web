export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}