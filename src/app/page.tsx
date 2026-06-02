"use client";

import { FormEvent, useState } from "react";

type Candidate = {
  id: string;
  name: string;
  role: string;
  district: string;
  status: string;
  phone: string;
  email: string;
  color: string;
  initials: string;
  focus: string;
};

type Campaign = {
  id: string;
  headquarters: string;
  district: string;
  electionType: string;
  electionDate: string;
  daysLeft: number;
  candidateSummary: string;
  postingCount: number;
  greetingCount: number;
  posterCount: number;
  candidates: Candidate[];
  actionPlan: {
    date: string;
    time: string;
    title: string;
    detail: string;
  }[];
};

type VolunteerSubmission = {
  name: string;
  contact: string;
  skills: string[];
  days: string[];
  times: string[];
};

const campaigns: Campaign[] = [
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
      {
        id: "akita-1",
        name: "山本 ひろし",
        role: "現職",
        district: "秋市中心部",
        status: "街頭と地域行脚を強化",
        phone: "090-1234-5678",
        email: "hiroshi@example.jp",
        color: "from-amber-300 to-orange-600",
        initials: "HY",
        focus: "交通・子育て・商店街",
      },
      {
        id: "akita-2",
        name: "佐藤 みゆき",
        role: "新人",
        district: "秋市東部",
        status: "女性ネットワークと現場対話を拡大",
        phone: "090-2222-3333",
        email: "miyuki@example.jp",
        color: "from-rose-300 to-fuchsia-600",
        initials: "SM",
        focus: "福祉・教育・防災",
      },
      {
        id: "akita-3",
        name: "高橋 しゅん",
        role: "新人",
        district: "秋市西部",
        status: "駅前配布と夕方の挨拶を担当",
        phone: "090-4444-5555",
        email: "shun@example.jp",
        color: "from-emerald-300 to-teal-700",
        initials: "TS",
        focus: "雇用・交通・観光",
      },
      {
        id: "akita-4",
        name: "中村 あや",
        role: "サポート候補",
        district: "秋市南部",
        status: "4人以上のため一覧を圧縮表示",
        phone: "090-6666-7777",
        email: "aya@example.jp",
        color: "from-sky-300 to-blue-700",
        initials: "NA",
        focus: "生活道路・教育・高齢者",
      },
    ],
    actionPlan: [
      {
        date: "6/2",
        time: "18:30 - 20:00",
        title: "駅前挨拶",
        detail: "主要駅でのあいさつとチラシ配布。",
      },
      {
        date: "6/3",
        time: "10:00 - 12:00",
        title: "ポスター確認",
        detail: "掲示状況と剥がれの確認、差し替え。",
      },
      {
        date: "6/3",
        time: "14:00 - 16:30",
        title: "地域訪問",
        detail: "商店街と住宅地を回り、要望を回収。",
      },
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
      {
        id: "akita-pref-1",
        name: "小林 なお",
        role: "現職",
        district: "県北第一区",
        status: "農業・医療を中心に訴求",
        phone: "090-8888-9999",
        email: "nao@example.jp",
        color: "from-indigo-300 to-violet-700",
        initials: "KN",
        focus: "農業・医療・道路",
      },
      {
        id: "akita-pref-2",
        name: "田中 れん",
        role: "新人",
        district: "県北第二区",
        status: "集会と訪問の連携を担当",
        phone: "090-1212-3434",
        email: "ren@example.jp",
        color: "from-lime-300 to-green-700",
        initials: "TR",
        focus: "産業・教育・物流",
      },
    ],
    actionPlan: [
      {
        date: "6/2",
        time: "19:00 - 20:30",
        title: "地区打合せ",
        detail: "班長と当日の動線を再確認。",
      },
      {
        date: "6/4",
        time: "08:30 - 11:00",
        title: "街頭演説",
        detail: "通勤帯に合わせて重点駅で実施。",
      },
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
      {
        id: "akita-town-1",
        name: "藤井 さとる",
        role: "新人",
        district: "南町全域",
        status: "地域集会を中心に活動",
        phone: "090-7777-1111",
        email: "satoru@example.jp",
        color: "from-stone-300 to-amber-700",
        initials: "FS",
        focus: "暮らし・子育て・防災",
      },
    ],
    actionPlan: [
      {
        date: "6/2",
        time: "17:00 - 18:00",
        title: "戸別訪問",
        detail: "近隣商店と住宅のあいさつ回り。",
      },
      {
        date: "6/5",
        time: "13:00 - 15:00",
        title: "タウンミーティング",
        detail: "住民の要望を集約して記録。",
      },
    ],
  },
];

const volunteerSkills = ["街頭整理", "ポスティング", "電話対応", "運営補助"];
const volunteerDays = ["6/2", "6/3", "6/4", "6/5", "6/6"];
const volunteerTimes = ["午前", "午後", "夕方", "終日"];

function Portrait({ candidate }: { candidate: Candidate }) {
  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${candidate.color} text-xl font-bold text-white shadow-lg shadow-black/10 ring-4 ring-white/75`}
      aria-hidden="true"
    >
      {candidate.initials}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_rgba(72,54,21,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-stone-900">{value}</p>
    </div>
  );
}

export default function Home() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0].id);
  const [selectedCandidateId, setSelectedCandidateId] = useState(campaigns[0].candidates[0].id);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [submissionNote, setSubmissionNote] = useState<string | null>(null);
  const [recentApplications, setRecentApplications] = useState<VolunteerSubmission[]>([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    skills: [] as string[],
    days: [] as string[],
    times: [] as string[],
  });

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0];
  const selectedCandidate =
    selectedCampaign.candidates.find((candidate) => candidate.id === selectedCandidateId) ?? selectedCampaign.candidates[0];
  const expandedMode = selectedCampaign.candidates.length >= 4;

  function selectCampaign(campaignId: string) {
    const campaign = campaigns.find((item) => item.id === campaignId);

    if (!campaign) {
      return;
    }

    setSelectedCampaignId(campaignId);
    setSelectedCandidateId(campaign.candidates[0].id);
    setIsVolunteerOpen(false);
    setIsPlanOpen(false);
    setSubmissionNote(null);
  }

  function toggleField(group: "skills" | "days" | "times", value: string) {
    setForm((current) => {
      const values = current[group];

      return {
        ...current,
        [group]: values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value],
      };
    });
  }

  function submitVolunteer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.contact.trim()) {
      setSubmissionNote("名前と連絡先を入力してください。");
      return;
    }

    const newEntry: VolunteerSubmission = {
      name: form.name.trim(),
      contact: form.contact.trim(),
      skills: form.skills,
      days: form.days,
      times: form.times,
    };

    setRecentApplications((current) => [newEntry, ...current].slice(0, 3));
    setForm({ name: "", contact: "", skills: [], days: [], times: [] });
    setSubmissionNote("ボランティア情報を本部報告用に保存しました。");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-[#1f2430] p-6 text-white shadow-[0_24px_80px_rgba(29,27,22,0.28)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-amber-200/80">Election Control Center</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">選挙対策本部の進捗を、1画面で把握する。</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                選挙地区、選挙種別、候補者、ボランティア、行動計画をまとめて管理できます。複数本部を切り替えながら、現場の数字と予定を同じ画面で見られる構成です。
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/70">選挙本番まで</p>
              <div className="mt-4 flex items-end gap-4">
                <div className="rounded-3xl bg-amber-50 px-5 py-4 text-center text-stone-900 shadow-lg shadow-black/15">
                  <div className="text-5xl font-black leading-none">{selectedCampaign.daysLeft}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-stone-600">DAYS</div>
                </div>
                <div>
                  <div className="text-xl font-bold sm:text-2xl">{selectedCampaign.district}</div>
                  <p className="mt-1 text-sm text-slate-300">{selectedCampaign.electionType}</p>
                  <p className="mt-2 text-sm text-amber-100/80">投票予定日 {selectedCampaign.electionDate}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="ポスティング件数" value={selectedCampaign.postingCount} />
          <StatCard label="挨拶件数" value={selectedCampaign.greetingCount} />
          <StatCard label="ポスター件数" value={selectedCampaign.posterCount} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <aside className="space-y-4 rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_48px_rgba(72,54,21,0.08)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">本部一覧</p>
              <h2 className="mt-2 text-2xl font-black text-stone-900">切り替え対象</h2>
            </div>

            <div className="space-y-3">
              {campaigns.map((campaign) => {
                const active = campaign.id === selectedCampaign.id;

                return (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => selectCampaign(campaign.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      active
                        ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-200/40"
                        : "border-stone-200 bg-white hover:border-amber-200 hover:bg-amber-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-500">{campaign.headquarters}</p>
                        <h3 className="mt-1 text-lg font-bold text-stone-900">{campaign.district}</h3>
                        <p className="mt-1 text-sm text-stone-600">{campaign.electionType}</p>
                      </div>
                      <div className="rounded-2xl bg-stone-900 px-3 py-2 text-right text-white">
                        <div className="text-2xl font-black leading-none">{campaign.daysLeft}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-300">days</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_48px_rgba(72,54,21,0.08)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">候補者</p>
                <h2 className="mt-2 text-2xl font-black text-stone-900">{selectedCampaign.headquarters}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">{selectedCampaign.candidateSummary}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsPlanOpen((current) => !current)}
                className="rounded-full border border-stone-300 bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                行動計画を表示
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
              <div>
                {expandedMode ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {selectedCampaign.candidates.map((candidate) => {
                        const active = candidate.id === selectedCandidate.id;

                        return (
                          <button
                            key={candidate.id}
                            type="button"
                            onClick={() => setSelectedCandidateId(candidate.id)}
                            className={`rounded-[1.5rem] border p-4 text-left transition ${
                              active
                                ? "border-slate-900 bg-slate-50 shadow-lg shadow-slate-200/60"
                                : "border-stone-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <Portrait candidate={candidate} />
                              <div>
                                <p className="text-sm font-semibold text-stone-500">{candidate.district}</p>
                                <h3 className="mt-1 text-lg font-bold text-stone-900">{candidate.name}</h3>
                                <p className="mt-1 text-sm text-stone-600">{candidate.role}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Portrait candidate={selectedCandidate} />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">選択中の候補者</p>
                          <h3 className="mt-1 text-2xl font-black text-stone-900">{selectedCandidate.name}</h3>
                          <p className="mt-1 text-sm text-stone-600">
                            {selectedCandidate.district} / {selectedCandidate.focus}
                          </p>
                          <p className="mt-2 text-sm text-stone-700">{selectedCandidate.status}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-stone-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">電話</p>
                          <p className="mt-2 text-sm font-semibold text-stone-900">{selectedCandidate.phone}</p>
                        </div>
                        <div className="rounded-2xl bg-stone-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">メール</p>
                          <p className="mt-2 text-sm font-semibold text-stone-900">{selectedCandidate.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {selectedCampaign.candidates.map((candidate) => (
                      <article key={candidate.id} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                          <Portrait candidate={candidate} />
                          <div>
                            <p className="text-sm font-semibold text-stone-500">{candidate.role}</p>
                            <h3 className="mt-1 text-xl font-bold text-stone-900">{candidate.name}</h3>
                            <p className="mt-1 text-sm text-stone-600">{candidate.district}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-stone-600">{candidate.status}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsVolunteerOpen((current) => !current)}
                  className="w-full rounded-[1.5rem] bg-emerald-600 px-5 py-4 text-left text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-50/80">Volunteer</div>
                  <div className="mt-2 text-xl font-black">ボランティア応募</div>
                  <p className="mt-2 text-sm text-emerald-50/90">名前、連絡先、参加可能日、時間、参加できる作業を登録します。</p>
                </button>

                <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">候補者数</p>
                  <p className="mt-2 text-3xl font-black text-stone-900">{selectedCampaign.candidates.length}</p>
                  <p className="mt-1 text-sm text-stone-600">4人以上は顔写真と地区名を先に見せます。</p>
                </div>
              </div>
            </div>

            {isVolunteerOpen ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <form onSubmit={submitVolunteer} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">応募フォーム</p>
                      <h3 className="mt-2 text-2xl font-black text-stone-900">参加情報を登録</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsVolunteerOpen(false)}
                      className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                    >
                      閉じる
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-stone-700">名前</span>
                      <input
                        value={form.name}
                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none ring-0 focus:border-stone-400"
                        placeholder="山田 太郎"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-stone-700">連絡先</span>
                      <input
                        value={form.contact}
                        onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none ring-0 focus:border-stone-400"
                        placeholder="080-1234-5678 / example@example.jp"
                      />
                    </label>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-stone-700">参加できる作業</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {volunteerSkills.map((skill) => {
                          const checked = form.skills.includes(skill);

                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleField("skills", skill)}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                checked ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-600"
                              }`}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-stone-700">参加できる日にち</p>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {volunteerDays.map((day) => {
                            const checked = form.days.includes(day);

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => toggleField("days", day)}
                                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                  checked ? "border-amber-500 bg-amber-100 text-amber-900" : "border-stone-300 bg-white text-stone-600"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-stone-700">参加できる時間</p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {volunteerTimes.map((time) => {
                            const checked = form.times.includes(time);

                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => toggleField("times", time)}
                                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                  checked ? "border-sky-500 bg-sky-100 text-sky-900" : "border-stone-300 bg-white text-stone-600"
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                      保存して本部へ報告
                    </button>
                    <p className="text-sm text-stone-600">選択情報はローカルで保存し、報告用一覧に追加されます。</p>
                  </div>

                  {submissionNote ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-stone-700">{submissionNote}</p> : null}
                </form>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">最近の応募</p>
                    <div className="mt-4 space-y-3">
                      {recentApplications.length > 0 ? (
                        recentApplications.map((entry) => (
                          <div key={`${entry.name}-${entry.contact}`} className="rounded-2xl bg-stone-50 p-4">
                            <p className="font-semibold text-stone-900">{entry.name}</p>
                            <p className="mt-1 text-sm text-stone-600">{entry.contact}</p>
                            <p className="mt-2 text-xs text-stone-500">{[...entry.skills, ...entry.days, ...entry.times].join(" / ")}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-stone-500">まだ応募はありません。</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">本部への報告メモ</p>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      応募情報は、ボランティアの種類・日付・時間帯ごとに整理して、本部の配車・配置・連絡に使う想定です。
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {isPlanOpen ? (
              <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">行動計画</p>
                    <h3 className="mt-2 text-2xl font-black text-stone-900">日にち・時間別スケジュール</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlanOpen(false)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                  >
                    閉じる
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedCampaign.actionPlan.map((item) => (
                    <article key={`${item.date}-${item.time}`} className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{item.date}</p>
                      <h4 className="mt-2 text-lg font-bold text-stone-900">{item.title}</h4>
                      <p className="mt-1 text-sm font-semibold text-amber-700">{item.time}</p>
                      <p className="mt-3 text-sm leading-7 text-stone-600">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}