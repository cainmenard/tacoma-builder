/** Money the way a parts invoice prints it: cents only when there are cents. */
export function money(v: number): string {
  return v % 1 === 0
    ? `$${v.toLocaleString("en-US")}`
    : `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
