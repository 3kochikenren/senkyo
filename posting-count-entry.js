import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const SUPABASE_POSTING_TABLE = "posting_counts";
const SUPABASE_ACTIVITY_TABLE = "campaign_activity_counts";
const SUPABASE_MEMBER_TABLE = "members";

const hasSupabaseConfig =
  SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const els = {
  form: document.getElementById("postingForm"),
  districtName: document.getElementById("districtName"),
  candidateName: document.getElementById("candidateName"),
  postingMemberId: document.getElementById("postingMemberId"),
  activityDate: document.getElementById("activityDate"),
  sheetCount: document.getElementById("sheetCount"),
  formNote: document.getElementById("formNote"),
  backToBoardLink: document.getElementById("backToBoardLink"),
  formTitle: document.getElementById("formTitle"),
  formEyebrow: document.getElementById("formEyebrow"),
  sheetCountLabel: document.getElementById("sheetCountLabel"),
};

const params = new URLSearchParams(window.location.search);
const kpiTypeRaw = params.get("kpiType") || "posting";

const KPI_META = {
  posting: {
    key: "posting",
    title: "ポスティング件数入力",
    eyebrow: "Posting Count",
    label: "件数（枚数）",
    valueLabel: "件",
    step: "1",
  },
  greeting: {
    key: "greeting",
    title: "あいさつ件数入力",
    eyebrow: "Greeting Count",
    label: "件数",
    valueLabel: "件",
    step: "1",
  },
  standing: {
    key: "standing",
    title: "辻立ち件数入力",
    eyebrow: "Street Standing",
    label: "件数",
    valueLabel: "件",
    step: "1",
  },
  doublePoster: {
    key: "doublePoster",
    title: "2連ポスター件数入力",
    eyebrow: "Double Poster",
    label: "件数",
    valueLabel: "件",
    step: "1",
  },
  speech: {
    key: "speech",
    title: "街宣時間入力",
    eyebrow: "Street Speech",
    label: "時間",
    valueLabel: "時間",
    step: "0.1",
  },
};

const resolvedKpiType = KPI_META[kpiTypeRaw] ? kpiTypeRaw : "posting";
const kpiMeta = KPI_META[resolvedKpiType];

if (els.formTitle) {
  els.formTitle.textContent = kpiMeta.title;
}
if (els.formEyebrow) {
  els.formEyebrow.textContent = kpiMeta.eyebrow;
}
if (els.sheetCountLabel) {
  els.sheetCountLabel.textContent = kpiMeta.label;
}
document.title = kpiMeta.title;
els.sheetCount.step = kpiMeta.step;

els.districtName.value = params.get("districtName") || "";
els.candidateName.value = params.get("candidateName") || "";
els.activityDate.value = params.get("date") || new Date().toISOString().slice(0, 10);

if (els.backToBoardLink) {
  const boardParams = new URLSearchParams({
    districtName: params.get("districtName") || "",
    tileId: params.get("tileId") || "",
    candidateName: params.get("candidateName") || "",
    electionType: params.get("electionType") || "",
    notificationDate: params.get("notificationDate") || "",
    votingDate: params.get("date") || params.get("votingDate") || "",
    daysLeft: params.get("daysLeft") || "",
    candidatePhotoUrl: params.get("candidatePhotoUrl") || "",
    postingCount: params.get("postingCount") || "",
    greetingCount: params.get("greetingCount") || "",
  });
  els.backToBoardLink.href = `candidate-board.html?${boardParams.toString()}`;
}

async function loadMembers() {
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from(SUPABASE_MEMBER_TABLE)
    .select("id, name")
    .order("created_at", { ascending: false });

  if (error) {
    showNote(`メンバー一覧の取得に失敗しました: ${error.message}`, "error");
    return;
  }

  const members = data ?? [];
  if (members.length === 0) {
    showNote("メンバーが未登録です。先にメンバー登録してください。", "error");
    return;
  }

  const options = [
    '<option value="">メンバーを選択</option>',
    ...members.map((member) => `<option value="${member.id}">${member.name}</option>`),
  ];
  els.postingMemberId.innerHTML = options.join("");
}

function showNote(message, kind) {
  els.formNote.textContent = message;
  els.formNote.classList.remove("hidden", "ok", "error");
  els.formNote.classList.add(kind);
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    district_name: els.districtName.value.trim(),
    candidate_name: els.candidateName.value.trim(),
    posting_member_id: Number(els.postingMemberId.value),
    activity_date: els.activityDate.value,
    count: Number(els.sheetCount.value),
  };

  if (
    !payload.district_name ||
    !payload.candidate_name ||
    !payload.activity_date ||
    Number.isNaN(payload.count) ||
    Number.isNaN(payload.posting_member_id) ||
    payload.posting_member_id <= 0
  ) {
    showNote("入力内容を確認してください。", "error");
    return;
  }

  if (!supabase) {
    showNote("Supabase設定が未完了です。", "error");
    return;
  }

  let error = null;

  if (resolvedKpiType === "posting") {
    const result = await supabase.from(SUPABASE_POSTING_TABLE).insert(payload);
    error = result.error;
  } else {
    const activityPayload = {
      district_name: payload.district_name,
      candidate_name: payload.candidate_name,
      member_id: payload.posting_member_id,
      activity_kind: resolvedKpiType,
      activity_date: payload.activity_date,
      count: payload.count,
    };
    const result = await supabase.from(SUPABASE_ACTIVITY_TABLE).insert(activityPayload);
    error = result.error;
  }

  if (error) {
    showNote(`保存に失敗しました: ${error.message}`, "error");
    return;
  }

  showNote(`${kpiMeta.title}をDBへ保存しました。`, "ok");
  els.sheetCount.value = "";
});

void loadMembers();
