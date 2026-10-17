(function () {
  const $ = id => document.getElementById(id);
  const canvas = $('stage'), ctx = canvas.getContext('2d');

  const THEMES = [
    ['#ff3d71', '#ff8a3d'], ['#6a5cff', '#00c2ff'], ['#00b894', '#55efc4'],
    ['#f6d365', '#fda085'], ['#232526', '#414345'], ['#c471f5', '#fa71cd']
  ];
  const FADE = 0.5; // 장면 전환(초)

  const slides = [
    { text: '안녕하세요!\n오늘의 영상', sub: 'TubeMaker로 만들었어요', dur: 4, theme: 0, img: null },
    { text: '글과 사진만 넣으면\n영상 완성 🎬', sub: '', dur: 4, theme: 1, img: null }
  ];
  let cur = 0, audioEl = null, audioUrl = null;

  // ---------- 비율 ----------
  function setRatio(r) {
    const sizes = { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [1000, 1000] };
    [canvas.width, canvas.height] = sizes[r];
    preview();
  }

  // ---------- 그리기 ----------
  function wrap(text, maxW, font) {
    ctx.font = font;
    const out = [];
    text.split('\n').forEach(line => {
      let row = '';
      for (const ch of line) {
        if (ctx.measureText(row + ch).width > maxW && row) { out.push(row); row = ch; } else row += ch;
      }
      out.push(row);
    });
    return out;
  }

  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

  function drawSlide(s, t, alpha) {
    const W = canvas.width, H = canvas.height, p = t / s.dur;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (s.img) { // 켄 번즈 효과: 천천히 확대
      const z = 1 + 0.1 * p, ir = s.img.width / s.img.height, cr = W / H;
      let w, h;
      if (ir > cr) { h = H * z; w = h * ir; } else { w = W * z; h = w / ir; }
      ctx.drawImage(s.img, (W - w) / 2, (H - h) / 2, w, h);
      ctx.fillStyle = 'rgba(0,0,0,.42)'; ctx.fillRect(0, 0, W, H);
    } else {
      const [a, b] = THEMES[s.theme];
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, a); g.addColorStop(1, b);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // 텍스트 (아래서 올라오며 나타남)
    const fs = Math.round(Math.min(W, H) * (W >= H ? 0.1 : 0.085));
    const font = `800 ${fs}px "Malgun Gothic","Segoe UI",sans-serif`;
    const lines = wrap(s.text, W * 0.82, font);
    const lh = fs * 1.25, total = lines.length * lh;
    const k = ease(t / 0.8), off = (1 - k) * 40;
    ctx.globalAlpha = alpha * k;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 18;
    ctx.font = font;
    const shift = s.sub ? fs * 0.3 : 0;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, H / 2 - total / 2 + lh * (i + .5) + off - shift));
    if (s.sub) {
      const sk = ease((t - 0.4) / 0.8);
      ctx.globalAlpha = alpha * sk; ctx.shadowBlur = 10;
      ctx.font = `500 ${Math.round(fs * 0.42)}px "Malgun Gothic",sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.fillText(s.sub, W / 2, H / 2 + total / 2 + fs * 0.5 - shift + (1 - sk) * 20);
    }
    ctx.restore();
  }

  const totalTime = () => slides.reduce((a, s) => a + s.dur, 0);

  function drawAt(time) {
    let acc = 0, i = 0;
    for (; i < slides.length - 1; i++) { if (time < acc + slides[i].dur) break; acc += slides[i].dur; }
    const t = Math.min(time - acc, slides[i].dur);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (i > 0 && t < FADE) { // 크로스 페이드
      drawSlide(slides[i - 1], slides[i - 1].dur, 1);
      drawSlide(slides[i], t, t / FADE);
    } else drawSlide(slides[i], t, 1);
  }

  // ---------- 재생/녹화 ----------
  let busy = false;
  function run(onFrame, onDone) {
    const T = totalTime(), t0 = performance.now();
    const loop = now => {
      const time = (now - t0) / 1000;
      if (time >= T) { drawAt(T - 0.001); onFrame(1); onDone(); return; }
      drawAt(time); onFrame(time / T);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function setBusy(b) { busy = b; $('play-btn').disabled = b; $('make-btn').disabled = b; }

  $('play-btn').addEventListener('click', () => {
    if (busy) return;
    setBusy(true);
    if (audioEl) { audioEl.currentTime = 0; audioEl.play(); }
    run(() => {}, () => { if (audioEl) audioEl.pause(); setBusy(false); preview(); });
  });

  let mediaSrc = null, mediaCtx = null, mediaDest = null;

  $('make-btn').addEventListener('click', () => {
    if (busy) return;
    if (!window.MediaRecorder) { alert('이 브라우저는 영상 녹화를 지원하지 않아요. 크롬/엣지를 사용해 주세요.'); return; }
    setBusy(true);
    $('download').hidden = true; $('result').hidden = true;
    $('progress').hidden = false;
    $('status').textContent = '🎬 영상 만드는 중... 끝날 때까지 이 탭을 유지해 주세요.';

    const stream = canvas.captureStream(30);
    if (audioEl) {
      if (!mediaCtx) mediaCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (mediaSrc && mediaSrc.mediaElement !== audioEl) mediaSrc = null;
      if (!mediaSrc) {
        mediaSrc = mediaCtx.createMediaElementSource(audioEl);
        mediaDest = mediaCtx.createMediaStreamDestination();
        mediaSrc.connect(mediaDest);
      }
      mediaCtx.resume();
      mediaDest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
    }
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      .find(m => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
      $('result').src = url; $('result').hidden = false;
      $('download').href = url; $('download').download = 'tubemaker-video.webm'; $('download').hidden = false;
      $('status').textContent = '✅ 완성! 아래에서 확인하고 다운로드하세요. (유튜브에 WebM 그대로 업로드 가능)';
      $('progress').hidden = true; $('bar').style.width = '0';
      if (audioEl) audioEl.pause();
      setBusy(false); preview();
    };
    rec.start(250);
    if (audioEl) { audioEl.currentTime = 0; audioEl.play(); }
    run(p => { $('bar').style.width = (p * 100).toFixed(1) + '%'; }, () => setTimeout(() => rec.stop(), 300));
  });

  // ---------- 장면 목록/편집 ----------
  function renderList() {
    const ul = $('slide-list');
    ul.innerHTML = '';
    slides.forEach((s, i) => {
      const li = document.createElement('li');
      li.textContent = (i + 1) + '. ' + (s.text.replace(/\n/g, ' ') || '(빈 장면)');
      if (i === cur) li.className = 'active';
      li.addEventListener('click', () => select(i));
      ul.appendChild(li);
    });
  }

  function renderThemes() {
    const box = $('themes');
    box.innerHTML = '';
    THEMES.forEach(([a, b], i) => {
      const d = document.createElement('div');
      d.className = 'theme' + (slides[cur].theme === i ? ' active' : '');
      d.style.background = `linear-gradient(135deg, ${a}, ${b})`;
      d.addEventListener('click', () => { slides[cur].theme = i; renderThemes(); preview(); });
      box.appendChild(d);
    });
  }

  function preview() {
    if (busy) return;
    drawAt(slides.slice(0, cur).reduce((a, s) => a + s.dur, 0) + Math.min(1.2, slides[cur].dur));
  }

  function select(i) {
    cur = i;
    const s = slides[i];
    $('f-text').value = s.text; $('f-sub').value = s.sub;
    $('f-dur').value = s.dur; $('dur-val').textContent = s.dur;
    renderList(); renderThemes(); preview();
  }

  $('f-text').addEventListener('input', e => { slides[cur].text = e.target.value; renderList(); preview(); });
  $('f-sub').addEventListener('input', e => { slides[cur].sub = e.target.value; preview(); });
  $('f-dur').addEventListener('input', e => { slides[cur].dur = +e.target.value; $('dur-val').textContent = e.target.value; });
  $('f-img').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => { slides[cur].img = img; preview(); };
    img.src = URL.createObjectURL(f);
  });
  $('rm-img').addEventListener('click', () => { slides[cur].img = null; $('f-img').value = ''; preview(); });
  $('add-slide').addEventListener('click', () => {
    slides.push({ text: '새 장면', sub: '', dur: 4, theme: slides.length % THEMES.length, img: null });
    select(slides.length - 1);
  });
  $('del-slide').addEventListener('click', () => {
    if (slides.length < 2) { alert('장면이 최소 1개는 있어야 해요.'); return; }
    slides.splice(cur, 1); select(Math.max(0, cur - 1));
  });
  $('f-ratio').addEventListener('change', e => setRatio(e.target.value));
  $('f-audio').addEventListener('change', e => {
    const f = e.target.files[0];
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (!f) { audioEl = null; return; }
    audioUrl = URL.createObjectURL(f);
    audioEl = new Audio(audioUrl); audioEl.loop = true;
  });

  select(0);
})();
