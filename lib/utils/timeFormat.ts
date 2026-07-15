export function formatTime24(value: string | null | undefined) {
  if (!value) return '';

  const [rawHours = '', rawMinutes = ''] = value.split(':');
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatTimeRange24(from: string | null | undefined, to: string | null | undefined) {
  const fromLabel = formatTime24(from);
  const toLabel = formatTime24(to);

  if (!fromLabel && !toLabel) return '';
  if (!fromLabel) return toLabel;
  if (!toLabel) return fromLabel;

  return `${fromLabel} - ${toLabel}`;
}
