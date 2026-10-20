"use client";

import Image from "next/image";
import { useState } from "react";

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  date: string;
}

const CONTACT_EMAIL = "contact@dearmine.me";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [entries, setEntries] = useState<GuestbookEntry[]>([
    {
      id: 1,
      name: "정원의 이웃",
      message: "홈페이지 분위기가 너무 편안하고 따뜻해요. 자주 놀러 오겠습니다!",
      date: "오늘",
    },
    {
      id: 2,
      name: "햇살 한 줌",
      message: "초록빛 자연과 카키색 글씨가 정말 잘 어울려요. 힐링하고 갑니다 🌿",
      date: "어제",
    },
  ]);

  // 이메일 문의 관련 상태
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    inquiryType: "일반 문의",
    subject: "",
    message: "",
  });
  const [emailCopied, setEmailCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) return;

    setIsSubmitting(true);
    setSubmitResult({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "이메일 전송에 실패했습니다.");
      }

      setSubmitResult({
        type: "success",
        message: "문의사항이 성공적으로 전달되었습니다! 확인 후 정성껏 답변드리겠습니다.",
      });

      // 폼 초기화
      setContactForm({
        name: "",
        email: "",
        inquiryType: "일반 문의",
        subject: "",
        message: "",
      });

      // 3초 후 모달 닫기
      setTimeout(() => {
        setIsContactOpen(false);
        setSubmitResult({ type: "idle", message: "" });
      }, 3000);
    } catch (err: any) {
      setSubmitResult({
        type: "error",
        message: err?.message || "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    const newEntry: GuestbookEntry = {
      id: Date.now(),
      name: guestName.trim(),
      message: guestMessage.trim(),
      date: "방금 전",
    };

    setEntries([newEntry, ...entries]);
    setGuestName("");
    setGuestMessage("");
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#223420] flex flex-col font-sans selection:bg-[#DCE7D9] selection:text-[#1B2A18]">
      {/* 상단 네비게이션 바 (반응형 & Glassmorphism) */}
      <header className="sticky top-0 z-50 bg-[#F7F9F6]/85 backdrop-blur-md border-b border-[#D6E2D2] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* 로고 및 브랜딩 */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm ring-2 ring-[#C2D4BC] group-hover:ring-[#476342] transition-all">
              <Image
                src="/pabicon.png"
                alt="권오애 로고"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-[#1B2B19] tracking-tight group-hover:text-[#385133] transition-colors">
                DearMine
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-[#576D53] bg-[#E9F0E6] px-2 py-0.5 rounded-full border border-[#D0DEC9]">
                나를 찾아서
              </span>
            </div>
          </button>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#3C5238]">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-[#1B2B19] transition-colors cursor-pointer"
            >
              소개
            </button>
            <button
              onClick={() => scrollToSection("activities")}
              className="hover:text-[#1B2B19] transition-colors cursor-pointer"
            >
              일상 & 관심사
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="hover:text-[#1B2B19] transition-colors cursor-pointer"
            >
              갤러리
            </button>
            <button
              onClick={() => scrollToSection("guestbook")}
              className="hover:text-[#1B2B19] transition-colors cursor-pointer"
            >
              방명록
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#273B24] bg-[#E8F1E4] hover:bg-[#D7E6D3] border border-[#C5D7C1] transition-all cursor-pointer shadow-2xs"
            >
              <svg
                className="w-3.5 h-3.5 text-[#3D5639]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>문의하기</span>
            </button>
            <button
              onClick={() => scrollToSection("guestbook")}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#283C25] hover:bg-[#1B2A18] shadow-sm hover:shadow transition-all cursor-pointer"
            >
              인사 남기기
            </button>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#283C25] hover:bg-[#E9F0E6] transition-colors cursor-pointer"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F7F9F6] border-b border-[#D6E2D2] px-4 pt-3 pb-5 space-y-2 shadow-lg">
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-3 py-2 rounded-md font-medium text-[#283C25] hover:bg-[#E9F0E6]"
            >
              소개
            </button>
            <button
              onClick={() => scrollToSection("activities")}
              className="block w-full text-left px-3 py-2 rounded-md font-medium text-[#283C25] hover:bg-[#E9F0E6]"
            >
              일상 & 관심사
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="block w-full text-left px-3 py-2 rounded-md font-medium text-[#283C25] hover:bg-[#E9F0E6]"
            >
              갤러리
            </button>
            <button
              onClick={() => scrollToSection("guestbook")}
              className="block w-full text-left px-3 py-2 rounded-md font-medium text-[#283C25] hover:bg-[#E9F0E6]"
            >
              방명록
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsContactOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-[#1B2A18] bg-[#E8F1E4] hover:bg-[#D7E6D3] border border-[#C5D7C1] flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-[#354D31]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>이메일 문의하기</span>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 히어로 섹션 (Hero Section) */}
        <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center px-4 sm:px-6 py-16 overflow-hidden">
          {/* 수채화 숲 배경 (은은하게 배치) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/green_tree_bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              opacity: 0.32,
            }}
          />

          {/* 중앙 자연광 빛망울 효과 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          >
            <div
              className="w-[85vw] max-w-[800px] h-[70vh] max-h-[600px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(214,233,208,0.65) 0%, rgba(235,243,231,0.3) 50%, transparent 80%)",
                filter: "blur(65px)",
              }}
            />
          </div>

          {/* 히어로 메인 카드 */}
          <div className="relative z-10 max-w-2xl w-full mx-auto text-center bg-white/75 backdrop-blur-md p-7 sm:p-11 rounded-3xl border border-[#D5E1D1] shadow-2xl shadow-[#2E422A]/10">
            {/* 상단 서브 배지 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#E8F1E4] text-[#243721] border border-[#C5D7C1] mb-5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#4E7545] animate-pulse" />
              <span>사람과 사람이 만나는 곳</span>
            </div>

            {/* 보기 좋게 꾸민 메인 타이틀 */}
            <div className="relative mb-5">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1B2A18] leading-[1.25] break-keep">
                안녕하세요,{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#1B2B19] via-[#2F472B] to-[#45633E] bg-clip-text text-transparent">
                    디어마인
                  </span>
                  {/* 밑줄 장식 곡선 */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#7A9973]/60 -z-10"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,12 Q50,0 100,12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                에 오신것을 환영합니다
              </h1>
            </div>

            {/* 파비콘/프로필 아이콘 */}
            <div className="flex justify-center my-5">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#A3BF9E] to-[#DCE8D8] opacity-70 blur-xs group-hover:opacity-100 transition duration-300" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                  <Image
                    src="/pabicon.png"
                    alt="권오애 프로필 아이콘"
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 소개 문구 (진한 카키색 & 반응형 줄바꿈) */}
            <p className="text-[#364A32] text-base sm:text-lg leading-relaxed max-w-lg mx-auto font-normal">
              작은 풀잎 하나와 따스한 햇살에서 삶의 소중한 의미를 배웁니다.
              <br className="hidden sm:inline" />
              매일의 소소한 기쁨과 새로운 배움의 이야기들을 차곡차곡 담아갑니다.
            </p>

            {/* 액션 버튼 그룹 */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => scrollToSection("about")}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-white bg-[#283C25] hover:bg-[#1A2818] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>정원 둘러보기</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => scrollToSection("guestbook")}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-[#283C25] bg-[#EAF2E7] hover:bg-[#D9E6D5] border border-[#BFD4BA] transition-all cursor-pointer"
              >
                따뜻한 인사 남기기
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-[#1F331C] bg-white hover:bg-[#F3F7F1] border border-[#BFD4BA] hover:border-[#82A37B] shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <svg
                  className="w-4 h-4 text-[#43613D] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>이메일 문의하기</span>
              </button>
            </div>
          </div>
        </section>

        {/* 소개 섹션 (About Section) */}
        <section id="about" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#546C50] bg-[#E9F0E5] px-3 py-1 rounded-full border border-[#D1E0CD]">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A18] mt-3 tracking-tight">
              천천히, 정성스럽게 가꾸는 삶
            </h2>
            <p className="text-[#4A6046] text-sm sm:text-base mt-2 max-w-xl mx-auto">
              자연이 주는 위로를 사랑하며, 소박하지만 깊이 있는 하루를 만들어갑니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 가치 1 */}
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-[#D7E3D3] shadow-sm hover:shadow-md hover:border-[#8BA884] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2E7] text-[#2F472B] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🌱
              </div>
              <h3 className="text-xl font-bold text-[#1F301D] mb-2">자연과 계절</h3>
              <p className="text-sm text-[#485D44] leading-relaxed">
                식물을 돌보고 계절의 온도를 느끼며, 서두르지 않고 묵묵히 자라나는 자연의 지혜를 배웁니다.
              </p>
            </div>

            {/* 가치 2 */}
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-[#D7E3D3] shadow-sm hover:shadow-md hover:border-[#8BA884] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2E7] text-[#2F472B] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ☕
              </div>
              <h3 className="text-xl font-bold text-[#1F301D] mb-2">쉼과 차 한 잔</h3>
              <p className="text-sm text-[#485D44] leading-relaxed">
                창가 안락의자에 앉아 따스한 차를 마시며 생각을 정리하고, 지친 마음에 맑은 쉼표를 찍습니다.
              </p>
            </div>

            {/* 가치 3 */}
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-[#D7E3D3] shadow-sm hover:shadow-md hover:border-[#8BA884] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2E7] text-[#2F472B] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                💻
              </div>
              <h3 className="text-xl font-bold text-[#1F301D] mb-2">새로운 배움</h3>
              <p className="text-sm text-[#485D44] leading-relaxed">
                나만의 첫 웹사이트를 직접 만들어보며, 기술과 배움이 주는 즐거운 설렘을 이어가고 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 갤러리 섹션 (Gallery / Story) */}
        <section id="gallery" className="py-20 bg-[#EFF5ED] border-y border-[#D6E3D2]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#546C50] bg-white px-3 py-1 rounded-full border border-[#D1E0CD]">
                Moments & Spaces
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A18] mt-3 tracking-tight">
                머무는 공간, 좋아하는 풍경
              </h2>
              <p className="text-[#4A6046] text-sm sm:text-base mt-2">
                일상 속에서 마음에 평온을 선물하는 특별한 순간들입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 이미지 카드 1: 안락의자 */}
              <div className="bg-white rounded-3xl overflow-hidden border border-[#D5E2D1] shadow-md hover:shadow-xl transition-all group">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#FAFBF9]">
                  <Image
                    src="/mount-chair.png"
                    alt="햇살 비치는 정원 안락의자"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#243721] font-bold text-xs px-3 py-1 rounded-full">
                    쉼의 자리
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1B2A18] mb-2">
                    햇살 가득한 오후의 안락의자
                  </h3>
                  <p className="text-sm text-[#485D44] leading-relaxed">
                    아침 햇살이 부드럽게 내려앉는 곳에서 책을 읽거나 눈을 감고 바람 소리를 듣습니다. 가장 아끼는 쉼의 공간입니다.
                  </p>
                </div>
              </div>

              {/* 이미지 카드 2: 수채화 숲길 */}
              <div className="bg-white rounded-3xl overflow-hidden border border-[#D5E2D1] shadow-md hover:shadow-xl transition-all group">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#FAFBF9]">
                  <Image
                    src="/green_tree_bg.jpg"
                    alt="초록빛 수채화 숲길"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#243721] font-bold text-xs px-3 py-1 rounded-full">
                    초록 숲길
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1B2A18] mb-2">
                    마음을 맑게 해주는 숲속 산책
                  </h3>
                  <p className="text-sm text-[#485D44] leading-relaxed">
                    푸르른 나무들 사이를 걸을 때 느껴지는 맑은 공기와 새소리는 복잡했던 생각들을 깨끗하게 비워줍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 일상 및 관심사 (Activities Section) */}
        <section id="activities" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#546C50] bg-[#E9F0E5] px-3 py-1 rounded-full border border-[#D1E0CD]">
              Daily Notes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A18] mt-3 tracking-tight">
              소소한 즐거움과 일상 이야기
            </h2>
            <p className="text-[#4A6046] text-sm sm:text-base mt-2">
              하루하루를 채워나가는 작지만 소중한 기록들입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-[#D7E2D3] shadow-xs hover:border-[#8BA884] transition-all">
              <span className="text-2xl">🌿</span>
              <h4 className="font-bold text-[#1B2A18] mt-3 mb-1 text-base">화초 돌보기</h4>
              <p className="text-xs text-[#50654C] leading-relaxed">
                물을 주고 흙을 어루만지며 새 잎이 돋아나는 순간을 지켜봅니다.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#D7E2D3] shadow-xs hover:border-[#8BA884] transition-all">
              <span className="text-2xl">📝</span>
              <h4 className="font-bold text-[#1B2A18] mt-3 mb-1 text-base">일상 메모</h4>
              <p className="text-xs text-[#50654C] leading-relaxed">
                마음에 남는 좋은 글귀와 하루의 감사를 담담하게 기록합니다.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#D7E2D3] shadow-xs hover:border-[#8BA884] transition-all">
              <span className="text-2xl">🍵</span>
              <h4 className="font-bold text-[#1B2A18] mt-3 mb-1 text-base">차 마시기</h4>
              <p className="text-xs text-[#50654C] leading-relaxed">
                따뜻한 향기와 함께 호흡을 가다듬는 매일의 작은 의식입니다.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#D7E2D3] shadow-xs hover:border-[#8BA884] transition-all">
              <span className="text-2xl">💻</span>
              <h4 className="font-bold text-[#1B2A18] mt-3 mb-1 text-base">코딩 첫걸음</h4>
              <p className="text-xs text-[#50654C] leading-relaxed">
                새로운 배움을 두려워하지 않고 한 걸음씩 완성해 나갑니다.
              </p>
            </div>
          </div>
        </section>

        {/* 방명록 & 인사 남기기 섹션 (Guestbook) */}
        <section id="guestbook" className="py-20 bg-[#F2F6F0] border-t border-[#D6E2D2]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#546C50] bg-white px-3 py-1 rounded-full border border-[#D1E0CD]">
                Guestbook
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A18] mt-3 tracking-tight">
                따뜻한 한마디를 남겨주세요
              </h2>
              <p className="text-[#4A6046] text-sm sm:text-base mt-2">
                방문해주신 소중한 분들의 인사와 메시지를 환영합니다.
              </p>
            </div>

            {/* 입력 폼 */}
            <form
              onSubmit={handleAddEntry}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E3D2] shadow-sm mb-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block text-xs font-bold text-[#344830] mb-1.5"
                  >
                    이름 또는 닉네임
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="예: 푸른 하늘"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DECf] bg-[#FAFBF9] text-[#1B2A18] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7954] transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="guest-message"
                    className="block text-xs font-bold text-[#344830] mb-1.5"
                  >
                    남기실 말씀
                  </label>
                  <input
                    id="guest-message"
                    type="text"
                    required
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="따뜻한 인사 한마디를 적어주세요."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DECf] bg-[#FAFBF9] text-[#1B2A18] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7954] transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#283C25] hover:bg-[#1A2818] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  메시지 등록하기
                </button>
              </div>
            </form>

            {/* 메시지 리스트 */}
            <div className="space-y-3.5">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-[#D8E4D4] shadow-xs flex items-start gap-4 transition-all hover:bg-white"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E8F1E5] text-[#293E26] flex items-center justify-center font-bold text-sm shrink-0">
                    {entry.name.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#1B2A18]">
                        {entry.name}
                      </span>
                      <span className="text-xs text-[#70856C]">{entry.date}</span>
                    </div>
                    <p className="text-sm text-[#3E523A] leading-relaxed break-words">
                      {entry.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 이메일 1:1 비공개 문의 안내 카드 */}
            <div className="mt-12 bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#CADBC6] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F1E4] text-[#2C4128] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1B2A18]">
                    개인적인 문의사항이나 조용한 메시지가 있으신가요?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E644A] mt-1 leading-relaxed">
                    공개 방명록 외에 비공개로 전하고 싶은 말씀, 제휴 및 협업 문의는 이메일을 남겨주시면 정성껏 답변드리겠습니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#283C25] hover:bg-[#1A2818] shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>이메일 문의하기</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 푸터 (Footer) */}
      <footer className="bg-[#1C2C1A] text-[#C6D6C2] py-12 px-4 sm:px-6 border-t border-[#2A3E26]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#5E7958]">
              <Image
                src="/pabicon.png"
                alt="권오애 로고"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">권오애</span>
              <p className="text-xs text-[#95AB91] mt-0.5">
                자연과 쉼이 머무는 개인 공간
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-xs font-semibold text-[#D5E3D1] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#40563C] transition-colors cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 text-[#9EC098]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>이메일 문의하기</span>
            </button>
            <p className="text-xs text-[#95AB91]">
              © {new Date().getFullYear()} 권오애. All rights reserved.
            </p>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-semibold text-[#D5E3D1] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>맨 위로 가기</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </footer>

      {/* 화면 우측 하단 고정 플로팅 문의하기 버튼 */}
      <div className="fixed bottom-6 right-5 sm:right-8 z-40">
        <button
          onClick={() => setIsContactOpen(true)}
          className="group flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#283C25] text-white shadow-xl hover:bg-[#182616] hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border border-[#455E41]"
          aria-label="이메일 문의하기"
        >
          <div className="relative flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#E6F0E4] group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#84B078] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#84B078] rounded-full" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">이메일 문의</span>
        </button>
      </div>

      {/* 이메일 문의 팝업 모달 다이얼로그 */}
      {isContactOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAFBF9] rounded-3xl border border-[#D0DEC9] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
          >
            {/* 모달 닫기 버튼 */}
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#4E644A] hover:text-[#1B2A18] hover:bg-[#EAF2E7] transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 모달 헤더 */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1E4] text-[#2C4128] flex items-center justify-center shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#1B2A18] tracking-tight">
                  이메일 문의사항 남기기
                </h3>
                <p className="text-xs text-[#52684F]">
                  전하고 싶은 말씀이나 궁금한 점을 적어주세요.
                </p>
              </div>
            </div>

            {/* 수신처 이메일 복사 영역 */}
            <div className="my-4 p-3.5 rounded-2xl bg-[#EFF5ED] border border-[#D5E3D1] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#32492E] min-w-0">
                <span className="font-semibold text-[#5B7357] shrink-0">수신 이메일:</span>
                <span className="font-mono font-bold truncate text-[#1B2A18]">{CONTACT_EMAIL}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B2A18] bg-white border border-[#C5D7C1] hover:bg-[#F3F8F1] transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                {emailCopied ? "✓ 복사완료" : "주소 복사"}
              </button>
            </div>

            {/* 발송 성공 알림 */}
            {submitResult.type === "success" && (
              <div className="mb-4 p-4 rounded-2xl bg-[#E6F3E3] border border-[#A6CE9E] text-xs text-[#20401C] flex items-start gap-3">
                <span className="text-xl shrink-0">✨</span>
                <div>
                  <p className="font-bold text-sm">문의사항이 성공적으로 전송되었습니다!</p>
                  <p className="text-xs text-[#3E5C39] mt-0.5 leading-relaxed">
                    {submitResult.message}
                  </p>
                </div>
              </div>
            )}

            {/* 발송 실패 알림 */}
            {submitResult.type === "error" && (
              <div className="mb-4 p-4 rounded-2xl bg-[#FDEAEA] border border-[#F5B4B4] text-xs text-[#842029] flex items-start gap-3">
                <span className="text-xl shrink-0">⚠️</span>
                <div>
                  <p className="font-bold text-sm">전송에 실패했습니다</p>
                  <p className="text-xs text-[#842029]/80 mt-0.5 leading-relaxed">
                    {submitResult.message}
                  </p>
                </div>
              </div>
            )}

            {/* 문의 작성 폼 */}
            <form onSubmit={handleSendEmail} className="space-y-4">
              {/* 문의 유형 선택 */}
              <div>
                <label className="block text-xs font-bold text-[#344830] mb-1.5">
                  문의 유형
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["일반 문의", "안부 & 응원", "제휴 & 협업", "기타 문의"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setContactForm({ ...contactForm, inquiryType: type })}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${contactForm.inquiryType === type
                        ? "bg-[#283C25] text-white border-[#283C25] shadow-xs"
                        : "bg-white text-[#4A6046] border-[#D0DEC9] hover:bg-[#EFF5ED]"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 작성자 정보 (이름, 회신 이메일) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-[#344830] mb-1">
                    성함 또는 닉네임
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="예: 홍길동"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CCD8C8] bg-white text-[#1B2A18] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#587550] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-[#344830] mb-1">
                    회신받을 이메일 주소
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CCD8C8] bg-white text-[#1B2A18] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#587550] transition-all"
                  />
                </div>
              </div>

              {/* 문의 제목 */}
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold text-[#344830] mb-1">
                  문의 제목 <span className="text-[#A43B3B]">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="문의하실 제목을 입력해주세요"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CCD8C8] bg-white text-[#1B2A18] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#587550] transition-all"
                />
              </div>

              {/* 문의 내용 */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-[#344830] mb-1">
                  문의 내용 <span className="text-[#A43B3B]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="궁금하신 내용이나 남기실 말씀을 상세히 적어주세요."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CCD8C8] bg-white text-[#1B2A18] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#587550] transition-all resize-none"
                />
              </div>

              {/* 하단 버튼 및 안내 */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-2xl text-sm font-bold text-white bg-[#283C25] hover:bg-[#1A2818] disabled:bg-[#687C65] disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>이메일 전송 중...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      <span>문의사항 바로 보내기</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#63795F] text-center mt-2.5 leading-relaxed">
                  ※ 별도의 메일 프로그램 실행 없이 서버를 통해 즉시 발송되며, 답변은 남겨주신 이메일로 회신드립니다.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
