/**
 * 타로카드 ID → 이미지 경로 매핑
 * 네이밍 규칙: card_major_NN_name_vNN.ext / card_minor_NN_suit_rank_vNN.ext
 */
const BASE = '/assets/tarot_cards'

export const CARD_IMAGE_MAP: Record<string, string> = {
  // ── Major Arcana ──────────────────────────────────────────────────────
  // major_0 (The Fool) → 이미지 없음, 폴백 처리
  major_1:  `${BASE}/card_major_01_the_magician_v01.png`,
  major_2:  `${BASE}/card_major_02_the_high_priestess_v01.jpg`,
  major_3:  `${BASE}/card_major_03_the_empress_v01.png`,
  major_4:  `${BASE}/card_major_04_the_emperor_v01.png`,
  major_5:  `${BASE}/card_major_05_the_hierophant_v01.png`,
  major_6:  `${BASE}/card_major_06_the_lovers_v01.png`,
  major_7:  `${BASE}/card_major_07_the_chariot_v01.png`,
  major_8:  `${BASE}/card_major_08_strength_v01.jpg`,
  major_9:  `${BASE}/card_major_09_the_hermit_v01.png`,
  major_10: `${BASE}/card_major_10_wheel_of_fortune_v01.png`,
  major_11: `${BASE}/card_major_11_justice_v01.png`,
  major_12: `${BASE}/card_major_12_the_hanged_man_v01.png`,
  major_13: `${BASE}/card_major_13_death_v01.png`,
  major_14: `${BASE}/card_major_14_temperance_v01.png`,
  major_15: `${BASE}/card_major_15_the_devil_v01.jpg`,
  major_16: `${BASE}/card_major_16_the_tower_v01.png`,
  major_17: `${BASE}/card_major_17_the_star_v01.png`,
  major_18: `${BASE}/card_major_18_the_moon_v01.png`,
  major_19: `${BASE}/card_major_19_the_sun_v01.png`,
  major_20: `${BASE}/card_major_20_judgement_v01.png`,
  // major_21 (The World) → 이미지 없음, 폴백 처리

  // ── Wands (22–35) ─────────────────────────────────────────────────────
  wands_ace:    `${BASE}/card_minor_22_wands_ace_v01.png`,
  wands_2:      `${BASE}/card_minor_23_wands_02_v01.png`,
  wands_3:      `${BASE}/card_minor_24_wands_03_v01.png`,
  wands_4:      `${BASE}/card_minor_25_wands_04_v01.png`,
  wands_5:      `${BASE}/card_minor_26_wands_05_v01.png`,
  wands_6:      `${BASE}/card_minor_27_wands_06_v01.png`,
  wands_7:      `${BASE}/card_minor_28_wands_07_v01.png`,
  wands_8:      `${BASE}/card_minor_29_wands_08_v01.png`,
  wands_9:      `${BASE}/card_minor_30_wands_09_v01.png`,
  wands_10:     `${BASE}/card_minor_31_wands_10_v01.png`,
  wands_page:   `${BASE}/card_minor_32_wands_page_v01.png`,
  wands_knight: `${BASE}/card_minor_33_wands_knight_v01.png`,
  wands_queen:  `${BASE}/card_minor_34_wands_queen_v01.png`,
  wands_king:   `${BASE}/card_minor_35_wands_king_v01.png`,

  // ── Cups (36–49) ──────────────────────────────────────────────────────
  cups_ace:    `${BASE}/card_minor_36_cups_ace_v01.png`,
  cups_2:      `${BASE}/card_minor_37_cups_02_v01.png`,
  cups_3:      `${BASE}/card_minor_38_cups_03_v01.png`,
  cups_4:      `${BASE}/card_minor_39_cups_04_v01.png`,
  cups_5:      `${BASE}/card_minor_40_cups_05_v01.png`,
  cups_6:      `${BASE}/card_minor_41_cups_06_v01.png`,
  cups_7:      `${BASE}/card_minor_42_cups_07_v01.png`,
  cups_8:      `${BASE}/card_minor_43_cups_08_v01.png`,
  cups_9:      `${BASE}/card_minor_44_cups_09_v01.png`,
  cups_10:     `${BASE}/card_minor_45_cups_10_v01.png`,
  cups_page:   `${BASE}/card_minor_46_cups_page_v01.png`,
  cups_knight: `${BASE}/card_minor_47_cups_knight_v01.png`,
  cups_queen:  `${BASE}/card_minor_48_cups_queen_v01.png`,
  cups_king:   `${BASE}/card_minor_49_cups_king_v01.png`,

  // ── Swords (50–63) ────────────────────────────────────────────────────
  swords_ace:    `${BASE}/card_minor_50_swords_ace_v01.png`,
  swords_2:      `${BASE}/card_minor_51_swords_02_v01.png`,
  swords_3:      `${BASE}/card_minor_52_swords_03_v01.png`,
  swords_4:      `${BASE}/card_minor_53_swords_04_v01.png`,
  swords_5:      `${BASE}/card_minor_54_swords_05_v01.png`,
  swords_6:      `${BASE}/card_minor_55_swords_06_v01.png`,
  swords_7:      `${BASE}/card_minor_56_swords_07_v01.png`,
  swords_8:      `${BASE}/card_minor_57_swords_08_v01.png`,
  swords_9:      `${BASE}/card_minor_58_swords_09_v01.png`,
  // swords_10 → 이미지 없음
  swords_page:   `${BASE}/card_minor_60_swords_page_v01.png`,
  swords_knight: `${BASE}/card_minor_61_swords_knight_v01.png`,
  swords_queen:  `${BASE}/card_minor_62_swords_queen_v01.png`,
  swords_king:   `${BASE}/card_minor_63_swords_king_v01.png`,

  // ── Pentacles (64–77) ─────────────────────────────────────────────────
  pentacles_ace:    `${BASE}/card_minor_64_pentacles_ace_v01.png`,
  pentacles_2:      `${BASE}/card_minor_65_pentacles_02_v01.png`,
  pentacles_3:      `${BASE}/card_minor_66_pentacles_03_v01.png`,
  pentacles_4:      `${BASE}/card_minor_67_pentacles_04_v01.png`,
  pentacles_5:      `${BASE}/card_minor_68_pentacles_05_v01.jpg`,
  pentacles_6:      `${BASE}/card_minor_69_pentacles_06_v01.png`,
  pentacles_7:      `${BASE}/card_minor_70_pentacles_07_v01.png`,
  pentacles_8:      `${BASE}/card_minor_71_pentacles_08_v01.png`,
  pentacles_9:      `${BASE}/card_minor_72_pentacles_09_v01.png`,
  pentacles_10:     `${BASE}/card_minor_73_pentacles_10_v01.png`,
  pentacles_page:   `${BASE}/card_minor_74_pentacles_page_v01.jpg`,
  pentacles_knight: `${BASE}/card_minor_75_pentacles_knight_v01.png`,
  pentacles_queen:  `${BASE}/card_minor_76_pentacles_queen_v01.png`,
  pentacles_king:   `${BASE}/card_minor_77_pentacles_king_v01.png`,
}

export function getCardImagePath(cardId: string): string | null {
  return CARD_IMAGE_MAP[cardId] ?? null
}
