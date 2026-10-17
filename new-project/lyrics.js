// 노래 → AI 가사 인식/싱크 → 가사 자막 영상(WebM) 만들기
(function () {
  const $ = id => document.getElementById(id);
  const canvas = $('ly-canvas'), ctx = canvas.getContext('2d');
  const MODELS = ['gemini-3.8-flash', 'gemini-3.8-pro'];

  let audio = new Audio();
  let audioFile = null, bgImg = null, lrc = [];
  let actx = null, analyser = null, mediaSrc = null, mediaDest = null, freq = null;
  let playing = false, raf = 0, rec = null;

  // ---------- 설정 ----------
  $('ly-model').innerHTML = MODELS.map(m => `<option value="${m}">${m}</option>`).join('');
  $('ly-key').value = localStorage.getItem('key_gemini') || (window.AI_KEYS && window.AI_KEYS.gemini) || '';
  $('ly-key').addEventListener('change', e => localStorage.setItem('key_gemini', e.target.value.trim()));

  function status(msg, isErr) {
    const s = $('ly-status');
    s.textContent = msg; s.className = 'status' + (isErr ? ' err' : '');
  }

  // ---------- 파일 ----------
  $('ly-song').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    audioFile = f;
    audio.src = URL.createObjectURL(f);
    audio.onloadedmetadata = () => {
      status(`🎵 "${f.name}" 불러옴 (${fmt(audio.duration)})`);
      if (!$('ly-title').value) $('ly-title').value = f.name.replace(/\.[^.]+$/, '');
      $('ly-analyze').disabled = false;
      drawFrame(0);
    };
  });
  $('ly-bg').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => { bgImg = img; drawFrame(audio.currentTime || 0); };
    img.src = URL.createObjectURL(f);
  });
  $('ly-ratio').addEventListener('change', e => {
    const sizes = { '16:9': [1280, 720], '9:16': [720, 1280] };
    [canvas.width, canvas.height] = sizes[e.target.value];
    drawFrame(audio.currentTime || 0);
  });

  // ---------- LRC ----------
  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec - m * 60;
    return String(m).padStart(2, '0') + ':' + s.toFixed(2).padStart(5, '0');
  }
  function lrcToText(lines) { return lines.map(l => `[${fmt(l.t)}] ${l.text}`).join('\n'); }
  function parseLrc(text) {
    const out = [], plain = [];
    text.split('\n').forEach(line => {
      const l = line.trim(); if (!l) return;
      const m = l.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
      if (m) out.push({ t: +m[1] * 60 + parseFloat(m[2]), text: m[3] }); else plain.push(l);
    });
    if (!out.length && plain.length && audio.duration) { // 시간표시가 없으면 균등 배분
      const d = audio.duration;
      plain.forEach((p, i) => out.push({ t: d * i / plain.length * 0.92 + 1, text: p }));
    }
    return out.sort((a, b) => a.t - b.t);
  }

  // ---------- AI 가사 인식 + 싱크 ----------
  function toBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(',')[1]);
      r.onerror = () => rej(new Error('파일을 읽지 못했어요'));
      r.readAsDataURL(file);
    });
  }
  function fetchTimeout(url, opts, ms = 300000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...opts, signal: ctrl.signal })
      .catch(e => { throw new Error(e.name === 'AbortError' ? '응답 시간 초과' : '네트워크 오류: ' + e.message); })
      .finally(() => clearTimeout(t));
  }

  $('ly-analyze').addEventListener('click', async () => {
    const key = $('ly-key').value.trim();
    if (!key) { status('Gemini API 키를 입력하세요.', true); return; }
    if (!audioFile) { status('먼저 노래 파일을 선택하세요.', true); return; }
    if (audioFile.size > 15 * 1024 * 1024) { status('파일이 너무 커요 (15MB 이하 mp3로 줄여주세요).', true); return; }
    localStorage.setItem('key_gemini', key);
    $('ly-analyze').disabled = true;
    const t0 = Date.now();
    const tick = setInterval(() => status(`🤖 노래를 듣고 가사를 맞추는 중... (${Math.floor((Date.now() - t0) / 1000)}초)`), 1000);
    try {
      const data = await toBase64(audioFile);
      const given = $('ly-given').value.trim();
      const prompt = `이 노래 음원을 듣고 가사를 줄(소절) 단위로 받아 적고, 각 줄이 노래에서 시작하는 시간(초, 소수점 1자리)을 알려주세요.
${given ? '아래는 사용자가 제공한 가사입니다. 이 텍스트를 그대로 사용하고 시간만 정확히 맞추세요:\n' + given + '\n' : '가사는 들리는 언어 그대로 적으세요.'}
간주/반주 구간에는 줄을 만들지 마세요. 시간은 오름차순이어야 합니다.
반드시 아래 JSON 형식으로만 답하세요.
{"lines":[{"t":12.5,"text":"가사 한 줄"}]}`;
      const headers = { 'Content-Type': 'application/json', 'x-goog-api-key': key };
      const base = 'https://generativelanguage.googleapis.com/v1beta/interactions';
      const res = await fetchTimeout(base, {
        method: 'POST', headers,
        body: JSON.stringify({
          model: $('ly-model').value,
          input: [
            { type: 'audio', mime_type: audioFile.type || 'audio/mpeg', data },
            { type: 'text', text: prompt }
          ]
        })
      });
      let d = await res.json();
      console.log('Gemini response', d);
      if (!res.ok) throw new Error(d.error?.message || '요청 실패 (' + res.status + ')');
      for (let n = 0; d.id && /^(in_progress|queued|running)$/i.test(d.status || '') && n < 90; n++) {
        await new Promise(r => setTimeout(r, 2000));
        const r2 = await fetchTimeout(`${base}/${d.id}`, { headers });
        d = await r2.json();
        if (!r2.ok) throw new Error(d.error?.message || '조회 실패 (' + r2.status + ')');
      }
      let text = typeof d.output_text === 'string' ? d.output_text : '';
      if (!text) {
        const texts = [];
        const collect = list => (list || []).forEach(o => { if (typeof o.text === 'string') texts.push(o.text); collect(o.content); });
        collect(d.steps); collect(d.outputs);
        text = texts.join('');
      }
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('AI 응답을 해석하지 못했어요 (F12 콘솔 확인)');
      const lines = (JSON.parse(m[0]).lines || []).filter(l => l && typeof l.text === 'string')
        .map(l => ({ t: Number(l.t) || 0, text: l.text.trim() }));
      if (!lines.length) throw new Error('가사를 찾지 못했어요.');
      $('ly-lrc').value = lrcToText(lines);
      lrc = lines;
      renderTimes();
      status(`✅ 가사 ${lines.length}줄을 맞췄어요! 아래에서 시간/가사를 고칠 수 있어요.`);
    } catch (err) {
      console.error(err);
      status('⚠ ' + err.message, true);
    } finally {
      clearInterval(tick);
      $('ly-analyze').disabled = false;
    }
  });

  // ---------- 그리기 ----------
  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

  function wrap(text, maxW, font) {
    ctx.font = font;
    const rows = []; let row = '';
    for (const ch of text) {
      if (ctx.measureText(row + ch).width > maxW && row) { rows.push(row); row = ch; } else row += ch;
    }
    rows.push(row);
    return rows;
  }

  function drawBg(time) {
    const W = canvas.width, H = canvas.height;
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, cr = W / H, z = 1 + 0.04 * Math.sin(time / 6);
      let w, h;
      if (ir > cr) { h = H * z; w = h * ir; } else { w = W * z; h = w / ir; }
      ctx.drawImage(bgImg, (W - w) / 2, (H - h) / 2, w, h);
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, W, H);
    } else {
      const h1 = (time * 6) % 360;
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, `hsl(${h1},70%,24%)`); g.addColorStop(1, `hsl(${(h1 + 70) % 360},75%,16%)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  }

  function drawBars() {
    if (!analyser) return;
    analyser.getByteFrequencyData(freq);
    const W = canvas.width, H = canvas.height, n = 56, bw = W / n;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const v = freq[Math.floor(Math.pow(i / n, 1.6) * freq.length * 0.7)] / 255;
      const h = 8 + v * H * 0.16;
      ctx.fillStyle = `rgba(255,255,255,${0.15 + v * 0.35})`;
      ctx.fillRect(i * bw + bw * 0.2, H - h, bw * 0.6, h);
    }
    ctx.restore();
  }

  function drawFrame(time) {
    const W = canvas.width, H = canvas.height;
    const accent = $('ly-color').value;
    ctx.clearRect(0, 0, W, H);
    drawBg(time);
    drawBars();

    const title = $('ly-title').value;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fs = Math.round(Math.min(W, H) * (W >= H ? 0.075 : 0.07));
    const font = `800 ${fs}px "Malgun Gothic","Segoe UI",sans-serif`;
    const small = Math.round(fs * 0.55);

    let idx = -1;
    for (let i = 0; i < lrc.length; i++) if (lrc[i].t <= time) idx = i; else break;

    if (title) { // 상단 제목
      ctx.font = `600 ${Math.round(fs * 0.4)}px "Malgun Gothic",sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,.65)';
      ctx.fillText('♪ ' + title, W / 2, H * 0.07);
    }

    if (idx < 0) { // 인트로
      ctx.font = font; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20;
      wrap(title || '♪', W * 0.85, font).forEach((r, i, a) => ctx.fillText(r, W / 2, H / 2 + (i - (a.length - 1) / 2) * fs * 1.25));
      ctx.shadowBlur = 0;
      return;
    }

    const cur = lrc[idx], end = lrc[idx + 1] ? lrc[idx + 1].t : (audio.duration || cur.t + 4);
    const p = clamp((time - cur.t) / Math.max(0.5, Math.min(end - cur.t, 8)) * 1.05);
    const pop = 1 + 0.06 * (1 - ease((time - cur.t) / 0.3));

    // 이전/다음 줄
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10;
    const dimFont = `600 ${small}px "Malgun Gothic",sans-serif`;
    if (lrc[idx - 1]) { ctx.font = dimFont; ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillText(clip(lrc[idx - 1].text, W * 0.85, dimFont), W / 2, H * 0.3); }
    if (lrc[idx + 1]) { ctx.font = dimFont; ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillText(clip(lrc[idx + 1].text, W * 0.85, dimFont), W / 2, H * 0.72); }

    // 현재 줄 (노래방 스타일로 왼쪽부터 색이 차오름)
    const rows = wrap(cur.text, W * 0.84, font);
    const lh = fs * 1.3, totalChars = cur.text.length || 1;
    let consumed = 0;
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.scale(pop, pop); ctx.translate(-W / 2, -H / 2);
    rows.forEach((row, i) => {
      const y = H / 2 + (i - (rows.length - 1) / 2) * lh;
      ctx.font = font; ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      ctx.fillText(row, W / 2, y);
      const rp = clamp((p * totalChars - consumed) / Math.max(1, row.length));
      consumed += row.length;
      if (rp > 0) {
        const w = ctx.measureText(row).width;
        ctx.save();
        ctx.beginPath(); ctx.rect(W / 2 - w / 2, y - fs, w * rp, fs * 2); ctx.clip();
        ctx.fillStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 24;
        ctx.fillText(row, W / 2, y);
        ctx.restore();
      }
    });
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function clip(text, maxW, font) {
    ctx.font = font;
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 1 && ctx.measureText(text + '…').width > maxW) text = text.slice(0, -1);
    return text + '…';
  }

  // ---------- 오디오 그래프 (한 번만 연결) ----------
  function ensureGraph() {
    if (actx) { actx.resume(); return; }
    actx = new (window.AudioContext || window.webkitAudioContext)();
    mediaSrc = actx.createMediaElementSource(audio);
    analyser = actx.createAnalyser(); analyser.fftSize = 256;
    freq = new Uint8Array(analyser.frequencyBinCount);
    mediaDest = actx.createMediaStreamDestination();
    mediaSrc.connect(analyser);
    analyser.connect(actx.destination);
    analyser.connect(mediaDest);
  }

  // ---------- 재생 / 녹화 ----------
  function loop() {
    drawFrame(audio.currentTime);
    if (playing) raf = requestAnimationFrame(loop);
  }
  function applyLrc() {
    lrc = parseLrc($('ly-lrc').value);
    if (!lrc.length) { status('가사가 없어요. 먼저 AI로 가사를 맞추거나 직접 입력하세요.', true); return false; }
    return true;
  }
  function stopAll() {
    playing = false; cancelAnimationFrame(raf);
    audio.pause();
    $('ly-play').textContent = '▶ 미리보기';
  }

  $('ly-play').addEventListener('click', () => {
    if (playing) { stopAll(); return; }
    if (!audioFile) { status('먼저 노래 파일을 선택하세요.', true); return; }
    if (!applyLrc()) return;
    ensureGraph();
    audio.currentTime = 0; audio.play();
    playing = true; $('ly-play').textContent = '⏹ 정지';
    audio.onended = () => { stopAll(); drawFrame(0); };
    loop();
  });

  $('ly-make').addEventListener('click', () => {
    if (!window.MediaRecorder) { alert('이 브라우저는 영상 녹화를 지원하지 않아요. 크롬/엣지를 사용해 주세요.'); return; }
    if (!audioFile) { status('먼저 노래 파일을 선택하세요.', true); return; }
    if (!applyLrc()) return;
    stopAll(); ensureGraph();
    $('ly-download').hidden = true; $('ly-result').hidden = true;
    $('ly-make').disabled = true; $('ly-play').disabled = true;
    status('🎬 영상 만드는 중... 노래 길이만큼 걸려요. 이 탭을 유지해 주세요.');
    const stream = canvas.captureStream(30);
    mediaDest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
    rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
      $('ly-result').src = url; $('ly-result').hidden = false;
      $('ly-download').href = url; $('ly-download').download = ($('ly-title').value || 'lyric-video') + '.webm'; $('ly-download').hidden = false;
      status('✅ 가사 영상 완성! 확인하고 다운로드하세요.');
      $('ly-progress').hidden = true; $('ly-bar').style.width = '0';
      $('ly-make').disabled = false; $('ly-play').disabled = false;
      drawFrame(0);
    };
    $('ly-progress').hidden = false;
    rec.start(250);
    audio.currentTime = 0; audio.play();
    playing = true;
    audio.onended = () => {
      playing = false; cancelAnimationFrame(raf);
      setTimeout(() => rec.stop(), 400);
    };
    const tick = () => {
      drawFrame(audio.currentTime);
      if (audio.duration) $('ly-bar').style.width = (audio.currentTime / audio.duration * 100).toFixed(1) + '%';
      if (playing) raf = requestAnimationFrame(tick);
    };
    tick();
  });

  $('ly-lrc').addEventListener('input', () => { if (!playing) { lrc = parseLrc($('ly-lrc').value); drawFrame(audio.currentTime || 0); } });
  $('ly-title').addEventListener('input', () => { if (!playing) drawFrame(audio.currentTime || 0); });
  $('ly-color').addEventListener('input', () => { if (!playing) drawFrame(audio.currentTime || 0); });
  drawFrame(0);
})();
