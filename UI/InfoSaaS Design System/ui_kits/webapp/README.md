# InfoSaaS Web App UI Kit

Interactive click-through prototype of the core SaaS information management application.

## Screens & Interactions

| Screen | How to reach |
|--------|-------------|
| Library (grid) | Default view — click the grid icon |
| Library (list) | Click the list icon in the toolbar |
| Library (table) | Click the table icon in the toolbar |
| Item detail | Click any card or row |
| Add item modal | Click "새 항목" button |
| Starred items | Click "즐겨찾기" in sidebar |
| Space filter | Click any space in the sidebar (재무, 제품, 인사, 마케팅) |
| Search | Type in the search bar — filters live |

## Components

| File | Description |
|------|-------------|
| `index.html` | Main app shell — loads all components |
| `Sidebar.jsx` | Left navigation: nav items, spaces, user area |
| `SearchBar.jsx` | Global search input with ⌘K hint |
| `InfoCard.jsx` | Grid and list card variants with star/click |
| `DataTable.jsx` | Sortable table view with type/tag columns |
| `TagBadge.jsx` | `<TagBadge>` and `<InfoTag>` reusable primitives |

## Design Notes

- Font: DM Sans (variable) substituting `sohne-var` — swap when available
- All shadows use the blue-tinted multi-layer formula from the system spec
- Nav uses `backdrop-filter: blur(12px)` on sticky header
- Typography uses `font-feature-settings: "ss01"` everywhere
- Tabular data uses `"tnum"` feature for numeric columns
- Border radius: 4px (cards, buttons), 6px (sidebar items, modal), 8px (modal container)
- No emoji used anywhere in system UI
