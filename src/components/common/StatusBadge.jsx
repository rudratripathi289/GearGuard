import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.new;
  const label = STATUS_LABELS[status] || status;

  const className = `px-2 py-1 text-xs font-semibold rounded border ${colorClass}`;

  return (
    <span className={className}>
      {label}
    </span>
  );
}
