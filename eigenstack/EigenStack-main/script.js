// ============ CARD CONTENT (in-house skin) ============
const cards = {
  E1: {
    title: '// E1 — NAVIDSTAD',
    body: `
      <p class="tag">The demon-mode trio. Paper name retained.</p>
      <p>Spine: <strong>The Almanack of Naval Ravikant</strong> (Jorgenson)<br>
      Slot 2: [UNLOCKED] · Slot 3: [UNLOCKED]</p>
      <h2>Core axioms (spine)</h2>
      <ul>
        <li>Seek wealth, not money or status. Wealth = assets that earn while you sleep.</li>
        <li>Productize yourself: specific knowledge + accountability + leverage.</li>
        <li>Code and media are permissionless leverage — the army of robots is packed in data centers. Use it.</li>
        <li>Play long-term games with long-term people. All returns come from compound interest.</li>
        <li>Earn with your mind, not your time.</li>
        <li>If you cannot decide, the answer is no.</li>
      </ul>
      <h2>Peace side</h2>
      <ul>
        <li>Happiness is a choice and a skill — not something you inherit.</li>
        <li>Desire is a contract you make with yourself to be unhappy until you get what you want.</li>
        <li>Peace is happiness at rest; happiness is peace in motion.</li>
        <li>Impatience with actions, patience with results.</li>
      </ul>
      <h2>Slots (vetting, from the spine's own list)</h2>
      <ul>
        <li>Slot 2 candidates: <em>Poor Charlie's Almanack</em> · <em>Skin in the Game</em></li>
        <li>Slot 3 candidates: <em>Meditations</em> · <em>The Beginning of Infinity</em></li>
      </ul>
      <p class="feeds">FEEDS → KEYSTONE (wealth engine) · EIGEN (mindset)</p>`
  },
  E2: {
    title: '// E2 — CHEM / NUKE / SOLAR',
    body: `
      <p class="tag">The physical laws shelf.</p>
      <p>Chem anchor: <strong>Organic Chemistry as a Second Language</strong> (Klein, 4e)</p>
      <h2>The 15 essentials</h2>
      <ol>
        <li>Bond-line drawings</li><li>Resonance</li><li>Acid–base (ARIO)</li>
        <li>Geometry / hybridization</li><li>Nomenclature</li><li>Conformations</li>
        <li>Configurations (R/S, E/Z)</li><li>Mechanisms</li><li>Substitution</li>
        <li>Elimination</li><li>Addition</li><li>Alkynes</li><li>Alcohols</li>
        <li>Ethers & epoxides</li><li>Synthesis / retrosynthesis</li>
      </ol>
      <h2>Field notes (Klein)</h2>
      <ul>
        <li>Not memorization — one long story. Learn the plot; the terminology follows.</li>
        <li>Resonance, two commandments: never break a single bond; never exceed an octet.</li>
        <li>Acidity: ARIO — Atom, Resonance, Induction, Orbital.</li>
        <li>Mechanisms, four patterns: nucleophilic attack, proton transfer, loss of a leaving group, rearrangement.</li>
        <li>SN1 vs SN2: weigh electrophile, nucleophile, leaving group, solvent.</li>
        <li>Margin: hydrogen bonds are "temporary, or fleeting" — covalent bonds hold. The foundation agrees.</li>
      </ul>
      <h2>Nuke (vetting)</h2>
      <ul><li><em>Introduction to Nuclear Science</em> — Lewins</li></ul>
      <h2>Solar (vetting)</h2>
      <ul><li><em>Solar Electricity Basics</em> — Pavey</li>
      <li><em>Practical Handbook of Photovoltaics</em> (heavier)</li></ul>
      <p class="feeds">FEEDS → BASELINE (engineering) · EIGEN (first principles)</p>`
  },
  E3: {
    title: '// E3 — HANDIBOOK',
    body: `
      <p class="tag">The access layer. Hands / physical / digital bridge.</p>
      <p>Anchor: <strong>Practical Lock Picking — A Physical Penetration Tester's
      Training Guide</strong> — Deviant Ollam</p>
      <h2>Doors (rotate if one rots)</h2>
      <ul>
        <li>Primary: <a href="https://github.com/0x00ctrl/CyberSec-Books" target="_blank" rel="noopener">github.com/0x00ctrl/CyberSec-Books</a></li>
        <li>Alt: search "Practical Lock Picking Deviant Ollam"</li>
      </ul>
      <h2>Why this card exists</h2>
      <p>External repos can vanish. This card cannot.<br>
      The card is the bone; the links are doors.<br>
      If a door rots, re-point it here. One line, one commit.</p>
      <h2>Scope</h2>
      <ul><li>Locks, bypasses, physical security</li>
      <li>Hardware literacy → system literacy</li>
      <li>The body is the first perimeter; the door is the second</li></ul>
      <p class="feeds">FEEDS → BASELINE (build the portals) · AXIOM (real-world access)</p>`
  },
  E4: {
    title: '// E4 — WORK-STACK',
    body: `
      <p class="tag">The core engine. 33 pages, backnull-coded.</p>
      <p>Naming: <code>NN_backnull.md</code> per page (e.g. 26backnull)</p>
      <h2>Stack 6 — Infrastructure</h2>
      <ul>
        <li>Dixit & Nalebuff — <em>The Art of Strategy</em></li>
        <li>Greene — <em>The 33 Strategies of War</em></li>
      </ul>
      <h2>Stack 8 — Structural Power</h2>
      <ul>
        <li>Scott — <em>Seeing Like a State</em></li>
        <li>Caro — <em>The Power Broker</em></li>
        <li>Fisher — <em>Capitalist Realism</em></li>
        <li>Graeber — <em>Bullshit Jobs</em></li>
        <li>Sandel — <em>The Tyranny of Merit</em></li>
      </ul>
      <h2>Stack 9 — Money / Psychology</h2>
      <ul><li>[transcribing]</li></ul>
      <h2>Status</h2>
      <ul><li>Pages 1–33 photographed (Discord, 07/17)</li>
      <li>Transcription: PENDING — Day 3 excavation</li></ul>
      <p class="feeds">FEEDS → AXIOM (execution) · KEYSTONE (leverage)</p>`
  }
};

// ============ CONSTELLATION (4 vertices, no center) ============
const nodes = [
  { id: 'E1', label: 'NAVIDSTAD',   x: 400, y: 140 },
  { id: 'E2', label: 'CHEM / NUKE', x: 620, y: 300 },
  { id: 'E3', label: 'HANDIBOOK',   x: 400, y: 460 },
  { id: 'E4', label: 'WORK-STACK',  x: 180, y: 300 }
];

const links = [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]];

const edgesGroup = document.getElementById('edges');
const verticesGroup = document.getElementById('vertices');

links.forEach(([a, b]) => {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', nodes[a].x);
  line.setAttribute('y1', nodes[a].y);
  line.setAttribute('x2', nodes[b].x);
  line.setAttribute('y2', nodes[b].y);
  line.setAttribute('class', 'edge-line');
  edgesGroup.appendChild(line);
});

nodes.forEach(node => {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', 'node-group');
  group.style.cursor = 'pointer';

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', node.x);
  circle.setAttribute('cy', node.y);
  circle.setAttribute('r', 35);
  circle.setAttribute('class', 'node-circle');

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', node.x);
  text.setAttribute('y', node.y);
  text.setAttribute('class', 'node-text');
  text.textContent = node.id;

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', node.x);
  label.setAttribute('y', node.y + 55);
  label.setAttribute('class', 'node-label');
  label.textContent = node.label;

  group.appendChild(circle);
  group.appendChild(text);
  group.appendChild(label);
  group.addEventListener('click', () => openCard(node.id));
  verticesGroup.appendChild(group);
});

// ============ CARD VIEW (guarded, never kills the constellation) ============
const cardView  = document.getElementById('card-view');
const cardTitle = document.getElementById('card-title');
const cardBody  = document.getElementById('card-body');
const cardClose = document.getElementById('card-close');

function openCard(id) {
  if (!cardView) return;
  cardTitle.textContent = cards[id].title;
  cardBody.innerHTML = cards[id].body;
  cardBody.scrollTop = 0;
  cardView.classList.remove('hidden');
}
function closeCard() {
  if (!cardView) return;
  cardView.classList.add('hidden');
}
if (cardClose) cardClose.addEventListener('click', closeCard);
if (cardView) cardView.addEventListener('click', e => { if (e.target === cardView) closeCard(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
