// 사진 속 수학 문제를 비전 AI로 읽고, 그림(SVG)과 함께 단계별로 설명하는 에이전트
(function () {
  const $ = id => document.getElementById(id);
  let imageData = null; // { mime, base64 }

  const MODELS = {
    gemini: ['gemini-3.8-flash', 'gemini-3.8-pro'],
    openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1'],
    anthropic: ['claude-sonnet-4-5', 'claude-opus-4-1', 'claude-3-5-haiku-latest']
  };

  // ---------- 설정 (AI 종류 / 모델 / 키) ----------
  function loadKey() {
    const p = $('provider-select').value;
    $('api-key').value = localStorage.getItem('key_' + p) || (window.AI_KEYS && window.AI_KEYS[p]) || '';
  }
  function loadModels() {
    const p = $('provider-select').value;
    $('model-select').innerHTML = MODELS[p].map(m => `<option value="${m}">${m}</option>`).join('');
    const saved = localStorage.getItem('model_' + p);
    if (saved && MODELS[p].includes(saved)) $('model-select').value = saved;
  }
  $('provider-select').value = localStorage.getItem('provider') || 'gemini';
  $('provider-select').addEventListener('change', () => {
    localStorage.setItem('provider', $('provider-select').value);
    loadModels(); loadKey();
  });
  $('model-select').addEventListener('change', () =>
    localStorage.setItem('model_' + $('provider-select').value, $('model-select').value));
  $('api-key').addEventListener('change', e =>
    localStorage.setItem('key_' + $('provider-select').value, e.target.value.trim()));
  loadModels(); loadKey();

  // ---------- 사진 입력 ----------
  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      imageData = { mime: file.type, base64: reader.result.split(',')[1] };
      $('preview').src = reader.result;
      $('preview').hidden = false;
      $('solve-btn').disabled = false;
      $('solution').innerHTML = '';
    };
    reader.readAsDataURL(file);
  }
  $('photo-input').addEventListener('change', e => loadFile(e.target.files[0]));
  const drop = $('drop-zone');
  ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => loadFile(e.dataTransfer.files[0]));
  document.addEventListener('paste', e => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (item) loadFile(item.getAsFile());
  });

  // ---------- AI 호출 ----------
  const PROMPT_BASE = `사진 속 수학 문제를 읽고, 학생이 이해하기 쉽도록 한국어로 단계별로 풀어주세요. 단계는 최대 6개로 간결하게 하세요.
수식(분수, 곱하기, 제곱 등)은 반드시 LaTeX로 쓰고 $...$ 로 감싸세요. 예: $y=-\\frac{1}{3}x$, $3 \\times 4$. JSON 문자열이므로 역슬래시는 두 번 쓰세요.
`;
  const PROMPT_SVG = `각 단계마다 핵심만 보여주는 아주 단순한 SVG 그림(도형, 그래프, 수직선 등)을 포함하세요. SVG는 요소 12개 이하로 짧게.
SVG 규칙: <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"> 로 시작, 어두운 배경 위에 보이도록 밝은 색(#e8ecff, #5eead4, #a78bfa, #fda4af) 사용, 글자는 text 태그, script/외부이미지 금지.
`;
  const FORMAT_SVG = `{"problem": "인식한 문제 원문", "steps": [{"title": "단계 제목", "explanation": "이 단계에서 무엇을 왜 하는지", "work": "계산식", "svg": "<svg ...>...</svg>"}], "answer": "최종 답"}`;
  const FORMAT_PLAIN = `{"problem": "인식한 문제 원문", "steps": [{"title": "단계 제목", "explanation": "이 단계에서 무엇을 왜 하는지", "work": "계산식"}], "answer": "최종 답"}`;
  const PROMPT_END = `
문제가 보이지 않으면 problem에 "인식 실패"라고 쓰고 steps는 빈 배열로 두세요.`;
  const buildPrompt = () => $('svg-toggle').checked
    ? PROMPT_BASE + PROMPT_SVG + '반드시 아래 JSON 형식으로만 답하세요.\n' + FORMAT_SVG + PROMPT_END
    : PROMPT_BASE + '반드시 아래 JSON 형식으로만 답하세요.\n' + FORMAT_PLAIN + PROMPT_END;

  // 응답이 없으면 120초 후 중단
  function fetchTimeout(url, opts, ms = 240000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...opts, signal: ctrl.signal })
      .catch(e => { throw new Error(e.name === 'AbortError' ? '응답 시간 초과 (240초). 모델을 바꾸거나 다시 시도하세요.' : '네트워크 오류: ' + e.message); })
      .finally(() => clearTimeout(t));
  }

  const callers = {
    async gemini(key, model, img) {
      // Interactions API
      const headers = { 'Content-Type': 'application/json', 'x-goog-api-key': key };
      const base = 'https://generativelanguage.googleapis.com/v1beta/interactions';
      const res = await fetchTimeout(base, {
        method: 'POST', headers,
        body: JSON.stringify({
          model,
          input: [
            { type: 'image', mime_type: img.mime, data: img.base64 },
            { type: 'text', text: buildPrompt() }
          ]
        })
      });
      let d = await res.json();
      console.log('Gemini response', d);
      if (!res.ok) throw new Error(d.error?.message || '요청 실패 (' + res.status + ')');
      // 비동기 처리(in_progress)일 때 완료될 때까지 폴링
      for (let n = 0; d.id && /^(in_progress|queued|running)$/i.test(d.status || '') && n < 60; n++) {
        await new Promise(r => setTimeout(r, 2000));
        const r2 = await fetchTimeout(`${base}/${d.id}`, { headers });
        d = await r2.json();
        if (!r2.ok) throw new Error(d.error?.message || '조회 실패 (' + r2.status + ')');
      }
      if (/^(failed|cancelled|error)$/i.test(d.status || '')) throw new Error('AI 처리 실패: ' + (d.error?.message || d.status));
      if (typeof d.output_text === 'string' && d.output_text) return d.output_text;
      const texts = [];
      const collect = list => (list || []).forEach(o => {
        if (typeof o.text === 'string') texts.push(o.text);
        collect(o.content);
      });
      collect(d.steps); collect(d.outputs);
      if (!texts.length) throw new Error('AI 응답에서 텍스트를 찾지 못했습니다 (콘솔 F12 확인)');
      return texts.join('');
    },
    async openai(key, model, img) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({
          model, response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: [
            { type: 'text', text: buildPrompt() },
            { type: 'image_url', image_url: { url: `data:${img.mime};base64,${img.base64}` } }
          ] }]
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || '요청 실패 (' + res.status + ')');
      return d.choices?.[0]?.message?.content || '';
    },
    async anthropic(key, model, img) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model, max_tokens: 8192,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: img.mime, data: img.base64 } },
            { type: 'text', text: buildPrompt() }
          ] }]
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || '요청 실패 (' + res.status + ')');
      return d.content?.map(c => c.text || '').join('') || '';
    }
  };

  function parseJson(text) {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('AI 응답을 해석할 수 없습니다');
    return JSON.parse(m[0]);
  }

  async function solve() {
    const provider = $('provider-select').value, model = $('model-select').value;
    const key = $('api-key').value.trim();
    const out = $('solution');
    if (!key) { showError('API 키를 입력하세요.'); return; }
    localStorage.setItem('key_' + provider, key);
    $('solve-btn').disabled = true;
    const t0 = Date.now();
    const tick = () => out.innerHTML = `<p class="loading">🤖 문제를 읽고 그림으로 풀이를 만드는 중... (${Math.floor((Date.now() - t0) / 1000)}초)</p>`;
    tick();
    const timer = setInterval(tick, 1000);
    try {
      render(parseJson(await callers[provider](key, model, imageData)));
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      clearInterval(timer);
      $('solve-btn').disabled = false;
    }
  }

  function showError(msg) {
    const out = $('solution');
    out.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'err'; p.textContent = '⚠ ' + msg;
    out.appendChild(p);
  }

  // ---------- 렌더링 ----------
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // AI가 만든 SVG에서 스크립트·이벤트·외부참조 제거
  function safeSvg(src) {
    const doc = new DOMParser().parseFromString(src || '', 'image/svg+xml');
    const svg = doc.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return null;
    svg.querySelectorAll('script, foreignObject, iframe, image, use, a').forEach(n => n.remove());
    [svg, ...svg.querySelectorAll('*')].forEach(n => [...n.attributes].forEach(a => {
      if (/^on/i.test(a.name) || /javascript:/i.test(a.value) || /^(xlink:)?href$/i.test(a.name)) n.removeAttribute(a.name);
    }));
    svg.removeAttribute('width'); svg.removeAttribute('height');
    return document.importNode(svg, true);
  }

  // JSON 이스케이프 실수로 망가진 LaTeX(\frac→폼피드, \times→탭, \beta→백스페이스) 복구
  const fixTex = s => typeof s === 'string' ? s.replace(/\f/g, '\\f').replace(/\t/g, '\\t').replace(/\x08/g, '\\b') : s;

  function render(sol) {
    sol.problem = fixTex(sol.problem); sol.answer = fixTex(sol.answer);
    (sol.steps || []).forEach(s => { s.title = fixTex(s.title); s.explanation = fixTex(s.explanation); s.work = fixTex(s.work); });
    const out = $('solution');
    out.innerHTML = '';
    const prob = el('div', 'problem');
    prob.append(el('strong', '', '📝 인식한 문제'), el('p', '', sol.problem || ''));
    out.appendChild(prob);

    const items = (sol.steps || []).map((s, k) => {
      const d = el('div', 'step');
      d.append(el('div', 'step-num', String(k + 1)));
      const body = el('div', 'step-body');
      body.append(el('h3', '', s.title || ''), el('p', '', s.explanation || ''));
      const svg = safeSvg(s.svg);
      if (svg) { const fig = el('div', 'figure'); fig.appendChild(svg); body.appendChild(fig); }
      if (s.work) body.appendChild(el('div', 'work', s.work));
      d.appendChild(body);
      return d;
    });
    if (sol.answer) items.push(el('div', 'final', '✅ 정답: ' + sol.answer));

    items.forEach((node, k) => {
      node.style.animationDelay = (k * 0.6) + 's';
      node.classList.add('reveal');
      out.appendChild(node);
    });
    if (window.renderMathInElement) {
      renderMathInElement(out, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }
  }

  $('solve-btn').addEventListener('click', solve);
})();

