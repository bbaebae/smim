// Sidebar.jsx — left navigation sidebar

const NAV_ITEMS = [
  { id: 'home',    icon: 'home',     label: '홈' },
  { id: 'library', icon: 'library',  label: '라이브러리' },
  { id: 'recent',  icon: 'clock',    label: '최근 항목' },
  { id: 'starred', icon: 'star',     label: '즐겨찾기' },
  { id: 'tags',    icon: 'tag',      label: '태그' },
  { id: 'shared',  icon: 'users',    label: '팀 공유' },
];

const SPACES = [
  { id: 'finance', label: '재무', color: '#533afd' },
  { id: 'product', label: '제품', color: '#15be53' },
  { id: 'hr',      label: '인사', color: '#ea2261' },
  { id: 'market',  label: '마케팅', color: '#9b6829' },
];

const Icon = ({ name, size = 16 }) => {
  const paths = {
    home:    <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    library: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    clock:   <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    star:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    tag:     <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    users:   <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    chevron: <polyline points="9 18 15 12 9 6"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const Sidebar = ({ activeNav, onNav, counts }) => {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: '#fff', borderRight: '1px solid #e5edf5',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e5edf5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: '#533afd', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#061b31', fontFeatureSettings: '"ss01"', letterSpacing: '-0.3px' }}>
            Info<span style={{ color: '#533afd' }}>SaaS</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: 4 }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => onNav(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: isActive ? 'rgba(83,58,253,0.08)' : 'transparent',
                color: isActive ? '#533afd' : '#273951',
                fontSize: 13, fontWeight: isActive ? 400 : 300,
                fontFamily: "'DM Sans', sans-serif", fontFeatureSettings: '"ss01"',
                textAlign: 'left', transition: 'background 120ms, color 120ms',
                marginBottom: 1,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f0f4f8'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6 }}><Icon name={item.icon} size={15} /></span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {counts && counts[item.id] && (
                  <span style={{ fontSize: 10, color: '#64748d', fontFeatureSettings: '"tnum"' }}>{counts[item.id]}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Spaces section */}
        <div style={{ marginTop: 16 }}>
          <div style={{
            fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#64748d', padding: '0 10px', marginBottom: 6,
          }}>스페이스</div>
          {SPACES.map(space => (
            <button key={space.id} onClick={() => onNav('space-' + space.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: activeNav === 'space-' + space.id ? 'rgba(83,58,253,0.06)' : 'transparent',
              color: '#273951', fontSize: 13, fontWeight: 300,
              fontFamily: "'DM Sans', sans-serif", fontFeatureSettings: '"ss01"',
              textAlign: 'left', transition: 'background 120ms', marginBottom: 1,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f4f8'}
            onMouseLeave={e => e.currentTarget.style.background = activeNav === 'space-' + space.id ? 'rgba(83,58,253,0.06)' : 'transparent'}
            >
              <span style={{ width: 8, height: 8, borderRadius: 2, background: space.color, flexShrink: 0 }} />
              {space.label}
            </button>
          ))}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#64748d', fontSize: 12, fontWeight: 300,
            fontFamily: "'DM Sans', sans-serif", fontFeatureSettings: '"ss01"',
            textAlign: 'left',
          }}>
            <Icon name="plus" size={12} /> 스페이스 추가
          </button>
        </div>
      </nav>

      {/* Bottom user area */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #e5edf5' }}>
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: 'transparent', transition: 'background 120ms',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f0f4f8'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: '#1c1e54',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>김</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#061b31', fontFeatureSettings: '"ss01"' }}>김지수</div>
            <div style={{ fontSize: 10, color: '#64748d', fontFeatureSettings: '"ss01"' }}>관리자</div>
          </div>
          <span style={{ marginLeft: 'auto', color: '#64748d' }}><Icon name="settings" size={13} /></span>
        </button>
      </div>
    </aside>
  );
};

Object.assign(window, { Sidebar, Icon });
