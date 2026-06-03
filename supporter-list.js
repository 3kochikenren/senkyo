import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const SUPABASE_CANDIDATE_TABLE = "election_candidates";
const SUPABASE_MEMBER_TABLE = "members";
const SUPABASE_DISTRICT_MASTER_TABLE = "election_district_master";
const SUPABASE_SUPPORTER_TABLE = "supporter_members";

const hasSupabaseConfig = SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const els = {
    searchForm: document.getElementById("searchForm"),
    candidateSelect: document.getElementById("candidateSelect"),
    searchName: document.getElementById("searchName"),
    searchAddress: document.getElementById("searchAddress"),
    searchBtn: document.getElementById("searchBtn"),
    listStatus: document.getElementById("listStatus"),
    supporterList: document.getElementById("supporterList"),
};

function setStatus(message, isError = false) {
    if (!els.listStatus) return;
    els.listStatus.textContent = message;
    els.listStatus.style.display = "block";
    els.listStatus.style.color = isError ? "#b42318" : "#1c1e21";
    els.supporterList.innerHTML = "";
}

async function loadCandidates() {
    if (!supabase) {
        setStatus("Supabaseが設定されていません。", true);
        return;
    }

    const { data: candidates, error: candidateError } = await supabase
        .from(SUPABASE_CANDIDATE_TABLE)
        .select("id, district_id, member_id")
        .order("created_at", { ascending: false });

    if (candidateError) {
        setStatus(`候補者の読み込みに失敗: ${candidateError.message}`, true);
        return;
    }

    const candidateRows = candidates ?? [];
    if (candidateRows.length === 0) {
        els.candidateSelect.innerHTML = '<option value="">候補者が未登録です</option>';
        setStatus("先に候補者登録を行ってください。", true);
        return;
    }

    const districtIds = [...new Set(candidateRows.map((row) => row.district_id).filter((id) => typeof id === "number"))];
    const memberIds = [...new Set(candidateRows.map((row) => row.member_id).filter((id) => typeof id === "number"))];

    const [districtRes, memberRes] = await Promise.all([
        supabase.from(SUPABASE_DISTRICT_MASTER_TABLE).select("id, district_name").in("id", districtIds),
        supabase.from(SUPABASE_MEMBER_TABLE).select("id, name").in("id", memberIds),
    ]);

    if (districtRes.error) {
        setStatus(`選挙区の読み込みに失敗: ${districtRes.error.message}`, true);
        return;
    }

    if (memberRes.error) {
        setStatus(`候補者名の読み込みに失敗: ${memberRes.error.message}`, true);
        return;
    }

    const districtMap = new Map((districtRes.data ?? []).map((row) => [row.id, row.district_name]));
    const memberMap = new Map((memberRes.data ?? []).map((row) => [row.id, row.name]));

    els.candidateSelect.innerHTML = '<option value="">選択してください</option>';
    candidateRows.forEach((row) => {
        const districtName = districtMap.get(row.district_id) ?? "選挙区未設定";
        const memberName = memberMap.get(row.member_id) ?? "候補者未設定";
        const option = document.createElement("option");
        option.value = String(row.id);
        option.textContent = `${districtName} / ${memberName}`;
        els.candidateSelect.appendChild(option);
    });
}

function renderSupporters(supporters) {
    if (supporters.length === 0) {
        setStatus("該当する後援会員は見つかりませんでした。");
        return;
    }

    els.listStatus.style.display = "none";
    els.supporterList.innerHTML = supporters
        .map(
            (supporter) => `
                <div class="supporter-list-item">
                        <p class="name">${supporter.name || ""}</p>
                        <p class="furigana">${supporter.furigana || ""}</p>
                        <p class="address">住所: ${supporter.address || ""}</p>
                        <p class="phone">電話: ${supporter.phone || ""} / 携帯: ${supporter.mobile || ""}</p>
                        <p class="email">メール: ${supporter.email || ""}</p>
                </div>
        `
        )
        .join("");
}

async function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    if (!supabase) {
        setStatus("Supabaseが設定されていません。", true);
        return;
    }

    const candidateId = Number(els.candidateSelect.value);
    const searchName = els.searchName.value.trim();
    const searchAddress = els.searchAddress.value.trim();

    if (!Number.isFinite(candidateId) || candidateId <= 0) {
        setStatus("候補者を選択してください。", true);
        return;
    }

    setStatus("検索中...");

    let query = supabase
        .from(SUPABASE_SUPPORTER_TABLE)
        .select("id, name, furigana, address, phone, mobile, email, registration_date, created_at")
        .eq("candidate_id", candidateId);

    if (searchName) {
        query = query.ilike("name", `%${searchName}%`);
    }

    if (searchAddress) {
        query = query.ilike("address", `%${searchAddress}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        setStatus(`検索エラー: ${error.message}`, true);
        return;
    }

    renderSupporters(data ?? []);
}

function init() {
    if (!hasSupabaseConfig) {
        setStatus("Supabaseの接続設定がされていません。", true);
        return;
    }

    void loadCandidates();
    els.searchForm.addEventListener("submit", handleSearch);
    els.candidateSelect.addEventListener("change", () => {
        if (!els.candidateSelect.value) {
            setStatus("候補者を選択して検索してください。");
            return;
        }
        void handleSearch();
    });
}

init();
