import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const SUPABASE_MEMBER_TABLE = "members";

const hasSupabaseConfig =
  SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const storageKeys = {
  activities: "campaignShift.activities.v1",
  assignments: "campaignShift.assignments.v1",
  activityMembers: "campaignShift.activityMembers.v1",
  settings: "campaignShift.settings.v1",
};

const defaultActivities = [
  { id: "greeting", name: "挨拶回り", color: "#f4e41b" },
  { id: "posting", name: "ポスティング", color: "#f29e16" },
];

const state = {
  mode: "table",
  date: "",
  startTime: "08:00",
  endTime: "20:00",
  interval: 30,
  activities: [],
  members: [],
  activityMembers: {},
  assignments: {},
  slots: [],
};

const els = {
  timeForm: document.getElementById("timeForm"),
  shiftDate: document.getElementById("shiftDate"),
  startTime: document.getElementById("startTime"),
  endTime: document.getElementById("endTime"),
  slotInterval: document.getElementById("slotInterval"),
  activityForm: document.getElementById("activityForm"),
  activityName: document.getElementById("activityName"),
  activityColor: document.getElementById("activityColor"),
  activityMasterList: document.getElementById("activityMasterList"),
  assignmentMemberConfig: document.getElementById("assignmentMemberConfig"),
  viewNote: document.getElementById("viewNote"),
  shiftTable: document.getElementById("shiftTable"),
  timelineWrap: document.getElementById("timelineWrap"),
  tableWrap: document.getElementById("tableWrap"),
  tableModeBtn: document.getElementById("tableModeBtn"),
  timelineModeBtn: document.getElementById("timelineModeBtn"),
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function parseTimeToMinutes(timeValue) {
  const [hourText, minuteText] = String(timeValue).split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  return hour * 60 + minute;
}

function formatMinutesToTime(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function toDisplayDate(dateValue) {
  if (!dateValue) {
    return "";
  }
  const [yyyy, mm, dd] = dateValue.split("-");
  return `${Number(mm)}/${Number(dd)}`;
}

function buildSlots(startTime, endTime, interval) {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start === null || end === null || end < start || interval <= 0) {
    return [];
  }

  const result = [];
  for (let minute = start; minute <= end; minute += interval) {
    result.push(formatMinutesToTime(minute));
  }
  return result;
}

function getEnabledActivityColumns() {
  return state.activities
    .map((activity) => {
      const memberIds = state.activityMembers[activity.id] || [];
      const members = state.members.filter((member) => memberIds.includes(member.id));
      return { activity, members };
    })
    .filter((group) => group.members.length > 0);
}

function assignmentKey(slotTime, activityId, memberId) {
  return `${state.date}|${slotTime}|${activityId}|${memberId}`;
}

function updateViewNote(text) {
  els.viewNote.textContent = text;
}

function saveState() {
  saveJson(storageKeys.activities, state.activities);
  saveJson(storageKeys.activityMembers, state.activityMembers);
  saveJson(storageKeys.assignments, state.assignments);
  saveJson(storageKeys.settings, {
    date: state.date,
    startTime: state.startTime,
    endTime: state.endTime,
    interval: state.interval,
  });
}

function renderActivityMaster() {
  els.activityMasterList.innerHTML = "";

  if (state.activities.length === 0) {
    els.activityMasterList.innerHTML = '<p class="subtle">作業マスタがありません。</p>';
    renderAssignmentMemberConfig();
    return;
  }

  state.activities.forEach((activity) => {
    const row = document.createElement("div");
    row.className = "activity-row";

    const chip = document.createElement("span");
    chip.className = "activity-chip";
    chip.style.backgroundColor = activity.color;

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = activity.name;
    nameInput.addEventListener("change", () => {
      activity.name = nameInput.value.trim() || activity.name;
      saveState();
      renderAssignmentMemberConfig();
      renderScheduleViews();
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "削除";
    removeBtn.addEventListener("click", () => {
      state.activities = state.activities.filter((item) => item.id !== activity.id);
      delete state.activityMembers[activity.id];

      const nextAssignments = {};
      Object.entries(state.assignments).forEach(([key, value]) => {
        if (!key.includes(`|${activity.id}|`)) {
          nextAssignments[key] = value;
        }
      });
      state.assignments = nextAssignments;

      saveState();
      renderActivityMaster();
      renderScheduleViews();
    });

    row.append(chip, nameInput, removeBtn);
    els.activityMasterList.appendChild(row);
  });

  renderAssignmentMemberConfig();
}

function renderAssignmentMemberConfig() {
  els.assignmentMemberConfig.innerHTML = "";

  if (state.activities.length === 0) {
    els.assignmentMemberConfig.innerHTML = '<p class="subtle">先に作業マスタを追加してください。</p>';
    return;
  }

  if (state.members.length === 0) {
    els.assignmentMemberConfig.innerHTML = '<p class="subtle">メンバーが未登録です。メンバー登録画面で追加してください。</p>';
    return;
  }

  state.activities.forEach((activity) => {
    const card = document.createElement("section");
    card.className = "assign-card";

    const title = document.createElement("div");
    title.className = "assign-title";

    const chip = document.createElement("span");
    chip.className = "activity-chip";
    chip.style.backgroundColor = activity.color;

    const titleText = document.createElement("span");
    titleText.textContent = activity.name;

    title.append(chip, titleText);

    const memberGrid = document.createElement("div");
    memberGrid.className = "member-grid";

    state.members.forEach((member) => {
      const item = document.createElement("label");
      item.className = "member-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = String(member.id);
      checkbox.checked = (state.activityMembers[activity.id] || []).includes(member.id);
      checkbox.addEventListener("change", () => {
        const current = new Set(state.activityMembers[activity.id] || []);
        if (checkbox.checked) {
          current.add(member.id);
        } else {
          current.delete(member.id);
        }
        state.activityMembers[activity.id] = [...current];
        saveState();
        renderScheduleViews();
      });

      const name = document.createElement("span");
      name.textContent = member.name;
      item.append(checkbox, name);
      memberGrid.appendChild(item);
    });

    card.append(title, memberGrid);
    els.assignmentMemberConfig.appendChild(card);
  });
}

function toggleCell(slotTime, activityId, memberId) {
  const key = assignmentKey(slotTime, activityId, memberId);
  state.assignments[key] = !state.assignments[key];
  saveState();
  renderScheduleViews();
}

function renderTableView(columns) {
  if (!state.date || state.slots.length === 0 || columns.length === 0) {
    els.shiftTable.innerHTML = "";
    return;
  }

  const headTopCells = columns
    .map(
      ({ activity, members }) =>
        `<th class="time-group" colspan="${members.length}">${activity.name}</th>`
    )
    .join("");

  const headMemberCells = columns
    .map(({ members }) => members.map((member) => `<th class="member-head">${member.name}</th>`).join(""))
    .join("");

  const bodyRows = state.slots
    .map((slotTime) => {
      const slotCells = columns
        .map(({ activity, members }) =>
          members
            .map((member) => {
              const key = assignmentKey(slotTime, activity.id, member.id);
              const isOn = Boolean(state.assignments[key]);
              const style = isOn ? ` style="background:${activity.color};"` : "";
              const marker = isOn ? "●" : "";
              return `<td class="slot-cell" data-slot="${slotTime}" data-activity="${activity.id}" data-member="${member.id}"${style}>${marker}</td>`;
            })
            .join("")
        )
        .join("");

      return `
        <tr>
          <td class="sticky">${toDisplayDate(state.date)}</td>
          <td class="sticky-2">${slotTime}</td>
          ${slotCells}
        </tr>
      `;
    })
    .join("");

  els.shiftTable.innerHTML = `
    <thead>
      <tr>
        <th class="sticky" rowspan="2">日付</th>
        <th class="sticky-2" rowspan="2">時間</th>
        ${headTopCells}
      </tr>
      <tr>
        ${headMemberCells}
      </tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  `;

  els.shiftTable.querySelectorAll("td.slot-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const slot = cell.getAttribute("data-slot") || "";
      const activityId = cell.getAttribute("data-activity") || "";
      const memberId = Number(cell.getAttribute("data-member"));
      if (!slot || !activityId || !Number.isFinite(memberId)) {
        return;
      }
      toggleCell(slot, activityId, memberId);
    });
  });
}

function renderTimelineView(columns) {
  els.timelineWrap.innerHTML = "";

  if (!state.date || state.slots.length === 0 || columns.length === 0) {
    return;
  }

  const visibleMemberMap = new Map();
  columns.forEach(({ members }) => {
    members.forEach((member) => visibleMemberMap.set(member.id, member));
  });

  const memberList = [...visibleMemberMap.values()];

  memberList.forEach((member) => {
    const card = document.createElement("article");
    card.className = "timeline-card";

    const heading = document.createElement("h3");
    heading.textContent = member.name;

    const list = document.createElement("div");
    list.className = "timeline-list";

    let itemCount = 0;
    state.slots.forEach((slotTime) => {
      columns.forEach(({ activity }) => {
        const key = assignmentKey(slotTime, activity.id, member.id);
        if (!state.assignments[key]) {
          return;
        }

        itemCount += 1;
        const item = document.createElement("button");
        item.type = "button";
        item.className = "timeline-item";

        const time = document.createElement("span");
        time.className = "timeline-time";
        time.textContent = slotTime;

        const label = document.createElement("span");
        label.className = "timeline-label";
        label.textContent = activity.name;
        label.style.backgroundColor = activity.color;

        item.append(time, label);
        item.addEventListener("click", () => {
          toggleCell(slotTime, activity.id, member.id);
        });
        list.appendChild(item);
      });
    });

    if (itemCount === 0) {
      const empty = document.createElement("p");
      empty.className = "subtle";
      empty.textContent = "割当なし";
      list.appendChild(empty);
    }

    card.append(heading, list);
    els.timelineWrap.appendChild(card);
  });
}

function renderScheduleViews() {
  const columns = getEnabledActivityColumns();

  if (!state.date || state.slots.length === 0) {
    updateViewNote("時間枠を設定して「表を自動作成」を押してください。");
    els.shiftTable.innerHTML = "";
    els.timelineWrap.innerHTML = "";
    return;
  }

  if (columns.length === 0) {
    updateViewNote("作業ごとに担当メンバーを選択すると表示できます。");
    els.shiftTable.innerHTML = "";
    els.timelineWrap.innerHTML = "";
    return;
  }

  const totalColumns = columns.reduce((sum, group) => sum + group.members.length, 0);
  updateViewNote(`${toDisplayDate(state.date)} / ${state.slots.length}枠 / ${totalColumns}列`);

  renderTableView(columns);
  renderTimelineView(columns);
}

function switchMode(mode) {
  state.mode = mode;
  els.tableModeBtn.classList.toggle("active", mode === "table");
  els.timelineModeBtn.classList.toggle("active", mode === "timeline");
  els.tableWrap.classList.toggle("hidden", mode !== "table");
  els.timelineWrap.classList.toggle("hidden", mode !== "timeline");
}

async function loadMembers() {
  if (!supabase) {
    state.members = [];
    return;
  }

  const { data, error } = await supabase
    .from(SUPABASE_MEMBER_TABLE)
    .select("id, name")
    .order("created_at", { ascending: false });

  if (error) {
    state.members = [];
    updateViewNote(`メンバー取得に失敗しました: ${error.message}`);
    return;
  }

  state.members = (data || []).map((row) => ({ id: Number(row.id), name: row.name || "メンバー" }));
}

function hydrateStateFromStorage() {
  state.activities = loadJson(storageKeys.activities, defaultActivities);
  state.activityMembers = loadJson(storageKeys.activityMembers, {});
  state.assignments = loadJson(storageKeys.assignments, {});

  const settings = loadJson(storageKeys.settings, null);
  const today = new Date().toISOString().slice(0, 10);
  state.date = settings?.date || today;
  state.startTime = settings?.startTime || "08:00";
  state.endTime = settings?.endTime || "20:00";
  state.interval = Number(settings?.interval || 30);
  state.slots = buildSlots(state.startTime, state.endTime, state.interval);

  els.shiftDate.value = state.date;
  els.startTime.value = state.startTime;
  els.endTime.value = state.endTime;
  els.slotInterval.value = String(state.interval);
}

function bindEvents() {
  els.timeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    state.date = els.shiftDate.value;
    state.startTime = els.startTime.value;
    state.endTime = els.endTime.value;
    state.interval = Number(els.slotInterval.value);
    state.slots = buildSlots(state.startTime, state.endTime, state.interval);

    if (state.slots.length === 0) {
      updateViewNote("時間設定を見直してください（開始 <= 終了 / 間隔 > 0）。");
      els.shiftTable.innerHTML = "";
      els.timelineWrap.innerHTML = "";
      return;
    }

    saveState();
    renderScheduleViews();
  });

  els.activityForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.activityName.value.trim();
    if (!name) {
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.activities.push({ id, name, color: els.activityColor.value || "#f4e41b" });
    state.activityMembers[id] = [];

    els.activityName.value = "";
    saveState();
    renderActivityMaster();
    renderScheduleViews();
  });

  els.tableModeBtn.addEventListener("click", () => switchMode("table"));
  els.timelineModeBtn.addEventListener("click", () => switchMode("timeline"));
}

async function init() {
  hydrateStateFromStorage();
  bindEvents();
  await loadMembers();
  renderActivityMaster();
  renderScheduleViews();

  if (window.matchMedia("(max-width: 900px)").matches) {
    switchMode("timeline");
  } else {
    switchMode("table");
  }
}

void init();
