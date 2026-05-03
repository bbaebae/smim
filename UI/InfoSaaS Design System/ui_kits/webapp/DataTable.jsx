// DataTable.jsx — tabular data view for info items

const DataTable = ({ items, starred, onStar, onRowClick }) => {
  const [sortCol, setSortCol] = React.useState('date');
  const [sortDir, setSortDir] = React.useState('desc');

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span style={{ color: '#e5edf5', marginLeft: 3, fontSize: 9 }}>↕</span>;
    return <span style={{ color: '#533afd', marginLeft: 3, fontSize: 9 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const thStyle = (col) => ({
    padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
    fontSize: 11, fontWeight: 500, color: sortCol === col ? '#533afd' : '#64748d',
    fontFamily: "'DM Sans', sans-serif", fontFeatureSettings: '"ss01"',
    userSelect: 'none', whiteSpace: 'nowrap',
    borderBottom: '1px solid #e5edf5',
    background: '#fafbfd',
  });

  const TYPE_LABELS = { doc: '문서', note: '노트', link: '링크', data: '데이터' };
  const TYPE_COLORS = { doc: '#533afd', note: '#1c1e54', link: '#2874ad', data: '#108c3d' };

  return (
    <div style={{ border: '1px solid #e5edf5', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: 32 }} />
          <col style={{ width: '38%' }} />
          <col style={{ width: 70 }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 80 }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...thStyle(), cursor: 'default', paddingLeft: 12 }}></th>
            <th style={thStyle('title')} onClick={() => handleSort('title')}>제목 <SortIcon col="title" /></th>
            <th style={thStyle('type')} onClick={() => handleSort('type')}>유형 <SortIcon col="type" /></th>
            <th style={thStyle('tags')}>태그</th>
            <th style={thStyle('date')} onClick={() => handleSort('date')}>수정일 <SortIcon col="date" /></th>
            <th style={thStyle('status')}>상태</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}
              onClick={() => onRowClick && onRowClick(item)}
              style={{ cursor: 'pointer', transition: 'background 100ms' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafd'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <td style={{ padding: '9px 8px 9px 12px', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', verticalAlign: 'middle' }}>
                <button
                  onClick={e => { e.stopPropagation(); onStar && onStar(item.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: starred?.has(item.id) ? '#533afd' : '#e5edf5', display: 'flex' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={starred?.has(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              </td>
              <td style={{ padding: '9px 12px', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DocIcon type={item.type} size={22} />
                  <span style={{ fontSize: 13, fontWeight: 400, color: '#061b31', fontFeatureSettings: '"ss01"', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                </div>
              </td>
              <td style={{ padding: '9px 12px', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', verticalAlign: 'middle' }}>
                <span style={{ fontSize: 11, color: TYPE_COLORS[item.type], fontFeatureSettings: '"ss01"', fontFamily: "'DM Sans', sans-serif" }}>{TYPE_LABELS[item.type]}</span>
              </td>
              <td style={{ padding: '9px 12px', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>
                  {item.tags && item.tags.slice(0, 2).map(tag => <InfoTag key={tag} label={tag} />)}
                </div>
              </td>
              <td style={{ padding: '9px 12px', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', verticalAlign: 'middle' }}>
                <span style={{ fontSize: 11, color: '#64748d', fontFeatureSettings: '"tnum"', fontFamily: "'DM Sans', sans-serif", fontVariantNumeric: 'tabular-nums' }}>{item.date}</span>
              </td>
              <td style={{ padding: '9px 12px', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', verticalAlign: 'middle' }}>
                <TagBadge variant={item.status === '활성' ? 'success' : 'default'} dot>{item.status || '일반'}</TagBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Object.assign(window, { DataTable });
