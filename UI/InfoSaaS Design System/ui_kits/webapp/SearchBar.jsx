// SearchBar.jsx — global search component

const SearchBar = ({ value, onChange, placeholder = '정보 검색...', style }) => {
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#64748d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300,
          fontFeatureSettings: '"ss01"', color: '#061b31',
          border: '1px solid #e5edf5', borderRadius: 4, outline: 'none',
          background: '#fff', transition: 'border-color 150ms, box-shadow 150ms',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#533afd';
          e.target.style.boxShadow = '0 0 0 2px rgba(83,58,253,0.12)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e5edf5';
          e.target.style.boxShadow = 'none';
        }}
      />
      <span style={{
        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
        fontSize: 10, color: '#64748d', fontFamily: "'Source Code Pro', monospace",
        background: '#f0f4f8', border: '1px solid #e5edf5', borderRadius: 3,
        padding: '1px 5px', lineHeight: '1.4',
      }}>⌘K</span>
    </div>
  );
};

Object.assign(window, { SearchBar });
