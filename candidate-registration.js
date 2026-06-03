import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const CANDIDATE_TABLE = "election_candidates";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const openAddCandidateBtn = document.getElementById("openAddCandidateBtn");
const cancelCandidateBtn = document.getElementById("cancelCandidateBtn");
const candidateFormPanel = document.getElementById("candidateFormPanel");
const candidateModalBackdrop = document.getElementById("candidateModalBackdrop");
const candidateForm = document.getElementById("candidateForm");
const candidateDistrictSelect = document.getElementById("candidateDistrictSelect");
const candidateMemberSelect = document.getElementById("candidateMemberSelect");
const candidateActivityStartDate = document.getElementById("candidateActivityStartDate");
const candidateOfficialApprovalDate = document.getElementById("candidateOfficialApprovalDate");
const candidatePopulation = document.getElementById("candidatePopulation");
const candidateHouseholds = document.getElementById("candidateHouseholds");
const candidateVoteTarget = document.getElementById("candidateVoteTarget");
const candidatePostingTarget = document.getElementById("candidatePostingTarget");
const candidateGreetingTarget = document.getElementById("candidateGreetingTarget");
const candidateStreetStandingTarget = document.getElementById("candidateStreetStandingTarget");
const candidateDoublePosterTarget = document.getElementById("candidateDoublePosterTarget");
const candidateStreetSpeechHoursTarget = document.getElementById("candidateStreetSpeechHoursTarget");
const candidateList = document.getElementById("candidateList");
const candidateNote = document.getElementById("candidateNote");
const candidateListNote = document.getElementById("candidateListNote");
const saveCandidateBtn = document.getElementById("saveCandidateBtn");
const deleteCandidateBtn = document.getElementById("deleteCandidateBtn");
const candidatePanelTitle = document.getElementById("candidatePanelTitle");

let districts = [];
let members = [];
let selectedCandidate = null;

function isMissingCandidateTableError(error) {
  const message = String(error?.message ?? "");
  return (
    message.includes("Could not find the table 'public.election_candidates' in the schema cache") ||
    message.includes("relation \"public.election_candidates\" does not exist")
  );
}

function isMissingCandidateColumnError(error) {
  const message = String(error?.message ?? "");
  return message.includes("column election_candidates.") && message.includes(" does not exist");
}

function isCandidatePolicyError(error) {
  const message = String(error?.message ?? "");
  return (
    message.includes("new row violates row-level security policy") ||
    message.includes("permission denied for table election_candidates")
  );
}

function showNote(message) {
  candidateNote.textContent = message;
  candidateNote.classList.remove("hidden");
}

function hideNote() {
  candidateNote.textContent = "";
  candidateNote.classList.add("hidden");
}

function openCreatePanel() {
  selectedCandidate = null;
  candidatePanelTitle.textContent = "候補者を追加";
  deleteCandidateBtn.classList.add("hidden");
  candidateFormPanel.classList.remove("hidden");
  candidateFormPanel.setAttribute("aria-hidden", "false");
  hideNote();
  candidateDistrictSelect.value = "";
  candidateMemberSelect.value = "";
  candidateActivityStartDate.value = "";
  candidateOfficialApprovalDate.value = "";
  candidatePopulation.value = "";
  candidateHouseholds.value = "";
  candidateVoteTarget.value = "";
  candidatePostingTarget.value = "";
  candidateGreetingTarget.value = "";
  candidateStreetStandingTarget.value = "";
  candidateDoublePosterTarget.value = "";
  candidateStreetSpeechHoursTarget.value = "";
}

function openEditPanel(candidate) {
  selectedCandidate = candidate;
  candidatePanelTitle.textContent = "候補者を編集";
  deleteCandidateBtn.classList.remove("hidden");
  candidateFormPanel.classList.remove("hidden");
  candidateFormPanel.setAttribute("aria-hidden", "false");
  hideNote();
  candidateDistrictSelect.value = String(candidate.district_id ?? "");
  candidateMemberSelect.value = String(candidate.member_id ?? "");
  candidateActivityStartDate.value = candidate.activity_start_date ?? "";
  candidateOfficialApprovalDate.value = candidate.official_approval_date ?? "";
  candidatePopulation.value = candidate.population ?? "";
  candidateHouseholds.value = candidate.households ?? "";
  candidateVoteTarget.value = candidate.vote_target ?? "";
  candidatePostingTarget.value = candidate.posting_target ?? "";
  candidateGreetingTarget.value = candidate.greeting_target ?? "";
  candidateStreetStandingTarget.value = candidate.street_standing_target ?? "";
  candidateDoublePosterTarget.value = candidate.double_poster_target ?? "";
  candidateStreetSpeechHoursTarget.value = candidate.street_speech_hours_target ?? "";
}

function closePanel() {
  const active = document.activeElement;
  if (active instanceof HTMLElement && candidateFormPanel.contains(active)) {
    active.blur();
  }

  candidateFormPanel.classList.add("hidden");
  candidateFormPanel.setAttribute("aria-hidden", "true");
  selectedCandidate = null;
  hideNote();
  candidateDistrictSelect.value = "";
  candidateMemberSelect.value = "";
  candidateActivityStartDate.value = "";
  candidateOfficialApprovalDate.value = "";
  candidatePopulation.value = "";
  candidateHouseholds.value = "";
  candidateVoteTarget.value = "";
  candidatePostingTarget.value = "";
  candidateGreetingTarget.value = "";
  candidateStreetStandingTarget.value = "";
  candidateDoublePosterTarget.value = "";
  candidateStreetSpeechHoursTarget.value = "";
}

function toNullableDate(value) {
  return value ? value : null;
}

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function renderSelectOptions() {
  candidateDistrictSelect.innerHTML =
    '<option value="">選択してください</option>' +
    districts
      .map((district) => `<option value="${district.id}">${district.district_name}</option>`)
      .join("");

  candidateMemberSelect.innerHTML =
    '<option value="">選択してください</option>' +
    members.map((member) => `<option value="${member.id}">${member.name}</option>`).join("");
}

function renderCandidateList(rows) {
  if (rows.length === 0) {
    candidateList.innerHTML = '<p class="lead">候補者はまだ登録されていません。</p>';
    return;
  }

  const districtMap = new Map(districts.map((item) => [item.id, item.district_name]));
  const memberMap = new Map(members.map((item) => [item.id, item.name]));

  candidateList.innerHTML = rows
    .map((row) => {
      const districtName = districtMap.get(row.district_id) ?? "未設定";
      const memberName = memberMap.get(row.member_id) ?? "不明なメンバー";
      return `
        <article class="candidate-item" data-candidate-id="${row.id}">
          <strong>${memberName}</strong>
          <span>選挙区: ${districtName}</span>
          <span>登録日: ${String(row.created_at).slice(0, 10)}</span>
        </article>
      `;
    })
    .join("");

  rows.forEach((row) => {
    const tile = candidateList.querySelector(`[data-candidate-id="${row.id}"]`);
    if (!tile) {
      return;
    }

    tile.addEventListener("click", () => {
      openEditPanel(row);
    });
  });
}

async function loadMasterData() {
  const [districtRes, memberRes] = await Promise.all([
    supabase
      .from("election_district_master")
      .select("id, district_name")
      .order("notification_date", { ascending: false }),
    supabase.from("members").select("id, name").order("created_at", { ascending: false }),
  ]);

  if (districtRes.error) {
    candidateListNote.textContent = `選挙区取得に失敗しました: ${districtRes.error.message}`;
    candidateListNote.classList.remove("hidden");
    return false;
  }

  if (memberRes.error) {
    candidateListNote.textContent = `メンバー取得に失敗しました: ${memberRes.error.message}`;
    candidateListNote.classList.remove("hidden");
    return false;
  }

  candidateListNote.classList.add("hidden");
  districts = districtRes.data ?? [];
  members = memberRes.data ?? [];
  renderSelectOptions();
  return true;
}

async function loadCandidateList() {
  const { data, error } = await supabase
    .from(CANDIDATE_TABLE)
    .select(
      "id, district_id, member_id, created_at, activity_start_date, official_approval_date, population, households, vote_target, posting_target, greeting_target, street_standing_target, double_poster_target, street_speech_hours_target"
    )
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingCandidateTableError(error) || isMissingCandidateColumnError(error)) {
      candidateListNote.textContent =
        "候補者テーブルの最新カラムが未反映です。Supabase SQL Editorでsupabase.sqlを再実行してから再読み込みしてください。";
    } else {
      candidateListNote.textContent = `候補者一覧取得に失敗しました: ${error.message}`;
    }
    candidateListNote.classList.remove("hidden");
    return;
  }

  candidateListNote.classList.add("hidden");
  renderCandidateList(data ?? []);
}

openAddCandidateBtn.addEventListener("click", () => {
  openCreatePanel();
});

cancelCandidateBtn.addEventListener("click", () => {
  closePanel();
});

candidateModalBackdrop.addEventListener("click", () => {
  closePanel();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !candidateFormPanel.classList.contains("hidden")) {
    closePanel();
  }
});

candidateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  void (async () => {
    const districtId = Number(candidateDistrictSelect.value);
    const memberId = Number(candidateMemberSelect.value);
    const activityStartDate = toNullableDate(candidateActivityStartDate.value);
    const officialApprovalDate = toNullableDate(candidateOfficialApprovalDate.value);
    const population = toNullableNumber(candidatePopulation.value);
    const households = toNullableNumber(candidateHouseholds.value);
    const voteTarget = toNullableNumber(candidateVoteTarget.value);
    const postingTarget = toNullableNumber(candidatePostingTarget.value);
    const greetingTarget = toNullableNumber(candidateGreetingTarget.value);
    const streetStandingTarget = toNullableNumber(candidateStreetStandingTarget.value);
    const doublePosterTarget = toNullableNumber(candidateDoublePosterTarget.value);
    const streetSpeechHoursTarget = toNullableNumber(candidateStreetSpeechHoursTarget.value);

    const numericValues = [
      population,
      households,
      voteTarget,
      postingTarget,
      greetingTarget,
      streetStandingTarget,
      doublePosterTarget,
      streetSpeechHoursTarget,
    ];

    if (Number.isNaN(districtId) || Number.isNaN(memberId)) {
      showNote("選挙区とメンバーを選択してください。");
      return;
    }

    if (numericValues.some((value) => Number.isNaN(value))) {
      showNote("数値項目を正しく入力してください。");
      return;
    }

    if (numericValues.some((value) => value !== null && value < 0)) {
      showNote("数値項目は0以上で入力してください。");
      return;
    }

    const payload = {
      district_id: districtId,
      member_id: memberId,
      activity_start_date: activityStartDate,
      official_approval_date: officialApprovalDate,
      population: population,
      households: households,
      vote_target: voteTarget,
      posting_target: postingTarget,
      greeting_target: greetingTarget,
      street_standing_target: streetStandingTarget,
      double_poster_target: doublePosterTarget,
      street_speech_hours_target: streetSpeechHoursTarget,
    };

    saveCandidateBtn.disabled = true;
    let error;

    if (selectedCandidate) {
      const result = await supabase
        .from(CANDIDATE_TABLE)
        .update(payload)
        .eq("id", selectedCandidate.id);
      error = result.error;
    } else {
      const result = await supabase.from(CANDIDATE_TABLE).insert(payload);
      error = result.error;
    }

    saveCandidateBtn.disabled = false;

    if (error) {
      if (isMissingCandidateTableError(error) || isMissingCandidateColumnError(error)) {
        showNote(
          "候補者テーブルの最新カラムが未反映です。Supabase SQL Editorでsupabase.sqlを実行し、ページを再読み込みしてください。"
        );
      } else if (isCandidatePolicyError(error)) {
        showNote(
          "候補者テーブルの更新ポリシーが未反映です。Supabase SQL Editorでsupabase.sqlを再実行してください。"
        );
      } else {
        showNote(`保存に失敗しました: ${error.message}`);
      }
      return;
    }

    await loadCandidateList();
    closePanel();
  })();
});

deleteCandidateBtn.addEventListener("click", () => {
  void (async () => {
    if (!selectedCandidate) {
      return;
    }

    const ok = window.confirm("本当に削除してもいいですか？");
    if (!ok) {
      closePanel();
      return;
    }

    deleteCandidateBtn.disabled = true;
    const { error } = await supabase.from(CANDIDATE_TABLE).delete().eq("id", selectedCandidate.id);
    deleteCandidateBtn.disabled = false;

    if (error) {
      showNote(`削除に失敗しました: ${error.message}`);
      return;
    }

    await loadCandidateList();
    closePanel();
  })();
});

void (async () => {
  const ok = await loadMasterData();
  if (ok) {
    await loadCandidateList();
  }
})();
