const nodes = [
  { id: 'EIGEN',    label: 'RESEARCH',    x: 400, y: 150, url: 'index.html' },
  { id: 'AXIOM',    label: 'APPLICATION', x: 620, y: 300, url: '#' },
  { id: 'BASELINE', label: 'CREATIVE',    x: 400, y: 450, url: '#' },
  { id: 'KEYSTONE', label: 'FINANCE',     x: 180, y: 300, url: '#' }
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
  circle.setAttribute('r', 45);
  circle.setAttribute('class', 'node-circle');

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', node.x);
  text.setAttribute('y', node.y);
  text.setAttribute('class', 'node-text');
  text.textContent = node.id;

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', node.x);
  label.setAttribute('y', node.y + 65);
  label.setAttribute('class', 'node-label');
  label.textContent = node.label;

  group.appendChild(circle);
  group.appendChild(text);
  group.appendChild(label);

  group.addEventListener('click', () => {
    if (node.url.startsWith('http')) {
      window.open(node.url, '_blank');
    } else if (node.url !== '#') {
      window.location.href = node.url;
    } else {
      alert(`// STRATUM PENDING: ${node.label}\n\nPillar under construction. The skeleton holds.`);
    }
  });

  verticesGroup.appendChild(group);
});
