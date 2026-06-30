"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Lock, ChevronDown, Loader2 } from "lucide-react";

/* ── Types ── */
type PostType = "Ide" | "Gerakan" | "Event" | "Laporan";

export interface NewPost {
  id: string;
  type: PostType;
  content: string;
  linkedAction: string | null;
  author: string;
  avatar: string;
  createdAt: string;
  likes: number;
  comments: number;
}

interface PostComposerProps {
  onPost: (post: NewPost) => void;
}

/* ── Constants ── */
const POST_TYPES: PostType[] = ["Ide", "Gerakan", "Event", "Laporan"];

const TYPE_PLACEHOLDER: Record<PostType, string> = {
  Ide: "Bagikan ide inovatifmu untuk lingkungan Surabaya...",
  Gerakan: "Ceritakan gerakan yang ingin kamu pimpin...",
  Event: "Informasikan event lingkungan yang akan kamu adakan...",
  Laporan: "Laporkan kondisi lingkungan yang perlu perhatian...",
};

const TYPE_COLOR: Record<PostType, string> = {
  Ide: "#2D5F3F",
  Gerakan: "#10B981",
  Event: "#F59E0B",
  Laporan: "#EF4444",
};

const VERIFIED_ACTIONS = [
  "Kurangi Listrik 20% — 1 Nov 2026",
  "Zero Waste 7 Hari — 25 Okt 2026",
  "Transportasi Umum 10x — 20 Okt 2026",
];

/* ── Component ── */
export default function PostComposer({ onPost }: PostComposerProps) {
  const user = useAuthStore((s) => s.user);
  const [postType, setPostType] = useState<PostType>("Ide");
  const [content, setContent] = useState("");
  const [linkVerified, setLinkVerified] = useState(false);
  const [selectedAction, setSelectedAction] = useState(VERIFIED_ACTIONS[0]);
  const [isPosting, setIsPosting] = useState(false);

  const canPost = content.trim().length > 0;
  const authorName = user ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() : "GU";
  const authorFullName = user ? user.name.split(" ")[0] + " " + (user.name.split(" ")[1]?.[0] ?? "") + "." : "Guest U.";
  const avatarBg = user?.avatarColor ?? "#2D5F3F";

  const handleSubmit = () => {
    if (!canPost || isPosting) return;
    setIsPosting(true);

    setTimeout(() => {
      const newPost: NewPost = {
        id: Date.now().toString(),
        type: postType,
        content: content.trim(),
        linkedAction: linkVerified ? selectedAction : null,
        author: authorFullName,
        avatar: authorName,
        createdAt: "Baru saja",
        likes: 0,
        comments: 0,
      };
      onPost(newPost);
      setContent("");
      setLinkVerified(false);
      setIsPosting(false);
    }, 1000);
  };

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      {/* Row 1 — Avatar + textarea */}
      <div className="flex gap-3">
        {/* Avatar */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: avatarBg }}>
          {authorName}
        </span>

        {/* Textarea wrapper */}
        <div className="flex-1 rounded-lg border border-[#E5E7EB] px-3 py-2.5 transition-colors focus-within:border-[#2D5F3F]">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={TYPE_PLACEHOLDER[postType]}
            className="w-full resize-none bg-transparent text-sm text-[#1A1A1A] placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Row 2 — Type tabs */}
      <div className="mt-3 flex flex-wrap gap-2">
        {POST_TYPES.map((type) => {
          const active = postType === type;
          const color = TYPE_COLOR[type];
          return (
            <button
              key={type}
              onClick={() => setPostType(type)}
              className="rounded-full px-3 py-1 text-sm font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: `${color}18`, color }
                  : { color: "#6B7280" }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "#F3F4F6";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Row 3 — Verified link + post button */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {/* Left: verified action checkbox */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600 select-none">
            <input
              type="checkbox"
              checked={linkVerified}
              onChange={(e) => setLinkVerified(e.target.checked)}
              className="accent-[#2D5F3F]"
            />
            <Lock size={12} className="text-gray-400" />
            Tautkan Aksi Terverifikasi
          </label>

          {linkVerified && (
            <div className="relative">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="appearance-none rounded-md border border-[#E5E7EB] bg-white py-1 pl-3 pr-8 text-xs text-gray-600 outline-none focus:border-[#2D5F3F]"
              >
                {VERIFIED_ACTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          )}
        </div>

        {/* Right: post button */}
        <button
          onClick={handleSubmit}
          disabled={!canPost || isPosting}
          className="flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-opacity"
          style={
            canPost && !isPosting
              ? { backgroundColor: "#2D5F3F", color: "#fff" }
              : { backgroundColor: "#E5E7EB", color: "#9CA3AF", cursor: "not-allowed" }
          }
        >
          {isPosting && <Loader2 size={14} className="animate-spin" />}
          {isPosting ? "Memposting..." : "Posting"}
        </button>
      </div>
    </div>
  );
}
