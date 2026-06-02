import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const SUPABASE_DISTRICT_MASTER_TABLE = "election_district_master";

const districtNameInput = document.getElementById("districtNameInput");
const notificationDateInput = document.getElementById("notificationDateInput");
const votingDateInput = document.getElementById("votingDateInput");
const earlyVotingInput = document.getElementById("earlyVotingInput");
const seatsInput = document.getElementById("seatsInput");
const registrationNote = document.getElementById("registrationNote");
const districtList = document.getElementById("districtList");
const districtListNote = document.getElementById("districtListNote");
const openRegistrationBtn = document.getElementById("openRegistrationBtn");
const cancelRegistrationBtn = document.getElementById("cancelRegistrationBtn");
const registrationPanel = document.getElementById("registrationPanel");
const panelTitle = document.getElementById("panelTitle");
const createActions = document.getElementById("createActions");
const editActions = document.getElementById("editActions");
const registerBtn = document.getElementById("registerBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let editingDistrictId = null;
let latestDistrictRows = [];

function showNote(message) {
  registrationNote.textContent = message;
  registrationNote.classList.remove("hidden");
}

function hideNote() {
  registrationNote.textContent = "";
  registrationNote.classList.add("hidden");
}

function clearForm() {
  districtNameInput.value = "";
  notificationDateInput.value = "";
  votingDateInput.value = "";
  earlyVotingInput.value = "";
  seatsInput.value = "";
}

function setMode(mode) {
  if (mode === "edit") {
    panelTitle.textContent = "選挙区を修正";
    createActions.classList.add("hidden");
    editActions.classList.remove("hidden");
  } else {
    panelTitle.textContent = "選挙区を追加";
    createActions.classList.remove("hidden");
    editActions.classList.add("hidden");
    editingDistrictId = null;
  }
}

function openRegistrationPanel() {
  registrationPanel.classList.remove("hidden");
  setMode("create");
  hideNote();
}

function openEditPanel(item) {
  registrationPanel.classList.remove("hidden");
  setMode("edit");
  editingDistrictId = item.id;
  districtNameInput.value = item.district_name ?? "";
  notificationDateInput.value = item.notification_date ?? "";
  votingDateInput.value = item.voting_date ?? "";
  earlyVotingInput.value = item.early_voting ?? "";
  seatsInput.value = item.seats ?? "";
  hideNote();
}

function closeRegistrationPanel() {
  registrationPanel.classList.add("hidden");
  setMode("create");
  hideNote();
  clearForm();
}

function renderDistrictList(items) {
  if (items.length === 0) {
    districtList.innerHTML = '<p class="list-help">登録済みの選挙区はありません。</p>';
    return;
  }

  districtList.innerHTML = items
    .map(
      (item) => `
        <button type="button" class="district-item clickable" data-district-id="${item.id}">
          <strong>${item.district_name}</strong>
          <span>告示日: ${item.notification_date}</span>
          <span>投票日: ${item.voting_date}</span>
          <span>期日前: ${item.early_voting} / 定数: ${item.seats}</span>
        </button>
      `,
    )
    .join("");
}

async function loadDistrictList() {
  const { data, error } = await supabase
    .from(SUPABASE_DISTRICT_MASTER_TABLE)
    .select("id, district_name, notification_date, voting_date, early_voting, seats")
    .order("notification_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    districtListNote.textContent = `一覧取得に失敗しました: ${error.message}`;
    districtListNote.classList.remove("hidden");
    return;
  }

  districtListNote.classList.add("hidden");
  latestDistrictRows = data ?? [];
  renderDistrictList(latestDistrictRows);
}

function validateInputs() {
  const seatsValue = Number(seatsInput.value);
  if (
    !districtNameInput.value.trim() ||
    !notificationDateInput.value ||
    !votingDateInput.value ||
    !earlyVotingInput.value.trim() ||
    Number.isNaN(seatsValue) ||
    seatsValue < 0
  ) {
    showNote("入力内容を確認してください。すべての項目が必須です。");
    return null;
  }

  return {
    district_name: districtNameInput.value.trim(),
    notification_date: notificationDateInput.value,
    voting_date: votingDateInput.value,
    early_voting: earlyVotingInput.value.trim(),
    seats: seatsValue,
  };
}

async function createDistrict() {
  const payload = validateInputs();
  if (!payload) {
    return;
  }

  registerBtn.disabled = true;
  const { error } = await supabase.from(SUPABASE_DISTRICT_MASTER_TABLE).insert(payload);
  registerBtn.disabled = false;

  if (error) {
    showNote(`保存に失敗しました: ${error.message}`);
    return;
  }

  await loadDistrictList();
  closeRegistrationPanel();
}

async function saveDistrict() {
  if (editingDistrictId === null) {
    closeRegistrationPanel();
    return;
  }

  const payload = validateInputs();
  if (!payload) {
    return;
  }

  saveBtn.disabled = true;
  const { error } = await supabase
    .from(SUPABASE_DISTRICT_MASTER_TABLE)
    .update(payload)
    .eq("id", editingDistrictId);
  saveBtn.disabled = false;

  if (error) {
    showNote(`保存に失敗しました: ${error.message}`);
    return;
  }

  await loadDistrictList();
  closeRegistrationPanel();
}

async function deleteDistrict() {
  if (editingDistrictId === null) {
    closeRegistrationPanel();
    return;
  }

  const confirmed = window.confirm("本当に削除してもいいですか？");
  if (!confirmed) {
    closeRegistrationPanel();
    return;
  }

  deleteBtn.disabled = true;
  const { error } = await supabase
    .from(SUPABASE_DISTRICT_MASTER_TABLE)
    .delete()
    .eq("id", editingDistrictId);
  deleteBtn.disabled = false;

  if (error) {
    showNote(`削除に失敗しました: ${error.message}`);
    return;
  }

  await loadDistrictList();
  closeRegistrationPanel();
}

openRegistrationBtn.addEventListener("click", () => {
  openRegistrationPanel();
});

cancelRegistrationBtn.addEventListener("click", () => {
  closeRegistrationPanel();
});

registerBtn.addEventListener("click", () => {
  void createDistrict();
});

saveBtn.addEventListener("click", () => {
  void saveDistrict();
});

deleteBtn.addEventListener("click", () => {
  void deleteDistrict();
});

districtList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const itemButton = target.closest("[data-district-id]");
  if (!(itemButton instanceof HTMLElement)) {
    return;
  }

  const id = Number(itemButton.getAttribute("data-district-id"));
  if (Number.isNaN(id)) {
    return;
  }

  const selected = latestDistrictRows.find((row) => row.id === id);
  if (!selected) {
    return;
  }

  openEditPanel(selected);
});

void loadDistrictList();
