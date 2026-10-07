export function validMoney(value: string) {
  return /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 100000000;
}
export function goalError(name: string, target: string, current = 0): string {
  if (!name.trim() || name.trim().length > 60) return "Enter a goal name of 1–60 characters.";
  if (!validMoney(target)) return "Enter a target between €0.01 and €100,000,000, with up to two decimal places.";
  if (Number(target) < current) return "The target cannot be below the amount already saved.";
  return "";
}
export function allocationError(amount: string, mode: "add" | "release", current: number, target: number, available: number): string {
  if (!validMoney(amount)) return "Enter a positive amount with up to two decimal places.";
  const cents = Math.round(Number(amount) * 100);
  if (mode === "release") return cents > Math.round(current * 100) ? "Amount exceeds this goal’s saved balance." : "";
  if (cents > Math.round(available * 100)) return "Amount exceeds your unallocated savings. Release money from another goal first.";
  if (cents > Math.round((target - current) * 100)) return "Amount exceeds the remaining target. Edit the target to save more.";
  return "";
}
