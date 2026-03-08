/**
 * 타로카드 ID → 이미지 경로 매핑
 * 이미지 파일명의 오타(tree/eigt/knigt/ge)를 반영
 */
const BASE = '/assets/tarot_cards'

export const CARD_IMAGE_MAP: Record<string, string> = {
  // ── Major Arcana ──────────────────────────────────────────────────────
  major_1:  `${BASE}/card_the_magician_1.png`,
  major_2:  `${BASE}/card_the_high_priestess_1.png`,
  major_3:  `${BASE}/card_the_empress_1.png`,
  major_4:  `${BASE}/card_the_emperor_1.png`,
  major_5:  `${BASE}/card_the_hierophant_1.png`,
  major_6:  `${BASE}/card_the_lovers_1.png`,
  major_7:  `${BASE}/card_the_chariot_1.png`,
  major_8:  `${BASE}/card_strength_1.jpg`,
  major_9:  `${BASE}/card_the_hermit_1.png`,
  major_10: `${BASE}/card_wheel_of_fortune_1.png`,
  major_11: `${BASE}/card_justice_1.png`,
  major_12: `${BASE}/card_the_hanged_man_1.png`,
  major_13: `${BASE}/card_death_1.png`,
  major_14: `${BASE}/card_temperance_1.png`,
  major_15: `${BASE}/card_the_devil_1.jpg`,
  major_16: `${BASE}/card_the_tower_1.png`,
  major_17: `${BASE}/card_the_star_1.png`,
  major_18: `${BASE}/card_the_moon_1.png`,
  major_19: `${BASE}/card_the_sun_1.png`,
  major_20: `${BASE}/card_judgement_1.png`,
  // major_0 (The Fool), major_21 (The World) → 이미지 없음, 폴백 처리

  // ── Cups ──────────────────────────────────────────────────────────────
  cups_ace:    `${BASE}/card_ace_of_cups_1.png`,
  cups_2:      `${BASE}/card_two_of_cups_1.png`,
  cups_3:      `${BASE}/card_tree_of_cups_1.png`,   // 파일명 오타: tree
  cups_4:      `${BASE}/card_four_of_cups_1.png`,
  cups_5:      `${BASE}/card_five_of_cups_1.png`,
  cups_6:      `${BASE}/card_six_of_cups_1.png`,
  cups_7:      `${BASE}/card_seven_of_cups_1.png`,
  cups_8:      `${BASE}/card_eigt_of_cups_1.png`,   // 파일명 오타: eigt
  cups_9:      `${BASE}/card_nine_of_cups_1.png`,
  cups_10:     `${BASE}/card_ten_of_cups_1.png`,
  cups_page:   `${BASE}/card_ge_of_cups_1.png`,     // 파일명 오타: ge
  cups_knight: `${BASE}/card_knigt_of_cups_1.png`,  // 파일명 오타: knigt
  cups_queen:  `${BASE}/card_queen_of_cups_1.png`,
  cups_king:   `${BASE}/card_king_of_cups_1.png`,

  // ── Wands ─────────────────────────────────────────────────────────────
  wands_ace:    `${BASE}/card_ace_of_wands_1.png`,
  wands_2:      `${BASE}/card_two_of_wands_1.png`,
  wands_3:      `${BASE}/card_tree_of_wands_1.png`,
  wands_4:      `${BASE}/card_four_of_wands_1.png`,
  wands_5:      `${BASE}/card_five_of_wands_1.png`,
  wands_6:      `${BASE}/card_six_of_wands_1.png`,
  wands_7:      `${BASE}/card_seven_of_wands_1.png`,
  wands_8:      `${BASE}/card_eigt_of_wands_1.png`,
  wands_9:      `${BASE}/card_nine_of_wands_1.png`,
  wands_10:     `${BASE}/card_ten_of_wands_1.png`,
  wands_page:   `${BASE}/card_ge_of_wands_1.png`,
  wands_knight: `${BASE}/card_knigt_of_wands_1.png`,
  wands_queen:  `${BASE}/card_queen_of_wands_1.png`,
  wands_king:   `${BASE}/card_king_of_wands_1.png`,

  // ── Swords ────────────────────────────────────────────────────────────
  swords_ace:    `${BASE}/card_ace_of_swords_1.png`,
  swords_2:      `${BASE}/card_two_of_swords_1.png`,
  swords_3:      `${BASE}/card_tree_of_swords_1.png`,
  swords_4:      `${BASE}/card_four_of_swords_1.png`,
  swords_5:      `${BASE}/card_five_of_swords_1.png`,
  swords_6:      `${BASE}/card_six_of_swords_1.png`,
  swords_7:      `${BASE}/card_seven_of_swords_1.png`,
  swords_8:      `${BASE}/card_eigt_of_swords_1.png`,
  swords_9:      `${BASE}/card_nine_of_swords_1.png`,
  // swords_10 → 이미지 없음
  swords_page:   `${BASE}/card_ge_of_swords_1.png`,
  swords_knight: `${BASE}/card_knigt_of_swords_1.png`,
  swords_queen:  `${BASE}/card_queen_of_swords_1.png`,
  swords_king:   `${BASE}/card_king_of_swords_1.png`,

  // ── Pentacles ─────────────────────────────────────────────────────────
  pentacles_ace:    `${BASE}/card_ace_of_pentacles_1.png`,
  pentacles_2:      `${BASE}/card_two_of_pentacles_1.png`,
  pentacles_3:      `${BASE}/card_tree_of_pentacles_1.png`,
  pentacles_4:      `${BASE}/card_four_of_pentacles_1.png`,
  pentacles_5:      `${BASE}/card_five_of_pentacles_1.jpg`,
  pentacles_6:      `${BASE}/card_six_of_pentacles_1.png`,
  pentacles_7:      `${BASE}/card_seven_of_pentacles_1.png`,
  pentacles_8:      `${BASE}/card_eigt_of_pentacles_1.png`,
  pentacles_9:      `${BASE}/card_nine_of_pentacles_1.png`,
  pentacles_10:     `${BASE}/card_ten_of_pentacles_1.png`,
  pentacles_page:   `${BASE}/card_ge_of_pentacles_1.png`,
  pentacles_knight: `${BASE}/card_knigt_of_pentacles_1.png`,
  pentacles_queen:  `${BASE}/card_queen_of_pentacles_1.png`,
  pentacles_king:   `${BASE}/card_king_of_pentacles_1.png`,
}

export function getCardImagePath(cardId: string): string | null {
  return CARD_IMAGE_MAP[cardId] ?? null
}
