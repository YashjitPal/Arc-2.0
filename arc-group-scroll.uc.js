const LINE_HEIGHT = 20;

function onWheel(event) {
  const group = event.target?.closest?.(
    "tab-group:not([split-view-group]):not([collapsed])",
  );
  if (!group || group.scrollHeight <= group.clientHeight) {
    return;
  }

  let delta = event.deltaY;
  if (event.deltaMode === event.DOM_DELTA_LINE) {
    delta *= LINE_HEIGHT;
  } else if (event.deltaMode === event.DOM_DELTA_PAGE) {
    delta *= group.clientHeight;
  }

  const max = group.scrollHeight - group.clientHeight;
  const next = Math.max(0, Math.min(max, group.scrollTop + delta));

  // At the group's top or bottom, let the event through so the sidebar scrolls.
  if (next === group.scrollTop) {
    return;
  }

  group.scrollTop = next;
  event.preventDefault();
  event.stopPropagation();
}

document.addEventListener("wheel", onWheel, {
  capture: true,
  passive: false,
});
