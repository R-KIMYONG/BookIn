export const ConditionBadge = ({ label, value }: { label: string; value: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </span>
);
