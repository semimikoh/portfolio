(() => {
  'use strict';
  const root = document.querySelector('[data-demo]');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };

  if (root.dataset.demo === 'graph') {
    const canvas = $('#graph-canvas');
    const ctx = canvas.getContext('2d');
    const stage = $('#graph-stage');
    const scene = $('#graph-scene');
    const layer = $('#graph-dom-layer');
    const world = { width: 900, height: 400 };
    const state = { count: 96, zoom: 0.8, recent: [], selected: null };
    let nodes = [];
    const statuses = ['정상', '정상', '실행 중', '대기'];
    const isCanvasMode = () => state.count > 60 && state.zoom <= 1.1;
    function buildNodes() {
      const cols = state.count === 160 ? 16 : state.count === 24 ? 6 : 12;
      const rows = Math.ceil(state.count / cols);
      const width = Math.min(88, 820 / cols - 14);
      const height = 27;
      nodes = Array.from({ length: state.count }, (_, i) => ({
        id: `resource-${i + 1}`, name: `리소스 ${String(i + 1).padStart(2, '0')}`,
        cols, x: 35 + (i % cols) * (830 / cols), y: 22 + Math.floor(i / cols) * (354 / rows),
        width, height, status: statuses[i % statuses.length],
      }));
      const select = $('#graph-select');
      select.replaceChildren(new Option('리소스를 선택하세요', ''));
      nodes.forEach(node => select.add(new Option(node.name, node.id)));
    }
    function fitScene() {
      const fit = Math.min(stage.clientWidth / world.width, stage.clientHeight / world.height, 1);
      scene.style.transform = `translate(-50%, -50%) scale(${fit * state.zoom})`;
    }
    function showInfo() {
      const info = $('#graph-node-info');
      info.replaceChildren();
      const node = nodes.find(n => n.id === state.selected);
      $('#graph-select').value = node?.id || '';
      if (!node) {
        info.append(el('p', '노드를 선택하면 이름·상태와 상세 메뉴를 확인할 수 있습니다.'));
        return;
      }
      const heading = el('div', undefined, 'node-info-heading');
      heading.append(el('strong', node.name), el('span', node.status, 'node-status'));
      const detail = el('button', '상세 정보');
      detail.type = 'button';
      detail.setAttribute('aria-expanded', 'false');
      detail.setAttribute('aria-controls', 'node-detail-content');
      const content = el('p', `${node.name} · 예시 애플리케이션 / ${node.status}`, 'node-detail-content');
      content.id = 'node-detail-content';
      content.hidden = true;
      detail.addEventListener('click', () => {
        content.hidden = !content.hidden;
        detail.setAttribute('aria-expanded', String(!content.hidden));
      });
      const clear = el('button', '선택 해제');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        state.recent = state.recent.filter(id => id !== state.selected);
        state.selected = null;
        render(); showInfo();
      });
      const actions = el('div', undefined, 'node-actions');
      actions.append(detail, clear);
      info.append(heading, actions, content);
    }
    function selectNode(id, focus = false) {
      if (!nodes.some(n => n.id === id)) return;
      state.selected = id;
      state.recent = [...state.recent.filter(item => item !== id), id].slice(-12);
      render(); showInfo();
      if (focus) layer.querySelector(`[data-node-id="${id}"]`)?.focus({ preventScroll: true });
    }
    function render() {
      fitScene();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = world.width * dpr;
      canvas.height = world.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, world.width, world.height);
      const useCanvas = isCanvasMode();
      const domNodes = useCanvas ? nodes.filter(n => state.recent.includes(n.id)) : nodes;
      const domIds = new Set(domNodes.map(n => n.id));
      ctx.strokeStyle = '#d9dfe5';
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        if (!i) return;
        const parent = nodes[i % node.cols === 0 ? Math.max(0, i - node.cols) : i - 1];
        ctx.beginPath();
        ctx.moveTo(parent.x + parent.width / 2, parent.y + parent.height);
        ctx.lineTo(node.x + node.width / 2, node.y);
        ctx.stroke();
      });
      for (const node of nodes) {
        if (!useCanvas || domIds.has(node.id)) continue;
        ctx.fillStyle = '#f0f3f6';
        ctx.strokeStyle = '#bbc5cf';
        ctx.fillRect(node.x, node.y, node.width, node.height);
        ctx.strokeRect(node.x, node.y, node.width, node.height);
        ctx.fillStyle = '#516172';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(Number(node.id.split('-')[1])).padStart(2, '0'), node.x + node.width / 2, node.y + node.height / 2);
      }
      layer.replaceChildren();
      domNodes.forEach(node => {
        const button = el('button', String(Number(node.id.split('-')[1])).padStart(2, '0'), 'graph-dom-node');
        button.type = 'button'; button.dataset.nodeId = node.id;
        button.setAttribute('aria-label', `${node.name}, ${node.status}`);
        button.setAttribute('aria-pressed', String(node.id === state.selected));
        Object.assign(button.style, { left: `${node.x}px`, top: `${node.y}px`, width: `${node.width}px`, height: `${node.height}px` });
        button.addEventListener('click', () => selectNode(node.id, true));
        layer.append(button);
      });
      $('#graph-mode').textContent = useCanvas ? 'Canvas + DOM' : 'DOM';
      $('#graph-canvas-count').textContent = String(useCanvas ? nodes.length - domNodes.length : 0);
      $('#graph-dom-count').textContent = String(domNodes.length);
      $('#graph-zoom-value').textContent = `${Math.round(state.zoom * 100)}%`;
      $('.stage-hint').hidden = Boolean(state.selected);
    }
    canvas.addEventListener('click', event => {
      const node = [...nodes].reverse().find(n => event.offsetX >= n.x && event.offsetX <= n.x + n.width && event.offsetY >= n.y && event.offsetY <= n.y + n.height);
      if (node) selectNode(node.id);
    });
    $('#graph-count').addEventListener('change', event => {
      state.count = Number(event.target.value); state.recent = []; state.selected = null;
      buildNodes(); render(); showInfo();
    });
    $('#graph-zoom').addEventListener('input', event => { state.zoom = Number(event.target.value) / 100; render(); });
    $('#graph-select').addEventListener('change', event => {
      if (event.target.value) selectNode(event.target.value);
    });
    $('#graph-reset').addEventListener('click', () => {
      Object.assign(state, { count: 96, zoom: 0.8, recent: [], selected: null });
      $('#graph-count').value = '96'; $('#graph-zoom').value = '80';
      buildNodes(); render(); showInfo();
    });
    new ResizeObserver(fitScene).observe(stage);
    buildNodes(); render();
  }

  if (root.dataset.demo === 'form') {
    let type = 'basic';
    const form = $('#entry-demo');
    const names = { basic: '응모 안내', group: '동반인 정보', member: '회원 자격' };
    const labels = { basic: '일반 응모', group: '동반인 응모', member: '회원 한정' };
    function clearErrors() {
      root.querySelectorAll('.field-error').forEach(node => { node.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(node => node.removeAttribute('aria-invalid'));
    }
    function error(input, errorId, message) {
      input.setAttribute('aria-invalid', 'true');
      $(errorId).textContent = message;
    }
    root.querySelectorAll('[data-form-type]').forEach(button => button.addEventListener('click', () => {
      type = button.dataset.formType;
      root.querySelectorAll('[data-form-type]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      for (const key of ['basic', 'group', 'member']) {
        const section = $(`#entry-${key}-fields`);
        section.hidden = key !== type;
        section.querySelectorAll('input').forEach(input => { input.disabled = key !== type; });
      }
      $('#entry-extra-title').replaceChildren(document.createTextNode(names[type] + ' '), el('span', '유형별'));
      $('#entry-section-name').replaceChildren(document.createTextNode(names[type] + ' '), el('span', labels[type]));
      clearErrors();
      $('#entry-result').classList.remove('is-success');
      $('#entry-result').textContent = `${labels[type]}의 필수 조건으로 검증합니다. 공통 입력은 유지됩니다.`;
    }));
    $('#entry-fill').addEventListener('click', () => {
      $('#entry-title').value = '봄밤의 콘서트';
      $('#entry-email').value = 'ticket@example.com';
      $('#entry-start').value = '2026-12-01'; $('#entry-end').value = '2026-12-07';
      if (type === 'group') $('#entry-companions').value = '2';
      if (type === 'member') $('#entry-member').value = 'FAN-2026';
      clearErrors();
      $('#entry-result').classList.remove('is-success');
      $('#entry-result').textContent = '예시를 채웠습니다. 입력값 확인을 눌러보세요.';
    });
    form.addEventListener('submit', event => {
      event.preventDefault(); clearErrors();
      const title = $('#entry-title'), email = $('#entry-email');
      const start = $('#entry-start'), end = $('#entry-end');
      if (!title.value.trim()) error(title, '#entry-title-error', '공연명을 입력해주세요.');
      if (!email.value.trim() || !email.validity.valid) error(email, '#entry-email-error', '올바른 이메일을 입력해주세요.');
      if (!start.value || !end.value || start.value > end.value) {
        error(start, '#entry-date-error', '시작일과 종료일을 확인해주세요.');
        end.setAttribute('aria-invalid', 'true');
      }
      if (type === 'group') {
        const input = $('#entry-companions');
        if (!input.value || !Number.isInteger(Number(input.value)) || Number(input.value) < 1 || Number(input.value) > 3) error(input, '#entry-companions-error', '동반인은 1~3명으로 입력해주세요.');
      }
      if (type === 'member') {
        const input = $('#entry-member');
        if (!input.value.trim()) error(input, '#entry-member-error', '회원 번호를 입력해주세요.');
      }
      const invalid = form.querySelector('[aria-invalid="true"]');
      const result = $('#entry-result');
      result.classList.toggle('is-success', !invalid);
      if (invalid) {
        result.textContent = '입력 조건을 확인해주세요. 현재 유형에 필요한 항목만 검증합니다.';
        invalid.focus(); return;
      }
      result.replaceChildren(el('strong', '입력 조건을 모두 만족했습니다.'), el('p', `${title.value.trim()} · ${labels[type]}`), el('p', `${start.value} ~ ${end.value}`));
      if (type === 'group') result.append(el('p', `동반인 ${$('#entry-companions').value}명`));
      if (type === 'member') result.append(el('p', `회원 번호 ${$('#entry-member').value.trim()}`));
    });
  }

  if (root.dataset.demo === 'paste') {
    const samples = {
      paragraph: '<div><p style="font-weight:700">우리 동네 음악회</p><p>이번 주말에는 <strong>작은 공연</strong>을 엽니다.<br><em>좋아하는 사람과 함께</em> 찾아와 주세요.</p></div>',
      table: '<div><p><strong>공연 안내</strong></p><table><tbody><tr><th>시간</th><th>프로그램</th></tr><tr><td>14:00</td><td><strong>피아노</strong> 독주</td></tr><tr><td>15:00</td><td>현악 합주</td></tr></tbody></table><ul><li>입장료 무료</li><li><em>시작 10분 전 입장</em></li></ul></div>',
      nested: '<table><tbody><tr><th>구분</th><th>세부 일정</th></tr><tr><td><strong>토요일</strong></td><td><p>오후 프로그램</p><table><tbody><tr><td>14:00</td><td>피아노</td></tr><tr><td>15:00</td><td>합주</td></tr></tbody></table></td></tr></tbody></table>',
    };
    const textarea = $('#paste-html');
    let source = '';
    const excluded = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'LINK', 'META', 'TEMPLATE']);
    // Parse inertly, then create only explicitly supported elements and text.
    function parse(input) { return new DOMParser().parseFromString(input, 'text/html').body; }
    function marksFor(node, inherited) {
      const marks = { ...inherited };
      if (['STRONG', 'B', 'TH'].includes(node.tagName) || /^(bold|[6-9]00)$/.test(node.style?.fontWeight || '')) marks.bold = true;
      if (['EM', 'I'].includes(node.tagName) || node.style?.fontStyle === 'italic') marks.italic = true;
      return marks;
    }
    function convert(node, inherited = {}) {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() ? [{ type: 'text', text: node.textContent, ...inherited }] : [];
      if (node.nodeType !== Node.ELEMENT_NODE || excluded.has(node.tagName)) return [];
      if (node.tagName === 'BR') return [{ type: 'break' }];
      const marks = marksFor(node, inherited);
      const children = [...node.childNodes].flatMap(child => convert(child, marks));
      const types = { P: 'paragraph', H1: 'paragraph', H2: 'paragraph', H3: 'paragraph', TABLE: 'table', TR: 'row', TD: 'cell', TH: 'cell', UL: 'list', OL: 'list', LI: 'listItem' };
      const type = types[node.tagName];
      if (!type) return children;
      return [{ type, ...(node.tagName === 'OL' ? { ordered: true } : {}), children }];
    }
    function renderModel(items) {
      const fragment = document.createDocumentFragment();
      const tags = { paragraph: 'p', table: 'table', row: 'tr', cell: 'td', list: 'ul', listItem: 'li', break: 'br' };
      for (const item of items) {
        if (item.type === 'text') {
          let node = document.createTextNode(item.text);
          if (item.italic) { const wrapper = el('em'); wrapper.append(node); node = wrapper; }
          if (item.bold) { const wrapper = el('strong'); wrapper.append(node); node = wrapper; }
          fragment.append(node); continue;
        }
        const node = el(item.ordered ? 'ol' : tags[item.type] || 'div');
        if (item.children) node.append(renderModel(item.children));
        fragment.append(node);
      }
      return fragment;
    }
    function safeSource(node) {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
      if (node.nodeType !== Node.ELEMENT_NODE || excluded.has(node.tagName)) return document.createDocumentFragment();
      const allowed = new Set(['P', 'DIV', 'SPAN', 'STRONG', 'B', 'EM', 'I', 'BR', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3']);
      const output = el(allowed.has(node.tagName) ? node.tagName.toLowerCase() : 'span');
      const marks = marksFor(node, {});
      if (marks.bold) output.style.fontWeight = '700';
      if (marks.italic) output.style.fontStyle = 'italic';
      [...node.childNodes].forEach(child => output.append(safeSource(child)));
      return output;
    }
    function resetOutput() {
      const placeholder = el('p', '‘에디터에 붙여넣기’를 누르면 변환 결과가 여기에 표시됩니다.', 'paste-placeholder');
      $('#paste-output').replaceChildren(placeholder);
      $('#paste-output').contentEditable = 'false';
      $('#paste-output').setAttribute('aria-readonly', 'true');
      $('#paste-model').textContent = '붙여넣기 후 문서 구조를 확인할 수 있습니다.';
      $('#paste-status').textContent = '문단의 굵기·기울임, 표와 목록의 구조를 확인해보세요.';
      root.querySelector('.demo-disclosure').open = false;
    }
    function applySource(input) {
      source = input;
      textarea.value = input;
      const parsed = parse(source);
      $('#paste-source').replaceChildren(...[...parsed.childNodes].map(safeSource));
      resetOutput();
    }
    $('#paste-sample').addEventListener('change', event => applySource(samples[event.target.value]));
    $('#paste-apply').addEventListener('click', () => applySource(textarea.value));
    $('#paste-reset').addEventListener('click', resetOutput);
    $('#paste-convert').addEventListener('click', () => {
      const model = { type: 'document', children: [...parse(source).childNodes].flatMap(node => convert(node)) };
      if (!model.children.length) { $('#paste-status').textContent = '변환할 텍스트나 표를 입력해주세요.'; return; }
      $('#paste-output').replaceChildren(renderModel(model.children));
      $('#paste-output').contentEditable = 'plaintext-only';
      $('#paste-output').setAttribute('aria-readonly', 'false');
      $('#paste-model').textContent = JSON.stringify(model, null, 2);
      const counts = { paragraph: 0, table: 0, list: 0 };
      const count = items => items.forEach(item => { if (item.type in counts) counts[item.type]++; if (item.children) count(item.children); });
      count(model.children);
      const parts = [['paragraph', '문단'], ['table', '표'], ['list', '목록']].filter(([key]) => counts[key]).map(([key, label]) => `${label} ${counts[key]}개`);
      $('#paste-status').textContent = `변환 완료 · ${parts.join(' · ') || '텍스트'} — 결과에서 내용을 직접 수정할 수 있습니다.`;
    });
    $('#paste-output').addEventListener('input', () => {
      const model = { type: 'document', children: [...$('#paste-output').childNodes].flatMap(node => convert(node)) };
      $('#paste-model').textContent = JSON.stringify(model, null, 2);
      $('#paste-status').textContent = '편집한 내용이 문서 모델에 반영되었습니다.';
    });
    applySource(samples.paragraph);
  }
})();
