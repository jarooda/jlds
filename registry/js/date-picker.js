/* JLDS behavior — DatePicker / Calendar. Builds the month grid for any .jl-cal
 * (nav between months, click to select; emits jl-cal:change) and wires
 * .jl-datepicker triggers to open that calendar in a popover, reflecting the
 * pick on .jl-datepicker__value + data-value (emits jl-datepicker:change).
 * Native Date math, no deps beyond core.js + util.js (or the all.js bundle).
 * Read the selected date from data-value (YYYY-MM-DD); set data-week-start to
 * start weeks on Monday (1). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var CHEV_L = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function parseISO(s) {
    if (!s) return null;
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  function toISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function fmt(d) { return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }

  /* Render the grid of a .jl-cal into `cal`, using internal state. onPick(date) fires on select. */
  function mountCal(cal, onPick) {
    var weekStart = parseInt(cal.getAttribute("data-week-start") || "0", 10) || 0;
    var selected = parseISO(cal.getAttribute("data-value"));
    var view = new Date((selected || new Date()).getFullYear(), (selected || new Date()).getMonth(), 1);
    var today = startOfDay(new Date());

    function render() {
      var ordered = WEEKDAYS.slice(weekStart).concat(WEEKDAYS.slice(0, weekStart));
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var lead = (first.getDay() - weekStart + 7) % 7;
      var cur = new Date(first);
      cur.setDate(1 - lead);

      var html = '<div class="jl-cal__header">' +
        '<button type="button" class="jl-cal__nav" data-nav="-1" aria-label="Previous month">' + CHEV_L + "</button>" +
        '<div class="jl-cal__title" aria-live="polite">' + MONTHS[view.getMonth()] + " " + view.getFullYear() + "</div>" +
        '<button type="button" class="jl-cal__nav" data-nav="1" aria-label="Next month">' + CHEV_R + "</button>" +
        "</div><div class=\"jl-cal__grid\" role=\"grid\">";
      ordered.forEach(function (w) { html += '<div class="jl-cal__weekday" role="columnheader">' + w + "</div>"; });
      for (var i = 0; i < 42; i++) {
        var d = new Date(cur);
        var outside = d.getMonth() !== view.getMonth();
        html += '<button type="button" class="jl-cal__day" role="gridcell" data-iso="' + toISO(d) + '"' +
          (outside ? ' data-outside="true"' : "") +
          (sameDay(d, today) ? ' data-today="true"' : "") +
          (sameDay(d, selected) ? ' data-selected="true" aria-selected="true"' : "") +
          ">" + d.getDate() + "</button>";
        cur.setDate(cur.getDate() + 1);
      }
      html += "</div>";
      cal.innerHTML = html;
    }

    cal.addEventListener("click", function (e) {
      var nav = e.target.closest(".jl-cal__nav");
      if (nav) {
        view = new Date(view.getFullYear(), view.getMonth() + parseInt(nav.getAttribute("data-nav"), 10), 1);
        render();
        return;
      }
      var day = e.target.closest(".jl-cal__day");
      if (day) {
        selected = parseISO(day.getAttribute("data-iso"));
        cal.setAttribute("data-value", day.getAttribute("data-iso"));
        render();
        cal.dispatchEvent(new CustomEvent("jl-cal:change", { detail: { value: cal.getAttribute("data-value") }, bubbles: true }));
        if (onPick) onPick(selected);
      }
    });

    render();
  }

  function initCal(cal) {
    if (cal.__jlCal) return;
    cal.__jlCal = true;
    mountCal(cal, null);
  }

  function initDatePicker(dp) {
    if (dp.__jlDatePicker) return;
    dp.__jlDatePicker = true;

    var trigger = dp.querySelector(".jl-datepicker__trigger");
    var valueEl = dp.querySelector(".jl-datepicker__value");
    if (!trigger) return;

    var pop = dp.querySelector(".jl-datepicker__pop");
    var cal = pop && pop.querySelector(".jl-cal");
    var cleanup = null;

    function close() {
      if (!pop || pop.hidden) return;
      pop.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (cleanup) { cleanup(); cleanup = null; }
    }
    function open() {
      if (!pop) {
        pop = document.createElement("div");
        pop.className = "jl-datepicker__pop";
        pop.setAttribute("role", "dialog");
        pop.setAttribute("data-align", dp.getAttribute("data-align") || "start");
        cal = document.createElement("div");
        cal.className = "jl-cal";
        if (dp.getAttribute("data-value")) cal.setAttribute("data-value", dp.getAttribute("data-value"));
        pop.appendChild(cal);
        dp.appendChild(pop);
        mountCal(cal, function (d) {
          dp.setAttribute("data-value", toISO(d));
          if (valueEl) { valueEl.textContent = fmt(d); valueEl.removeAttribute("data-placeholder"); }
          dp.dispatchEvent(new CustomEvent("jl-datepicker:change", { detail: { value: toISO(d) }, bubbles: true }));
          close();
        });
      }
      pop.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      var u = window.JLDS && window.JLDS.util;
      var offOutside = u && u.onClickOutside ? u.onClickOutside(dp, close) : function () {};
      var offEsc = u && u.onEscape ? u.onEscape(close) : function () {};
      cleanup = function () { offOutside(); offEsc(); };
    }

    if (cal && pop) {
      // Calendar already in the DOM: wire selection back to the trigger.
      pop.hidden = true;
      mountCal(cal, function (d) {
        dp.setAttribute("data-value", toISO(d));
        if (valueEl) { valueEl.textContent = fmt(d); valueEl.removeAttribute("data-placeholder"); }
        dp.dispatchEvent(new CustomEvent("jl-datepicker:change", { detail: { value: toISO(d) }, bubbles: true }));
        close();
      });
    }

    trigger.addEventListener("click", function () {
      if (pop && !pop.hidden) close();
      else open();
    });
  }

  register("date-picker", function (root) {
    // Standalone calendars first, but skip ones inside a datepicker (handled there).
    root.querySelectorAll(".jl-cal").forEach(function (cal) {
      if (!cal.closest(".jl-datepicker")) initCal(cal);
    });
    root.querySelectorAll(".jl-datepicker").forEach(initDatePicker);
  });
})();
