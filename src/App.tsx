/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Heart,
  Stars,
  Gift,
  Sparkles,
  Music,
  ChevronDown,
  Quote,
  MessageCircleHeart,
  Star,
  User,
  ShieldCheck,
  Zap,
  HandHeart,
  Baby,
  GraduationCap,
  Stethoscope,
  PartyPopper,
  Play,
  Loader2,
  Video,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import { GoogleGenAI } from "@google/genai";
import confetti from "canvas-confetti";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type IconElementProps = {
  size?: number | string;
  className?: string;
};

type IconElement = React.ReactElement<IconElementProps>;

// --- AI Helper ---
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Sound Utility ---
const SOUNDS = {
  surprise: "https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  reveal: "https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3",
  hover: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  shimmer: "https://assets.mixkit.co/active_storage/sfx/1764/1764-preview.mp3",
};

const playSound = (soundKey: keyof typeof SOUNDS) => {
  const audio = new Audio(SOUNDS[soundKey]);
  audio.volume = soundKey === "hover" ? 0.15 : 0.3;
  audio.play().catch(() => {});
};

// --- Data & Images ---
const IMAGES = {
  hero: "/images/11.png",
  message: "/images/15.png",
  categories: [
    {
      name: "Traditional Grace",
      description: "From sarees to lehengas, you define elegance.",
      photos: [
        {
          url: "/images/12.png",
          caption: "The Diya of Hope",
          sentiment: "Your inner light shines brighter than any flame.",
        },
        {
          url: "/images/13.png",
          caption: "Grace Personified",
          sentiment:
            "Elegance is not about being noticed, but being remembered.",
        },
        {
          url: "/images/18.png",
          caption: "Festive Joy",
          sentiment: "Making every celebration feel like home.",
        },
      ],
    },
    {
      name: "Professional Spark",
      description:
        "Seeing you work with such dedication is a moment of pure pride.",
      photos: [
        {
          url: "/images/19.png",
          caption: "Our Dedicated Nurse",
          sentiment: "The hands that heal are the hands of an angel.",
        },
      ],
    },
    {
      name: "Sisterly Bond",
      description: "My forever partner in crime and best friend.",
      photos: [
        {
          url: "/images/1.png",
          caption: "Forever Moments",
          sentiment:
            "Side by side or miles apart, we are connected by the heart.",
        },
        {
          url: "/images/2.png",
          caption: "Partner In Crime",
          sentiment:
            "Life was meant for good friends and great adventures.",
        },
        {
          url: "/images/3.png",
          caption: "The Best Sister",
          sentiment:
            "You are the greatest gift our parents ever gave me.",
        },
      ],
    },
    {
      name: "Casual Moments",
      description: "The everyday joy of having you around.",
      photos: [
        {
          url: "/images/4.png",
          caption: "Simply You",
          sentiment: "Beauty in its purest, most honest form.",
        },
        {
          url: "/images/5.png",
          caption: "Beautiful Smile",
          sentiment: "A smile that could light up the entire world.",
        },
        {
          url: "/images/6.png",
          caption: "Peaceful Days",
          sentiment: "In your presence, I find my peace.",
        },
        {
          url: "/images/7.png",
          caption: "Everyday Magic",
          sentiment:
            "Turning the mundane into something extraordinary.",
        },
      ],
    },
  ],
  spotlight: [
    {
      url: "/images/17.png",
      quote: "The light of our family.",
    },
    {
      url: "/images/18.png",
      quote: "My forever guiding star.",
    },
    {
      url: "/images/19.png",
      quote: "Our pride, our strength.",
    },
  ],
};

const REASONS = [
  {
    title: "My Biggest Support",
    desc: "You are the one who always stands by me, no matter what.",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: "Safe Place",
    desc: "Your presence is my comfort zone where I can be myself.",
    icon: <HandHeart className="w-6 h-6" />,
  },
  {
    title: "Inspiration",
    desc: "Watching you achieve your goals makes me want to be better.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Best Friend",
    desc: "More than a sister, you're the best friend I could ever ask for.",
    icon: <User className="w-6 h-6" />,
  },
];

const TIMELINE = [
  {
    year: "Our Childhood",
    event: "The Foundation of Love",
    desc: "From the earliest days, you were my guide. Fighting for the remote but sharing our deepest fears—you've always been my safe harbor.",
    icon: <Baby className="w-8 h-8" />,
  },
  {
    year: "A Dreamer's Path",
    event: "Seeing You Achieve",
    desc: "Watching you don your uniform and step into your professional role was one of my proudest moments. Your dedication inspires me every day.",
    icon: <Stethoscope className="w-8 h-8" />,
  },
  {
    year: "Beautiful Memories",
    event: "Traditional & Festive Times",
    desc: "Every festival and every wedding became a core memory because of your presence. From lehengas to sarees, you carry every moment with such grace.",
    icon: <PartyPopper className="w-8 h-8" />,
  },
  {
    year: "Always Together",
    event: "My Forever Best Friend",
    desc: "No matter how much we grow, some things never change. You're still the first person I want to talk to when I'm happy or sad.",
    icon: <Heart className="w-8 h-8" />,
  },
];

// --- Components ---

const GiftBox = ({ onReveal }: { onReveal: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    playSound("shimmer");
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#D4AF37", "#F8BBD0", "#FFD700"],
    });
    setTimeout(onReveal, 1000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.05, rotateZ: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
      >
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <motion.div
            className="absolute -top-4 left-0 w-full h-12 md:h-16 bg-brand-deep-rose rounded-t-xl z-20 shadow-lg border-b-4 border-brand-rose/30"
            animate={isOpen ? { y: -100, rotateX: -45, opacity: 0 } : {}}
            transition={{ duration: 0.8, ease: "backOut" as const }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-brand-gold rounded-full shadow-inner flex items-center justify-center">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            className="w-full h-full bg-brand-rose rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-white/20 flex items-center justify-center relative overflow-hidden"
            animate={isOpen ? { scale: 0.9, opacity: 0.5 } : {}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-12 bg-brand-gold shadow-sm" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 md:h-12 bg-brand-gold shadow-sm" />
            <Gift size={64} className="text-white relative z-10 drop-shadow-lg" />
          </motion.div>

          <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <p className="font-serif text-brand-deep-rose italic text-xl animate-bounce">
              Click to Unbox Your Love
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const ParallaxElement = ({
  children,
  offset = 50,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [dots] = useState(
    [...Array(50)].map(() => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      scale: Math.random() * 2 + 1,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-brand-cream z-[200] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-brand-rose/40"
            initial={{ x: `${dot.x}vw`, y: `${dot.y}vh`, opacity: 0 }}
            animate={{
              x: 0,
              y: 0,
              opacity: [0, 0.5, 1],
              scale: [1, dot.scale, 0.5],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut" as const,
              delay: i * 0.02,
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5, ease: "backOut" as const }}
          className="relative z-10 text-center"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "linear" as const,
              }}
              className="absolute -inset-8 border border-brand-rose/20 rounded-full"
            />
            <Heart
              size={80}
              className="text-brand-deep-rose fill-brand-deep-rose animate-pulse"
            />
          </div>
          <h2 className="font-serif text-4xl text-brand-deep-rose italic tracking-widest">
            Gathering Magic...
          </h2>
          <div className="mt-4 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-brand-deep-rose"
              />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute inset-0 bg-brand-rose/10 blur-[100px] rounded-full pointer-events-none"
      />
    </div>
  );
};

const MEMORY_VIDEO_FRAMES = [
  "/images/11.png",
  "/images/12.png",
  "/images/13.png",
  "/images/15.png",
  "/images/17.png",
  "/images/18.png",
  "/images/19.png",
  "/images/20.png",
  "/images/22.png",
  "/images/23.png",
  "/images/24.png",
  '/images/25.png',
  '/images/26.png',
  '/images/27.png',
  '/images/28.png'
];

const AIStoryVideo = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MEMORY_VIDEO_FRAMES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="glass-card p-8 md:p-12 rounded-[4rem] text-center space-y-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-rose/5 to-brand-gold/5 opacity-100" />

      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-brand-rose/10 rounded-full flex items-center justify-center mx-auto">
            <Video className="w-12 h-12 text-brand-deep-rose" />
          </div>
          <h3 className="font-serif text-4xl text-brand-deep-rose italic">
            Memory Video Montage
          </h3>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto">
            A beautiful video-style slideshow made from your favorite memories.
          </p>
        </div>

        <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-black relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={MEMORY_VIDEO_FRAMES[currentIndex]}
              src={MEMORY_VIDEO_FRAMES[currentIndex]}
              alt={`Memory frame ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1.2 }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {MEMORY_VIDEO_FRAMES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                )}
                aria-label={`Go to frame ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="bg-brand-deep-rose text-white px-8 py-4 rounded-full font-serif text-xl shadow-xl hover:shadow-brand-rose/40 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            {isPlaying ? (
              <span>Pause</span>
            ) : (
              <>
                <Play fill="currentColor" size={20} />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-brand-rose/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: "110%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 1, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: i % 2 === 0 ? Infinity : 0,
            delay: Math.random() * 20,
            ease: "linear" as const,
          }}
        >
          <Heart fill="currentColor" size={Math.random() * 40 + 20} />
        </motion.div>
      ))}
    </div>
  );
};

const Typewriter = ({
  text,
  delay = 100,
}: {
  text: string;
  delay?: number;
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsPlaying(!isPlaying)}
      className="fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg border border-brand-rose group"
    >
      <div className="relative">
        <Music
          className={cn(
            "w-6 h-6 transition-colors",
            isPlaying ? "text-brand-deep-rose" : "text-gray-400"
          )}
        />
        {isPlaying && (
          <>
            <motion.div
              animate={{ y: [-5, -15], opacity: [1, 0], x: [0, 5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -top-2 -right-2 text-brand-deep-rose text-xs font-bold"
            >
              ♪
            </motion.div>
            <motion.div
              animate={{ y: [-5, -15], opacity: [1, 0], x: [0, -5] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
              className="absolute -top-2 -left-2 text-brand-deep-rose text-xs font-bold"
            >
              ♫
            </motion.div>
          </>
        )}
      </div>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 glass-card px-3 py-1 rounded-full text-[10px] font-sans tracking-widest text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isPlaying ? "STOP MAGIC" : "PLAY MAGIC"}
      </span>
    </motion.button>
  );
};

const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className={cn("py-20 px-6 max-w-7xl mx-auto relative z-10", className)}
    >
      {children}
    </motion.section>
  );
};

type FadeInProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
};

const FadeIn = ({
  children,
  className,
  direction = "up",
  ...props
}: FadeInProps) => {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

interface GalleryCardProps {
  photo: {
    url: string;
    caption?: string;
    sentiment: string;
  };
  index: number;
  categoryName: string;
}

const GalleryCard = ({ photo, index, categoryName }: GalleryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <FadeIn>
      <motion.div
        whileHover={{
          y: -15,
          scale: 1.05,
          rotate: index % 2 === 0 ? 3 : -3,
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          playSound("hover");
        }}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden shadow-2xl transition-all duration-500 group cursor-zoom-in"
      >
        <div className="bg-white p-4 pb-12 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="overflow-hidden aspect-[4/5] sm:aspect-auto rounded-sm relative">
            <img
              src={photo.url}
              alt={`${categoryName} ${index + 1}`}
              className="w-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1 bg-gray-100 min-h-[300px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-rose/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
          </div>

          <div className="pt-6 px-2 space-y-3 relative z-10 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-brand-rose/20" />
              <Heart className="w-4 h-4 text-brand-rose fill-brand-rose animate-pulse" />
              <div className="h-[1px] flex-1 bg-brand-rose/20" />
            </div>
            <div className="text-center relative min-h-[5rem] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {!isHovered ? (
                  <motion.div
                    key="caption"
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-1"
                  >
                    <span className="font-script text-2xl text-brand-rose block opacity-60">
                      Didi&apos;s Note
                    </span>
                    <p className="font-serif text-brand-deep-rose text-xl italic leading-tight px-4">
                      {photo.caption || "Sweet Memory"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sentiment"
                    initial={{ opacity: 0, scale: 0.5, y: 20, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.2, y: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="relative px-4"
                  >
                    <div className="absolute inset-0 bg-brand-gold/10 blur-xl rounded-full scale-150 -z-10" />
                    <Sparkles className="w-6 h-6 text-brand-gold mb-2 mx-auto animate-pulse" />
                    <p className="font-sans text-brand-deep-rose text-base italic font-bold leading-relaxed tracking-tight drop-shadow-sm">
                      "{photo.sentiment}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Star className="text-brand-gold fill-brand-gold w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isHoveredGift, setIsHoveredGift] = useState(false);
  const [showSecretLetter, setShowSecretLetter] = useState(false);
  const [showHeroSurprise, setShowHeroSurprise] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenGift = () => {
    playSound("surprise");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f8bbd0", "#f3e5f5", "#fff9f0", "#d4af37"],
    });
    setIsOpened(true);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (!isOpened) {
    return (
      <div className="fixed inset-0 bg-brand-cream flex items-center justify-center p-6 z-[100]">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl text-brand-deep-rose mb-4 drop-shadow-sm">
              <Typewriter
                text="A Delivery for One Very Special Sister"
                delay={50}
              />
            </h2>
            <p className="font-sans text-gray-500 mb-8 italic text-lg">
              Your little surprise is waiting inside...
            </p>
          </motion.div>

          <motion.div
            className="cursor-pointer relative inline-block group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenGift}
            onMouseEnter={() => {
              setIsHoveredGift(true);
              playSound("hover");
            }}
            onMouseLeave={() => setIsHoveredGift(false)}
          >
            <AnimatePresence>
              {isHoveredGift && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-brand-rose/40 blur-3xl rounded-full"
                />
              )}
            </AnimatePresence>

            <div className="relative">
              <div className="bg-gradient-to-br from-brand-rose to-brand-deep-rose p-12 rounded-[2rem] shadow-2xl border-8 border-white transform transition-transform group-hover:rotate-2">
                <Gift className="w-24 h-24 text-white animate-bounce" />
              </div>
              <div className="absolute -top-6 -right-6 bg-brand-gold p-4 rounded-full shadow-lg border-4 border-white transform rotate-12">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <motion.div
              className="mt-12"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <button className="bg-brand-deep-rose text-white px-10 py-4 rounded-full font-serif text-xl tracking-wide hover:bg-brand-deep-rose/90 transition-all hover:px-12 shadow-xl shadow-brand-rose/40 ring-4 ring-white focus:outline-none">
                Open Your Gift
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <FloatingHearts />
      <MusicToggle />

      <section className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-6 py-20">
        <ParallaxElement offset={-200} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-rose/20 mix-blend-multiply z-10" />
          <img
            src={IMAGES.hero}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </ParallaxElement>

        <div className="max-w-4xl w-full text-center relative z-10 space-y-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="font-script text-2xl md:text-4xl text-brand-deep-rose block mb-2">
              Celebrating You...
            </span>
            <h1 className="font-serif text-6xl md:text-9xl text-brand-deep-rose tracking-tight text-glow leading-none">
              Happy Birthday, <br />
              <span className="italic">Didi</span>
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showHeroSurprise ? (
              <motion.div
                key="gift-box"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                className="py-10"
              >
                <GiftBox onReveal={() => setShowHeroSurprise(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="relative mx-auto w-64 h-64 md:w-96 md:h-96"
                >
                  <div className="absolute inset-0 border-2 border-brand-gold rounded-full animate-[spin_20s_linear_infinite] p-4 scale-110 opacity-30" />
                  <div className="absolute inset-0 border border-brand-rose rounded-full animate-[spin_25s_linear_infinite_reverse] p-6 scale-110 opacity-30" />
                  <div className="w-full h-full rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                    <img
                      src={IMAGES.hero}
                      alt="Main Birthday Girl"
                      className="w-full h-full object-cover bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>

                <div className="space-y-8">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="font-sans text-lg md:text-2xl text-gray-700 max-w-2xl mx-auto italic font-light"
                  >
                    "To the one who has been my guide, my protector, and my
                    favorite person since day one."
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playSound("click");
                      document
                        .getElementById("message")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-brand-deep-rose text-white px-12 py-5 rounded-full font-serif text-2xl shadow-2xl hover:shadow-brand-rose/40 transition-all flex items-center gap-4 mx-auto"
                  >
                    Open Your Surprise
                    <ChevronDown size={24} className="animate-bounce" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Section
        id="message"
        className="bg-brand-cream/50 min-h-screen flex items-center"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">
          <FadeIn className="order-2 md:order-1" direction="right">
            <div className="glass-card p-10 md:p-16 rounded-[3rem] relative shadow-2xl">
              <Quote className="absolute -top-8 -left-8 w-20 h-20 text-brand-rose opacity-40" />
              <div className="space-y-8">
                <h3 className="font-serif text-4xl text-brand-deep-rose font-bold italic">
                  To my dearest Didi,
                </h3>
                <div className="font-sans text-xl text-gray-700 leading-relaxed space-y-6">
                  <p>
                    On your special day, I want you to know how much you truly
                    mean to me. You are not just my sister; you are a piece of
                    my heart that I carry with me everywhere.
                  </p>
                  <p>
                    Through every high and low, your strength and grace have
                    inspired me to be a better person. You&apos;ve taught me
                    what it means to be selfless, kind, and resilient.
                  </p>
                  <p>
                    Today is about celebrating the beautiful soul that you are.
                    May your year be as bright and wonderful as your smile.
                  </p>
                </div>
                <p className="font-script text-4xl text-brand-deep-rose pt-8">
                  - With all my love, your sibling
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn
            className="order-1 md:order-2 flex justify-center"
            direction="left"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-rose/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              <img
                src={IMAGES.message}
                className="relative z-10 w-full max-w-sm rounded-[4rem] shadow-2xl border-[16px] border-white transform rotate-6 group-hover:rotate-0 transition-all duration-1000 ease-out bg-gray-100"
                alt="Sweet Moment"
                referrerPolicy="no-referrer"
              />
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-32">
        <FadeIn>
          <AIStoryVideo />
        </FadeIn>
      </Section>

      <Section className="bg-white rounded-[5rem] shadow-inner py-32 overflow-hidden">
        <div className="text-center mb-24 space-y-6">
          <FadeIn>
            <h2 className="font-serif text-5xl md:text-7xl text-brand-deep-rose italic font-bold">
              Our Beautiful Memories
            </h2>
          </FadeIn>
          <FadeIn>
            <div className="w-32 h-1.5 bg-brand-rose mx-auto rounded-full" />
          </FadeIn>
          <FadeIn>
            <p className="font-sans text-xl text-gray-500 italic max-w-lg mx-auto">
              Every photo carries a whisper of our shared laughter and boundless
              love.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-32">
          {IMAGES.categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-12">
              <FadeIn
                className="px-6"
                direction={catIdx % 2 === 0 ? "right" : "left"}
              >
                <h3 className="font-serif text-4xl text-brand-deep-rose mb-2 italic font-bold">
                  {category.name}
                </h3>
                <p className="font-sans text-gray-500 italic text-lg">
                  {category.description}
                </p>
              </FadeIn>

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12 px-4 md:px-0">
                {category.photos.map((photo, i) => (
                  <GalleryCard
                    key={i}
                    photo={photo}
                    index={i}
                    categoryName={category.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-brand-lavender/20 to-brand-cream/20 py-32 rounded-[6rem]">
        <div className="text-center mb-24">
          <FadeIn>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-deep-rose mb-6 italic font-extrabold">
              A Journey of Bond...
            </h2>
          </FadeIn>
          <FadeIn>
            <p className="font-sans text-xl text-gray-500 italic">
              Tracing the heartbeats of our growing years together.
            </p>
          </FadeIn>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-20">
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0.5 bg-brand-rose/10 hidden md:block">
            <motion.div
              className="w-full bg-gradient-to-b from-brand-rose via-brand-gold to-brand-rose shadow-[0_0_20px_rgba(212,175,55,0.6)] rounded-full relative"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 2, ease: "easeInOut" as const }}
            >
              <motion.div
                animate={{ top: ["-10%", "110%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "linear" as const,
                }}
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 blur-md pointer-events-none"
              />

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 text-brand-gold"
                  initial={{
                    top: `${Math.random() * 100}%`,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: [-10, 10, -10],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 5,
                    ease: "easeInOut" as const,
                  }}
                >
                  <Sparkles size={12} className="animate-spin" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col md:flex-row gap-12 items-center relative",
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "absolute -z-10 opacity-5 blur-xl pointer-events-none",
                  i % 2 !== 0 ? "left-0" : "right-0"
                )}
              >
                {React.cloneElement(item.icon as IconElement, {
                  size: 300,
                  className: "text-brand-rose",
                })}
              </div>

              <FadeIn
                className="flex-1 w-full relative"
                direction={i % 2 !== 0 ? "left" : "right"}
              >
                <motion.div
                  className="glass-card p-10 rounded-[3rem] premium-shadow group hover:bg-white/60 transition-all relative overflow-hidden active:scale-95"
                  whileHover={{ x: i % 2 !== 0 ? 10 : -10, y: -5 }}
                  onMouseEnter={() => playSound("hover")}
                >
                  <div className="absolute top-4 right-4 text-brand-rose/10 group-hover:text-brand-rose/20 transition-colors">
                    {React.cloneElement(item.icon as IconElement, { size: 100 })}
                  </div>

                  <motion.div
                    className="absolute -left-12 -top-12 text-brand-rose opacity-0 group-hover:opacity-20 transition-opacity"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      repeat: Infinity,
                      duration: 20,
                      ease: "linear" as const,
                    }}
                  >
                    <Stars size={80} />
                  </motion.div>

                  <div className="absolute -bottom-10 -right-10 opacity-0 group-hover:opacity-15 transition-all duration-700 pointer-events-none transform translate-y-4 group-hover:translate-y-0">
                    {i === 0 && (
                      <div className="space-y-4">
                        <Baby size={180} className="text-brand-gold" />
                        <Sparkles className="text-brand-rose animate-bounce" />
                      </div>
                    )}
                    {i === 1 && (
                      <div className="space-y-4">
                        <GraduationCap size={180} className="text-brand-gold" />
                        <Stars className="text-brand-rose animate-pulse" />
                      </div>
                    )}
                    {i === 2 && (
                      <div className="space-y-4">
                        <Sparkles size={180} className="text-brand-gold" />
                        <PartyPopper className="text-brand-rose animate-spin" />
                      </div>
                    )}
                    {i === 3 && (
                      <div className="space-y-4">
                        <Heart size={180} className="text-brand-gold" />
                        <HandHeart className="text-brand-rose animate-bounce" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-brand-rose/10 rounded-2xl text-brand-deep-rose">
                      {item.icon}
                    </div>
                    <span className="font-serif text-brand-gold text-2xl font-black">
                      {item.year}
                    </span>
                  </div>
                  <h4 className="font-sans text-2xl font-bold text-brand-deep-rose mb-4">
                    {item.event}
                  </h4>
                  <p className="font-sans text-gray-600 text-lg italic leading-relaxed">
                    "{item.desc}"
                  </p>
                </motion.div>
              </FadeIn>

              <div className="hidden md:flex relative z-10 items-center justify-center">
                <motion.div
                  whileInView={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-14 h-14 rounded-full bg-brand-deep-rose ring-[12px] ring-brand-rose/15 shadow-[0_0_30px_rgba(173,20,87,0.4)] flex items-center justify-center text-white p-3 relative"
                >
                  <Sparkles className="w-full h-full" />
                  <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-brand-gold rounded-full -z-10 blur-md"
                  />
                </motion.div>
              </div>

              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white rounded-[5rem] py-32">
        <div className="text-center mb-24">
          <h2 className="font-serif text-5xl md:text-7xl text-brand-deep-rose italic">
            Why You Are Everything...
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {REASONS.map((reason, i) => (
            <motion.div
              key={i}
              className="bg-brand-cream/30 p-12 rounded-[3.5rem] shadow-sm text-center space-y-8 group hover:bg-brand-deep-rose border border-brand-rose/10 transition-all duration-700"
              whileHover={{
                y: -20,
                boxShadow: "0 25px 50px -12px rgba(173, 20, 87, 0.25)",
              }}
              onMouseEnter={() => playSound("hover")}
            >
              <div className="w-24 h-24 bg-white text-brand-deep-rose rounded-[2rem] mx-auto flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:bg-white group-hover:rotate-12 transition-all duration-700">
                {reason.icon}
              </div>
              <h4 className="font-serif text-3xl text-brand-deep-rose group-hover:text-white transition-colors">
                {reason.title}
              </h4>
              <p className="font-sans text-gray-500 text-lg group-hover:text-brand-pink transition-colors leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section
        id="surprise"
        className="bg-brand-rose/10 rounded-[6rem] mb-32 py-32"
      >
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <h2 className="font-serif text-5xl text-brand-deep-rose italic">
            A Secret for Your Eyes Only
          </h2>
          <p className="font-sans text-xl text-gray-600 font-light">
            I have something more to tell you. Will you open your heart to it?
          </p>

          <div className="relative h-80 md:h-[400px] perspective-1000">
            <AnimatePresence mode="wait">
              {!showSecretLetter ? (
                <motion.div
                  key="envelope"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: 90 }}
                  className="bg-gradient-to-br from-brand-rose to-brand-deep-rose p-12 rounded-[3rem] shadow-2xl cursor-pointer hover:shadow-brand-rose/50 transition-all h-full flex flex-col items-center justify-center space-y-6 group"
                  onClick={() => {
                    setShowSecretLetter(true);
                    playSound("reveal");
                  }}
                  onMouseEnter={() => playSound("hover")}
                >
                  <div className="relative">
                    <MessageCircleHeart className="w-24 h-24 text-white animate-pulse" />
                    <Sparkles className="absolute -top-4 -right-4 text-brand-gold animate-spin" />
                  </div>
                  <span className="text-white font-serif italic tracking-[0.2em] text-2xl group-hover:scale-110 transition-transform">
                    READ MY HEART
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  className="glass-card p-12 md:p-16 rounded-[3rem] shadow-inner h-full flex flex-col items-center justify-center space-y-8 border-2 border-brand-rose/20"
                >
                  <Heart className="w-12 h-12 text-brand-deep-rose fill-brand-deep-rose animate-bounce" />
                  <p className="font-script text-3xl md:text-4xl text-brand-deep-rose italic leading-relaxed text-glow">
                    "You are not just my sister, you are a part of my heart. No
                    matter how many birthdays pass, you&apos;ll always be my
                    favorite person in the world. I am so lucky to walk through
                    life with you."
                  </p>
                  <button
                    onClick={() => setShowSecretLetter(false)}
                    className="text-sm font-sans uppercase tracking-[0.4em] text-gray-400 hover:text-brand-deep-rose transition-all hover:tracking-[0.6em] py-2"
                  >
                    CLOSE LETTER
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      <Section className="bg-white rounded-[5rem] overflow-hidden pb-48 pt-32">
        <div className="text-center mb-24">
          <h2 className="font-serif text-5xl md:text-7xl text-brand-deep-rose flex items-center justify-center gap-8 italic font-bold">
            <Star className="text-brand-gold fill-brand-gold w-10 h-10 animate-pulse" />
            Spotlight Moments
            <Star className="text-brand-gold fill-brand-gold w-10 h-10 animate-pulse" />
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-center justify-center px-10">
          {IMAGES.spotlight.map((photo, i) => (
            <motion.div
              key={i}
              initial={{
                rotate: i % 2 === 0 ? -8 : 8,
                scale: 0.9,
                opacity: 0,
              }}
              whileInView={{
                rotate: i % 2 === 0 ? -4 : 4,
                scale: 1,
                opacity: 1,
              }}
              whileHover="hover"
              onMouseEnter={() => playSound("hover")}
              className="w-full max-w-sm group"
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              style={{ perspective: 1200 }}
            >
              <div className="bg-white p-6 pb-24 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm transform transition-all duration-1000 border border-gray-100 flex flex-col items-center relative overflow-hidden active:scale-95 group-hover:border-brand-gold/50 group-hover:shadow-brand-rose/20">
                <div className="absolute inset-0 bg-brand-rose/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <motion.div
                  className="w-full h-[400px] overflow-hidden rounded-sm mb-8 relative"
                  variants={{
                    hover: {
                      rotateY: 20,
                      rotateX: 10,
                      scale: 1.1,
                      z: 100,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      },
                    },
                  }}
                >
                  <img
                    src={photo.url}
                    alt="Spotlight"
                    className="w-full h-full object-cover transition-all duration-1000 bg-gray-100 group-hover:scale-125 group-hover:blur-[1px]"
                    referrerPolicy="no-referrer"
                  />

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent -translate-x-full pointer-events-none z-30"
                    variants={{
                      hover: { translateX: "200%" },
                    }}
                    transition={{ duration: 0.8, ease: "circOut" as const }}
                  />

                  <div className="absolute inset-0 bg-brand-deep-rose/85 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[12px] z-20">
                    <motion.div
                      variants={{
                        hover: {
                          scale: 1,
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: {
                            delay: 0.3,
                            type: "spring",
                            bounce: 0.5,
                          },
                        },
                      }}
                      initial={{
                        scale: 0.3,
                        opacity: 0,
                        y: 80,
                        filter: "blur(20px)",
                      }}
                      className="space-y-8"
                    >
                      <Quote className="w-16 h-16 text-brand-gold mx-auto opacity-90 animate-pulse" />
                      <p className="font-serif text-white text-4xl md:text-5xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] italic leading-tight scale-110">
                        "{photo.quote}"
                      </p>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                      >
                        <Sparkles className="w-12 h-12 text-brand-gold mx-auto" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="relative z-10 text-center">
                  <div className="font-script text-4xl text-brand-rose opacity-80 mb-2">
                    #{i + 1}
                  </div>
                  <div className="font-serif text-xl text-gray-400 italic">
                    Pure Elegance
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute bottom-4 right-4 text-brand-gold"
                >
                  <Heart size={32} fill="currentColor" className="opacity-20" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <footer className="bg-brand-deep-rose text-white pt-48 pb-32 px-6 relative overflow-hidden rounded-t-[10rem]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ParallaxElement
            offset={200}
            className="absolute top-1/4 left-1/4 animate-ping"
          >
            <Sparkles size={150} />
          </ParallaxElement>
          <ParallaxElement
            offset={150}
            className="absolute bottom-1/4 right-1/4 animate-pulse"
          >
            <Stars size={180} />
          </ParallaxElement>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Heart size={600} strokeWidth={1} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 2, bounce: 0.5 }}
          >
            <Heart
              size={150}
              fill="white"
              className="mx-auto text-white drop-shadow-2xl"
            />
          </motion.div>

          <div className="space-y-10">
            <h2 className="font-serif text-6xl md:text-8xl text-white italic font-bold">
              Happy Birthday, Didi.
            </h2>
            <div className="font-sans text-2xl md:text-3xl text-brand-pink leading-relaxed max-w-3xl mx-auto italic font-light">
              "This website is more than just code; it&apos;s a digital hug, a
              lifetime of gratitude, and a promise that I&apos;ll always be your
              biggest fan."
            </div>
          </div>

          <div className="pt-24 border-t border-brand-rose/20 flex flex-col items-center">
            <p className="font-script text-5xl mb-6">Forever your sibling,</p>
            <div className="inline-flex items-center gap-4 bg-white/10 px-8 py-3 rounded-full backdrop-blur-sm">
              <Heart size={16} fill="white" />
              <span className="font-sans uppercase tracking-[0.5em] text-sm font-bold opacity-90">
                Created with Love
              </span>
              <Heart size={16} fill="white" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}