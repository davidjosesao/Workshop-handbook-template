(function () {
  const url = location.href.split('#')[0];
  let last = null;
  async function check() {
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      const tag = res.headers.get('ETag') || res.headers.get('Last-Modified');
      if (last && tag && tag !== last) location.reload();
      last = tag;
    } catch (e) {}
  }
  setInterval(check, 15000);
  check();
})();