/* Real plugin data from the Crowz development downloads folder */
const PLUGINS = [
  {
    id: "armor-durability-hud", name: "CrowzArmorDurabilityHUD", jar: "crowz-armordurability-hud-1.0.0.jar", version: "1.0.0",
    category: "Client Mod", type: "Client",
    desc: "Real-time armor durability HUD with durability alerts and color-coded status indicators.",
    features: ["Armor status HUD", "Durability warnings", "Color-coded alerts"]
  },
  {
    id: "antivpn", name: "CrowzAntiVPN", jar: "CrowzAntiVPN-1.0.0.jar", version: "1.0.0",
    category: "Security", type: "Plugin",
    desc: "Advanced anti-VPN protection system for Paper servers with IP lookup and whitelisting.",
    features: ["VPN detection", "IP lookup", "Whitelist management"]
  },
  {
    id: "canticheat", name: "CrowzCAnticheat", jar: "CrowzCAnticheat.jar", version: "1.0.0",
    category: "Security", type: "Plugin",
    desc: "Anti-cheat suite with alert HUD and multiple detection types to keep your server clean.",
    features: ["Alert HUD", "Multi-detection", "Config manager"]
  },
  {
    id: "optimizer", name: "CrowzOptimizer", jar: "CrowzOptimizer-1.0.0.jar", version: "1.0.0",
    category: "Performance", type: "Plugin",
    desc: "Advanced server optimization plugin to reduce lag and improve TPS.",
    features: ["TPS improvement", "Entity limits", "Redstone limits"]
  },
  {
    id: "performance", name: "CrowzPerformance", jar: "crowzperformance-1.0.0.jar", version: "1.0.0",
    category: "Client Mod", type: "Client",
    desc: "Client-side performance mod with chunk, entity, and block culling for smoother gameplay.",
    features: ["Block culling", "Entity culling", "Chunk memory"]
  },
  {
    id: "pvp", name: "CrowzPvP", jar: "crowzpvp-1.0.0.jar", version: "1.0.0",
    category: "Client Mod", type: "Client",
    desc: "PvP client utilities — auto-eat, auto-sprint, auto-fish, and armor break warnings.",
    features: ["Auto-eat", "Auto-sprint", "Armor break warning"]
  },
  {
    id: "enclave-joinquit", name: "EnclaveJoinAndQuit", jar: "EnclaveJoinAndQuit-1.0.0.jar", version: "1.0.0",
    category: "Chat", type: "Plugin",
    desc: "Rich customizable join/quit with MiniMessage, actionbar, titles, sounds, and PlaceholderAPI.",
    features: ["MiniMessage", "Actionbar & titles", "PlaceholderAPI"]
  },
  {
    id: "enclave-shop", name: "EnclaveShop", jar: "EnclaveShop-1.0.0.jar", version: "1.0.0",
    category: "Economy", type: "Plugin",
    desc: "High-performance configurable shop with EnclaveEco integration and Vault support.",
    features: ["GUI shop", "Vault support", "EnclaveEco"]
  },
  {
    id: "enclave-smp", name: "EnclaveSMP", jar: "EnclaveSMP-1.0.0.jar", version: "1.0.0",
    category: "SMP", type: "Plugin",
    desc: "Core SMP utilities — set the server world spawn and respawn all players there.",
    features: ["Spawn management", "Respawn control"]
  },
  {
    id: "everything-in1", name: "EverythingIn1", jar: "EverythingIn1-1.0.0.jar", version: "1.0.0",
    category: "Utility", type: "Plugin",
    desc: "All-in-one: optimization, moderation & chat. Vanish, freeze, fly, staff chat, and more.",
    features: ["Vanish & freeze", "Staff chat", "Lag viewer"]
  },
  {
    id: "flowsmp", name: "FlowSMP", jar: "FlowSMP-1.0.0.jar", version: "1.0.0",
    category: "PvP", type: "Plugin",
    desc: "Legendary combat weapons with a unique offhand interaction system.",
    features: ["Custom weapons", "Offhand system"]
  },
  {
    id: "kais-clearlag", name: "KaisClearLag", jar: "KaisClearLag-1.0.0.jar", version: "1.0.0",
    category: "Performance", type: "Plugin",
    desc: "Advanced lightweight ClearLag utility with custom schedules and warnings.",
    features: ["Item clearing", "Schedules", "Warnings"]
  },
  {
    id: "pvpcorex", name: "PVPCoreX", jar: "PVPCoreX-1.0.0.jar", version: "1.0.0",
    category: "PvP", type: "Plugin",
    desc: "The ultimate all-in-one PvP ecosystem — duels, bounties, KOTH, supply drops, and kill streaks.",
    features: ["Duels", "Bounties", "KOTH", "Kill streaks"]
  },
  {
    id: "quitjoin", name: "QuitJoin", jar: "QuitJoin-1.0.0.jar", version: "1.0.0",
    category: "Chat", type: "Plugin",
    desc: "Fully customizable join and quit messages for Paper servers.",
    features: ["Custom messages", "Hide & see options"]
  },
  {
    id: "staffmod", name: "StaffModerationPlus", jar: "StaffModerationPlus-1.0.0.jar", version: "2.0.0",
    category: "Staff", type: "Plugin",
    desc: "Advanced staff moderation toolkit — bans, freeze, vanish, reports, alt detection, and more.",
    features: ["Ban & tempban", "Reports", "Alt detection", "Staff GUI"]
  },
  {
    id: "ultimate-team", name: "UltimateTeam", jar: "UltimateTeam-1.0.0.jar", version: "1.0.0",
    category: "SMP", type: "Plugin",
    desc: "Full-featured team system with PvP, team homes, chests, chat, and a GUI.",
    features: ["Team PvP", "Team homes", "Team chest", "GUI"]
  },
  {
    id: "ultimate-voice", name: "UltimateVoice", jar: "UltimateVoice-1.0.0.jar", version: "1.0.0",
    category: "Voice", type: "Plugin",
    desc: "Enterprise-grade voice communication plugin — calls, groups, friends, and history.",
    features: ["Voice calls", "Voice groups", "Friends list"]
  },
  {
    id: "v0auth", name: "v0Auth", jar: "v0Auth-1.0.0.jar", version: "1.0.0",
    category: "Security", type: "Plugin",
    desc: "Advanced authentication and security — SQL storage, CAPTCHA, rate limiting, and lockout.",
    features: ["SQL storage", "CAPTCHA", "Rate limiting", "Folia-ready"]
  }
];

const CATEGORY_COLORS = {
  "Security": "#f43f5e",
  "Performance": "#22d3ee",
  "PvP": "#ef4444",
  "Staff": "#a78bfa",
  "Chat": "#fbbf24",
  "Economy": "#34d399",
  "SMP": "#38bdf8",
  "Client Mod": "#fb923c",
  "Voice": "#818cf8",
  "Utility": "#94a3b8"
};

const CATEGORY_ICONS = {
  "Security": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
  "Performance": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  "PvP": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>`,
  "Staff": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  "Chat": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  "Economy": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15.5 9.5a3.5 3.5 0 00-3.5-2.5c-2 0-3 1.3-3 2.5s1 2.5 3 3 3 1 3 2.5-1 2.5-3 2.5a3.5 3.5 0 01-3.5-2.5"/></svg>`,
  "SMP": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18"/><path d="M4 20c0-4 4-5 4-9 0-2-1-3-1-3s2 0 3 1c1-2 3-3 5-3s4 1 5 3c1-1 3-1 3-1s-1 1-1 3c0 4 4 5 4 9"/><path d="M12 9v4m-2-2h4"/></svg>`,
  "Client Mod": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  "Voice": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="17" x2="12" y2="22"/></svg>`,
  "Utility": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
};
