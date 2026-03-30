export const GRADE_OPTIONS = [
  { value: "1", label: "1학년" },
  { value: "2", label: "2학년" },
  { value: "3", label: "3학년" },
  { value: "4", label: "4학년" },
  { value: "grad", label: "대학원" },
];

export function isHighGrade(grade: string): boolean {
  return ["3", "4", "grad"].includes(grade);
}
