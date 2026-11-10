// Filter and sort for the company tables. No inline script, no innerHTML (the site's content security policy).
(function () {
  var table = document.getElementById("t");
  if (!table) { return; }
  var body = table.tBodies[0];
  var rows = Array.prototype.slice.call(body.rows);
  var q = document.getElementById("f-text");
  var sec = document.getElementById("f-sector");
  var sub = document.getElementById("f-sub");
  var zone = document.getElementById("f-zone");
  var count = document.getElementById("count");
  var sortKey = -1;
  var sortDir = 1;

  function apply() {
    var text = q ? q.value.trim().toLowerCase() : "";
    var shown = 0;
    rows.forEach(function (r) {
      var ok = (!text || r.getAttribute("data-name").indexOf(text) !== -1) &&
        (!sec || !sec.value || r.getAttribute("data-sector") === sec.value) &&
        (!sub || !sub.value || r.getAttribute("data-sub") === sub.value) &&
        (!zone || !zone.checked || r.getAttribute("data-zone") === "yes");
      r.hidden = !ok;
      if (ok) { shown += 1; }
    });
    if (count) { count.textContent = shown + " of " + rows.length + " companies shown"; }
  }

  function val(r, i) {
    var c = r.cells[i];
    return c.getAttribute("data-sort") !== null ? c.getAttribute("data-sort") : c.textContent.trim();
  }

  function sortBy(i) {
    sortDir = (sortKey === i) ? -sortDir : 1;
    sortKey = i;
    rows.sort(function (a, b) {
      var x = val(a, i), y = val(b, i);
      var nx = parseFloat(x), ny = parseFloat(y);
      var d = (!isNaN(nx) && !isNaN(ny) && String(nx) === x && String(ny) === y) ? nx - ny : x.localeCompare(y);
      return d * sortDir;
    });
    rows.forEach(function (r) { body.appendChild(r); });
    Array.prototype.forEach.call(table.tHead.rows[0].cells, function (h, j) {
      if (h.hasAttribute("aria-sort") || h.querySelector("button")) {
        h.setAttribute("aria-sort", j === i ? (sortDir === 1 ? "ascending" : "descending") : "none");
      }
    });
  }

  Array.prototype.forEach.call(table.querySelectorAll("th button"), function (b) {
    b.addEventListener("click", function () { sortBy(b.parentNode.cellIndex); });
  });
  [q, sec, sub, zone].forEach(function (el) {
    if (el) { el.addEventListener("input", apply); el.addEventListener("change", apply); }
  });
  apply();
})();
