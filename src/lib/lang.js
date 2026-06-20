const supportedLangs = [
    // ═══════════════════════════════════════════
    // TIER 1 — Global Lingua Francas
    // ═══════════════════════════════════════════
    'en',   // English
    'es',   // Spanish
    'fr',   // French
    'de',   // German
    'ja',   // Japanese
    'zh',   // Chinese (Mandarin Simplified)
    'pt',   // Portuguese
    'it',   // Italian
    'ru',   // Russian
    'ko',   // Korean
    'hi',   // Hindi
    'ar',   // Arabic

    // ═══════════════════════════════════════════
    // TIER 2 — South & Southeast Asia
    // ═══════════════════════════════════════════
    'bn',   // Bengali
    'pa',   // Punjabi
    'jv',   // Javanese
    'ms',   // Malay
    'id',   // Indonesian
    'vi',   // Vietnamese
    'th',   // Thai
    'te',   // Telugu
    'mr',   // Marathi
    'ta',   // Tamil
    'gu',   // Gujarati
    'kn',   // Kannada
    'ml',   // Malayalam
    'or',   // Odia (Oriya)
    'as',   // Assamese
    'ne',   // Nepali
    'si',   // Sinhala
    'sd',   // Sindhi
    'my',   // Burmese
    'km',   // Khmer
    'lo',   // Lao
    'su',   // Sundanese
    'ceb',  // Cebuano
    'tl',   // Tagalog (Filipino)
    'hmn',  // Hmong
    'bo',   // Tibetan
    'dz',   // Dzongkha
    'mni',  // Manipuri (Meitei)
    'doi',  // Dogri
    'mai',  // Maithili
    'sat',  // Santali
    'ks',   // Kashmiri
    'bho',  // Bhojpuri

    // ═══════════════════════════════════════════
    // TIER 3 — Western & Northern Europe
    // ═══════════════════════════════════════════
    'nl',   // Dutch
    'pl',   // Polish
    'sv',   // Swedish
    'no',   // Norwegian
    'da',   // Danish
    'fi',   // Finnish
    'is',   // Icelandic
    'ga',   // Irish
    'cy',   // Welsh
    'gd',   // Scots Gaelic
    'br',   // Breton
    'co',   // Corsican
    'lb',   // Luxembourgish
    'fy',   // Western Frisian
    'eu',   // Basque
    'gl',   // Galician
    'ca',   // Catalan
    'oc',   // Occitan
    'sc',   // Sardinian
    'ast',  // Asturian
    'an',   // Aragonese
    'fo',   // Faroese
    'kl',   // Kalaallisut (Greenlandic)
    'se',   // Northern Sami

    // ═══════════════════════════════════════════
    // TIER 4 — Central, Eastern & Southeastern Europe
    // ═══════════════════════════════════════════
    'uk',   // Ukrainian
    'cs',   // Czech
    'el',   // Greek
    'hu',   // Hungarian
    'ro',   // Romanian
    'sk',   // Slovak
    'bg',   // Bulgarian
    'hr',   // Croatian
    'sr',   // Serbian
    'sl',   // Slovenian
    'et',   // Estonian
    'lv',   // Latvian
    'lt',   // Lithuanian
    'mt',   // Maltese
    'sq',   // Albanian
    'mk',   // Macedonian
    'be',   // Belarusian
    'bs',   // Bosnian
    'tr',   // Turkish

    // ═══════════════════════════════════════════
    // TIER 5 — Middle East & Central Asia
    // ═══════════════════════════════════════════
    'fa',   // Persian (Farsi)
    'ur',   // Urdu
    'he',   // Hebrew
    'ps',   // Pashto
    'ku',   // Kurdish (Kurmanji)
    'az',   // Azerbaijani
    'ka',   // Georgian
    'hy',   // Armenian
    'kk',   // Kazakh
    'uz',   // Uzbek
    'tk',   // Turkmen
    'tg',   // Tajik
    'ky',   // Kyrgyz
    'mn',   // Mongolian
    'ug',   // Uyghur
    'tt',   // Tatar
    'ba',   // Bashkir
    'cv',   // Chuvash
    'sah',  // Sakha (Yakut)
    'os',   // Ossetic
    'ce',   // Chechen
    'ab',   // Abkhaz

    // ═══════════════════════════════════════════
    // TIER 6 — East Asia & Pacific
    // ═══════════════════════════════════════════
    'yue',  // Cantonese
    'nan',  // Min Nan (Hokkien)
    'hak',  // Hakka Chinese
    'za',   // Zhuang
    'ii',   // Yi (Nuosu)
    'sm',   // Samoan
    'to',   // Tongan
    'fj',   // Fijian
    'ty',   // Tahitian
    'mi',   // Maori
    'haw',  // Hawaiian
    'bi',   // Bislama
    'gil',  // Gilbertese (Kiribati)
    'niu',  // Niuean
    'tkl',  // Tokelauan
    'rap',  // Rapa Nui (Easter Island)
    'tvl',  // Tuvaluan
    'tet',  // Tetum (Timor-Leste)
    'war',  // Waray (Philippines)

    // ═══════════════════════════════════════════
    // TIER 7 — Sub-Saharan Africa
    // ═══════════════════════════════════════════
    'sw',   // Swahili
    'ha',   // Hausa
    'yo',   // Yoruba
    'ig',   // Igbo
    'zu',   // Zulu
    'xh',   // Xhosa
    'af',   // Afrikaans
    'so',   // Somali
    'mg',   // Malagasy
    'ny',   // Chichewa
    'sn',   // Shona
    'st',   // Sesotho
    'am',   // Amharic
    'ti',   // Tigrinya
    'om',   // Oromo
    'rw',   // Kinyarwanda
    'rn',   // Kirundi
    'lg',   // Luganda
    'wo',   // Wolof
    'ff',   // Fulah (Fula)
    'bm',   // Bambara
    'ln',   // Lingala
    'tn',   // Tswana
    'ts',   // Tsonga
    've',   // Venda
    'ss',   // Swati
    'nso',  // Northern Sotho (Sepedi)
    'nd',   // Northern Ndebele
    'ee',   // Ewe
    'tw',   // Twi
    'ak',   // Akan
    'sg',   // Sango
    'kr',   // Kanuri
    'ki',   // Kikuyu
    'lu',   // Luba-Katanga
    'gaa',  // Ga
    'mos',  // Mooré (Mossi)
    'dyu',  // Dyula
    'ber',  // Berber (Tamazight)
    'kab',  // Kabyle

    // ═══════════════════════════════════════════
    // TIER 8 — Americas (Indigenous)
    // ═══════════════════════════════════════════
    'gn',   // Guarani
    'ay',   // Aymara
    'qu',   // Quechua
    'nv',   // Navajo
    'chr',  // Cherokee
    'ht',   // Haitian Creole
    'pap',  // Papiamento
    'yua',  // Yucatec Maya
    'nah',  // Nahuatl
    'arn',  // Mapudungun (Mapuche)
    'srn',  // Sranan Tongo

    // ═══════════════════════════════════════════
    // TIER 9 — Classical & Constructed
    // ═══════════════════════════════════════════
    'la',   // Latin
    'eo',   // Esperanto
    'sa',   // Sanskrit
    'yi',   // Yiddish
    'cu',   // Old Church Slavonic
    'ang',  // Old English
    'got',  // Gothic
    'vo',   // Volapük
    'ia',   // Interlingua
    'io',   // Ido
    'jbo',  // Lojban
    'tlh',  // Klingon
    'tok',  // Toki Pona
    'arc',  // Aramaic
    'cop',  // Coptic
    'pi',   // Pali
    'prg',  // Old Prussian
    'non',  // Old Norse

    // ═══════════════════════════════════════════
    // TIER 10 — Creoles, Pidgins & Sign
    // ═══════════════════════════════════════════
    'crs',  // Seychellois Creole
    'mfe',  // Mauritian Creole
    'gcr',  // Guianese Creole
    'jam',  // Jamaican Patois
    'tpi',  // Tok Pisin
    'kri',  // Krio (Sierra Leone)
    'pih',  // Pitkern (Pitcairn)
    'kea',  // Kabuverdianu (Cape Verde)
];

export default supportedLangs;