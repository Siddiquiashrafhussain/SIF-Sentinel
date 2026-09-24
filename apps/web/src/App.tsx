type MetricCard = {
  label: string;
  value: string;
  detail: string;
  tone?: 'blue' | 'red' | 'slate';
};

const stats: MetricCard[] = [
  { label: 'Total precursors', value: '1,428', detail: '↑ 4.2%', tone: 'blue' },
  { label: 'High SIF exposure', value: '438', detail: 'Critical', tone: 'red' },
  { label: 'Trend velocity', value: '-4.8%', detail: 'vs last month', tone: 'slate' },
];

const rows = [
  { id: 'SIF-0828', date: 'Oct 24, 2025', type: 'Unsafe Condition', site: 'Duliajan Rig #4', level: 'High SIF', lifeRule: 'Energy Isolation', score: 'High SIF', hazard: 'Line of fire' },
  { id: 'SIF-0841', date: 'Oct 23, 2025', type: 'Near Miss', site: 'Moran Field R-2', level: 'High SIF', lifeRule: 'Safe Lifting', score: 'High SIF', hazard: 'Dropped object' },
  { id: 'SIF-0799', date: 'Oct 21, 2025', type: 'Unsafe Act', site: 'Digboi Central P1', level: 'Critical High SIF', lifeRule: 'Bypassing Controls', score: 'Critical High SIF', hazard: 'Confined space' },
  { id: 'SIF-0782', date: 'Oct 20, 2025', type: 'Unsafe Condition', site: 'Moran Rig #7', level: 'SIF Potential', lifeRule: 'Work at Height', score: 'SIF Potential', hazard: 'Perimeter guard missing' },
  { id: 'SIF-0750', date: 'Oct 19, 2025', type: 'Unsafe Act', site: 'Jorhat Base Workshop', level: 'Non-SIF', lifeRule: 'Permit to Work', score: 'Non-SIF', hazard: 'Tooling issue' },
  { id: 'SIF-0733', date: 'Oct 17, 2025', type: 'Unsafe Act', site: 'Moran Field R-1', level: 'SIF Potential', lifeRule: 'Confined Space', score: 'SIF Potential', hazard: 'Poor ventilation' },
  { id: 'SIF-0712', date: 'Oct 16, 2025', type: 'Unsafe Condition', site: 'Duliajan Camp 1', level: 'Non-SIF', lifeRule: 'Hot Work', score: 'Non-SIF', hazard: 'Temporary work permits' },
];

const rules = [
  { name: 'Energy Isolation', count: 942, tag: 'Critical alert', tone: 'red' },
  { name: 'Line of Fire', count: 780, tag: 'High alert', tone: 'blue' },
  { name: 'Safe Mechanical Lifting', count: 512, tag: 'Normal', tone: 'slate' },
  { name: 'Work at Height', count: 430, tag: 'Monitored', tone: 'blue' },
  { name: 'Bypassing Safety Controls', count: 390, tag: 'Critical alert', tone: 'red' },
  { name: 'Hot Work', count: 210, tag: 'Normal', tone: 'slate' },
];

function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">
            <span className="shield" />
          </div>
          <div>
            <div className="brand-title">SIF-Sentinel</div>
            <div className="brand-subtitle">Oil India Limited</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">Reports</a>
          <a className="active" href="#">SIF Analysis</a>
          <a href="#">Life-Saving Rules</a>
          <a href="#">Barriers</a>
          <a href="#">Patterns</a>
          <a href="#">Sites</a>
          <a href="#">Review</a>
        </nav>

        <div className="bottom-actions">
          <div className="alert-pill">AI Engine v2.4</div>
          <div className="profile-card">
            <div className="avatar">R</div>
            <div>
              <div className="name">Rajesh Borah</div>
              <div className="role">Lead Safety Officer</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="search-box">Search reports, barriers, LSR...</div>
          </div>
          <div className="topbar-right">
            <button className="ghost-btn">Last 30 Days</button>
            <button className="ghost-btn">All Assets (Assam)</button>
            <div className="user-chip">R</div>
          </div>
        </header>

        <section className="panel hero">
          <div className="eyebrow">Precursor intelligence</div>
          <div className="title-row">
            <h1>SIF Analysis</h1>
            <div className="header-actions">
              <button className="ghost-btn small">Last 30 Days</button>
              <button className="ghost-btn small">All Activities</button>
              <button className="primary-btn small">Filter</button>
              <button className="ghost-btn small">Export Trend</button>
            </div>
          </div>
          <div className="stats-grid">
            {stats.map((card) => (
              <div key={card.label} className={`stat-card ${card.tone ?? ''}`}>
                <div className="stat-head">
                  <span className="stat-label">{card.label}</span>
                  {card.tone === 'red' && <span className="mini-icon">!</span>}
                </div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-detail">{card.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-grid">
          <div className="panel large-panel">
            <div className="section-head">
              <h2>SIF Trend</h2>
              <div className="segment-toggle">
                <span className="dot on" />
                <span>All observations</span>
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-grid">
                <span>1.5k</span>
                <span>1.0k</span>
                <span>0.5k</span>
              </div>
              <div className="line-chart">
                <div className="area" />
              </div>
            </div>
            <div className="chart-foot">
              <span>Precursor-to-incident ratio crated 2.1% in last 14 days</span>
              <span>Total: 2,814</span>
            </div>
          </div>

          <div className="panel side-panel">
            <div className="section-head">
              <h2>By Site & Field Asset</h2>
            </div>
            <ul className="asset-list">
              <li><span>Duliajan Central</span><strong>1,128</strong></li>
              <li><span>Moran Asset</span><strong>748</strong></li>
              <li><span>Digboi Oilfield</span><strong>569</strong></li>
              <li><span>Kumchai Rig</span><strong>394</strong></li>
            </ul>
          </div>
        </section>

        <section className="panel rule-panel">
          <div className="section-head">
            <h2>By Activity</h2>
            <span className="muted">Top 5 operational vectors impacting SIF potential</span>
          </div>
          <div className="activity-list">
            <div className="activity-row">
              <span className="rank">01</span>
              <span className="activity-name">Wheelbarrow Intervention</span>
              <div className="meter"><span style={{ width: '82%' }} /></div>
              <strong>842</strong>
            </div>
            <div className="activity-row">
              <span className="rank">02</span>
              <span className="activity-name">Pipe Handling &amp; Rig Floor</span>
              <div className="meter"><span style={{ width: '76%' }} /></div>
              <strong>620</strong>
            </div>
            <div className="activity-row">
              <span className="rank">03</span>
              <span className="activity-name">Heavy Mechanical Lifting</span>
              <div className="meter"><span style={{ width: '70%' }} /></div>
              <strong>498</strong>
            </div>
            <div className="activity-row">
              <span className="rank">04</span>
              <span className="activity-name">Confined Space Tank Entry</span>
              <div className="meter"><span style={{ width: '55%' }} /></div>
              <strong>332</strong>
            </div>
            <div className="activity-row">
              <span className="rank">05</span>
              <span className="activity-name">Work at Height</span>
              <div className="meter"><span style={{ width: '45%' }} /></div>
              <strong>210</strong>
            </div>
          </div>
        </section>

        <section className="panel rules-grid-panel">
          <div className="section-head">
            <h2>Life-Saving Rules</h2>
          </div>
          <div className="rules-grid">
            {rules.map((rule) => (
              <div key={rule.name} className={`rule-card ${rule.tone}`}>
                <div className="rule-top">
                  <span className="tag">{rule.tag}</span>
                  <span className="rule-icon" />
                </div>
                <h3>{rule.name}</h3>
                <div className="rule-stats">
                  <strong>{rule.count}</strong>
                  <span>Reports</span>
                </div>
                <div className="mini-row">
                  <span>SIF Rate</span>
                  <span>44.5%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel table-panel">
          <div className="section-head">
            <h2>Filtered reports</h2>
            <div className="table-actions">
              <button className="ghost-btn small">Mark as reviewed</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Shift &amp; Date</th>
                <th>Type</th>
                <th>Operations</th>
                <th>Asset &amp; Rig</th>
                <th>SIF Potential</th>
                <th>Detected LSR</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.date}</td>
                  <td>{row.type}</td>
                  <td>{row.hazard}</td>
                  <td>{row.site}</td>
                  <td><span className="badge">{row.score}</span></td>
                  <td>{row.lifeRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
