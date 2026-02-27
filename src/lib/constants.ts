/**
 * Game Categories Constants
 * Danh sách thể loại game được sử dụng trong toàn hệ thống
 */

export const GAME_CATEGORIES = [
  "Tất cả",
  "RPG",
  "FPS",
  "MMORPG",
  "Racing",
  "Battle Royale",
  "Strategy",
  "MOBA",
  "Adventure",
  "Puzzle",
  "Sports",
  "Simulation",
] as const;

// Loại bỏ "Tất cả" cho admin form (chỉ dùng cho filter)
export const GAME_CATEGORIES_FOR_FORM = GAME_CATEGORIES.filter(
  (cat) => cat !== "Tất cả",
);

export type GameCategory = (typeof GAME_CATEGORIES)[number];
export type GameCategoryForForm = (typeof GAME_CATEGORIES_FOR_FORM)[number];
