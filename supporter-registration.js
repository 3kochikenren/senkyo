import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const SUPABASE_CANDIDATE_TABLE = "election_candidates";
const SUPABASE_MEMBER_TABLE = "members";
const SUPABASE_DISTRICT_MASTER_TABLE = "election_district_master";
const SUPABASE_SUPPORTER_TABLE = "supporter_members";

const hasSupabaseConfig =
  SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const params = new URLSearchParams(window.location.search);
const flowTileIdRaw = params.get("tileId") || "";
const flowDistrictName = params.get("districtName") || "";
const flowCandidateName = params.get("candidateName") || "";
const hasFlowCandidate = Boolean(flowCandidateName);

const els = {
  form: document.getElementById("supporterForm"),
  backLink: document.getElementById("backLink"),
  candidateSelect: document.getElementById("candidateSelect"),
  supporterName: document.getElementById("supporterName"),
  supporterFurigana: document.getElementById("supporterFurigana"),
  supporterPostalCode: document.getElementById("supporterPostalCode"),
  supporterAddress: document.getElementById("supporterAddress"),
  supporterPhone: document.getElementById("supporterPhone"),
  supporterMobile: document.getElementById("supporterMobile"),
  supporterEmail: document.getElementById("supporterEmail"),
  supporterRegistrationDate: document.getElementById("supporterRegistrationDate"),
  supporterNote: document.getElementById("supporterNote"),
  recentSupporters: document.getElementById("recentSupporters"),
};

els.supporterRegistrationDate.value = new Date().toISOString().slice(0, 10);

let fixedCandidateId = null;

function setupBackLink() {
  if (!els.backLink) {
    return;
  }

  const cameFromBoard = Boolean(flowDistrictName || flowCandidateName || params.get("votingDate") || params.get("daysLeft"));
  if (!cameFromBoard) {
    els.backLink.href = "settings.html";
    els.backLink.textContent = "設定へ戻る";
    return;
  }

  const boardParams = new URLSearchParams({
    districtName: flowDistrictName,
    tileId: flowTileIdRaw,
    candidateName: flowCandidateName,
    electionType: params.get("electionType") || "",
    notificationDate: params.get("notificationDate") || "",
    votingDate: params.get("votingDate") || params.get("date") || "",
    daysLeft: params.get("daysLeft") || "",
    candidatePhotoUrl: params.get("candidatePhotoUrl") || "",
    postingCount: params.get("postingCount") || "",
    greetingCount: params.get("greetingCount") || "",
  });

  els.backLink.href = `candidate-board.html?${boardParams.toString()}`;
  els.backLink.textContent = "候補者ボードへ戻る";
}

function applyFlowCandidateOption() {
  if (!hasFlowCandidate) {
    return;
  }

  const label = `${flowDistrictName || "選挙区"} / ${flowCandidateName}`;
  els.candidateSelect.innerHTML = `<option value="" data-candidate-name="${flowCandidateName}" selected>${label}</option>`;
  els.candidateSelect.disabled = true;
}

function getSelectedCandidateId() {
  const candidateId = Number(els.candidateSelect.value);
  return Number.isFinite(candidateId) && candidateId > 0 ? candidateId : null;
}

function showNote(message, kind) {
  if (!els.supporterNote) {
    return;
  }

  els.supporterNote.textContent = message;
  els.supporterNote.classList.remove("hidden", "ok", "error");
  els.supporterNote.classList.add(kind);
}

function clearNote() {
  if (!els.supporterNote) {
    return;
  }

  els.supporterNote.classList.add("hidden");
  els.supporterNote.textContent = "";
  els.supporterNote.classList.remove("ok", "error");
}

async function loadCandidates() {
  if (!supabase) {
    applyFlowCandidateOption();
    showNote("Supabase設定が未完了です。", "error");
    return;
  }

  const { data: candidates, error: candidateError } = await supabase
    .from(SUPABASE_CANDIDATE_TABLE)
    .select("id, district_id, member_id")
    .order("created_at", { ascending: false });

  if (candidateError) {
    applyFlowCandidateOption();
    showNote(`候補者一覧の取得に失敗しました: ${candidateError.message}`, "error");
    return;
  }

  const candidateRows = candidates ?? [];
  if (candidateRows.length === 0) {
    if (hasFlowCandidate) {
      applyFlowCandidateOption();
    } else {
      els.candidateSelect.innerHTML = '<option value="">候補者が未登録です</option>';
    }
    showNote("先に候補者登録を行ってください。", "error");
    return;
  }

  const districtIds = [...new Set(candidateRows.map((row) => row.district_id).filter((id) => typeof id === "number"))];
  const memberIds = [...new Set(candidateRows.map((row) => row.member_id).filter((id) => typeof id === "number"))];

  const [districtRes, memberRes] = await Promise.all([
    supabase.from(SUPABASE_DISTRICT_MASTER_TABLE).select("id, district_name").in("id", districtIds),
    supabase.from(SUPABASE_MEMBER_TABLE).select("id, name").in("id", memberIds),
  ]);

  if (districtRes.error) {
    showNote(`選挙区一覧の取得に失敗しました: ${districtRes.error.message}`, "error");
    return;
  }

  if (memberRes.error) {
    showNote(`メンバー一覧の取得に失敗しました: ${memberRes.error.message}`, "error");
    return;
  }

  const districtMap = new Map((districtRes.data ?? []).map((row) => [row.id, row.district_name]));
  const memberMap = new Map((memberRes.data ?? []).map((row) => [row.id, row.name]));

  const candidateViews = [];
  const options = ["<option value=\"\">選択してください</option>"];
  candidateRows.forEach((row) => {
    const districtName = districtMap.get(row.district_id) ?? "選挙区未設定";
    const memberName = memberMap.get(row.member_id) ?? "候補者未設定";
    candidateViews.push({
      id: Number(row.id),
      districtName,
      memberName,
    });
    options.push(
      `<option value=\"${row.id}\" data-candidate-name=\"${memberName}\">${districtName} / ${memberName}</option>`
    );
  });

  els.candidateSelect.innerHTML = options.join("");

  const flowTileId = Number(flowTileIdRaw);
  let preferredCandidate = null;

  if (Number.isFinite(flowTileId) && flowTileId > 0) {
    preferredCandidate = candidateViews.find((row) => row.id === flowTileId) ?? null;
  }

  if (!preferredCandidate && flowCandidateName) {
    preferredCandidate =
      candidateViews.find(
        (row) =>
          row.memberName === flowCandidateName &&
          (!flowDistrictName || row.districtName === flowDistrictName)
      ) ?? null;
  }

  if (preferredCandidate) {
    fixedCandidateId = preferredCandidate.id;
    els.candidateSelect.value = String(preferredCandidate.id);
    els.candidateSelect.disabled = true;
  } else if (hasFlowCandidate) {
    fixedCandidateId = null;
    applyFlowCandidateOption();
  } else {
    fixedCandidateId = null;
    els.candidateSelect.disabled = false;
  }

  clearNote();
}

function renderRecentSupporters(rows) {
  if (!els.recentSupporters) {
    return;
  }

  if (!rows || rows.length === 0) {
    els.recentSupporters.innerHTML = '<p class="empty">まだ登録はありません。</p>';
    return;
  }

  els.recentSupporters.innerHTML = rows
    .map(
      (row) => `
        <article class="recent-item">
          <strong>${row.name}</strong>
          <span>${row.candidate_name}</span>
          <span>登録日 ${row.registration_date}</span>
        </article>
      `
    )
    .join("");
}

async function loadRecentSupporters(candidateId = null, candidateName = "") {
  if (!supabase) {
    return;
  }

  let query = supabase
    .from(SUPABASE_SUPPORTER_TABLE)
    .select("name, candidate_name, registration_date")
    .order("created_at", { ascending: false })
    .limit(10);

  if (Number.isFinite(candidateId) && candidateId > 0) {
    query = query.eq("candidate_id", candidateId);
  } else if (candidateName) {
    query = query.eq("candidate_name", candidateName);
  }

  const { data, error } = await query;

  if (error) {
    renderRecentSupporters([]);
    return;
  }

  renderRecentSupporters(data ?? []);
}

els.candidateSelect.addEventListener("change", () => {
  const selectedId = getSelectedCandidateId();
  const selectedOption = els.candidateSelect.selectedOptions?.[0] || null;
  const selectedName = selectedOption?.getAttribute("data-candidate-name") || "";
  void loadRecentSupporters(selectedId, selectedName);
});

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedOption = els.candidateSelect.selectedOptions?.[0] || null;
  const candidateId = Number(els.candidateSelect.value);
  const candidateName = selectedOption?.getAttribute("data-candidate-name") || "";

  const payload = {
    candidate_id: candidateId,
    candidate_name: candidateName,
    name: els.supporterName.value.trim(),
    furigana: els.supporterFurigana.value.trim(),
    postal_code: els.supporterPostalCode.value.trim(),
    address: els.supporterAddress.value.trim(),
    phone: els.supporterPhone.value.trim(),
    mobile: els.supporterMobile.value.trim(),
    email: els.supporterEmail.value.trim(),
    registration_date: els.supporterRegistrationDate.value,
  };

  if (!Number.isFinite(candidateId) || candidateId <= 0) {
    showNote("候補者名を選択してください。", "error");
    return;
  }

  if (!payload.name) {
    showNote("名前（必須）を入力してください。", "error");
    return;
  }

  if (!payload.registration_date) {
    showNote("登録日を入力してください。", "error");
    return;
  }

  if (!supabase) {
    showNote("Supabase設定が未完了です。", "error");
    return;
  }

  const { error } = await supabase.from(SUPABASE_SUPPORTER_TABLE).insert(payload);

  if (error) {
    showNote(`保存に失敗しました: ${error.message}`, "error");
    return;
  }

  showNote("後援会員を保存しました。", "ok");
  els.supporterName.value = "";
  els.supporterFurigana.value = "";
  els.supporterPostalCode.value = "";
  els.supporterAddress.value = "";
  els.supporterPhone.value = "";
  els.supporterMobile.value = "";
  els.supporterEmail.value = "";
  const currentCandidateId = getSelectedCandidateId();
  const currentOption = els.candidateSelect.selectedOptions?.[0] || null;
  const currentCandidateName = currentOption?.getAttribute("data-candidate-name") || flowCandidateName;
  await loadRecentSupporters(currentCandidateId, currentCandidateName);
});

void (async () => {
  setupBackLink();
  await loadCandidates();
  const selectedId = fixedCandidateId ?? getSelectedCandidateId();
  const selectedOption = els.candidateSelect.selectedOptions?.[0] || null;
  const selectedName = selectedOption?.getAttribute("data-candidate-name") || flowCandidateName;
  await loadRecentSupporters(selectedId, selectedName);
})();
