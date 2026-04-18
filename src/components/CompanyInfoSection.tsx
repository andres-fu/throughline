import type { CareerEntry, CompanyType, CompanyStage } from '../data/career'

const COMPANY_TYPES: CompanyType[] = ['enterprise', 'startup', 'gaming', 'consulting', 'agency']
const COMPANY_STAGES: CompanyStage[] = ['pre-product', 'early-startup', 'growth', 'scale-up', 'enterprise']

interface Props {
  draft: CareerEntry
  onChange: (patch: Partial<CareerEntry>) => void
}

const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', display: 'block', marginBottom: 4 }
const inputStyle = { width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 4, boxSizing: 'border-box' as const, fontFamily: 'inherit' }

export function CompanyInfoSection({ draft, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>COMPANY</label>
        <input
          data-testid="company-name-input"
          style={inputStyle}
          value={draft.company}
          onChange={e => onChange({ company: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>LOCATION</label>
        <input
          data-testid="location-input"
          style={inputStyle}
          value={draft.location}
          onChange={e => onChange({ location: e.target.value })}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>TYPE</label>
          <select
            data-testid="company-type-select"
            style={inputStyle}
            value={draft.companyType}
            onChange={e => onChange({ companyType: e.target.value as CompanyType })}
          >
            {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>STAGE</label>
          <select
            data-testid="company-stage-select"
            style={inputStyle}
            value={draft.companyStage}
            onChange={e => onChange({ companyStage: e.target.value as CompanyStage })}
          >
            {COMPANY_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
