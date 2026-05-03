// InfoCard.jsx — information item card component

const TYPE_CONFIG = {
  doc:  { label: '문서', color: '#533afd', bg: 'rgba(83,58,253,0.08)' },
  note: { label: '노트', color: '#1c1e54', bg: 'rgba(28,30,84,0.07)' },
  link: { label: '링크', color: '#2874ad', bg: 'rgba(43,145,223,0.1)' },
  data: { label: '데이터', color: '#108c3d', bg: 'rgba(21,190,83,0.1)' },
};

const DocIcon = ({ type, size = 32 }) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.doc;
  const paths = {
    doc:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    note: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    data: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></>,
  };
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {paths[type] || paths.doc}
      </svg>
    </div>
  );
};

const InfoCard = ({ item, view = 'grid', onClick, starred, onStar }) => {
  const [hovered, setHovered] = React.useState(false);

  if (view === 'list') {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 16px', borderRadius: 4,
          border: '1px solid ' + (hovered ? '#b9b9f9' : '#e5edf5'),
          background: '#fff', cursor: 'pointer',
          transition: 'border-color 150ms, box-shadow 150ms',
          boxShadow: hovered ? 'rgba(23,23,23,0.06) 0px 3px 6px' : 'none',
          marginBottom: 4,
        }}
      >
        <DocIcon type={item.type} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 400, color: '#061b31', fontFeatureSettings: '"ss01"', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
          <div style={{ fontSize: 11, color: '#64748d', fontFeatureSettings: '"ss01"', marginTop: 1 }}>{item.desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {item.tags && item.tags.slice(0, 2).map(tag => <InfoTag key={tag} label={tag} />)}
        </div>
        <div style={{ fontSize: 11, color: '#64748d', fontFeatureSettings: '"tnum"', flexShrink: 0, minWidth: 80, textAlign: 'right' }}>{item.date}</div>
        <button onClick={e => { e.stopPropagation(); onStar && onStar(item.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: starred ? '#533afd' : '#64748d', opacity: starred ? 1 : 0.5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: '1px solid ' + (hovered ? '#b9b9f9' : '#e5edf5'),
        borderRadius: 6, padding: 16, cursor: 'pointer',
        transition: 'border-color 150ms, box-shadow 150ms',
        boxShadow: hovered ? 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px' : 'rgba(23,23,23,0.04) 0px 2px 4px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <DocIcon type={item.type} size={32} />
        <button onClick={e => { e.stopPropagation(); onStar && onStar(item.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: starred ? '#533afd' : '#64748d', opacity: starred ? 1 : 0.4, marginTop: -2 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 400, color: '#061b31', fontFeatureSettings: '"ss01"', lineHeight: 1.3, marginBottom: 4 }}>{item.title}</div>
        <div style={{ fontSize: 12, fontWeight: 300, color: '#64748d', fontFeatureSettings: '"ss01"', lineHeight: 1.4 }}>{item.desc}</div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 'auto' }}>
        {item.tags && item.tags.map(tag => <InfoTag key={tag} label={tag} />)}
      </div>
      <div style={{ borderTop: '1px solid #e5edf5', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#64748d', fontFeatureSettings: '"tnum"' }}>{item.date}</span>
        <TagBadge variant={item.status === '활성' ? 'success' : 'default'} dot>{item.status || '일반'}</TagBadge>
      </div>
    </div>
  );
};

Object.assign(window, { InfoCard, DocIcon });
