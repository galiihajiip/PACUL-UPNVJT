"use client";

import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import PostComposer, { type NewPost } from "@/components/features/collaboration-wall/PostComposer";
import PostCard, { mockPosts, type Post } from "@/components/features/collaboration-wall/PostCard";
import TrendingTopics from "@/components/features/collaboration-wall/TrendingTopics";
import InitiatifUnggulan from "@/components/features/collaboration-wall/InitiatifUnggulan";
import AnggotaAktif from "@/components/features/collaboration-wall/AnggotaAktif";

function newPostToPost(p: NewPost): Post {
  const typeMap: Record<string, Post["type"]> = {
    Ide: "IDE", Gerakan: "GERAKAN", Event: "EVENT", Laporan: "LAPORAN",
  };
  return {
    id: p.id,
    author: { name: p.author, initials: p.avatar, location: "Surabaya" },
    timeAgo: p.createdAt,
    type: typeMap[p.type] ?? "IDE",
    content: p.content,
    likes: 0,
    replies: 0,
    isVerifiedAction: !!p.linkedAction,
    verifiedActionLabel: p.linkedAction ?? undefined,
  };
}

const feedVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function CollaborationPageClient() {
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const handleNewPost = (post: NewPost) => {
    setUserPosts((prev) => [newPostToPost(post), ...prev]);
  };

  const allPosts = [...userPosts, ...mockPosts];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4 lg:gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">Collaboration Wall</h1>
          <p className="mt-1 text-sm text-gray-500">Bagikan ide, gerakan, dan aksi hijaumu</p>
        </div>

        <PostComposer onPost={handleNewPost} />

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-[60fr_40fr]">
          <motion.div
            className="flex flex-col gap-4"
            variants={feedVariants}
            initial="hidden"
            animate="visible"
            aria-label="Feed kolaborasi"
            aria-live="polite"
          >
            <AnimatePresence>
              {allPosts.map((post) => (
                <motion.div key={post.id} variants={itemVariants} layout>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <aside className="flex flex-col gap-4" aria-label="Sidebar kolaborasi">
            <TrendingTopics />
            <InitiatifUnggulan />
            <AnggotaAktif />
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}
