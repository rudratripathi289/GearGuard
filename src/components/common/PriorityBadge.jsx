import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants';

export default function PriorityBadge({ priority }) {
  const colorClass = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  const label = PRIORITY_LABELS[priority] || priority;

  const className = `px-2 py-1 text-xs font-semibold rounded border ${colorClass}`;

  return (
    <span className={className}>
      {label}
    </span>
  );
}
