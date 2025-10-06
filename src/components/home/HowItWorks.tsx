"use client";

import { UserPlus, Upload, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      icon: UserPlus,
      step: "Langkah 1",
      title: "Buat Akun Toko",
      desc: "Daftarkan toko online Anda dengan formulir sederhana. Gratis, cepat, dan mudah.",
      colorClass: {
        text: "text-blue-600",
        bg: "bg-blue-100",
        darkText: "dark:text-blue-400",
        darkBg: "dark:bg-blue-900/50",
      },
    },
    {
      icon: Upload,
      step: "Langkah 2",
      title: "Upload Produk",
      desc: "Unggah foto produk terbaik Anda, tambahkan deskripsi, dan atur harga dengan mudah.",
      colorClass: {
        text: "text-amber-600",
        bg: "bg-amber-100",
        darkText: "dark:text-amber-400",
        darkBg: "dark:bg-amber-900/50",
      },
    },
    {
      icon: MessageCircle,
      step: "Langkah 3",
      title: "Langsung Jualan",
      desc: "Terima pesanan dari pembeli via WhatsApp. Transaksi aman langsung antara Anda dan pembeli.",
      colorClass: {
        text: "text-emerald-600",
        bg: "bg-emerald-100",
        darkText: "dark:text-emerald-400",
        darkBg: "dark:bg-emerald-900/50",
      },
    },
  ];

  // Intersection observer untuk animasi muncul
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setIsVisible(true)),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Scroll progress (mobile line)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // section belum muncul di bawah layar
      if (rect.top > windowHeight * 0.8) {
        setScrollProgress(0);
        return;
      }

      // section sudah lewat ke atas
      if (rect.bottom < windowHeight * 0.2) {
        setScrollProgress(1);
        return;
      }

      // progress di tengah
      const middlePoint = windowHeight / 2;
      const startPoint = windowHeight * 0.8;
      const endPoint = rect.height - middlePoint;

      const visibleHeight = startPoint - rect.top;
      const totalScrollable = rect.height + windowHeight * 0.5;
      const progress = Math.max(0, Math.min(1, visibleHeight / totalScrollable));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop auto line animation
  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const offset = Math.sin(elapsed / 1000) * 30;
      setMouseOffset(offset);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.85) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-card {
            animation: fadeInScale 0.8s ease-out forwards;
            opacity: 0;
          }
        `}
      </style>

      <section
        ref={sectionRef}
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Mulai Berjualan dalam 3 Langkah Mudah
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Platform kami dirancang agar UMKM bisa go-online dengan cepat dan tanpa biaya.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
  key={step.title}
  className={`relative z-10 ${
    index === 0
      ? "opacity-100" // card pertama langsung tampil penuh
      : isVisible
      ? "animate-card"
      : "opacity-0"
  }`}
  style={{
    animationDelay: index === 0 ? "0s" : `${index * 0.5}s`,
  }}
>

                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 text-center h-full shadow-lg hover:shadow-2xl active:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 group hover:-translate-y-2 active:-translate-y-2">
                    <span className="absolute top-4 right-6 text-7xl font-black text-gray-100 dark:text-gray-800 -z-10">
                      {index + 1}
                    </span>

                    <div
                      className={`w-16 h-16 ${step.colorClass.bg} ${step.colorClass.darkBg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        className={`h-8 w-8 ${step.colorClass.text} ${step.colorClass.darkText}`}
                        strokeWidth={2.2}
                      />
                    </div>

                    <div
                      className={`text-sm font-bold uppercase tracking-wider mb-2 ${step.colorClass.text} ${step.colorClass.darkText}`}
                    >
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Desktop line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full -z-0">
              <svg
                width="100%"
                height="40"
                className="overflow-visible transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${mouseOffset * 0.2}px)` }}
              >
                <path
                  d={`M 10 20 Q 25 ${20 + mouseOffset}, 50 20 T 90 20 T 150 20 T 250 20 T 400 20 T 700 20 T 1000 20`}
                  stroke="url(#gradLine)"
                  strokeWidth="3"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Mobile line */}
            <div className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 h-[calc(100%-5rem)] w-1 -z-0 pointer-events-none">
              <div
                className="w-full bg-gradient-to-b from-emerald-500 to-emerald-400 transition-all duration-500 ease-in-out rounded-full"
                style={{ height: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
