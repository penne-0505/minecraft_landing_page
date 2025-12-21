import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import confetti from "canvas-confetti";

const DiscordMemberListMock = ({ user }) => {
  const [isHover, setIsHover] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const baseShadow =
    "3px 20px 25px -5px rgba(0, 0, 0, 0.3), 3px 10px 10px -5px rgba(0, 0, 0, 0.2)";
  const baseRotate = isDesktop ? 1.5 : 0;

  const handleUserClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 70,
      startVelocity: 20,
      scalar: 0.7,
      ticks: 60,
      gravity: 1.1,
      origin: { x, y },
      zIndex: 10000,
      colors: ['#5fbb4e', '#ffcc00', '#5865f2', '#ffffff']
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(query.matches);
    update();
    if (query.addEventListener) {
      query.addEventListener("change", update);
    } else {
      query.addListener(update);
    }
    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", update);
      } else {
        query.removeListener(update);
      }
    };
  }, []);

  return (
    <motion.div
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      initial={{ rotate: baseRotate }}
      animate={{ rotate: baseRotate }}
      whileHover={{ rotate: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        boxShadow: baseShadow,
        borderColor: isHover ? "rgba(100, 100, 100, 0.5)" : "#1e1f22",
        transition: "box-shadow 0.2s ease-out, border-color 0.2s ease-out",
      }}
      className="w-72 bg-[#313338] rounded-xl overflow-hidden border font-sans"
    >
    <div className="bg-[#2b2d31] p-4 border-b border-[#1e1f22] flex items-center justify-between">
      <span className="text-[#f2f3f5] font-bold text-sm"># supporters-chat</span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#1e1f22]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#1e1f22]"></div>
      </div>
    </div>

    <div className="p-4 bg-[#313338]">
      <div className="text-[#949ba4] text-xs font-bold uppercase tracking-wide mb-3 px-1 hover:text-[#dbdee1] transition-colors cursor-default">
        Supporters — 1
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, x: -10 }}
        whileInView={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ backgroundColor: "rgba(64, 66, 73, 0.6)", x: 2 }}
        onClick={handleUserClick}
        className="flex items-center gap-4 p-2 rounded cursor-pointer group relative"
      >
        <div className="relative">
          <img
            src={
              user?.avatar ||
              "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"
            }
            className="w-10 h-10 rounded-full bg-slate-200"
            alt=""
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#313338] rounded-full p-[4px]">
            <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div>
          <div className="text-[#5fbb4e] font-medium text-base group-hover:underline flex items-center gap-1.5">
            {user?.name ?? "Guest"}
            <Crown
              size={14}
              className="fill-current text-[#ffcc00] stroke-[#ffcc00] stroke-[1px]"
            />
          </div>
          <div className="text-xs text-[#949ba4]">Playing Minecraft</div>
        </div>
      </motion.div>

      <div className="mt-6 opacity-50">
        <div className="text-[#949ba4] text-xs font-bold uppercase tracking-wide mb-3 px-1">
          Members — 3
        </div>
        {["Steve", "Alex", "Zombie"].map((name, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: "rgba(64, 66, 73, 0.6)", x: 2 }}
            className="flex items-center gap-4 p-2 rounded cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-sm font-bold">
              {name[0]}
            </div>
            <div>
              <div className="text-[#dbdee1] text-base font-medium">{name}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </motion.div>
  );
};

export default DiscordMemberListMock;
