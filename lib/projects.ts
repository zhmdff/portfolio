import { Project } from "@/components/ProjectCard";

export const projects: Project[] = [
  {
    id: 1,
    name: "Bakı Biznes Universiteti",
    name_en: "Baku Business University",
    subtitle: "Universitet Portalı",
    subtitle_en: "University Portal",
    description: "Təhsil müəssisəsi üçün müasir, yüksək performanslı rəsmi veb-sayt.",
    description_en: "Modern, high-performance official website for an educational institution.",
    technicalDetails: [
      "Next.js 16 və React 19 ilə performans optimallaşdırılması.",
      "next-intl vasitəsilə tam beynəlxalqlaşdırma (az/en) dəstəyi.",
      "Framer Motion ilə zəngin UI/UX animasiyaları.",
      "Oracle Cloud və Next.js Image vasitəsilə optimallaşdırılmış media delivery."
    ],
    technicalDetails_en: [
      "Performance optimization with Next.js 16 and React 19.",
      "Full internationalization (az/en) support via next-intl.",
      "Rich UI/UX animations with Framer Motion.",
      "Optimized media delivery via Oracle Cloud and Next.js Image."
    ],
    url: "https://bbu.edu.az",
    tags: ["NEXT", "TS", "i18n"],
    image: "/images/projects/bbu.png",
  },
  {
    id: 2,
    name: "BakuDivers",
    name_en: "BakuDivers",
    subtitle: "Dalış Mərkəzi",
    subtitle_en: "Diving Center",
    description: "Dalış mərkəzi üçün müasir və sürətli veb tətbiqin hazırlanması.",
    description_en: "Development of a modern and fast web application for a diving center.",
    technicalDetails: [
      "İstifadəçi dostu interfeys və asan naviqasiya.",
      "Xidmətlər və məhsullar üçün geniş kataloq sistemi.",
      "Backend üçün C# və SQL verilənlər bazası inteqrasiyası.",
      "Sürətli yüklənmə üçün React optimallaşdırmaları."
    ],
    technicalDetails_en: [
      "User-friendly interface and easy navigation.",
      "Comprehensive catalog system for services and products.",
      "C# and SQL database integration for the backend.",
      "React optimizations for fast loading speeds."
    ],
    url: "https://bakudivers.az",
    tags: ["React", "C#", "SQL"],
    image: "/images/projects/baku-divers.png",
  },
  {
    id: 3,
    name: "Aznews",
    name_en: "Aznews",
    subtitle: "Xəbər Portalı",
    subtitle_en: "News Portal",
    description: "PHP Laravel platforması üzərində qurulmuş xəbər portalı.",
    description_en: "News portal built on the PHP Laravel platform.",
    technicalDetails: [
      "Laravel çərçivəsi ilə güclü inzibatçı paneli.",
      "Dinamik xəbər kateqoriyaları və teqlər sistemi.",
      "Yüksək trafik üçün verilənlər bazası optimallaşdırması.",
      "SEO dostu URL strukturu və meta-teqlər."
    ],
    technicalDetails_en: [
      "Powerful admin panel built with Laravel framework.",
      "Dynamic news categories and tagging system.",
      "Database optimizations for high traffic handling.",
      "SEO-friendly URL structure and meta tags."
    ],
    url: "https://aznews.rf.gd",
    tags: ["PHP", "LARAVEL", "MYSQL"],
    image: "/images/projects/aznews.png",
  },
  {
    id: 4,
    name: "Bakı Biznes Universiteti Fayl Sistemi",
    name_en: "Baku Business University File System",
    subtitle: "Bulut Saxlanc Sistemi",
    subtitle_en: "Cloud Storage System",
    description: "Tələbələr və müəllimlər üçün daxili fayl idarəetmə sistemi.",
    description_en: "Internal file management system for students and teachers.",
    technicalDetails: [
      "Faylların təhlükəsiz yüklənməsi və idarə edilməsi.",
      "Tələbə və müəllimlər üçün xüsusi giriş hüquqları.",
      "Next.js App Router mühitində sürətli işləmə qabiliyyəti.",
      "Daxili axtarış və filtrasiya imkanları."
    ],
    technicalDetails_en: [
      "Secure file upload and management system.",
      "Special access rights for students and teachers.",
      "Fast performance within Next.js App Router environment.",
      "Internal search and filtering capabilities."
    ],
    url: "https://bbu-referat.vercel.app/",
    tags: ["Web", "NEXT", "FS"],
    image: "/images/projects/bbu-fs.png",
  },
  {
    id: 5,
    name: "OBA Market Smart Reserve",
    name_en: "OBA Market Smart Reserve",
    subtitle: "Ağıllı Növbə Sistemi",
    subtitle_en: "Smart Queue System",
    description: "Marketlər üçün ağıllı rezervasiya və növbə sistemi MVP-si.",
    description_en: "Smart reservation and queue system MVP for markets.",
    technicalDetails: [
      "QR kod əsaslı sürətli rezervasiya mexanizmi.",
      "Real-vaxt növbə statusu izləmə interfeysi.",
      "Dashboard vasitəsilə mərkəzi market idarəetməsi.",
      "Yüngül və sürətli Next.js mühiti."
    ],
    technicalDetails_en: [
      "QR code based fast reservation mechanism.",
      "Real-time queue status tracking interface.",
      "Centralized market management via dashboard.",
      "Lightweight and fast Next.js environment."
    ],
    url: "https://smart-reserve-mvp.vercel.app/",
    tags: ["NEXT", "QR", "WEB"],
    image: "/images/projects/smart-reserve.png",
  },
];
