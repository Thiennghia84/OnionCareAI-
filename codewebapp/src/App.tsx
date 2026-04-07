import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Shield,
  Grid,
  Zap,
  Star,
  ArrowRight,
  Menu,
  Save,
  Lock,
  Layout,
  BookOpen,
  GraduationCap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// ==================== TYPES & DATA ====================

interface AppData {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  category: string;
  badge: 'MIỄN PHÍ' | 'VIP' | 'MỚI' | 'HOT' | string;
}

const INITIAL_APPS: AppData[] = [
  {
    id: "1",
    title: "MathSolver Pro",
    description: "Công cụ giải toán thông minh hỗ trợ từ cơ bản đến nâng cao, tích hợp AI giải thích từng bước chi tiết.",
    image: "https://picsum.photos/seed/math/800/600",
    url: "#",
    category: "Toán học",
    badge: "MIỄN PHÍ",
  },
  {
    id: "2",
    title: "EnglishMaster",
    description: "Nền tảng học tiếng Anh toàn diện với bài tập ngữ pháp, từ vựng và luyện nghe theo chuẩn IELTS/TOEIC.",
    image: "https://picsum.photos/seed/english/800/600",
    url: "#",
    category: "Tiếng Anh",
    badge: "VIP",
  },
  {
    id: "3",
    title: "ExamBuilder",
    description: "Tạo đề thi tự động theo chuẩn Bộ GD&ĐT, hỗ trợ nhiều môn học, xuất file Word/PDF chỉ trong vài giây.",
    image: "https://picsum.photos/seed/exam/800/600",
    url: "#",
    category: "Tạo đề thi",
    badge: "MỚI",
  },
  {
    id: "4",
    title: "PhysicsLab",
    description: "Phòng thí nghiệm vật lý ảo với mô phỏng 3D trực quan, giúp học sinh hiểu sâu các hiện tượng vật lý.",
    image: "https://picsum.photos/seed/physics/800/600",
    url: "#",
    category: "Vật lý",
    badge: "MIỄN PHÍ",
  },
  {
    id: "5",
    title: "VocabBoost",
    description: "Ứng dụng học từ vựng tiếng Anh theo phương pháp Spaced Repetition, tối ưu hóa trí nhớ dài hạn.",
    image: "https://picsum.photos/seed/vocab/800/600",
    url: "#",
    category: "Tiếng Anh",
    badge: "VIP",
  },
  {
    id: "6",
    title: "AlgebraWiz",
    description: "Giải phương trình đại số, hệ phương trình và bất phương trình với biểu đồ minh họa sinh động.",
    image: "https://picsum.photos/seed/algebra/800/600",
    url: "#",
    category: "Toán học",
    badge: "HOT",
  },
];

const CATEGORIES = ["Tất cả", "Toán học", "Tiếng Anh", "Tạo đề thi", "Vật lý", "Khác"];

const BADGE_STYLES: Record<string, string> = {
  "MIỄN PHÍ": "bg-emerald-500 text-white shadow-emerald-200",
  "VIP": "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-200",
  "MỚI": "bg-blue-500 text-white shadow-blue-200",
  "HOT": "bg-rose-500 text-white shadow-rose-200",
};

const STORAGE_KEY = "app_portal_data_v1";

// ==================== COMPONENTS ====================

const Badge = ({ text }: { text: string }) => {
  if (!text) return null;
  const style = BADGE_STYLES[text] || "bg-slate-600 text-white";
  return (
    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${style}`}>
      {text}
    </span>
  );
};

const AppCard = ({ app }: { app: AppData }) => (
  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
    <div className="relative overflow-hidden aspect-video bg-slate-100">
      <img
        src={app.image}
        alt={app.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/800x600?text=${encodeURIComponent(app.title)}`;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Badge text={app.badge} />
      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm border border-white/50">
        {app.category}
      </span>
    </div>
    
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {app.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
        {app.description}
      </p>
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 border border-slate-200 hover:border-indigo-200 group/btn"
      >
        Truy cập ngay 
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </a>
    </div>
  </div>
);

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: React.ReactNode; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================

export default function App() {
  // State
  const [apps, setApps] = useState<AppData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Login State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);
  const [deletingApp, setDeletingApp] = useState<AppData | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AppData>>({});

  // Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }, [apps]);

  // Handlers
  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setIsLoginOpen(true);
      setPassword("");
      setLoginError("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAdmin(true);
      setIsLoginOpen(false);
    } else {
      setLoginError("Mật khẩu không đúng! Vui lòng thử lại.");
    }
  };

  const handleEdit = (app: AppData) => {
    setEditingApp(app);
    setFormData(app);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingApp(null);
    setFormData({
      category: "Toán học",
      badge: "MIỄN PHÍ",
      image: `https://picsum.photos/seed/${Date.now()}/800/600`
    });
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    if (editingApp) {
      setApps(prev => prev.map(a => a.id === editingApp.id ? { ...a, ...formData } as AppData : a));
    } else {
      const newApp: AppData = {
        ...formData,
        id: Date.now().toString(),
      } as AppData;
      setApps(prev => [newApp, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingApp) {
      setApps(prev => prev.filter(a => a.id !== deletingApp.id));
      setDeletingApp(null);
    }
  };

  // Filter Logic
  const filteredApps = apps.filter(app => {
    const matchesCategory = activeCategory === "Tất cả" || app.category === activeCategory;
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105">
                <Grid className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">AppPortal</span>
                <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">Directory</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => setIsAdmin(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!isAdmin ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Trang chủ
              </button>
              <button 
                onClick={handleAdminClick}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isAdmin ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Shield className="w-4 h-4" />
                {isAdmin ? 'Thoát Admin' : 'Quản trị'}
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 shadow-xl">
            <button 
              onClick={() => { setIsAdmin(false); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${!isAdmin ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => { handleAdminClick(); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${isAdmin ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
            >
              <Shield className="w-4 h-4" />
              {isAdmin ? 'Thoát Admin' : 'Quản trị viên'}
            </button>
          </div>
        )}
      </header>

      <main className="min-h-[calc(100vh-4rem)]">
        {isAdmin ? (
          // ==================== ADMIN VIEW ====================
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Layout className="w-6 h-6 text-indigo-600" />
                  Dashboard
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Quản lý danh sách ứng dụng và nội dung hiển thị.</p>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Thêm ứng dụng
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Tổng ứng dụng", value: apps.length, icon: Grid, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Miễn phí", value: apps.filter(a => a.badge === "MIỄN PHÍ").length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "VIP", value: apps.filter(a => a.badge === "VIP").length, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Danh mục", value: CATEGORIES.length - 1, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-700">Ứng dụng</th>
                      <th className="px-6 py-4 font-semibold text-slate-700">Danh mục</th>
                      <th className="px-6 py-4 font-semibold text-slate-700">Trạng thái</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={app.image} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 ring-1 ring-slate-200"
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100?text=${app.title.charAt(0)}`; }}
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{app.title}</div>
                              <a href={app.url} target="_blank" className="text-xs text-slate-500 hover:text-indigo-600 hover:underline truncate max-w-[200px] block">
                                {app.url}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                            {app.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            app.badge === 'MIỄN PHÍ' ? 'bg-emerald-100 text-emerald-800' :
                            app.badge === 'VIP' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {app.badge}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(app)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeletingApp(app)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {apps.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          Chưa có ứng dụng nào. Hãy thêm mới!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // ==================== CLIENT VIEW ====================
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Cập nhật kho ứng dụng 2025</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                  Khám phá kho tàng <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Ứng dụng Giáo dục
                  </span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                  Tổng hợp các công cụ học tập, phần mềm hỗ trợ giảng dạy và tài liệu ôn thi tốt nhất. 
                  Được tuyển chọn kỹ lưỡng cho giáo viên và học sinh.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                  <a href="#explore" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                    Khám phá ngay
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 transition-all hover:scale-105 flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    Top nổi bật
                  </a>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm py-4 rounded-2xl transition-all">
                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar mask-linear">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeCategory === cat 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-80 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm group-hover:shadow-md"
                    placeholder="Tìm kiếm ứng dụng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              {filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredApps.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Không tìm thấy kết quả</h3>
                  <p className="text-slate-500 mt-1">Thử thay đổi từ khóa hoặc bộ lọc danh mục.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setActiveCategory("Tất cả"); }}
                    className="mt-6 text-indigo-600 font-medium hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Grid className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">AppPortal</span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm">
                Nền tảng kết nối tri thức, mang đến những giải pháp công nghệ giáo dục tiên tiến nhất cho cộng đồng.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Khám phá</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Ứng dụng mới</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Được yêu thích nhất</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Dành cho giáo viên</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Dành cho học sinh</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Liên hệ</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Hỗ trợ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 AppPortal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <GraduationCap className="w-5 h-5 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer" />
              <BookOpen className="w-5 h-5 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>

      {/* ===== MODALS ===== */}
      
      {/* Login Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Đăng nhập Quản trị"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-slate-600">Vui lòng nhập mật khẩu để truy cập.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              className={`w-full px-4 py-2 rounded-xl border ${loginError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'} outline-none transition-all`}
              placeholder="Nhập mật khẩu..."
            />
            {loginError && <p className="text-red-500 text-sm mt-1">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            Đăng nhập
          </button>
        </form>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingApp ? "Chỉnh sửa ứng dụng" : "Thêm ứng dụng mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên ứng dụng <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              value={formData.title || ""}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="VD: MathSolver Pro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="Mô tả tính năng nổi bật..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
              <select
                value={formData.category || "Toán học"}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {CATEGORIES.filter(c => c !== "Tất cả").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nhãn (Badge)</label>
              <select
                value={formData.badge || "MIỄN PHÍ"}
                onChange={e => setFormData({...formData, badge: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {Object.keys(BADGE_STYLES).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Đường dẫn (URL) <span className="text-red-500">*</span></label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="url"
                value={formData.url || ""}
                onChange={e => setFormData({...formData, url: e.target.value})}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link ảnh bìa</label>
            <input
              type="text"
              value={formData.image || ""}
              onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu lại
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingApp}
        onClose={() => setDeletingApp(null)}
        title="Xác nhận xóa"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-slate-600 mb-6">
            Bạn có chắc chắn muốn xóa ứng dụng <strong className="text-slate-900">{deletingApp?.title}</strong> không? 
            <br />Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingApp(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
            >
              Xóa ngay
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
