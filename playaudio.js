/* playAudio.js  与音频文件放同一目录 */
(function () {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const cache = {};

  /* 根据脚本自身路径推断音频目录 */
  const scriptPath = document.currentScript?.src || '';
  const baseUrl = scriptPath.slice(0, scriptPath.lastIndexOf('/') + 1);

  async function loadAudio(fileName) {
    const url = baseUrl + fileName;
    if (cache[url]) return cache[url];
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const buf = await ctx.decodeAudioData(await res.arrayBuffer());
    cache[url] = buf;
    return buf;
  }

  window.playAudio = async function (fileName) {
    if (ctx.state !== 'running') await ctx.resume();
    const buf = await loadAudio(fileName);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    gain.gain.value = 0.25;
    src.connect(gain).connect(ctx.destination);
    src.start();
  };

  console.log('[playAudio] 远程音频播放器已加载，目录：' + baseUrl);
})();
