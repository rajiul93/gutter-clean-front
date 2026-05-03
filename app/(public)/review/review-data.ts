export type ReviewCategory = "all" | "gutter" | "roof" | "repair";

export type ReviewEntry = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  avatarAlt: string;
  rating: number;
  quote: string;
  serviceLabel: string;
  category: Exclude<ReviewCategory, "all">;
};

export const REVIEW_CATEGORIES: { id: ReviewCategory; label: string }[] = [
  { id: "all", label: "All Reviews" },
  { id: "gutter", label: "Gutter Cleaning" },
  { id: "roof", label: "Roof Rejuvenation" },
  { id: "repair", label: "Repair Services" },
];

export const REVIEWS: ReviewEntry[] = [
  {
    id: "1",
    name: "Marcus Thompson",
    location: "Austin, TX",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3t2TOLcbjBwzn_VrUehgJPSuCsz71iJLup8X3xsUc85_KASV-r_PP6Zn2Cy09fWA2eYYnWuLi8lUVYiViSWnQJSdfmTONym4L6QcJyaGA1HEvXraucBqBzomcBgygcGkXd-qU6fDu78WaYQ5sfAAYDGjTasWJzqvAxBJXlbvOt5IcdYak6sX3O3TgZ9onVKlku5QtLXgYoH7TGdT5XmHobZuU9T-TX8us79sOgiAnLqNLD2ZSC7c1gClbi1exSsVKKJwe8iqnUl1o",
    avatarAlt: "Marcus Thompson",
    rating: 5,
    quote:
      "Crew showed up on time, walked the property with me, and sent photos of every downspout after the flush. Our yard finally drains properly after heavy rain—worth every penny.",
    serviceLabel: "Full Gutter Cleaning",
    category: "gutter",
  },
  {
    id: "2",
    name: "Elena Ruiz",
    location: "Denver, CO",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6WRWTPvgBQyTyc1CLXpSBLNEipb5VCkDhtHPbAY7A4w-kEEzatrVby_x6tvDB-AKImJk6j2b6BfSHm5HVcbmfhp-J4ZACzQiJsnZt7VLxLZgW0lzUzYcd7pxsLU1AKTV2rszWSQTxqEv0-dXQvdc2TH3SoXSxD6g0TaIdGF1cb22fEkzSSyge5aMs6iXTwbUp0t4rpgsv-uVwCvPV2rdo9lL_D2lBZIXvMmWkfzUIStoS6g-QyerZo8XxgO-xJspIZp6TMropSL5L",
    avatarAlt: "Elena Ruiz",
    rating: 5,
    quote:
      "We had algae streaks and granule loss that other companies waved off. GutterPrecision documented the roof, applied the rejuvenation treatment, and the curb appeal jumped overnight.",
    serviceLabel: "Roof Rejuvenation",
    category: "roof",
  },
  {
    id: "3",
    name: "James Whitaker",
    location: "Portland, OR",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7gP56dXyClymUBoyJIIEe3S5-eQlT2H0oBZzb-SK6btFidIknkeyWA_OQ-P0FYuQiblDEHJcdkwRqG5l6ueQB96wvqSIeThjY6ZquMc96CrsufA-m5SAsfSw2cbUkYTRJsIHMzz4Kqf7UFrTarU7SLHxmv04u83iBPgy-J6BKmRLgX9SOGSCmzvY7n7MC7_PrwIP94Wp3tZLnCE56fBm0FJbOmR3vJ5l6XGbMk-SLncmPg9Ona5LSIjjA3KX4ZmvHI_Bo1p-DwJm",
    avatarAlt: "James Whitaker",
    rating: 5,
    quote:
      "A section of fascia was rotting behind a leak. They replaced the board, re-hung the gutter, and sealed everything with photos in the report. Clear communication from start to finish.",
    serviceLabel: "Repair & Flashing",
    category: "repair",
  },
  {
    id: "4",
    name: "Priya Nair",
    location: "San Jose, CA",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3t2TOLcbjBwzn_VrUehgJPSuCsz71iJLup8X3xsUc85_KASV-r_PP6Zn2Cy09fWA2eYYnWuLi8lUVYiViSWnQJSdfmTONym4L6QcJyaGA1HEvXraucBqBzomcBgygcGkXd-qU6fDu78WaYQ5sfAAYDGjTasWJzqvAxBJXlbvOt5IcdYak6sX3O3TgZ9onVKlku5QtLXgYoH7TGdT5XmHobZuU9T-TX8us79sOgiAnLqNLD2ZSC7c1gClbi1exSsVKKJwe8iqnUl1o",
    avatarAlt: "Priya Nair",
    rating: 5,
    quote:
      "Bi-annual maintenance plan keeps our two-story gutters clear without me climbing a ladder. Office texts a day before every visit—super professional.",
    serviceLabel: "Maintenance Plan — Gutters",
    category: "gutter",
  },
  {
    id: "5",
    name: "Omar Haddad",
    location: "Phoenix, AZ",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6WRWTPvgBQyTyc1CLXpSBLNEipb5VCkDhtHPbAY7A4w-kEEzatrVby_x6tvDB-AKImJk6j2b6BfSHm5HVcbmfhp-J4ZACzQiJsnZt7VLxLZgW0lzUzYcd7pxsLU1AKTV2rszWSQTxqEv0-dXQvdc2TH3SoXSxD6g0TaIdGF1cb22fEkzSSyge5aMs6iXTwbUp0t4rpgsv-uVwCvPV2rdo9lL_D2lBZIXvMmWkfzUIStoS6g-QyerZo8XxgO-xJspIZp6TMropSL5L",
    avatarAlt: "Omar Haddad",
    rating: 5,
    quote:
      "Heat had baked our shingles gray. After rejuvenation the color depth came back and they verified attic ventilation so we are not cooking the deck from underneath.",
    serviceLabel: "Roof Rejuvenation",
    category: "roof",
  },
  {
    id: "6",
    name: "Laura Chen",
    location: "Chicago, IL",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3t2TOLcbjBwzn_VrUehgJPSuCsz71iJLup8X3xsUc85_KASV-r_PP6Zn2Cy09fWA2eYYnWuLi8lUVYiViSWnQJSdfmTONym4L6QcJyaGA1HEvXraucBqBzomcBgygcGkXd-qU6fDu78WaYQ5sfAAYDGjTasWJzqvAxBJXlbvOt5IcdYak6sX3O3TgZ9onVKlku5QtLXgYoH7TGdT5XmHobZuU9T-TX8us79sOgiAnLqNLD2ZSC7c1gClbi1exSsVKKJwe8iqnUl1o",
    avatarAlt: "Laura Chen",
    rating: 5,
    quote:
      "Emergency repair after wind damage—same-week appointment, temporary tarp the first day, permanent fix two days later. Invoice matched the quote.",
    serviceLabel: "Storm Damage Repair",
    category: "repair",
  },
];
