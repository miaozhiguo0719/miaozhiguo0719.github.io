(() => {
  const scene = document.querySelector('#waist-scene');
  if (!scene) return;
  const looks = {
    classic: { name: 'CLASSIC 400', filter: 'sepia(0.14) saturate(0.88) contrast(1.03)' },
    fade: { name: 'FADE 200', filter: 'sepia(0.18) saturate(0.65) contrast(0.88)' },
    mono: { name: 'MONO 100', filter: 'grayscale(1) contrast(1.12)' }
  };
  const ev = document.querySelector('#waist-ev');
  const shutter = document.querySelector('.waist-shutter');
  const thumb = document.querySelector('.waist-thumb');
  const review = document.querySelector('.waist-review');
  const status = document.querySelector('.waist-status');
  let selected = 'classic', count = 0, lastPhoto = null;
  const evLabel = () => (Number(ev.value) > 0 ? '+' : '') + Number(ev.value).toFixed(1) + ' EV';
  const filter = () => looks[selected].filter + ' brightness(' + Math.pow(2, Number(ev.value)).toFixed(3) + ')';
  function update() {
    scene.style.filter = filter();
    document.querySelector('#waist-current-look').textContent = looks[selected].name;
    document.querySelector('#waist-ev-value').textContent = evLabel();
    document.querySelectorAll('[data-look]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.look === selected)));
  }
  document.querySelectorAll('[data-look]').forEach(button => button.addEventListener('click', () => { selected = button.dataset.look; update(); }));
  ev.addEventListener('input', update);
  shutter.addEventListener('click', async () => {
    try {
      await scene.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 900;
      const ctx = canvas.getContext('2d');
      const cropRatio = 4 / 3, sourceRatio = scene.naturalWidth / scene.naturalHeight;
      const sw = sourceRatio > cropRatio ? scene.naturalHeight * cropRatio : scene.naturalWidth;
      const sh = sourceRatio > cropRatio ? scene.naturalHeight : scene.naturalWidth / cropRatio;
      ctx.filter = filter();
      ctx.drawImage(scene, (scene.naturalWidth - sw) / 2, (scene.naturalHeight - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
      lastPhoto = { src: canvas.toDataURL('image/png'), label: looks[selected].name + ' / ' + evLabel() };
      thumb.querySelector('img').src = lastPhoto.src;
      thumb.disabled = false;
      count += 1;
      document.querySelector('#waist-count').textContent = String(count).padStart(2, '0');
      status.textContent = '已拍摄。点击左侧缩略图回看。';
      const finder = document.querySelector('.waist-finder');
      finder.classList.remove('flash');
      void finder.offsetWidth;
      finder.classList.add('flash');
    } catch {
      status.textContent = '演示照片还在载入，请稍后重试。';
    }
  });
  thumb.addEventListener('click', () => {
    if (!lastPhoto) return;
    document.querySelector('#waist-review-image').src = lastPhoto.src;
    document.querySelector('#waist-review-meta').textContent = lastPhoto.label;
    document.querySelector('#waist-download').href = lastPhoto.src;
    review.showModal();
  });
  document.querySelector('[data-close-review]').addEventListener('click', () => review.close());
  review.addEventListener('close', () => thumb.focus({preventScroll: true}));
  update();
})();
