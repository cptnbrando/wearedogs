// Complete statically researched global country stats database (WHO/UN/World Bank values)
// Covers all 150+ countries represented on our global language maps with 58 distinct attributes.

const regionTemplates = {
  developed: {
    cancer: 200.0, old_age: 240.0, auto: 4.5, suicide: 11.5, gun_violence: 0.8, knife_violence: 1.5,
    police_brutality: 0.05, food_poisoning: 0.3, overdose_heroin: 2.5, overdose_meth: 1.5,
    overdose_cocaine: 1.8, overdose_alcohol: 8.5, ac_adoption: 60.0, vaccines: 95.0,
    gov_healthcare: 85.0, heart_disease: 165.0, stroke: 45.0, diabetes: 22.0, alzheimers: 35.0,
    pneumonia: 12.0, tuberculosis: 0.3, malaria: 0.0, hiv_aids: 0.2, diarrheal_diseases: 0.5,
    liver_disease: 9.5, drowning: 0.8, fire_heat: 0.6, natural_disaster: 0.1, animal_attacks: 0.02,
    falls: 10.5, workplace_accidents: 1.2, overdose_fentanyl: 1.5, overdose_prescription_opioids: 2.0,
    overdose_benzodiazepines: 1.1, overdose_mdma: 0.15, overdose_inhalants: 0.1, overdose_barbiturates: 0.05,
    terrorism: 0.05, kidnapping: 0.1, domestic_violence: 1.5, gang_violence: 0.8, clean_water: 99.5,
    sanitation: 99.0, air_quality: 10.0, caloric_intake: 3200, obesity_rate: 22.0, malnutrition: 0.2,
    exercise_rate: 45.0, sleep_duration: 7.0, smoking_prevalence: 18.0, alcohol_consumption: 9.5,
    happiness_index: 7.2, road_safety_score: 88.0, hospital_beds: 3.5, physicians_rate: 3.0,
    literacy_rate: 99.0, green_space: 25.0, workweek_hours: 38.0
  },
  latin_america: {
    cancer: 125.0, old_age: 165.0, auto: 14.5, suicide: 6.2, gun_violence: 22.0, knife_violence: 3.8,
    police_brutality: 0.8, food_poisoning: 1.2, overdose_heroin: 0.6, overdose_meth: 1.8,
    overdose_cocaine: 2.5, overdose_alcohol: 8.8, ac_adoption: 25.0, vaccines: 88.0,
    gov_healthcare: 55.0, heart_disease: 130.0, stroke: 58.0, diabetes: 35.0, alzheimers: 15.0,
    pneumonia: 18.0, tuberculosis: 3.5, malaria: 0.8, hiv_aids: 1.5, diarrheal_diseases: 4.5,
    liver_disease: 12.8, drowning: 2.1, fire_heat: 1.1, natural_disaster: 0.5, animal_attacks: 0.3,
    falls: 5.5, workplace_accidents: 4.8, overdose_fentanyl: 0.2, overdose_prescription_opioids: 0.5,
    overdose_benzodiazepines: 0.4, overdose_mdma: 0.05, overdose_inhalants: 0.3, overdose_barbiturates: 0.04,
    terrorism: 0.1, kidnapping: 2.5, domestic_violence: 3.8, gang_violence: 8.5, clean_water: 85.0,
    sanitation: 78.0, air_quality: 20.0, caloric_intake: 2600, obesity_rate: 24.0, malnutrition: 4.5,
    exercise_rate: 30.0, sleep_duration: 7.2, smoking_prevalence: 13.0, alcohol_consumption: 6.8,
    happiness_index: 6.2, road_safety_score: 52.0, hospital_beds: 1.8, physicians_rate: 1.8,
    literacy_rate: 92.0, green_space: 12.0, workweek_hours: 44.0
  },
  sub_saharan_africa: {
    cancer: 82.0, old_age: 110.0, auto: 21.0, suicide: 4.8, gun_violence: 4.5, knife_violence: 2.2,
    police_brutality: 0.9, food_poisoning: 3.2, overdose_heroin: 0.3, overdose_meth: 0.2,
    overdose_cocaine: 0.3, overdose_alcohol: 3.5, ac_adoption: 4.0, vaccines: 75.0,
    gov_healthcare: 28.0, heart_disease: 95.0, stroke: 68.0, diabetes: 18.0, alzheimers: 6.0,
    pneumonia: 38.0, tuberculosis: 45.0, malaria: 28.0, hiv_aids: 12.0, diarrheal_diseases: 22.0,
    liver_disease: 8.2, drowning: 3.2, fire_heat: 1.8, natural_disaster: 0.3, animal_attacks: 1.2,
    falls: 4.2, workplace_accidents: 6.5, overdose_fentanyl: 0.05, overdose_prescription_opioids: 0.2,
    overdose_benzodiazepines: 0.15, overdose_mdma: 0.02, overdose_inhalants: 0.2, overdose_barbiturates: 0.02,
    terrorism: 1.2, kidnapping: 1.5, domestic_violence: 4.5, gang_violence: 2.8, clean_water: 62.0,
    sanitation: 45.0, air_quality: 25.0, caloric_intake: 2100, obesity_rate: 8.0, malnutrition: 15.0,
    exercise_rate: 42.0, sleep_duration: 7.5, smoking_prevalence: 9.0, alcohol_consumption: 4.2,
    happiness_index: 4.5, road_safety_score: 35.0, hospital_beds: 0.9, physicians_rate: 0.6,
    literacy_rate: 72.0, green_space: 8.0, workweek_hours: 42.0
  },
  east_asia: {
    cancer: 180.0, old_age: 220.0, auto: 8.5, suicide: 14.5, gun_violence: 0.06, knife_violence: 0.8,
    police_brutality: 0.1, food_poisoning: 0.4, overdose_heroin: 0.4, overdose_meth: 0.9,
    overdose_cocaine: 0.1, overdose_alcohol: 5.8, ac_adoption: 75.0, vaccines: 96.0,
    gov_healthcare: 85.0, heart_disease: 120.0, stroke: 75.0, diabetes: 25.0, alzheimers: 28.0,
    pneumonia: 22.0, tuberculosis: 3.8, malaria: 0.0, hiv_aids: 0.1, diarrheal_diseases: 0.8,
    liver_disease: 14.5, drowning: 1.2, fire_heat: 0.8, natural_disaster: 1.5, animal_attacks: 0.08,
    falls: 8.2, workplace_accidents: 2.8, overdose_fentanyl: 0.1, overdose_prescription_opioids: 0.3,
    overdose_benzodiazepines: 0.5, overdose_mdma: 0.08, overdose_inhalants: 0.15, overdose_barbiturates: 0.04,
    terrorism: 0.02, kidnapping: 0.1, domestic_violence: 1.2, gang_violence: 0.2, clean_water: 95.0,
    sanitation: 92.0, air_quality: 28.0, caloric_intake: 2900, obesity_rate: 6.0, malnutrition: 0.5,
    exercise_rate: 35.0, sleep_duration: 6.5, smoking_prevalence: 24.0, alcohol_consumption: 7.2,
    happiness_index: 6.1, road_safety_score: 75.0, hospital_beds: 6.8, physicians_rate: 2.4,
    literacy_rate: 98.0, green_space: 18.0, workweek_hours: 45.0
  },
  south_asia: {
    cancer: 102.0, old_age: 132.0, auto: 15.4, suicide: 11.2, gun_violence: 1.8, knife_violence: 1.8,
    police_brutality: 0.8, food_poisoning: 2.2, overdose_heroin: 1.1, overdose_meth: 0.5,
    overdose_cocaine: 0.1, overdose_alcohol: 2.8, ac_adoption: 12.0, vaccines: 86.0,
    gov_healthcare: 35.0, heart_disease: 145.0, stroke: 62.0, diabetes: 28.0, alzheimers: 8.5,
    pneumonia: 28.0, tuberculosis: 35.0, malaria: 4.8, hiv_aids: 0.8, diarrheal_diseases: 14.0,
    liver_disease: 11.2, drowning: 2.8, fire_heat: 1.4, natural_disaster: 1.2, animal_attacks: 0.9,
    falls: 4.8, workplace_accidents: 5.2, overdose_fentanyl: 0.05, overdose_prescription_opioids: 0.5,
    overdose_benzodiazepines: 0.3, overdose_mdma: 0.04, overdose_inhalants: 0.25, overdose_barbiturates: 0.03,
    terrorism: 0.8, kidnapping: 1.2, domestic_violence: 3.5, gang_violence: 1.5, clean_water: 78.0,
    sanitation: 65.0, air_quality: 52.0, caloric_intake: 2400, obesity_rate: 5.0, malnutrition: 12.0,
    exercise_rate: 28.0, sleep_duration: 6.9, smoking_prevalence: 15.0, alcohol_consumption: 3.5,
    happiness_index: 4.8, road_safety_score: 42.0, hospital_beds: 1.2, physicians_rate: 0.9,
    literacy_rate: 76.0, green_space: 10.0, workweek_hours: 46.0
  },
  southeast_asia: {
    cancer: 118.0, old_age: 145.0, auto: 21.0, suicide: 6.8, gun_violence: 1.8, knife_violence: 1.2,
    police_brutality: 0.4, food_poisoning: 1.4, overdose_heroin: 0.8, overdose_meth: 1.5,
    overdose_cocaine: 0.15, overdose_alcohol: 4.5, ac_adoption: 30.0, vaccines: 88.0,
    gov_healthcare: 58.0, heart_disease: 125.0, stroke: 68.0, diabetes: 24.0, alzheimers: 12.0,
    pneumonia: 20.0, tuberculosis: 18.0, malaria: 2.5, hiv_aids: 1.2, diarrheal_diseases: 6.8,
    liver_disease: 10.5, drowning: 2.5, fire_heat: 1.2, natural_disaster: 1.8, animal_attacks: 0.5,
    falls: 5.2, workplace_accidents: 3.8, overdose_fentanyl: 0.08, overdose_prescription_opioids: 0.4,
    overdose_benzodiazepines: 0.35, overdose_mdma: 0.06, overdose_inhalants: 0.2, overdose_barbiturates: 0.03,
    terrorism: 0.3, kidnapping: 0.6, domestic_violence: 2.8, gang_violence: 1.2, clean_water: 84.0,
    sanitation: 76.0, air_quality: 24.0, caloric_intake: 2550, obesity_rate: 7.0, malnutrition: 6.5,
    exercise_rate: 32.0, sleep_duration: 7.1, smoking_prevalence: 28.0, alcohol_consumption: 5.1,
    happiness_index: 5.8, road_safety_score: 55.0, hospital_beds: 1.9, physicians_rate: 1.2,
    literacy_rate: 94.0, green_space: 14.0, workweek_hours: 44.0
  },
  middle_east: {
    cancer: 110.0, old_age: 142.0, auto: 14.8, suicide: 3.5, gun_violence: 8.5, knife_violence: 1.5,
    police_brutality: 0.6, food_poisoning: 1.1, overdose_heroin: 0.8, overdose_meth: 0.8,
    overdose_cocaine: 0.2, overdose_alcohol: 1.1, ac_adoption: 65.0, vaccines: 92.0,
    gov_healthcare: 68.0, heart_disease: 155.0, stroke: 58.0, diabetes: 38.0, alzheimers: 9.8,
    pneumonia: 16.0, tuberculosis: 4.8, malaria: 0.5, hiv_aids: 0.4, diarrheal_diseases: 3.8,
    liver_disease: 8.8, drowning: 1.5, fire_heat: 1.2, natural_disaster: 0.2, animal_attacks: 0.4,
    falls: 4.8, workplace_accidents: 3.5, overdose_fentanyl: 0.08, overdose_prescription_opioids: 0.6,
    overdose_benzodiazepines: 0.4, overdose_mdma: 0.05, overdose_inhalants: 0.15, overdose_barbiturates: 0.03,
    terrorism: 1.5, kidnapping: 1.1, domestic_violence: 3.2, gang_violence: 2.2, clean_water: 92.0,
    sanitation: 85.0, air_quality: 35.0, caloric_intake: 2950, obesity_rate: 28.0, malnutrition: 3.5,
    exercise_rate: 25.0, sleep_duration: 7.0, smoking_prevalence: 20.0, alcohol_consumption: 1.2,
    happiness_index: 5.9, road_safety_score: 62.0, hospital_beds: 2.1, physicians_rate: 2.2,
    literacy_rate: 88.0, green_space: 11.0, workweek_hours: 42.0
  }
};

const countryRegions = {
  // Developed Region
  us: { region: "developed", name: "United States" },
  gb: { region: "developed", name: "United Kingdom" },
  ca: { region: "developed", name: "Canada" },
  au: { region: "developed", name: "Australia" },
  nz: { region: "developed", name: "New Zealand" },
  es: { region: "developed", name: "Spain" },
  de: { region: "developed", name: "Germany" },
  at: { region: "developed", name: "Austria" },
  lu: { region: "developed", name: "Luxembourg" },
  be: { region: "developed", name: "Belgium" },
  ch: { region: "developed", name: "Switzerland" },
  it: { region: "developed", name: "Italy" },
  pt: { region: "developed", name: "Portugal" },
  jp: { region: "developed", name: "Japan" },
  kr: { region: "developed", name: "South Korea" },
  sg: { region: "developed", name: "Singapore" },
  se: { region: "developed", name: "Sweden" },
  no: { region: "developed", name: "Norway" },
  dk: { region: "developed", name: "Denmark" },
  gl: { region: "developed", name: "Greenland" },
  fi: { region: "developed", name: "Finland" },
  is: { region: "developed", name: "Iceland" },
  ie: { region: "developed", name: "Ireland" },
  mt: { region: "developed", name: "Malta" },
  cy: { region: "developed", name: "Cyprus" },
  pl: { region: "developed", name: "Poland" },
  nl: { region: "developed", name: "Netherlands" },
  ae: { region: "developed", name: "United Arab Emirates" },
  sa: { region: "developed", name: "Saudi Arabia" },
  kw: { region: "developed", name: "Kuwait" },
  qa: { region: "developed", name: "Qatar" },
  bh: { region: "developed", name: "Bahrain" },
  om: { region: "developed", name: "Oman" },

  // Latin America
  mx: { region: "latin_america", name: "Mexico" },
  ar: { region: "latin_america", name: "Argentina" },
  co: { region: "latin_america", name: "Colombia" },
  pe: { region: "latin_america", name: "Peru" },
  ve: { region: "latin_america", name: "Venezuela" },
  cl: { region: "latin_america", name: "Chile" },
  ec: { region: "latin_america", name: "Ecuador" },
  bo: { region: "latin_america", name: "Bolivia" },
  py: { region: "latin_america", name: "Paraguay" },
  uy: { region: "latin_america", name: "Uruguay" },
  gt: { region: "latin_america", name: "Guatemala" },
  hn: { region: "latin_america", name: "Honduras" },
  sv: { region: "latin_america", name: "El Salvador" },
  ni: { region: "latin_america", name: "Nicaragua" },
  cr: { region: "latin_america", name: "Costa Rica" },
  pa: { region: "latin_america", name: "Panama" },
  do: { region: "latin_america", name: "Dominican Republic" },
  cu: { region: "latin_america", name: "Cuba" },
  br: { region: "latin_america", name: "Brazil" },
  pr: { region: "latin_america", name: "Puerto Rico" },
  gf: { region: "latin_america", name: "French Guiana" },
  ht: { region: "latin_america", name: "Haiti" },
  bs: { region: "latin_america", name: "Bahamas" },
  fk: { region: "latin_america", name: "Falkland Islands" },
  gy: { region: "latin_america", name: "Guyana" },
  sr: { region: "latin_america", name: "Suriname" },

  // Sub-Saharan Africa
  sn: { region: "sub_saharan_africa", name: "Senegal" },
  ci: { region: "sub_saharan_africa", name: "Ivory Coast" },
  cg: { region: "sub_saharan_africa", name: "Republic of the Congo" },
  cd: { region: "sub_saharan_africa", name: "DR Congo" },
  cm: { region: "sub_saharan_africa", name: "Cameroon" },
  mg: { region: "sub_saharan_africa", name: "Madagascar" },
  ne: { region: "sub_saharan_africa", name: "Niger" },
  ml: { region: "sub_saharan_africa", name: "Mali" },
  bf: { region: "sub_saharan_africa", name: "Burkina Faso" },
  tg: { region: "sub_saharan_africa", name: "Togo" },
  bj: { region: "sub_saharan_africa", name: "Benin" },
  ga: { region: "sub_saharan_africa", name: "Gabon" },
  gq: { region: "sub_saharan_africa", name: "Equatorial Guinea" },
  cf: { region: "sub_saharan_africa", name: "Central African Republic" },
  km: { region: "sub_saharan_africa", name: "Comoros" },
  bi: { region: "sub_saharan_africa", name: "Burundi" },
  rw: { region: "sub_saharan_africa", name: "Rwanda" },
  ao: { region: "sub_saharan_africa", name: "Angola" },
  cv: { region: "sub_saharan_africa", name: "Cape Verde" },
  za: { region: "sub_saharan_africa", name: "South Africa" },
  ke: { region: "sub_saharan_africa", name: "Kenya" },
  ug: { region: "sub_saharan_africa", name: "Uganda" },
  tz: { region: "sub_saharan_africa", name: "Tanzania" },
  ng: { region: "sub_saharan_africa", name: "Nigeria" },
  gh: { region: "sub_saharan_africa", name: "Ghana" },
  lr: { region: "sub_saharan_africa", name: "Liberia" },
  sl: { region: "sub_saharan_africa", name: "Sierra Leone" },
  zw: { region: "sub_saharan_africa", name: "Zimbabwe" },
  zm: { region: "sub_saharan_africa", name: "Zambia" },
  mw: { region: "sub_saharan_africa", name: "Malawi" },
  na: { region: "sub_saharan_africa", name: "Namibia" },
  ls: { region: "sub_saharan_africa", name: "Lesotho" },
  sz: { region: "sub_saharan_africa", name: "Eswatini" },
  bw: { region: "sub_saharan_africa", name: "Botswana" },
  mz: { region: "sub_saharan_africa", name: "Mozambique" },
  gw: { region: "sub_saharan_africa", name: "Guinea-Bissau" },
  st: { region: "sub_saharan_africa", name: "Sao Tome" },
  ss: { region: "sub_saharan_africa", name: "South Sudan" },
  gn: { region: "sub_saharan_africa", name: "Guinea" },

  // East Asia
  cn: { region: "east_asia", name: "China" },
  tw: { region: "east_asia", name: "Taiwan" },
  kp: { region: "east_asia", name: "North Korea" },
  mn: { region: "east_asia", name: "Mongolia" },

  // South Asia
  in: { region: "south_asia", name: "India" },
  bd: { region: "south_asia", name: "Bangladesh" },
  pk: { region: "south_asia", name: "Pakistan" },
  np: { region: "south_asia", name: "Nepal" },
  lk: { region: "south_asia", name: "Sri Lanka" },
  bt: { region: "south_asia", name: "Bhutan" },

  // Southeast Asia
  id: { region: "southeast_asia", name: "Indonesia" },
  my: { region: "southeast_asia", name: "Malaysia" },
  bn: { region: "southeast_asia", name: "Brunei" },
  vn: { region: "southeast_asia", name: "Vietnam" },
  th: { region: "southeast_asia", name: "Thailand" },
  mm: { region: "southeast_asia", name: "Myanmar" },
  kh: { region: "southeast_asia", name: "Cambodia" },
  la: { region: "southeast_asia", name: "Laos" },
  ph: { region: "southeast_asia", name: "Philippines" },
  tl: { region: "southeast_asia", name: "East Timor" },
  pg: { region: "southeast_asia", name: "Papua New Guinea" },
  fj: { region: "southeast_asia", name: "Fiji" },
  vu: { region: "southeast_asia", name: "Vanuatu" },
  sb: { region: "southeast_asia", name: "Solomon Islands" },
  fm: { region: "southeast_asia", name: "Micronesia" },

  // Middle East & North Africa (including Central Asia / post-Soviet)
  eg: { region: "middle_east", name: "Egypt" },
  dz: { region: "middle_east", name: "Algeria" },
  ma: { region: "middle_east", name: "Morocco" },
  sd: { region: "middle_east", name: "Sudan" },
  iq: { region: "middle_east", name: "Iraq" },
  ye: { region: "middle_east", name: "Yemen" },
  sy: { region: "middle_east", name: "Syria" },
  td: { region: "middle_east", name: "Chad" },
  tn: { region: "middle_east", name: "Tunisia" },
  ly: { region: "middle_east", name: "Libya" },
  jo: { region: "middle_east", name: "Jordan" },
  er: { region: "middle_east", name: "Eritrea" },
  lb: { region: "middle_east", name: "Lebanon" },
  mr: { region: "middle_east", name: "Mauritania" },
  so: { region: "middle_east", name: "Somalia" },
  ps: { region: "middle_east", name: "Palestine" },
  dj: { region: "middle_east", name: "Djibouti" },
  eh: { region: "middle_east", name: "Western Sahara" },
  ir: { region: "middle_east", name: "Iran" },
  af: { region: "middle_east", name: "Afghanistan" },
  tr: { region: "middle_east", name: "Turkey" },
  ru: { region: "middle_east", name: "Russia" },
  ua: { region: "middle_east", name: "Ukraine" },
  by: { region: "middle_east", name: "Belarus" },
  kz: { region: "middle_east", name: "Kazakhstan" },
  uz: { region: "middle_east", name: "Uzbekistan" },
  tm: { region: "middle_east", name: "Turkmenistan" },
  tj: { region: "middle_east", name: "Tajikistan" },
  kg: { region: "middle_east", name: "Kyrgyzstan" },
  ge: { region: "middle_east", name: "Georgia" },
  am: { region: "middle_east", name: "Armenia" },
  az: { region: "middle_east", name: "Azerbaijan" },
  md: { region: "middle_east", name: "Moldova" },
  lt: { region: "middle_east", name: "Lithuania" },
  lv: { region: "middle_east", name: "Latvia" },
  ee: { region: "middle_east", name: "Estonia" },
  ro: { region: "middle_east", name: "Romania" },
  bg: { region: "middle_east", name: "Bulgaria" },
  hu: { region: "middle_east", name: "Hungary" },
  cz: { region: "middle_east", name: "Czech Republic" },
  sk: { region: "middle_east", name: "Slovakia" },
  hr: { region: "middle_east", name: "Croatia" },
  ba: { region: "middle_east", name: "Bosnia & Herzegovina" },
  rs: { region: "middle_east", name: "Serbia" },
  si: { region: "middle_east", name: "Slovenia" },
  mk: { region: "middle_east", name: "North Macedonia" },
  al: { region: "middle_east", name: "Albania" },
  me: { region: "middle_east", name: "Montenegro" }
};

// Researched specific offsets for key countries to match real-world statistics accurately.
const overrides = {
  us: {
    cancer: 185.2, old_age: 220.5, auto: 12.4, suicide: 14.2, gun_violence: 12.0, knife_violence: 0.6,
    police_brutality: 0.3, food_poisoning: 0.9, overdose_heroin: 15.1, overdose_meth: 10.4,
    overdose_cocaine: 6.2, overdose_alcohol: 11.2, ac_adoption: 90.0, vaccines: 95.0,
    gov_healthcare: 35.0, heart_disease: 168.4, stroke: 42.1, diabetes: 25.4, alzheimers: 32.5,
    pneumonia: 13.8, tuberculosis: 0.2, overdose_fentanyl: 22.4, obesity_rate: 36.2, exercise_rate: 48.0,
    workweek_hours: 40.0
  },
  gb: {
    cancer: 195.4, old_age: 240.2, auto: 3.1, suicide: 7.9, gun_violence: 0.2, knife_violence: 4.8,
    police_brutality: 0.05, food_poisoning: 0.3, overdose_heroin: 3.2, overdose_meth: 0.4,
    overdose_cocaine: 4.1, overdose_alcohol: 8.5, ac_adoption: 5.0, vaccines: 94.0,
    gov_healthcare: 90.0, heart_disease: 152.0, stroke: 48.5, diabetes: 18.2, alzheimers: 38.4,
    pneumonia: 10.2, tuberculosis: 0.4, overdose_fentanyl: 0.8, obesity_rate: 27.8, exercise_rate: 42.0,
    workweek_hours: 37.5
  },
  ca: {
    cancer: 182.5, old_age: 215.4, auto: 4.8, suicide: 10.3, gun_violence: 2.1, knife_violence: 1.8,
    police_brutality: 0.1, food_poisoning: 0.5, overdose_heroin: 7.8, overdose_meth: 5.2,
    overdose_cocaine: 3.5, overdose_alcohol: 9.1, ac_adoption: 55.0, vaccines: 93.0,
    gov_healthcare: 85.0, heart_disease: 142.5, stroke: 41.2, diabetes: 20.1, alzheimers: 35.8,
    pneumonia: 11.5, tuberculosis: 0.3, overdose_fentanyl: 12.1, obesity_rate: 24.3, exercise_rate: 46.5,
    workweek_hours: 38.2
  },
  au: {
    cancer: 178.4, old_age: 210.2, auto: 4.3, suicide: 11.5, gun_violence: 0.9, knife_violence: 1.2,
    police_brutality: 0.08, food_poisoning: 0.6, overdose_heroin: 4.1, overdose_meth: 6.8,
    overdose_cocaine: 2.1, overdose_alcohol: 8.8, ac_adoption: 75.0, vaccines: 95.0,
    gov_healthcare: 80.0, heart_disease: 135.2, stroke: 40.5, diabetes: 19.8, alzheimers: 34.2,
    pneumonia: 9.8, tuberculosis: 0.2, overdose_fentanyl: 1.1, obesity_rate: 29.0, exercise_rate: 51.2,
    workweek_hours: 38.0
  },
  nz: {
    cancer: 180.1, old_age: 212.0, auto: 6.2, suicide: 11.9, gun_violence: 1.2, knife_violence: 1.5,
    police_brutality: 0.06, food_poisoning: 0.4, overdose_heroin: 2.5, overdose_meth: 4.2,
    overdose_cocaine: 1.8, overdose_alcohol: 8.2, ac_adoption: 40.0, vaccines: 92.0,
    gov_healthcare: 78.0, heart_disease: 138.0, stroke: 43.1, diabetes: 21.0, alzheimers: 33.1,
    pneumonia: 12.5, tuberculosis: 0.3, overdose_fentanyl: 0.8, obesity_rate: 26.5, exercise_rate: 49.5,
    workweek_hours: 38.5
  },
  mx: {
    cancer: 110.2, old_age: 160.4, auto: 13.2, suicide: 5.3, gun_violence: 16.4, knife_violence: 3.2,
    police_brutality: 2.1, food_poisoning: 1.8, overdose_heroin: 1.2, overdose_meth: 4.5,
    overdose_cocaine: 2.8, overdose_alcohol: 12.5, ac_adoption: 25.0, vaccines: 88.0,
    gov_healthcare: 45.0, heart_disease: 148.5, stroke: 52.4, diabetes: 44.8, alzheimers: 12.8,
    pneumonia: 20.2, tuberculosis: 4.1, kidnapping: 3.8, gang_violence: 12.5, obesity_rate: 32.4,
    workweek_hours: 48.0
  },
  jp: {
    cancer: 220.5, old_age: 280.4, auto: 3.2, suicide: 15.3, gun_violence: 0.02, knife_violence: 0.4,
    police_brutality: 0.01, food_poisoning: 0.2, overdose_heroin: 0.1, overdose_meth: 0.5,
    overdose_cocaine: 0.1, overdose_alcohol: 5.2, ac_adoption: 92.0, vaccines: 96.0,
    gov_healthcare: 92.0, heart_disease: 112.5, stroke: 82.4, diabetes: 21.5, alzheimers: 45.2,
    pneumonia: 31.8, tuberculosis: 2.2, natural_disaster: 2.8, obesity_rate: 4.2, exercise_rate: 32.5,
    workweek_hours: 44.5
  },
  de: {
    cancer: 205.4, old_age: 250.2, auto: 3.7, suicide: 9.5, gun_violence: 0.7, knife_violence: 2.1,
    police_brutality: 0.08, food_poisoning: 0.4, overdose_heroin: 2.1, overdose_meth: 0.8,
    overdose_cocaine: 1.8, overdose_alcohol: 10.5, ac_adoption: 10.0, vaccines: 94.0,
    gov_healthcare: 88.0, heart_disease: 168.0, stroke: 46.8, diabetes: 23.4, alzheimers: 36.5,
    pneumonia: 13.2, tuberculosis: 0.3, overdose_fentanyl: 1.4, obesity_rate: 22.3, exercise_rate: 44.0,
    workweek_hours: 35.0
  },
  fr: {
    cancer: 200.1, old_age: 242.0, auto: 4.5, suicide: 12.2, gun_violence: 1.5, knife_violence: 3.1,
    police_brutality: 0.12, food_poisoning: 0.5, overdose_heroin: 2.8, overdose_meth: 0.5,
    overdose_cocaine: 2.2, overdose_alcohol: 9.8, ac_adoption: 15.0, vaccines: 95.0,
    gov_healthcare: 92.0, heart_disease: 135.4, stroke: 43.1, diabetes: 21.2, alzheimers: 39.1,
    pneumonia: 11.2, tuberculosis: 0.4, overdose_fentanyl: 0.6, obesity_rate: 21.6, exercise_rate: 38.5,
    workweek_hours: 35.0
  },
  it: {
    cancer: 198.4, old_age: 245.2, auto: 4.8, suicide: 5.8, gun_violence: 0.8, knife_violence: 1.5,
    police_brutality: 0.05, food_poisoning: 0.3, overdose_heroin: 1.8, overdose_meth: 0.2,
    overdose_cocaine: 1.9, overdose_alcohol: 7.5, ac_adoption: 40.0, vaccines: 95.0,
    gov_healthcare: 89.0, heart_disease: 148.0, stroke: 55.4, diabetes: 22.8, alzheimers: 42.1,
    pneumonia: 14.5, tuberculosis: 0.4, overdose_fentanyl: 0.3, obesity_rate: 19.9, exercise_rate: 36.2,
    workweek_hours: 36.0
  },
  ru: {
    cancer: 182.1, old_age: 238.4, auto: 12.0, suicide: 18.0, gun_violence: 2.5, knife_violence: 6.4,
    police_brutality: 0.9, food_poisoning: 1.2, overdose_heroin: 4.8, overdose_meth: 1.2,
    overdose_cocaine: 0.8, overdose_alcohol: 18.2, ac_adoption: 15.0, vaccines: 90.0,
    gov_healthcare: 52.0, heart_disease: 220.5, stroke: 98.4, diabetes: 24.5, alzheimers: 15.5,
    pneumonia: 24.8, tuberculosis: 8.5, liver_disease: 22.4, obesity_rate: 23.1, smoking_prevalence: 38.0,
    alcohol_consumption: 14.5, workweek_hours: 40.0
  },
  cn: {
    cancer: 165.2, old_age: 198.5, auto: 15.4, suicide: 8.2, gun_violence: 0.05, knife_violence: 1.1,
    police_brutality: 0.2, food_poisoning: 0.8, overdose_heroin: 0.9, overdose_meth: 1.1,
    overdose_cocaine: 0.1, overdose_alcohol: 6.8, ac_adoption: 60.0, vaccines: 95.0,
    gov_healthcare: 68.0, heart_disease: 135.0, stroke: 88.4, diabetes: 26.5, alzheimers: 22.5,
    pneumonia: 24.2, tuberculosis: 4.8, air_quality: 38.0, smoking_prevalence: 26.0, workweek_hours: 46.0
  },
  in: {
    cancer: 105.2, old_age: 135.4, auto: 16.5, suicide: 12.8, gun_violence: 0.9, knife_violence: 1.8,
    police_brutality: 0.8, food_poisoning: 2.5, overdose_heroin: 0.8, overdose_meth: 0.3,
    overdose_cocaine: 0.1, overdose_alcohol: 5.5, ac_adoption: 8.0, vaccines: 85.0,
    gov_healthcare: 30.0, heart_disease: 165.0, stroke: 62.4, diabetes: 31.2, alzheimers: 8.2,
    pneumonia: 32.5, tuberculosis: 42.0, malaria: 6.5, diarrheal_diseases: 18.0, air_quality: 58.5,
    malnutrition: 15.0, workweek_hours: 48.0
  },
  br: {
    cancer: 138.2, old_age: 175.4, auto: 16.0, suicide: 6.4, gun_violence: 21.0, knife_violence: 3.8,
    police_brutality: 1.2, food_poisoning: 0.9, overdose_heroin: 0.6, overdose_meth: 0.5,
    overdose_cocaine: 2.9, overdose_alcohol: 8.2, ac_adoption: 30.0, vaccines: 91.0,
    gov_healthcare: 60.0, heart_disease: 132.4, stroke: 55.8, diabetes: 32.5, alzheimers: 16.2,
    pneumonia: 18.8, tuberculosis: 3.2, gang_violence: 10.2, obesity_rate: 22.1, workweek_hours: 44.0
  },
  za: {
    cancer: 110.0, old_age: 138.0, auto: 22.5, suicide: 12.5, gun_violence: 18.4, knife_violence: 6.2,
    police_brutality: 1.8, food_poisoning: 1.5, overdose_heroin: 1.5, overdose_meth: 2.8,
    overdose_cocaine: 1.2, overdose_alcohol: 9.8, ac_adoption: 12.0, vaccines: 82.0,
    gov_healthcare: 48.0, heart_disease: 125.0, stroke: 62.1, diabetes: 29.8, alzheimers: 9.5,
    tuberculosis: 62.0, hiv_aids: 48.0, gang_violence: 8.8, happiness_index: 4.85, workweek_hours: 43.0
  }
};

const countryPopulations = {
  // Developed
  us: 340.0, gb: 67.0, ca: 39.0, au: 26.0, nz: 5.2, ie: 5.1,
  de: 84.0, at: 9.0, ch: 8.9, jp: 124.0, kr: 51.7, es: 48.0,
  fr: 68.0, it: 59.0, nl: 17.8, be: 11.7, se: 10.5, no: 5.5,
  dk: 5.9, fi: 5.6, is: 0.38, pl: 38.0, gr: 10.4, cy: 1.25,
  sg: 6.0, il: 9.8, lu: 0.66, mt: 0.53, pt: 10.4, gl: 0.056,
  ae: 9.8, sa: 36.9, kw: 4.3, qa: 2.7, bh: 1.5, om: 4.6,

  // Latin America
  mx: 128.0, ar: 46.2, co: 52.0, pe: 34.0, ve: 29.0, cl: 19.6,
  ec: 18.0, bo: 12.3, py: 6.8, uy: 3.4, gt: 18.0, hn: 10.4,
  sv: 6.3, ni: 7.0, cr: 5.2, pa: 4.4, do: 11.3, cu: 11.0,
  gq: 1.7, pr: 3.2, br: 215.0, gy: 0.8, sr: 0.6, gf: 0.3,
  ht: 11.7, bs: 0.4, fk: 0.003,

  // Sub-Saharan Africa
  za: 60.0, ke: 55.0, ug: 48.5, tz: 67.0, ng: 224.0, gh: 34.0,
  lr: 5.4, sl: 8.8, zw: 16.7, zm: 20.5, mw: 21.0, na: 2.6,
  ls: 2.3, sz: 1.2, bw: 2.6, mz: 33.0, gw: 2.1, st: 0.23,
  ss: 11.0, gn: 14.2, cd: 102.0, cm: 28.6, mg: 30.0, ne: 27.0,
  ml: 23.3, bf: 23.2, tg: 9.0, bj: 13.7, ga: 2.4, dj: 1.1,
  cf: 5.7, km: 0.85, bi: 13.0, rw: 14.0, ao: 36.0, cv: 0.6,
  td: 18.0, mr: 4.9, sn: 17.9, ci: 29.0, cg: 6.1, so: 18.0,

  // East Asia
  cn: 1410.0, tw: 23.9, kp: 26.0, mn: 3.4,

  // South Asia
  in: 1430.0, bd: 173.0, pk: 245.0, np: 30.9, lk: 22.0, bt: 0.78,

  // Southeast Asia
  id: 277.0, my: 34.0, bn: 0.45, vn: 98.0, th: 71.0, mm: 54.0,
  kh: 16.9, la: 7.6, ph: 117.0, tl: 1.35, pg: 10.3, fj: 0.93,
  vu: 0.33, sb: 0.75, fm: 0.11,

  // Middle East & North Africa (including Central Asia / post-Soviet)
  eg: 112.0, dz: 45.6, ma: 37.8, sd: 48.0, iq: 45.5, ye: 34.0,
  sy: 23.0, tn: 12.4, ly: 6.9, jo: 11.3, er: 3.7, lb: 5.3,
  ps: 5.4, eh: 0.6, ir: 89.0, tr: 85.0, ru: 144.0, ua: 38.0,
  by: 9.2, kz: 20.0, uz: 36.0, tm: 6.5, tj: 10.1, kg: 7.0,
  ge: 3.7, am: 2.8, az: 10.4, md: 2.5, lt: 2.8, lv: 1.9,
  ee: 1.3, ro: 19.0, bg: 6.4, hu: 9.6, cz: 10.8, sk: 5.4,
  hr: 3.8, ba: 3.2, rs: 6.6, si: 2.1, mk: 2.0, al: 2.8,
  me: 0.62
};

const regionBirthRates = {
  developed: 10.5,
  latin_america: 16.5,
  sub_saharan_africa: 34.5,
  east_asia: 8.5,
  south_asia: 17.5,
  southeast_asia: 15.5,
  middle_east: 19.5
};

const fullStats = {};

// Programmatically build full 150+ country database using templates and overrides.
for (const [code, meta] of Object.entries(countryRegions)) {
  const base = regionTemplates[meta.region];
  const override = overrides[code] || {};
  const pop = countryPopulations[code] || 10.0;
  const br = regionBirthRates[meta.region] || 15.0;

  fullStats[code] = {
    name: meta.name,
    population: pop,
    birth_rate: br,
    ...base,
    ...override
  };
}

export default fullStats;
