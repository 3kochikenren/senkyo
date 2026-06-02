import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const SUPABASE_TABLE = "volunteer_applications";
const SUPABASE_MEMBER_TABLE = "members";
const SUPABASE_DISTRICT_MASTER_TABLE = "election_district_master";
const SUPABASE_CANDIDATE_TABLE = "election_candidates";

const hasSupabaseConfig =
  SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const campaigns = [
  {
    id: "akita-city",
    headquarters: "秋市議会対策本部",
    district: "秋市",
    electionType: "市議会議員選挙",
    electionDate: "2026-07-19",
    daysLeft: 47,
    candidateSummary: "地域密着の街頭・訪問・掲示を統合して進行中",
    postingCount: 1240,
    greetingCount: 860,
    posterCount: 318,
    candidates: [
      { id: "akita-1", name: "山本 ひろし", role: "現職", district: "秋市中心部", status: "街頭と地域行脚を強化", phone: "090-1234-5678", email: "hiroshi@example.jp", color: "amber", initials: "HY", focus: "交通・子育て・商店街" },
      { id: "akita-2", name: "佐藤 みゆき", role: "新人", district: "秋市東部", status: "女性ネットワークと現場対話を拡大", phone: "090-2222-3333", email: "miyuki@example.jp", color: "rose", initials: "SM", focus: "福祉・教育・防災" },
      { id: "akita-3", name: "高橋 しゅん", role: "新人", district: "秋市西部", status: "駅前配布と夕方の挨拶を担当", phone: "090-4444-5555", email: "shun@example.jp", color: "emerald", initials: "TS", focus: "雇用・交通・観光" },
      { id: "akita-4", name: "中村 あや", role: "サポート候補", district: "秋市南部", status: "4人以上のため一覧を圧縮表示", phone: "090-6666-7777", email: "aya@example.jp", color: "sky", initials: "NA", focus: "生活道路・教育・高齢者" },
    ],
    actionPlan: [
      { date: "6/2", time: "18:30 - 20:00", title: "駅前挨拶", detail: "主要駅でのあいさつとチラシ配布。" },
      { date: "6/3", time: "10:00 - 12:00", title: "ポスター確認", detail: "掲示状況と剥がれの確認、差し替え。" },
      { date: "6/3", time: "14:00 - 16:30", title: "地域訪問", detail: "商店街と住宅地を回り、要望を回収。" },
    ],
  },
  {
    id: "akita-pref",
    headquarters: "県政連携本部",
    district: "県北ブロック",
    electionType: "県議会議員選挙",
    electionDate: "2026-08-02",
    daysLeft: 61,
    candidateSummary: "広域対応のため地区別に班編成中",
    postingCount: 920,
    greetingCount: 740,
    posterCount: 206,
    candidates: [
      { id: "akita-pref-1", name: "小林 なお", role: "現職", district: "県北第一区", status: "農業・医療を中心に訴求", phone: "090-8888-9999", email: "nao@example.jp", color: "indigo", initials: "KN", focus: "農業・医療・道路" },
      { id: "akita-pref-2", name: "田中 れん", role: "新人", district: "県北第二区", status: "集会と訪問の連携を担当", phone: "090-1212-3434", email: "ren@example.jp", color: "lime", initials: "TR", focus: "産業・教育・物流" },
    ],
    actionPlan: [
      { date: "6/2", time: "19:00 - 20:30", title: "地区打合せ", detail: "班長と当日の動線を再確認。" },
      { date: "6/4", time: "08:30 - 11:00", title: "街頭演説", detail: "通勤帯に合わせて重点駅で実施。" },
    ],
  },
  {
    id: "akita-town",
    headquarters: "町村対策室",
    district: "南町",
    electionType: "町議会議員補欠選挙",
    electionDate: "2026-06-28",
    daysLeft: 26,
    candidateSummary: "少人数体制で機動的に対応",
    postingCount: 410,
    greetingCount: 290,
    posterCount: 102,
    candidates: [
      { id: "akita-town-1", name: "藤井 さとる", role: "新人", district: "南町全域", status: "地域集会を中心に活動", phone: "090-7777-1111", email: "satoru@example.jp", color: "stone", initials: "FS", focus: "暮らし・子育て・防災" },
    ],
    actionPlan: [
      { date: "6/2", time: "17:00 - 18:00", title: "戸別訪問", detail: "近隣商店と住宅のあいさつ回り。" },
      { date: "6/5", time: "13:00 - 15:00", title: "タウンミーティング", detail: "住民の要望を集約して記録。" },
    ],
  },
];

const volunteerSkills = ["街頭整理", "ポスティング", "電話対応", "運営補助"];
const volunteerDays = ["6/2", "6/3", "6/4", "6/5", "6/6"];
const volunteerTimes = ["午前", "午後", "夕方", "終日"];

const state = {
  campaignId: campaigns[0].id,
  candidateId: campaigns[0].candidates[0].id,
  volunteerOpen: false,
  planOpen: false,
  memberOpen: false,
  districtMasterOpen: false,
  districtMasterEditingId: null,
  recentApplications: [],
  recentMembers: [],
  recentDistrictMasters: [],
  form: { name: "", contact: "", skills: [], days: [], times: [] },
  memberForm: { name: "", address: "", mobile: "", email: "", lineId: "" },
  districtMasterForm: {
    districtName: "",
    notificationDate: "",
    votingDate: "",
    earlyVoting: "",
    seats: "",
  },
  upcomingElectionTile: null,
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function calcDaysLeftToNotification(notificationDate) {
  const notification = parseIsoDate(notificationDate);
  if (!notification) {
    return 0;
  }

  const today = startOfToday();
  const diff = Math.ceil((notification.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

function getFallbackTile(campaign, selectedCandidate) {
  return {
    districtName: campaign.district,
    electionType: campaign.electionType,
    votingDate: campaign.electionDate,
    daysLeft: campaign.daysLeft,
    candidateName: selectedCandidate?.name ?? "候補者 未設定",
    candidatePhotoUrl: "",
  };
}

function toSubmission(entry) {
  return {
    name: entry.name ?? "",
    contact: entry.contact ?? "",
    skills: Array.isArray(entry.skills) ? entry.skills : [],
    days: Array.isArray(entry.days) ? entry.days : [],
    times: Array.isArray(entry.times) ? entry.times : [],
  };
}

function toMember(entry) {
  return {
    name: entry.name ?? "",
    address: entry.address ?? "",
    mobile: entry.mobile ?? "",
    email: entry.email ?? "",
    lineId: entry.line_id ?? entry.lineId ?? "",
  };
}

function toDistrictMaster(entry) {
  return {
    id: entry.id ?? null,
    districtName: entry.district_name ?? "",
    notificationDate: entry.notification_date ?? "",
    votingDate: entry.voting_date ?? "",
    earlyVoting: entry.early_voting ?? "",
    seats: entry.seats ?? 0,
  };
}

function getVolunteerPayload() {
  const campaign = getCampaign();

  return {
    campaign_id: campaign.id,
    headquarters: campaign.headquarters,
    district: campaign.district,
    election_type: campaign.electionType,
    name: state.form.name.trim(),
    contact: state.form.contact.trim(),
    skills: [...state.form.skills],
    days: [...state.form.days],
    times: [...state.form.times],
  };
}

function getMemberPayload() {
  return {
    name: state.memberForm.name.trim(),
    address: state.memberForm.address.trim(),
    mobile: state.memberForm.mobile.trim(),
    email: state.memberForm.email.trim(),
    line_id: state.memberForm.lineId.trim(),
  };
}

function getDistrictMasterPayload() {
  return {
    district_name: state.districtMasterForm.districtName.trim(),
    notification_date: state.districtMasterForm.notificationDate,
    voting_date: state.districtMasterForm.votingDate,
    early_voting: state.districtMasterForm.earlyVoting.trim(),
    seats: Number(state.districtMasterForm.seats),
  };
}

function resetDistrictMasterForm() {
  state.districtMasterForm = {
    districtName: "",
    notificationDate: "",
    votingDate: "",
    earlyVoting: "",
    seats: "",
  };
  state.districtMasterEditingId = null;
}

const els = {
  daysLeft: document.getElementById("daysLeft"),
  districtName: document.getElementById("districtName"),
  electionType: document.getElementById("electionType"),
  electionDate: document.getElementById("electionDate"),
  districtPortrait: document.getElementById("districtPortrait"),
  districtPortraitImage: document.getElementById("districtPortraitImage"),
  districtCandidateName: document.getElementById("districtCandidateName"),
  postingCount: document.getElementById("postingCount"),
  greetingCount: document.getElementById("greetingCount"),
  campaignList: document.getElementById("campaignList"),
  headquartersName: document.getElementById("headquartersName"),
  campaignSummary: document.getElementById("campaignSummary"),
  candidateArea: document.getElementById("candidateArea"),
  candidateCount: document.getElementById("candidateCount"),
  volunteerPanel: document.getElementById("volunteerPanel"),
  planPanel: document.getElementById("planPanel"),
  planGrid: document.getElementById("planGrid"),
  toggleVolunteerBtn: document.getElementById("toggleVolunteerBtn"),
  districtVolunteerBtn: document.getElementById("districtVolunteerBtn"),
  districtOrgChartBtn: document.getElementById("districtOrgChartBtn"),
  closeVolunteerBtn: document.getElementById("closeVolunteerBtn"),
  togglePlanBtn: document.getElementById("togglePlanBtn"),
  closePlanBtn: document.getElementById("closePlanBtn"),
  toggleMemberBtn: document.getElementById("toggleMemberBtn"),
  closeMemberBtn: document.getElementById("closeMemberBtn"),
  toggleDistrictMasterBtn: document.getElementById("toggleDistrictMasterBtn"),
  closeDistrictMasterBtn: document.getElementById("closeDistrictMasterBtn"),
  volunteerForm: document.getElementById("volunteerForm"),
  volunteerName: document.getElementById("volunteerName"),
  volunteerContact: document.getElementById("volunteerContact"),
  skillsGroup: document.getElementById("skillsGroup"),
  daysGroup: document.getElementById("daysGroup"),
  timesGroup: document.getElementById("timesGroup"),
  submissionNote: document.getElementById("submissionNote"),
  recentApplications: document.getElementById("recentApplications"),
  memberPanel: document.getElementById("memberPanel"),
  memberForm: document.getElementById("memberForm"),
  memberName: document.getElementById("memberName"),
  memberAddress: document.getElementById("memberAddress"),
  memberMobile: document.getElementById("memberMobile"),
  memberEmail: document.getElementById("memberEmail"),
  memberLineId: document.getElementById("memberLineId"),
  memberNote: document.getElementById("memberNote"),
  recentMembers: document.getElementById("recentMembers"),
  districtMasterPanel: document.getElementById("districtMasterPanel"),
  districtMasterForm: document.getElementById("districtMasterForm"),
  masterDistrictName: document.getElementById("masterDistrictName"),
  masterNotificationDate: document.getElementById("masterNotificationDate"),
  masterVotingDate: document.getElementById("masterVotingDate"),
  masterEarlyVoting: document.getElementById("masterEarlyVoting"),
  masterSeats: document.getElementById("masterSeats"),
  districtMasterNote: document.getElementById("districtMasterNote"),
  recentDistrictMasters: document.getElementById("recentDistrictMasters"),
};

function getCampaign() {
  return campaigns.find((item) => item.id === state.campaignId) ?? campaigns[0];
}

function getSelectedCandidate(campaign) {
  return campaign.candidates.find((candidate) => candidate.id === state.candidateId) ?? campaign.candidates[0];
}

function renderCampaignList() {
  els.campaignList.innerHTML = "";
  campaigns.forEach((campaign) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `campaign-item${campaign.id === state.campaignId ? " active" : ""}`;
    button.innerHTML = `
      <div class="campaign-item-top">
        <div>
          <p class="eyebrow" style="color:#7c6f5b">${campaign.headquarters}</p>
          <h3>${campaign.district}</h3>
          <p>${campaign.electionType}</p>
        </div>
        <div class="day-pill">
          <strong>${campaign.daysLeft}</strong>
          <small>DAYS</small>
        </div>
      </div>
    `;
    button.addEventListener("click", () => {
      state.campaignId = campaign.id;
      state.candidateId = campaign.candidates[0].id;
      state.volunteerOpen = false;
      state.planOpen = false;
      updateView();
    });
    els.campaignList.appendChild(button);
  });
}

function portraitClass(color) {
  return `portrait ${color}`;
}

function renderCandidates(campaign) {
  const selected = getSelectedCandidate(campaign);
  const expandedMode = campaign.candidates.length >= 4;

  if (expandedMode) {
    const cards = campaign.candidates
      .map(
        (candidate) => `
          <button type="button" class="candidate-button${candidate.id === selected.id ? " active" : ""}" data-candidate="${candidate.id}">
            <div class="candidate-top">
              <div class="${portraitClass(candidate.color)}">${candidate.initials}</div>
              <div class="candidate-info">
                <p>${candidate.district}</p>
                <h3>${candidate.name}</h3>
                <p>${candidate.role}</p>
              </div>
            </div>
          </button>
        `,
      )
      .join("");

    els.candidateArea.innerHTML = `
      <div class="candidate-grid">
        <div class="candidate-grid three-cols">${cards}</div>
        <article class="selected-candidate card">
          <div class="candidate-top">
            <div class="${portraitClass(selected.color)}">${selected.initials}</div>
            <div>
              <p class="eyebrow" style="color:#7c6f5b">選択中の候補者</p>
              <h3>${selected.name}</h3>
              <p>${selected.district} / ${selected.focus}</p>
              <p>${selected.status}</p>
            </div>
          </div>
          <div class="form-grid" style="margin-top:16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
            <div class="recent-item"><span>電話</span><strong>${selected.phone}</strong></div>
            <div class="recent-item"><span>メール</span><strong>${selected.email}</strong></div>
          </div>
        </article>
      </div>
    `;
  } else {
    els.candidateArea.innerHTML = `
      <div class="candidate-grid three-cols">
        ${campaign.candidates
          .map(
            (candidate) => `
              <article class="candidate-card">
                <div class="candidate-top">
                  <div class="${portraitClass(candidate.color)}">${candidate.initials}</div>
                  <div class="candidate-info">
                    <p>${candidate.role}</p>
                    <h3>${candidate.name}</h3>
                    <p>${candidate.district}</p>
                  </div>
                </div>
                <p style="margin-top:14px; line-height:1.7; color:#6b6358;">${candidate.status}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  els.candidateArea.querySelectorAll("[data-candidate]").forEach((button) => {
    button.addEventListener("click", () => {
      state.candidateId = button.getAttribute("data-candidate") || state.candidateId;
      updateView();
    });
  });
}

function renderSkillButtons() {
  els.skillsGroup.innerHTML = volunteerSkills
    .map(
      (skill) => `
        <button type="button" class="chip${state.form.skills.includes(skill) ? " active" : ""}" data-skill="${skill}">${skill}</button>
      `,
    )
    .join("");

  els.daysGroup.innerHTML = volunteerDays
    .map(
      (day) => `
        <button type="button" class="chip day${state.form.days.includes(day) ? " active" : ""}" data-day="${day}">${day}</button>
      `,
    )
    .join("");

  els.timesGroup.innerHTML = volunteerTimes
    .map(
      (time) => `
        <button type="button" class="chip time${state.form.times.includes(time) ? " active" : ""}" data-time="${time}">${time}</button>
      `,
    )
    .join("");

  els.skillsGroup.querySelectorAll("[data-skill]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-skill");
      if (!value) return;
      if (state.form.skills.includes(value)) {
        state.form.skills = state.form.skills.filter((item) => item !== value);
      } else {
        state.form.skills = [...state.form.skills, value];
      }
      updateView(false);
    });
  });

  els.daysGroup.querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-day");
      if (!value) return;
      if (state.form.days.includes(value)) {
        state.form.days = state.form.days.filter((item) => item !== value);
      } else {
        state.form.days = [...state.form.days, value];
      }
      updateView(false);
    });
  });

  els.timesGroup.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-time");
      if (!value) return;
      if (state.form.times.includes(value)) {
        state.form.times = state.form.times.filter((item) => item !== value);
      } else {
        state.form.times = [...state.form.times, value];
      }
      updateView(false);
    });
  });
}

function renderPlan(campaign) {
  els.planGrid.innerHTML = campaign.actionPlan
    .map(
      (item) => `
        <article class="plan-item">
          <span>${item.date}</span>
          <strong>${item.title}</strong>
          <span>${item.time}</span>
          <p style="margin:10px 0 0; line-height:1.7; color:#6b6358;">${item.detail}</p>
        </article>
      `,
    )
    .join("");
}

function renderRecentApplications() {
  if (state.recentApplications.length === 0) {
    els.recentApplications.innerHTML = '<p class="empty">まだ応募はありません。</p>';
    return;
  }

  els.recentApplications.innerHTML = state.recentApplications
    .map(
      (entry) => `
        <div class="recent-item">
          <strong>${entry.name}</strong>
          <span>${entry.contact}</span>
          <span>${[...entry.skills, ...entry.days, ...entry.times].join(" / ")}</span>
        </div>
      `,
    )
    .join("");
}

function renderRecentMembers() {
  if (state.recentMembers.length === 0) {
    els.recentMembers.innerHTML = '<p class="empty">まだ登録はありません。</p>';
    return;
  }

  els.recentMembers.innerHTML = state.recentMembers
    .map(
      (entry) => `
        <div class="recent-item">
          <strong>${entry.name}</strong>
          <span>${entry.address}</span>
          <span>${entry.mobile} / ${entry.email} / ${entry.lineId}</span>
        </div>
      `,
    )
    .join("");
}

function renderRecentDistrictMasters() {
  if (state.recentDistrictMasters.length === 0) {
    els.recentDistrictMasters.innerHTML = '<p class="empty">まだ登録はありません。</p>';
    return;
  }

  els.recentDistrictMasters.innerHTML = state.recentDistrictMasters
    .map(
      (entry) => `
        <div class="recent-item">
          <strong>${entry.districtName}</strong>
          <span>告示日 ${entry.notificationDate} / 投票日 ${entry.votingDate}</span>
          <span>期日前 ${entry.earlyVoting} / 定数 ${entry.seats}</span>
          <div class="recent-actions">
            <button type="button" class="mini-action edit" data-district-edit="${entry.id}">編集</button>
            <button type="button" class="mini-action delete" data-district-delete="${entry.id}">削除</button>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadRecentApplications() {
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("name, contact, skills, days, times")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    if (!error.message.includes("Could not find the table")) {
      els.submissionNote.textContent = `Supabaseの読み込みに失敗しました: ${error.message}`;
      els.submissionNote.classList.remove("hidden");
    }
    return;
  }

  state.recentApplications = (data ?? []).map(toSubmission);
  renderRecentApplications();
}

async function loadRecentMembers() {
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from(SUPABASE_MEMBER_TABLE)
    .select("name, address, mobile, email, line_id")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    if (!error.message.includes("Could not find the table")) {
      els.memberNote.textContent = `Supabaseの読み込みに失敗しました: ${error.message}`;
      els.memberNote.classList.remove("hidden");
    }
    return;
  }

  state.recentMembers = (data ?? []).map(toMember);
  renderRecentMembers();
}

async function loadRecentDistrictMasters() {
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from(SUPABASE_DISTRICT_MASTER_TABLE)
    .select("id, district_name, notification_date, voting_date, early_voting, seats")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    if (!error.message.includes("Could not find the table")) {
      els.districtMasterNote.textContent = `Supabaseの読み込みに失敗しました: ${error.message}`;
      els.districtMasterNote.classList.remove("hidden");
    }
    return;
  }

  state.recentDistrictMasters = (data ?? []).map(toDistrictMaster);
  renderRecentDistrictMasters();
  void loadUpcomingElectionTile();
}

async function loadUpcomingElectionTile() {
  if (!supabase) {
    state.upcomingElectionTile = null;
    updateView(false);
    return;
  }

  const todayIso = dateToIso(startOfToday());
  const { data: districts, error: districtError } = await supabase
    .from(SUPABASE_DISTRICT_MASTER_TABLE)
    .select("id, district_name, notification_date, voting_date")
    .gte("voting_date", todayIso)
    .order("voting_date", { ascending: true })
    .limit(1);

  if (districtError) {
    if (!districtError.message.includes("Could not find the table")) {
      els.districtMasterNote.textContent = `タイル表示用データの取得に失敗しました: ${districtError.message}`;
      els.districtMasterNote.classList.remove("hidden");
    }
    state.upcomingElectionTile = null;
    updateView(false);
    return;
  }

  const district = districts?.[0];
  if (!district) {
    state.upcomingElectionTile = null;
    updateView(false);
    return;
  }

  let candidateName = "候補者 未登録";
  let candidatePhotoUrl = "";

  const { data: candidates, error: candidateError } = await supabase
    .from(SUPABASE_CANDIDATE_TABLE)
    .select("member_id")
    .eq("district_id", district.id)
    .order("created_at", { ascending: true })
    .limit(1);

  if (!candidateError && candidates?.[0]?.member_id) {
    const { data: memberData } = await supabase
      .from(SUPABASE_MEMBER_TABLE)
      .select("name, photo_url")
      .eq("id", candidates[0].member_id)
      .maybeSingle();

    if (memberData) {
      candidateName = memberData.name || candidateName;
      candidatePhotoUrl = memberData.photo_url || "";
    }
  }

  state.upcomingElectionTile = {
    districtName: district.district_name,
    electionType: "",
    votingDate: district.voting_date,
    daysLeft: calcDaysLeftToNotification(district.notification_date),
    candidateName,
    candidatePhotoUrl,
  };

  updateView(false);
}

function updateView(syncForm = true) {
  const campaign = getCampaign();
  const selectedCandidate = getSelectedCandidate(campaign);
  const tile = state.upcomingElectionTile ?? getFallbackTile(campaign, selectedCandidate);

  els.daysLeft.textContent = String(tile.daysLeft);
  els.districtName.textContent = tile.districtName;
  els.electionType.textContent = tile.electionType;
  els.electionDate.textContent = `投票予定日 ${tile.votingDate}`;
  els.districtCandidateName.textContent = tile.candidateName;
  els.postingCount.textContent = String(campaign.postingCount);
  els.greetingCount.textContent = String(campaign.greetingCount);
  els.headquartersName.textContent = campaign.headquarters;
  els.campaignSummary.textContent = campaign.candidateSummary;
  els.candidateCount.textContent = String(campaign.candidates.length);

  renderCampaignList();
  renderCandidates(campaign);
  renderSkillButtons();
  renderPlan(campaign);
  renderRecentApplications();
  renderRecentMembers();
  renderRecentDistrictMasters();

  els.volunteerPanel.classList.toggle("hidden", !state.volunteerOpen);
  els.planPanel.classList.toggle("hidden", !state.planOpen);
  els.memberPanel.classList.toggle("hidden", !state.memberOpen);
  els.districtMasterPanel.classList.toggle("hidden", !state.districtMasterOpen);

  if (syncForm) {
    els.volunteerName.value = state.form.name;
    els.volunteerContact.value = state.form.contact;
    els.memberName.value = state.memberForm.name;
    els.memberAddress.value = state.memberForm.address;
    els.memberMobile.value = state.memberForm.mobile;
    els.memberEmail.value = state.memberForm.email;
    els.memberLineId.value = state.memberForm.lineId;
    els.masterDistrictName.value = state.districtMasterForm.districtName;
    els.masterNotificationDate.value = state.districtMasterForm.notificationDate;
    els.masterVotingDate.value = state.districtMasterForm.votingDate;
    els.masterEarlyVoting.value = state.districtMasterForm.earlyVoting;
    els.masterSeats.value = state.districtMasterForm.seats;
  }

  if (selectedCandidate) {
    els.toggleVolunteerBtn.querySelector("strong").textContent = "ボランティア応募";
  }

  if (els.districtPortrait) {
    els.districtPortrait.className = `district-portrait ${selectedCandidate.color}`;
    if (tile.candidatePhotoUrl) {
      els.districtPortrait.classList.add("has-photo");
      els.districtPortraitImage.src = tile.candidatePhotoUrl;
      els.districtPortraitImage.classList.remove("hidden");
    } else {
      els.districtPortrait.classList.remove("has-photo");
      els.districtPortraitImage.removeAttribute("src");
      els.districtPortraitImage.classList.add("hidden");
    }
  }
}

els.toggleVolunteerBtn.addEventListener("click", () => {
  state.volunteerOpen = !state.volunteerOpen;
  updateView();
});

if (els.districtVolunteerBtn) {
  els.districtVolunteerBtn.addEventListener("click", () => {
    state.volunteerOpen = true;
    updateView();
    els.volunteerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (els.districtOrgChartBtn) {
  els.districtOrgChartBtn.addEventListener("click", () => {
    window.alert("組織図はこれから追加します。設定画面から項目を整備できます。");
  });
}

els.closeVolunteerBtn.addEventListener("click", () => {
  state.volunteerOpen = false;
  updateView();
});

els.togglePlanBtn.addEventListener("click", () => {
  state.planOpen = !state.planOpen;
  updateView();
});

els.toggleMemberBtn.addEventListener("click", () => {
  state.memberOpen = !state.memberOpen;
  updateView();
});

els.toggleDistrictMasterBtn.addEventListener("click", () => {
  if (!state.districtMasterOpen) {
    resetDistrictMasterForm();
  }
  state.districtMasterOpen = !state.districtMasterOpen;
  els.districtMasterNote.classList.add("hidden");
  updateView();
});

els.closePlanBtn.addEventListener("click", () => {
  state.planOpen = false;
  updateView();
});

els.closeMemberBtn.addEventListener("click", () => {
  state.memberOpen = false;
  updateView();
});

els.closeDistrictMasterBtn.addEventListener("click", () => {
  state.districtMasterOpen = false;
  resetDistrictMasterForm();
  updateView();
});

els.memberPanel.addEventListener("click", (event) => {
  if (event.target === els.memberPanel) {
    state.memberOpen = false;
    updateView();
  }
});

els.districtMasterPanel.addEventListener("click", (event) => {
  if (event.target === els.districtMasterPanel) {
    state.districtMasterOpen = false;
    resetDistrictMasterForm();
    updateView();
  }
});

els.recentDistrictMasters.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const editId = target.getAttribute("data-district-edit");
  if (editId) {
    const id = Number(editId);
    const entry = state.recentDistrictMasters.find((item) => item.id === id);
    if (!entry) {
      return;
    }

    state.districtMasterEditingId = id;
    state.districtMasterForm = {
      districtName: entry.districtName,
      notificationDate: entry.notificationDate,
      votingDate: entry.votingDate,
      earlyVoting: entry.earlyVoting,
      seats: String(entry.seats),
    };
    state.districtMasterOpen = true;
    els.districtMasterNote.textContent = "編集中です。保存すると上書きされます。";
    els.districtMasterNote.classList.remove("hidden");
    updateView();
    return;
  }

  const deleteId = target.getAttribute("data-district-delete");
  if (!deleteId) {
    return;
  }

  const id = Number(deleteId);
  void (async () => {
    if (!supabase) {
      els.districtMasterNote.textContent = "Supabaseの接続情報を script.js に設定してください。";
      els.districtMasterNote.classList.remove("hidden");
      return;
    }

    const deletingEntry = state.recentDistrictMasters.find((item) => item.id === id);
    const districtLabel = deletingEntry?.districtName ?? "この項目";
    const confirmed = window.confirm(`${districtLabel} を削除しますか？`);
    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from(SUPABASE_DISTRICT_MASTER_TABLE).delete().eq("id", id);
    if (error) {
      els.districtMasterNote.textContent = `削除に失敗しました: ${error.message}`;
      els.districtMasterNote.classList.remove("hidden");
      return;
    }

    state.recentDistrictMasters = state.recentDistrictMasters.filter((item) => item.id !== id);
    if (state.districtMasterEditingId === id) {
      resetDistrictMasterForm();
    }
    els.districtMasterNote.textContent = "選挙区マスターを削除しました。";
    els.districtMasterNote.classList.remove("hidden");
    updateView();
    void loadUpcomingElectionTile();
  })();
});

els.volunteerName.addEventListener("input", (event) => {
  state.form.name = event.target.value;
});

els.volunteerContact.addEventListener("input", (event) => {
  state.form.contact = event.target.value;
});

els.memberName.addEventListener("input", (event) => {
  state.memberForm.name = event.target.value;
});

els.memberAddress.addEventListener("input", (event) => {
  state.memberForm.address = event.target.value;
});

els.memberMobile.addEventListener("input", (event) => {
  state.memberForm.mobile = event.target.value;
});

els.memberEmail.addEventListener("input", (event) => {
  state.memberForm.email = event.target.value;
});

els.memberLineId.addEventListener("input", (event) => {
  state.memberForm.lineId = event.target.value;
});

els.masterDistrictName.addEventListener("input", (event) => {
  state.districtMasterForm.districtName = event.target.value;
});

els.masterNotificationDate.addEventListener("input", (event) => {
  state.districtMasterForm.notificationDate = event.target.value;
});

els.masterVotingDate.addEventListener("input", (event) => {
  state.districtMasterForm.votingDate = event.target.value;
});

els.masterEarlyVoting.addEventListener("input", (event) => {
  state.districtMasterForm.earlyVoting = event.target.value;
});

els.masterSeats.addEventListener("input", (event) => {
  state.districtMasterForm.seats = event.target.value;
});

els.volunteerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  void (async () => {
    if (!state.form.name.trim() || !state.form.contact.trim()) {
      els.submissionNote.textContent = "名前と連絡先を入力してください。";
      els.submissionNote.classList.remove("hidden");
      return;
    }

    if (!supabase) {
      els.submissionNote.textContent = "Supabaseの接続情報を script.js に設定してください。";
      els.submissionNote.classList.remove("hidden");
      return;
    }

    const payload = getVolunteerPayload();
    const { data, error } = await supabase.from(SUPABASE_TABLE).insert(payload).select().single();

    if (error) {
      els.submissionNote.textContent = `保存に失敗しました: ${error.message}`;
      els.submissionNote.classList.remove("hidden");
      return;
    }

    state.recentApplications = [toSubmission(data), ...state.recentApplications].slice(0, 3);
    state.form = { name: "", contact: "", skills: [], days: [], times: [] };
    els.volunteerName.value = "";
    els.volunteerContact.value = "";
    els.submissionNote.textContent = "Supabaseに保存しました。";
    els.submissionNote.classList.remove("hidden");
    updateView();
  })();
});

els.memberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  void (async () => {
    if (
      !state.memberForm.name.trim() ||
      !state.memberForm.address.trim() ||
      !state.memberForm.mobile.trim() ||
      !state.memberForm.email.trim() ||
      !state.memberForm.lineId.trim()
    ) {
      els.memberNote.textContent = "名前、住所、携帯番号、メールアドレス、LINE ID を入力してください。";
      els.memberNote.classList.remove("hidden");
      return;
    }

    if (!supabase) {
      els.memberNote.textContent = "Supabaseの接続情報を script.js に設定してください。";
      els.memberNote.classList.remove("hidden");
      return;
    }

    const payload = getMemberPayload();
    const { data, error } = await supabase.from(SUPABASE_MEMBER_TABLE).insert(payload).select().single();

    if (error) {
      els.memberNote.textContent = `保存に失敗しました: ${error.message}`;
      els.memberNote.classList.remove("hidden");
      return;
    }

    state.recentMembers = [toMember(data), ...state.recentMembers].slice(0, 3);
    state.memberForm = { name: "", address: "", mobile: "", email: "", lineId: "" };
    els.memberName.value = "";
    els.memberAddress.value = "";
    els.memberMobile.value = "";
    els.memberEmail.value = "";
    els.memberLineId.value = "";
    els.memberNote.textContent = "Supabaseにメンバー情報を保存しました。";
    els.memberNote.classList.remove("hidden");
    updateView();
  })();
});

els.districtMasterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  void (async () => {
    const seatsNumber = Number(state.districtMasterForm.seats);

    if (
      !state.districtMasterForm.districtName.trim() ||
      !state.districtMasterForm.notificationDate ||
      !state.districtMasterForm.votingDate ||
      !state.districtMasterForm.earlyVoting.trim() ||
      Number.isNaN(seatsNumber) ||
      seatsNumber < 0
    ) {
      els.districtMasterNote.textContent = "選挙区名、告示日、投票日、期日前、定数を正しく入力してください。";
      els.districtMasterNote.classList.remove("hidden");
      return;
    }

    if (!supabase) {
      els.districtMasterNote.textContent = "Supabaseの接続情報を script.js に設定してください。";
      els.districtMasterNote.classList.remove("hidden");
      return;
    }

    const payload = getDistrictMasterPayload();
    const isEditing = state.districtMasterEditingId !== null;
    let query = supabase.from(SUPABASE_DISTRICT_MASTER_TABLE);

    if (isEditing) {
      query = query.update(payload).eq("id", state.districtMasterEditingId);
    } else {
      query = query.insert(payload);
    }

    const { data, error } = await query.select().single();

    if (error) {
      els.districtMasterNote.textContent = `保存に失敗しました: ${error.message}`;
      els.districtMasterNote.classList.remove("hidden");
      return;
    }

    const saved = toDistrictMaster(data);
    if (isEditing) {
      state.recentDistrictMasters = state.recentDistrictMasters.map((item) =>
        item.id === saved.id ? saved : item,
      );
    } else {
      state.recentDistrictMasters = [saved, ...state.recentDistrictMasters].slice(0, 5);
    }

    resetDistrictMasterForm();
    els.masterDistrictName.value = "";
    els.masterNotificationDate.value = "";
    els.masterVotingDate.value = "";
    els.masterEarlyVoting.value = "";
    els.masterSeats.value = "";
    els.districtMasterNote.textContent = isEditing
      ? "選挙区マスターを更新しました。"
      : "選挙区マスターをSupabaseに保存しました。";
    els.districtMasterNote.classList.remove("hidden");
    updateView();
    void loadUpcomingElectionTile();
  })();
});

updateView();
void loadRecentApplications();
void loadRecentMembers();
void loadRecentDistrictMasters();
void loadUpcomingElectionTile();