import { create } from "zustand";
import type { Post, PostType } from "@/components/features/collaboration-wall/PostCard";

interface CollaborationStore {
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  addPost: (post: Omit<Post, "id" | "timeAgo" | "likes" | "replies">) => void;
  likePost: (postId: string) => void;
  fetchPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
}

const SEED_POSTS: Post[] = [
  {
    id: "p1",
    author: { name: "Dewi Lestari", initials: "DL", location: "Gubeng" },
    timeAgo: "2 jam yang lalu",
    type: "IDE",
    content: "Bagaimana kalau kita buat bank sampah digital di Gubeng? Saya punya rancangan alur pengumpulan yang bisa terintegrasi langsung dengan PACUL.",
    tags: ["#BankSampah", "#Gubeng", "#ZeroWaste"],
    likes: 24,
    replies: 8,
    isVerifiedAction: true,
    verifiedActionLabel: "Zero Waste Hero — Terverifikasi",
  },
  {
    id: "p2",
    author: { name: "Rian Hidayat", initials: "RH", location: "Wonokromo" },
    timeAgo: "5 jam yang lalu",
    type: "GERAKAN",
    content: "Ajak warga Wonokromo cycling setiap Minggu pagi! Kurangi emisi transportasi dan mempererat komunitas. Siapa mau bergabung?",
    tags: ["#SuroboyoCycling", "#GreenTransport"],
    likes: 45,
    replies: 12,
    isVerifiedAction: false,
  },
  {
    id: "p3",
    author: { name: "Siti Aminah", initials: "SA", location: "Tegalsari" },
    timeAgo: "Kemarin, 14:00",
    type: "EVENT",
    content: "Workshop Urban Farming gratis di Taman Bungkul! Pelajari cara bertanam sayuran di lahan sempit. Daftar sekarang — slot terbatas.",
    tags: ["#UrbanFarming", "#Surabaya", "#Workshop"],
    likes: 67,
    replies: 23,
    isVerifiedAction: false,
  },
];

const MORE_POSTS: Post[] = [
  {
    id: "p4",
    author: { name: "Budi Santoso", initials: "BS", location: "Rungkut" },
    timeAgo: "2 hari lalu",
    type: "LAPORAN",
    content: "Update: Panel surya komunitas Rungkut sudah menghasilkan 120 kWh bulan ini. Penghematan emisi mencapai 84 kg CO₂ 🌱",
    tags: ["#SolarPanel", "#Rungkut", "#EnergiTerbarukan"],
    likes: 89,
    replies: 15,
    isVerifiedAction: true,
    verifiedActionLabel: "Solar Pioneer — Terverifikasi",
  },
  {
    id: "p5",
    author: { name: "Ayu Rahayu", initials: "AR", location: "Mulyorejo" },
    timeAgo: "3 hari lalu",
    type: "IDE",
    content: "Usul: buat aplikasi tukar-menukar produk bekas di dalam PACUL. Kurangi sampah elektronik dan hemat pengeluaran warga.",
    tags: ["#EcoSwap", "#ZeroWaste", "#Inovasi"],
    likes: 32,
    replies: 9,
    isVerifiedAction: false,
  },
];

let postCounter = SEED_POSTS.length + MORE_POSTS.length;

export const useCollaborationStore = create<CollaborationStore>((set, get) => ({
  posts: SEED_POSTS,
  isLoading: false,
  hasMore: true,

  addPost: (postData) => {
    const newPost: Post = {
      ...postData,
      id: `p${++postCounter}`,
      timeAgo: "Baru saja",
      likes: 0,
      replies: 0,
    };
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },

  likePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    })),

  fetchPosts: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ posts: SEED_POSTS, isLoading: false });
  },

  loadMorePosts: async () => {
    if (!get().hasMore) return;
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => ({
      posts: [...state.posts, ...MORE_POSTS],
      isLoading: false,
      hasMore: false,
    }));
  },
}));
