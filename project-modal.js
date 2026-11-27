(() => {
  'use strict';
  const projects = window.PORTFOLIO_PROJECTS;
  if (!Array.isArray(projects) || !projects.length) return;
  const byId = new Map(projects.map(project => [project.id, project]));
  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.setAttribute('aria-labelledby', 'pm-title');
  dialog.innerHTML = `
    <header class="pm-header">
      <h2 id="pm-title">프로젝트</h2>
      <label class="pm-sr-only" for="pm-project-select">다른 프로젝트 보기</label>
      <select id="pm-project-select"></select>
      <button type="button" class="pm-close" aria-label="프로젝트 상세 닫기" autofocus><span aria-hidden="true"></span></button>
    </header>
    <div class="pm-scroll">
      <div class="pm-overview">
        <p class="pm-role"></p><p class="pm-company"></p><p class="pm-description"></p>
        <div class="pm-technologies" aria-label="주요 사용 기술"></div>
        <div class="pm-live"></div>
      </div>
      <section class="pm-media" aria-label="프로젝트 시각 자료">
        <div class="pm-visual-tabs" role="tablist" aria-label="프로젝트 자료 선택"></div>
        <div class="pm-visual-panel" id="pm-visual-panel" role="tabpanel" tabindex="0"></div>
        <p class="pm-visual-caption"></p>
      </section>
      <div class="pm-story-content"></div>
    </div>`;
  document.body.append(dialog);
  const $ = selector => dialog.querySelector(selector);
  const select = $('#pm-project-select');
  for (const project of projects) select.add(new Option(`${project.title} · ${project.category}`, project.id));
  let current = null;
  let lastTrigger = null;
  let pushedEntry = false;
  let priorOverflow = '';
  let visuals = [];
  const visualPanels = new Map();
  const trialCleanups = [];
  function clearVisuals() {
    trialCleanups.splice(0).forEach(cleanup => cleanup());
    visualPanels.clear();
    $('#pm-visual-panel').replaceChildren();
  }
  function makeOfficeTrial() {
    const wrapper = document.createElement('div');
    wrapper.className = 'pm-editor-trial';
    wrapper.innerHTML = `<div class="pm-editor-tools"><span>Word 에디터 체험</span><div><button type="button">다시 시작</button><a target="_blank" rel="noopener noreferrer">크게 열기 ↗</a></div></div><div class="pm-editor-stage"><iframe title="직접 사용해보는 GAIA Office Word 에디터" allow="clipboard-read; clipboard-write"></iframe><div class="pm-editor-loading" role="status">에디터를 준비하고 있습니다…</div></div>`;
    const frame = wrapper.querySelector('iframe');
    const status = wrapper.querySelector('[role="status"]');
    const base = new URL('https://word-playground-jarvis-6e754e99.vercel.app/');
    wrapper.querySelector('a').href = base.href;
    let token;
    let timeout;
    function start() {
      clearTimeout(timeout);
      token = crypto.randomUUID();
      status.hidden = false;
      status.textContent = '에디터를 준비하고 있습니다…';
      const url = new URL(base);
      url.searchParams.set('portfolioEmbed', '1');
      url.searchParams.set('portfolioOrigin', location.origin);
      url.searchParams.set('portfolioToken', token);
      frame.src = url.href;
      timeout = setTimeout(() => {
        status.textContent = '에디터에 연결하지 못했습니다. 위의 다시 시작을 눌러주세요.';
      }, 30000);
    }
    function ready(event) {
      if (event.origin !== base.origin || event.source !== frame.contentWindow ||
          event.data?.type !== 'superoffice-preview-ready' || event.data.token !== token) return;
      clearTimeout(timeout);
      status.hidden = true;
    }
    window.addEventListener('message', ready);
    wrapper.querySelector('button').addEventListener('click', start);
    trialCleanups.push(() => {
      clearTimeout(timeout);
      window.removeEventListener('message', ready);
      frame.src = 'about:blank';
    });
    start();
    return wrapper;
  }
  const withProject = id => {
    const url = new URL(location.href);
    if (id) url.searchParams.set('project', id);
    else url.searchParams.delete('project');
    return url;
  };
  function renderVisual(index, focus = false) {
    const visual = visuals[index];
    const tabs = [...dialog.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    let panel = visualPanels.get(index);
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'pm-visual-item';
      // Only locally authored project content is rendered here.
      if (visual.kind === 'officeTrial') panel.append(makeOfficeTrial());
      else panel.innerHTML = visual.html;
      visualPanels.set(index, panel);
      $('#pm-visual-panel').append(panel);
    }
    visualPanels.forEach((item, i) => { item.hidden = i !== index; });
    $('#pm-visual-panel').setAttribute('aria-labelledby', tabs[index].id);
    $('.pm-visual-caption').textContent = visual.caption;
    if (focus) tabs[index].focus();
  }
  function hide() {
    if (!dialog.open) return;
    dialog.close();
    clearVisuals();
    document.body.style.overflow = priorOverflow;
    current = null;
    pushedEntry = false;
    if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  }
  function show(id, { mode = 'push', trigger = null } = {}) {
    const project = byId.get(id);
    if (!project) return;
    const wasOpen = dialog.open;
    if (!wasOpen) lastTrigger = trigger || document.activeElement;
    if (mode === 'push' && !wasOpen) {
      history.pushState({ ...history.state, portfolioModal: true }, '', withProject(id));
      pushedEntry = true;
    } else if (mode !== 'none') {
      history.replaceState(history.state, '', withProject(id));
    } else {
      pushedEntry = Boolean(history.state?.portfolioModal);
    }
    clearVisuals();
    current = id;
    visuals = project.visuals;
    $('#pm-title').textContent = project.title;
    select.value = id;
    $('.pm-role').textContent = project.role;
    $('.pm-company').textContent = `${project.company} · ${project.category}`;
    $('.pm-description').textContent = project.subtitle;
    $('.pm-technologies').replaceChildren(...project.tags.map(text => {
      const tag = document.createElement('span'); tag.textContent = text; return tag;
    }));
    $('.pm-live').replaceChildren();
    if (project.live) {
      const link = document.createElement('a');
      link.href = project.live; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = 'Live ↗'; $('.pm-live').append(link);
    }
    const tabs = $('.pm-visual-tabs');
    tabs.replaceChildren(...visuals.map((visual, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.id = `pm-tab-${i}`;
      button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', 'pm-visual-panel');
      button.textContent = visual.label;
      button.addEventListener('click', () => renderVisual(i));
      button.addEventListener('keydown', event => {
        const last = visuals.length - 1;
        const destinations = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last };
        if (event.key in destinations) { event.preventDefault(); renderVisual(destinations[event.key], true); }
      });
      return button;
    }));
    renderVisual(0);
    $('.pm-story-content').innerHTML = project.body;
    if (!wasOpen) {
      priorOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      $('.pm-close').focus({ preventScroll: true });
    }
    $('.pm-scroll').scrollTop = 0;
  }
  function close() {
    if (pushedEntry) history.back();
    else {
      history.replaceState(history.state, '', withProject(null));
      hide();
    }
  }
  $('.pm-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  select.addEventListener('change', () => show(select.value, { mode: 'replace' }));
  document.querySelectorAll('[data-project]').forEach(link => {
    if (!byId.has(link.dataset.project)) return;
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); show(link.dataset.project, { trigger: link });
    });
  });
  window.addEventListener('popstate', () => {
    const id = new URL(location.href).searchParams.get('project');
    if (byId.has(id)) show(id, { mode: 'none' });
    else hide();
  });
  const initial = new URL(location.href).searchParams.get('project');
  if (byId.has(initial)) show(initial, { mode: 'none' });
})();
