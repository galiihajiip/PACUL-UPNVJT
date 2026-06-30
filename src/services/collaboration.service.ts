import { api } from "./api";
import type { Post, PostType } from "@/components/features/collaboration-wall/PostCard";
import { isDemoMode, demoDelay } from "@/lib/demo-mode";

export interface NewPostDTO {
  content: string;
  type: PostType;
  tags?: string[];
  isVerifiedAction?: boolean;
  verifiedActionLabel?: string;
}

const MOCK_POSTS: Post[] = [
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

export const collaborationService = {
  getPosts: async (page: number = 1): Promise<Post[]> => {
    if (isDemoMode) return MOCK_POSTS;
    try {
      return await api.get<Post[]>("/collaboration/posts", { params: { page } });
    } catch {
      return MOCK_POSTS;
    }
  },

  createPost: async (data: NewPostDTO): Promise<Post> => {
    if (isDemoMode) {
      await demoDelay(300);
      return {
        id: `p_${Date.now()}`,
        author: { name: "Aditya Pratama", initials: "AP", location: "Surabaya" },
        timeAgo: "Baru saja",
        type: data.type,
        content: data.content,
        tags: data.tags,
        likes: 0,
        replies: 0,
        isVerifiedAction: data.isVerifiedAction,
        verifiedActionLabel: data.verifiedActionLabel,
      };
    }
    try {
      return await api.post<Post>("/collaboration/posts", data);
    } catch {
      return {
        id: `p_${Date.now()}`,
        author: { name: "Aditya Pratama", initials: "AP", location: "Surabaya" },
        timeAgo: "Baru saja",
        type: data.type,
        content: data.content,
        tags: data.tags,
        likes: 0,
        replies: 0,
        isVerifiedAction: data.isVerifiedAction,
        verifiedActionLabel: data.verifiedActionLabel,
      };
    }
  },

  likePost: async (postId: string): Promise<void> => {
    if (isDemoMode) return;
    try {
      await api.post(`/collaboration/posts/${postId}/like`);
    } catch {
      /* mock: no-op */
    }
  },

  addComment: async (postId: string, content: string): Promise<void> => {
    if (isDemoMode) return;
    try {
      await api.post(`/collaboration/posts/${postId}/comments`, { content });
    } catch {
      /* mock: no-op */
    }
  },
};
