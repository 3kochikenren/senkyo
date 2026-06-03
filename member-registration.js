import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ufwnepzbuqmhtifkilsk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd25lcHpidXFtaHRpZmtpbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTUxNzIsImV4cCI6MjA5NTk3MTE3Mn0.jkIuBUKqUGg2mx29VFLKImLxceElU7TdABtZVJGKt1E";
const MEMBER_TABLE = "members";
const MEMBER_PHOTO_BUCKET = "member-photos";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const openAddMemberBtn = document.getElementById("openAddMemberBtn");
const cancelMemberBtn = document.getElementById("cancelMemberBtn");
const memberFormPanel = document.getElementById("memberFormPanel");
const memberForm = document.getElementById("memberForm");
const memberRoleInput = document.getElementById("memberRoleInput");
const memberNameInput = document.getElementById("memberNameInput");
const memberAddressInput = document.getElementById("memberAddressInput");
const memberMobileInput = document.getElementById("memberMobileInput");
const memberEmailInput = document.getElementById("memberEmailInput");
const memberLineIdInput = document.getElementById("memberLineIdInput");
const memberPhotoInput = document.getElementById("memberPhotoInput");
const memberPhotoPreview = document.getElementById("memberPhotoPreview");
const memberPhotoPreviewImage = document.getElementById("memberPhotoPreviewImage");
const memberModalBackdrop = document.getElementById("memberModalBackdrop");
const memberList = document.getElementById("memberList");
const memberNote = document.getElementById("memberNote");
const memberListNote = document.getElementById("memberListNote");
const saveMemberBtn = document.getElementById("saveMemberBtn");
const deleteMemberBtn = document.getElementById("deleteMemberBtn");
const memberPanelTitle = document.getElementById("memberPanelTitle");

let selectedMember = null;

function showNote(message) {
  memberNote.textContent = message;
  memberNote.classList.remove("hidden");
}

function hideNote() {
  memberNote.textContent = "";
  memberNote.classList.add("hidden");
}

function clearForm() {
  memberRoleInput.value = "使用者";
  memberNameInput.value = "";
  memberAddressInput.value = "";
  memberMobileInput.value = "";
  memberEmailInput.value = "";
  memberLineIdInput.value = "";
  memberPhotoInput.value = "";
  memberPhotoPreviewImage.removeAttribute("src");
  memberPhotoPreview.classList.add("hidden");
}

function openCreatePanel() {
  selectedMember = null;
  memberPanelTitle.textContent = "メンバーを追加";
  deleteMemberBtn.classList.add("hidden");
  memberFormPanel.classList.remove("hidden");
  memberFormPanel.setAttribute("aria-hidden", "false");
  hideNote();
  clearForm();
}

function openEditPanel(member) {
  selectedMember = member;
  memberPanelTitle.textContent = "メンバーを編集";
  deleteMemberBtn.classList.remove("hidden");
  memberFormPanel.classList.remove("hidden");
  memberFormPanel.setAttribute("aria-hidden", "false");
  hideNote();

  memberNameInput.value = member.name ?? "";
  memberRoleInput.value = member.role_type ?? "使用者";
  memberAddressInput.value = member.address ?? "";
  memberMobileInput.value = member.mobile ?? "";
  memberEmailInput.value = member.email ?? "";
  memberLineIdInput.value = member.line_id ?? "";
  memberPhotoInput.value = "";

  if (member.photo_url) {
    memberPhotoPreviewImage.src = member.photo_url;
    memberPhotoPreview.classList.remove("hidden");
  } else {
    memberPhotoPreviewImage.removeAttribute("src");
    memberPhotoPreview.classList.add("hidden");
  }
}

function closePanel() {
  memberFormPanel.classList.add("hidden");
  memberFormPanel.setAttribute("aria-hidden", "true");
  selectedMember = null;
  hideNote();
  clearForm();
}

function getPhotoPathFromUrl(url) {
  if (!url) {
    return null;
  }

  const marker = `/storage/v1/object/public/${MEMBER_PHOTO_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) {
    return null;
  }

  return url.slice(index + marker.length);
}

async function uploadMemberPhoto(memberId) {
  const file = memberPhotoInput.files?.[0];
  if (!file) {
    return selectedMember?.photo_url ?? null;
  }

  const fileExtension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const safeExtension = fileExtension && /^[a-z0-9]+$/.test(fileExtension) ? fileExtension : "jpg";
  const filePath = `${memberId}/${Date.now()}.${safeExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEMBER_PHOTO_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage.from(MEMBER_PHOTO_BUCKET).getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}

async function deleteMemberPhotoIfExists(photoUrl) {
  const path = getPhotoPathFromUrl(photoUrl);
  if (!path) {
    return;
  }

  await supabase.storage.from(MEMBER_PHOTO_BUCKET).remove([path]);
}

function renderMemberList(rows) {
  if (rows.length === 0) {
    memberList.innerHTML = '<p class="lead">メンバーはまだ登録されていません。</p>';
    return;
  }

  memberList.innerHTML = rows
    .map(
      (row) => `
        <article class="member-item" data-member-id="${row.id}">
          <strong>${row.name}</strong>
          <span>区分: ${row.role_type ?? "使用者"}</span>
          <span>住所: ${row.address}</span>
          <span>携帯: ${row.mobile}</span>
          <span>メール: ${row.email}</span>
          <span>LINE ID: ${row.line_id}</span>
          ${row.photo_url ? '<span>写真: 登録済み</span>' : '<span>写真: 未登録</span>'}
        </article>
      `,
    )
    .join("");

  rows.forEach((row) => {
    const tile = memberList.querySelector(`[data-member-id="${row.id}"]`);
    if (!tile) {
      return;
    }

    tile.addEventListener("click", () => {
      openEditPanel(row);
    });
  });
}

async function loadMemberList() {
  let { data, error } = await supabase
    .from(MEMBER_TABLE)
    .select("id, name, role_type, address, mobile, email, line_id, photo_url")
    .order("created_at", { ascending: false });

  // Backward compatible read for environments where role_type is not migrated yet.
  if (error && error.message.includes("members.role_type does not exist")) {
    const fallback = await supabase
      .from(MEMBER_TABLE)
      .select("id, name, address, mobile, email, line_id, photo_url")
      .order("created_at", { ascending: false });
    data = (fallback.data ?? []).map((row) => ({ ...row, role_type: "使用者" }));
    error = fallback.error;
  }

  if (error) {
    memberListNote.textContent = `メンバー一覧取得に失敗しました: ${error.message}`;
    memberListNote.classList.remove("hidden");
    return;
  }

  memberListNote.classList.add("hidden");
  renderMemberList(data ?? []);
}

openAddMemberBtn.addEventListener("click", () => {
  openCreatePanel();
});

cancelMemberBtn.addEventListener("click", () => {
  closePanel();
});

memberModalBackdrop.addEventListener("click", () => {
  closePanel();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !memberFormPanel.classList.contains("hidden")) {
    closePanel();
  }
});

memberPhotoInput.addEventListener("change", () => {
  const file = memberPhotoInput.files?.[0];
  if (!file) {
    if (selectedMember?.photo_url) {
      memberPhotoPreviewImage.src = selectedMember.photo_url;
      memberPhotoPreview.classList.remove("hidden");
      return;
    }

    memberPhotoPreviewImage.removeAttribute("src");
    memberPhotoPreview.classList.add("hidden");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  memberPhotoPreviewImage.src = objectUrl;
  memberPhotoPreview.classList.remove("hidden");
});

memberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  void (async () => {
    if (
      !memberNameInput.value.trim() ||
      !memberAddressInput.value.trim() ||
      !memberMobileInput.value.trim() ||
      !memberEmailInput.value.trim() ||
      !memberLineIdInput.value.trim()
    ) {
      showNote("すべての項目を入力してください。");
      return;
    }

    saveMemberBtn.disabled = true;

    try {
      const payload = {
        name: memberNameInput.value.trim(),
        role_type: memberRoleInput.value,
        address: memberAddressInput.value.trim(),
        mobile: memberMobileInput.value.trim(),
        email: memberEmailInput.value.trim(),
        line_id: memberLineIdInput.value.trim(),
      };

      if (payload.role_type !== "管理者" && payload.role_type !== "使用者") {
        showNote("区分を選択してください。");
        return;
      }

      if (selectedMember) {
        const { error: updateError } = await supabase
          .from(MEMBER_TABLE)
          .update(payload)
          .eq("id", selectedMember.id);

        if (updateError) {
          if (updateError.message.includes("members.role_type does not exist")) {
            showNote("DBに区分カラムが未反映です。supabase.sqlを実行してください。");
            return;
          }
          showNote(`保存に失敗しました: ${updateError.message}`);
          return;
        }

        if (memberPhotoInput.files?.[0]) {
          const photoUrl = await uploadMemberPhoto(selectedMember.id);
          const { error: photoUpdateError } = await supabase
            .from(MEMBER_TABLE)
            .update({ photo_url: photoUrl })
            .eq("id", selectedMember.id);

          if (photoUpdateError) {
            showNote(`写真保存に失敗しました: ${photoUpdateError.message}`);
            return;
          }
        }
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from(MEMBER_TABLE)
          .insert(payload)
          .select("id")
          .single();

        if (insertError) {
          if (insertError.message.includes("members.role_type does not exist")) {
            showNote("DBに区分カラムが未反映です。supabase.sqlを実行してください。");
            return;
          }
          showNote(`保存に失敗しました: ${insertError.message}`);
          return;
        }

        if (memberPhotoInput.files?.[0]) {
          const photoUrl = await uploadMemberPhoto(inserted.id);
          const { error: photoUpdateError } = await supabase
            .from(MEMBER_TABLE)
            .update({ photo_url: photoUrl })
            .eq("id", inserted.id);

          if (photoUpdateError) {
            showNote(`写真保存に失敗しました: ${photoUpdateError.message}`);
            return;
          }
        }
      }

      await loadMemberList();
      closePanel();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showNote(`保存に失敗しました: ${message}`);
    } finally {
      saveMemberBtn.disabled = false;
    }
  })();
});

deleteMemberBtn.addEventListener("click", () => {
  void (async () => {
    if (!selectedMember) {
      return;
    }

    const ok = window.confirm("本当に削除してもいいですか？");
    if (!ok) {
      closePanel();
      return;
    }

    deleteMemberBtn.disabled = true;
    await deleteMemberPhotoIfExists(selectedMember.photo_url);
    const { error } = await supabase.from(MEMBER_TABLE).delete().eq("id", selectedMember.id);
    deleteMemberBtn.disabled = false;

    if (error) {
      showNote(`削除に失敗しました: ${error.message}`);
      return;
    }

    await loadMemberList();
    closePanel();
  })();
});

void loadMemberList();
