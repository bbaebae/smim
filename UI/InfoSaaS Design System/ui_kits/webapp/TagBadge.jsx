// TagBadge.jsx — shared tag/badge components
// Export to window for cross-script use

const TagBadge = ({ children, variant = 'default', dot }) => {
  const tagBadgeStyles = {
    default: {
      background: '#f0f4f8', color: '#273951',
      border: '1px solid #e5edf5',
    },
    purple: {
      background: 'rgba(83,58,253,0.08)', color: '#533afd',
      border: '1px solid #d6d9fc',
    },
    success: {
      background: 'rgba(21,190,83,0.15)', color: '#108c3d',
      border: '1px solid rgba(21,190,83,0.35)',
    },
    warning: {
      background: 'rgba(155,104,41,0.1)', color: '#9b6829',
      border: '1px solid rgba(155,104,41,0.25)',
    },
    magenta: {
      background: '#ffd7ef', color: '#c4187a',
      border: '1px solid #ffd7ef',
    },
    dark: {
      background: '#1c1e54', color: 'rgba(255,255,255,0.85)',
      border: 'none',
    },
  };

  const dotColors = {
    default: '#64748d', purple: '#533afd', success: '#15be53',
    warning: '#9b6829', magenta: '#f96bee', dark: 'rgba(255,255,255,0.5)',
  };

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '1px 7px', borderRadius: 4,
    fontSize: 11, fontWeight: 400, lineHeight: '1.6',
    fontFamily: "'DM Sans', sans-serif",
    fontFeatureSettings: '"ss01"',
    whiteSpace: 'nowrap',
    ...tagBadgeStyles[variant],
  };

  return (
    <span style={base}>
      {dot && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
          background: dotColors[variant],
        }} />
      )}
      {children}
    </span>
  );
};

const InfoTag = ({ label, color }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 8px', borderRadius: 4,
    fontSize: 11, fontWeight: 400, lineHeight: '1.5',
    fontFamily: "'DM Sans', sans-serif", fontFeatureSettings: '"ss01"',
    background: '#f0f4f8', color: '#273951', border: '1px solid #e5edf5',
  }}>
    {color && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />}
    {label}
  </span>
);

Object.assign(window, { TagBadge, InfoTag });
