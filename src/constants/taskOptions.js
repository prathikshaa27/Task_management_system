export const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
export const PRIORITY_CHOICES = ["Low", "Medium","High"];
export const PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { label: "Due Date (Earliest)", value: "due_date" },
  { label: "Due Date (Latest)", value: "-due_date" },
  { label: "Priority (Low → High)", value: "priority" },
  { label: "Priority (High → Low)", value: "-priority" },
  { label: "Username (A → Z)", value: "user__username" },
  { label: "Username (Z → A)", value: "-user__username" },
];
