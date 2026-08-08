(function () {
  var APP_STORE_HTTPS = "https://apps.apple.com/app/trekstak/id6758947030";
  var APP_STORE_ITMS = "itms-apps://apps.apple.com/app/id6758947030";

  function readCode() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get("code") || params.get("ref") || params.get("c");
    if (fromQuery) return sanitize(fromQuery);

    var path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    if (!path || path === "index.html") return "";
    // Ignore nested paths like assets; only accept a single segment
    if (path.indexOf("/") !== -1) return "";
    return sanitize(path);
  }

  function sanitize(value) {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, 24);
  }

  function showCode(code) {
    var codeBlock = document.getElementById("code-block");
    var noCode = document.getElementById("no-code-block");
    var value = document.getElementById("code-value");
    if (!codeBlock || !noCode || !value) return;

    if (!code) {
      codeBlock.hidden = true;
      codeBlock.classList.add("is-empty");
      noCode.hidden = false;
      return;
    }

    value.textContent = code;
    codeBlock.hidden = false;
    codeBlock.classList.remove("is-empty");
    noCode.hidden = true;
    try {
      sessionStorage.setItem("trekstak_creator_code", code);
    } catch (err) {}
  }

  function wireCopy(code) {
    var button = document.getElementById("copy-code");
    var toast = document.getElementById("toast");
    if (!button || !code) return;

    button.addEventListener("click", function () {
      var done = function () {
        if (!toast) return;
        toast.hidden = false;
        window.clearTimeout(wireCopy._t);
        wireCopy._t = window.setTimeout(function () {
          toast.hidden = true;
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(function () {
          fallbackCopy(code);
          done();
        });
      } else {
        fallbackCopy(code);
        done();
      }
    });
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (err) {}
    document.body.removeChild(area);
  }

  function wireAppStore() {
    var link = document.getElementById("app-store-link");
    if (!link) return;

    var ua = navigator.userAgent || "";
    var isInstagram = /Instagram/i.test(ua);
    var isFacebook = /FBAN|FBAV|FB_IAB|Facebook/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua);
    var isInApp = isInstagram || isFacebook;

    link.addEventListener("click", function (event) {
      if (!isInApp) return;
      event.preventDefault();

      if (isInstagram && isIOS) {
        window.location.href = "instagram://extbrowser/?url=" + encodeURIComponent(APP_STORE_HTTPS);
        window.setTimeout(function () { window.location.href = APP_STORE_ITMS; }, 700);
        window.setTimeout(function () { window.location.href = APP_STORE_HTTPS; }, 1400);
        return;
      }

      if (isIOS) {
        window.location.href = "x-safari-https://apps.apple.com/app/trekstak/id6758947030";
        window.setTimeout(function () { window.location.href = APP_STORE_ITMS; }, 700);
        window.setTimeout(function () { window.location.href = APP_STORE_HTTPS; }, 1400);
        return;
      }

      window.location.href = APP_STORE_HTTPS;
    });
  }

  var code = readCode();
  showCode(code);
  wireCopy(code);
  wireAppStore();
})();
