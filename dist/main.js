const albumViews = [...document.querySelectorAll("[data-album]")];
const albumIndex = document.querySelector("#album-index");
const lightbox = document.querySelector(".lightbox");
let currentGroup = [];
let currentPhoto = 0;
let photoTrigger;

function renderAlbum() {
  if (!albumIndex) return;
  const id = location.hash.slice(1);
  const selected = albumViews.find(view => view.id === id);
  albumIndex.hidden = Boolean(selected);
  albumViews.forEach(view => { view.hidden = view !== selected; });
  document.title = selected ? selected.querySelector("h1").textContent + "｜苗志国 Daydreamer" : "作品｜苗志国 Daydreamer";
}
renderAlbum();
window.addEventListener("hashchange", () => {
  renderAlbum();
  if (albumIndex && location.hash !== "#moving-image") window.scrollTo({top: 0, behavior: "instant"});
});

function displayPhoto(index) {
  currentPhoto = (index + currentGroup.length) % currentGroup.length;
  const trigger = currentGroup[currentPhoto];
  const image = trigger.querySelector("img");
  const target = document.querySelector("#lightbox-image");
  target.src = image.src;
  target.alt = image.alt;
  document.querySelector("#lightbox-title").textContent = trigger.closest("figure").querySelector("figcaption span").textContent;
  document.querySelector("#lightbox-count").textContent = String(currentPhoto + 1).padStart(2, "0") + " / " + String(currentGroup.length).padStart(2, "0");
}
document.querySelectorAll(".photo-open").forEach(button => {
  button.addEventListener("click", () => {
    photoTrigger = button;
    currentGroup = [...button.closest("[data-album]").querySelectorAll(".photo-open")];
    displayPhoto(currentGroup.indexOf(button));
    lightbox.showModal();
  });
});
if (lightbox) {
  document.querySelector("[data-close-photo]").addEventListener("click", () => lightbox.close());
  document.querySelector("[data-prev-photo]").addEventListener("click", () => displayPhoto(currentPhoto - 1));
  document.querySelector("[data-next-photo]").addEventListener("click", () => displayPhoto(currentPhoto + 1));
  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") { event.preventDefault(); displayPhoto(currentPhoto + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); displayPhoto(currentPhoto - 1); }
  });
  lightbox.addEventListener("close", () => photoTrigger?.focus({preventScroll: true}));
  let touchStart;
  const image = document.querySelector("#lightbox-image");
  image.addEventListener("touchstart", event => { touchStart = event.changedTouches[0].clientX; }, {passive: true});
  image.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 50) displayPhoto(currentPhoto + (distance < 0 ? 1 : -1));
  }, {passive: true});
}

const films = {
  aperture: {title: "光圈一开，背景为什么就化了？", lines: ["光圈一开，", "背景为什么就化了？"], duration: "00:44", height: 1920, description: "从光束合焦到背景光斑，看开口大小怎样改变虚化。", method: "以“背景为什么会虚化”为问题，串联开口、光束与离焦光斑，用连续动画解释变化。"},
  shutter: {title: "快门，把时间留在照片里。", lines: ["快门，", "把时间留在照片里。"], duration: "00:40", height: 1620, description: "同一个骑行场景，从瞬间定格到连续光轨，看看曝光时间留下了什么。", method: "用同一个骑行主体和机位，比较短曝光与长曝光。把曝光时间转成可见的时间窗、连续拖影与光轨。"},
  iso: {title: "ISO：亮度变了，光没有变。", lines: ["亮度变了，", "光没有变。"], duration: "00:44", height: 1620, description: "区分真实收光与亮度呈现，再回到骑行场景，理解三项参数怎样配合。", method: "固定同一份传感器采样，演示亮度缩放与已有起伏，再比较少光与多光的结果。用简化模型区分收光量与亮度呈现。"}
};
const player = document.querySelector("#tutorial-player");
let currentFilm = "aperture";
function selectFilm(id) {
  if (!player || !films[id]) return;
  const data = films[id];
  const resume = !player.paused;
  if (currentFilm !== id) {
    player.pause();
    player.poster = "./assets/videos/photography-" + id + "-poster.jpg";
    player.querySelector("source").src = "./assets/videos/photography-" + id + ".mp4";
    player.height = data.height;
    player.setAttribute("aria-label", "播放：" + data.title);
    const fallback = player.querySelector("a");
    if (fallback) { fallback.href = "./assets/videos/photography-" + id + ".mp4"; fallback.textContent = "打开视频：" + data.title; }
    player.load();
    if (resume) player.play().catch(() => {});
  }
  currentFilm = id;
  document.querySelector("#film-title").replaceChildren(document.createTextNode(data.lines[0]), document.createElement("br"), document.createTextNode(data.lines[1]));
  document.querySelector("#film-position").textContent = String(Object.keys(films).indexOf(id) + 1).padStart(2, "0") + " / 03";
  document.querySelector("#film-duration").textContent = data.duration;
  document.querySelector("#film-description").textContent = data.description;
  document.querySelector("#film-method").textContent = data.method;
  document.querySelector("#film-source").href = "./assets/videos/photography-" + id + ".mp4";
  document.querySelectorAll("[data-film]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.film === id)));
}
if (player) {
  selectFilm(location.hash.slice(1) || "aperture");
  document.querySelectorAll("[data-film]").forEach(button => button.addEventListener("click", () => {
    selectFilm(button.dataset.film);
    history.replaceState(null, "", "#" + button.dataset.film);
  }));
  window.addEventListener("hashchange", () => selectFilm(location.hash.slice(1) || "aperture"));
}
document.querySelectorAll("video").forEach(video => video.addEventListener("play", () => {
  document.querySelectorAll("video").forEach(other => { if (other !== video) other.pause(); });
}));

document.querySelector("[data-copy-email]")?.addEventListener("click", async event => {
  const button = event.currentTarget;
  const status = document.querySelector(".copy-status");
  try {
    await navigator.clipboard.writeText("2466256412@qq.com");
    button.textContent = "已复制";
    status.textContent = "邮箱已复制，可以粘贴到邮件或聊天中。";
  } catch {
    status.textContent = "请长按或选中上方邮箱地址复制。";
  }
});
