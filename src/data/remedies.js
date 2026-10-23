export const remedies = [
  {
    id: 'ginger-honey-decoction',
    name: 'Ginger Honey Decoction',
    traditionalName: 'Adrak Ka Kadha',
    tradition: 'Ayurveda (Indian Traditional Medicine)',
    description:
      'A warming herbal decoction combining fresh ginger root with raw honey, traditionally used across South and Southeast Asian households for upper respiratory comfort and throat soothing.',
    traditionalUse:
      'In Ayurvedic practice, ginger (Zingiber officinale) is classified as a warming herb that supports digestion and respiratory health. This preparation has been documented in traditional Indian medicine for centuries as a household remedy for seasonal discomfort.',
    prepTime: '15 min',
    difficulty: 'Easy',
    servings: '1 cup',
    riskLevel: 'low',
    sourceIds: ['ayush', 'nccih', 'pubmed'],
    ingredients: [
      {
        name: 'Fresh ginger root',
        amount: '1 inch piece (roughly 10g)',
        allergens: [],
        source: { id: 'ayush', citation: 'AYUSH Protocol for Common Cold, 2021' },
      },
      {
        name: 'Raw honey',
        amount: '1 tablespoon',
        allergens: ['bee products'],
        source: { id: 'nccih', citation: 'NCCIH Honey Fact Sheet, 2023' },
      },
      {
        name: 'Water',
        amount: '1.5 cups (350ml)',
        allergens: [],
        source: { id: 'ayush', citation: 'AYUSH Protocol for Common Cold, 2021' },
      },
      {
        name: 'Black pepper',
        amount: '2-3 whole peppercorns (optional)',
        allergens: [],
        source: { id: 'pubmed', citation: 'J Ethnopharmacol. 2017;196:108-116' },
      },
      {
        name: 'Lemon juice',
        amount: '1 teaspoon (optional)',
        allergens: ['citrus'],
        source: { id: 'nccih', citation: 'NCCIH Seasonal Health Tips, 2022' },
      },
    ],
    steps: [
      {
        instruction: 'Wash and peel the fresh ginger root. Crush it lightly using the flat side of a knife or a mortar and pestle to release its oils.',
        source: { id: 'ayush', citation: 'AYUSH Home Remedies Advisory, Ministry of AYUSH, 2021' },
      },
      {
        instruction: 'Bring 1.5 cups of water to a rolling boil in a small saucepan. Add the crushed ginger and black peppercorns if using.',
        source: { id: 'ayush', citation: 'AYUSH Home Remedies Advisory, Ministry of AYUSH, 2021' },
      },
      {
        instruction: 'Reduce heat to low and let the mixture simmer for 8-10 minutes. The water should reduce by about one-third and turn a pale golden colour.',
        source: { id: 'pubmed', citation: 'BMC Complement Altern Med. 2019;19(1):58' },
      },
      {
        instruction: 'Remove from heat and strain into a cup. Allow to cool until warm (not hot, below 40°C / 104°F) to preserve the beneficial properties of honey.',
        source: { id: 'nccih', citation: 'NCCIH: Using Honey Safely, 2023' },
      },
      {
        instruction: 'Stir in the raw honey and lemon juice if using. Sip slowly while warm.',
        source: { id: 'nccih', citation: 'NCCIH: Using Honey Safely, 2023' },
      },
    ],
    usage: 'Consume once or twice daily, preferably in the morning and evening, for up to 5 days.',
    precautions: [
      {
        text: 'Do not give honey to children under 12 months of age due to botulism risk.',
        source: { id: 'mayo', citation: 'Mayo Clinic: Infant Botulism, 2023' },
      },
      {
        text: 'Ginger may interact with blood-thinning medications such as warfarin.',
        source: { id: 'nccih', citation: 'NCCIH Ginger Fact Sheet, 2023' },
      },
      {
        text: 'If symptoms persist beyond 7 days or worsen, consult a healthcare professional.',
        source: { id: 'who', citation: 'WHO Guidelines on Self-care, 2022' },
      },
    ],
    whoShouldAvoid: [
      {
        text: 'Individuals with gallstone disease',
        source: { id: 'nccih', citation: 'NCCIH Ginger Fact Sheet, 2023' },
      },
      {
        text: 'Pregnant women (high doses of ginger)',
        source: { id: 'pubmed', citation: 'Eur J Obstet Gynecol Reprod Biol. 2014;176:1-6' },
      },
      {
        text: 'Children under 1 year (due to honey)',
        source: { id: 'mayo', citation: 'Mayo Clinic: Infant Botulism, 2023' },
      },
      {
        text: 'People with bee product allergies',
        source: { id: 'nccih', citation: 'NCCIH Honey Fact Sheet, 2023' },
      },
    ],
  },
  {
    id: 'turmeric-milk',
    name: 'Turmeric Milk',
    traditionalName: 'Haldi Doodh (Golden Milk)',
    tradition: 'Ayurveda (Indian Traditional Medicine)',
    description:
      'A traditional warm beverage combining turmeric with milk and spices, known as "Golden Milk" in contemporary wellness circles. Historically consumed in Indian households for immune support and general comfort.',
    traditionalUse:
      'Turmeric (Curcuma longa) has been a cornerstone of Ayurvedic and Siddha medicine for over 4,000 years. Turmeric milk is one of the most widely referenced traditional preparations, documented in classical Ayurvedic texts as a Rasayana (rejuvenative) remedy.',
    prepTime: '10 min',
    difficulty: 'Easy',
    servings: '1 cup',
    riskLevel: 'low',
    sourceIds: ['ayush', 'pubmed', 'nccih'],
    ingredients: [
      {
        name: 'Whole or 2% milk (or plant-based milk)',
        amount: '1 cup (240ml)',
        allergens: ['dairy'],
        source: { id: 'ayush', citation: 'AYUSH Advisory on Immunity, 2020' },
      },
      {
        name: 'Turmeric powder',
        amount: '½ teaspoon (about 2.5g)',
        allergens: [],
        source: { id: 'ayush', citation: 'AYUSH Advisory on Immunity, 2020' },
      },
      {
        name: 'Black pepper',
        amount: 'A pinch (about ¼ tsp)',
        allergens: [],
        source: { id: 'pubmed', citation: 'Planta Med. 1998;64(4):353-356' },
      },
      {
        name: 'Cinnamon stick or powder',
        amount: '1 small stick or ¼ tsp',
        allergens: ['cinnamon'],
        source: { id: 'nccih', citation: 'NCCIH Turmeric Fact Sheet, 2023' },
      },
      {
        name: 'Honey or jaggery (optional sweetener)',
        amount: '1 teaspoon',
        allergens: ['bee products'],
        source: { id: 'ayush', citation: 'AYUSH Advisory on Immunity, 2020' },
      },
    ],
    steps: [
      {
        instruction: 'Pour the milk into a small saucepan and warm it over medium heat. Do not bring to a full boil.',
        source: { id: 'ayush', citation: 'AYUSH Advisory on Immunity, Ministry of AYUSH, 2020' },
      },
      {
        instruction: 'Add the turmeric powder, black pepper, and cinnamon. The black pepper contains piperine which research shows increases curcumin absorption by up to 2,000%.',
        source: { id: 'pubmed', citation: 'Planta Med. 1998;64(4):353-356 — Shoba et al.' },
      },
      {
        instruction: 'Stir continuously and let it simmer on low heat for 3-5 minutes, allowing the spices to infuse.',
        source: { id: 'ayush', citation: 'AYUSH Advisory on Immunity, Ministry of AYUSH, 2020' },
      },
      {
        instruction: 'Remove from heat, strain if desired, and allow to cool slightly. Add honey or jaggery to taste once the temperature is below 40°C.',
        source: { id: 'nccih', citation: 'NCCIH: Turmeric and Curcumin, 2023' },
      },
    ],
    usage: 'Drink once daily, ideally at bedtime, for up to 7 days during seasonal discomfort.',
    precautions: [
      {
        text: 'Turmeric supplements in high doses may interact with blood-thinning and diabetes medications.',
        source: { id: 'nccih', citation: 'NCCIH Turmeric Fact Sheet, 2023' },
      },
      {
        text: 'Dietary amounts of turmeric are generally considered safe. This remedy uses dietary amounts.',
        source: { id: 'who', citation: 'WHO Monographs on Selected Medicinal Plants, Vol. 1' },
      },
      {
        text: 'If you are lactose intolerant, substitute with a plant-based milk.',
        source: { id: 'mayo', citation: 'Mayo Clinic: Lactose Intolerance, 2023' },
      },
    ],
    whoShouldAvoid: [
      {
        text: 'Individuals with bile duct obstruction',
        source: { id: 'nccih', citation: 'NCCIH Turmeric Fact Sheet, 2023' },
      },
      {
        text: 'Those on anticoagulant therapy (consult physician)',
        source: { id: 'pubmed', citation: 'Thromb Res. 2012;130(4):e209-e218' },
      },
      {
        text: 'Individuals with dairy or lactose intolerance (unless using plant milk)',
        source: { id: 'mayo', citation: 'Mayo Clinic: Lactose Intolerance, 2023' },
      },
    ],
  },
  {
    id: 'tulsi-tea',
    name: 'Tulsi Tea',
    traditionalName: 'Tulsi Chai / Holy Basil Infusion',
    tradition: 'Ayurveda (Indian Traditional Medicine)',
    description:
      'A gentle herbal infusion made from Holy Basil (Ocimum tenuiflorum), one of the most sacred and widely used medicinal plants in Indian traditional medicine, traditionally consumed for respiratory and immune support.',
    traditionalUse:
      'Tulsi, or Holy Basil, is revered in Ayurveda as "The Incomparable One" and "Mother Medicine of Nature." It has been used for over 3,000 years and is classified as a Rasayana (rejuvenative) with adaptogenic properties.',
    prepTime: '10 min',
    difficulty: 'Easy',
    servings: '1 cup',
    riskLevel: 'low',
    sourceIds: ['ayush', 'pubmed', 'who'],
    ingredients: [
      {
        name: 'Fresh Tulsi (Holy Basil) leaves',
        amount: '8-10 leaves (or 1 tsp dried)',
        allergens: [],
        source: { id: 'ayush', citation: 'AYUSH Protocol for Respiratory Health, 2021' },
      },
      {
        name: 'Water',
        amount: '1.5 cups (350ml)',
        allergens: [],
        source: { id: 'ayush', citation: 'AYUSH Protocol for Respiratory Health, 2021' },
      },
      {
        name: 'Fresh ginger',
        amount: '½ inch piece, sliced',
        allergens: [],
        source: { id: 'pubmed', citation: 'J Ayurveda Integr Med. 2014;5(4):251-259' },
      },
      {
        name: 'Honey',
        amount: '1 teaspoon (optional)',
        allergens: ['bee products'],
        source: { id: 'nccih', citation: 'NCCIH Honey Fact Sheet, 2023' },
      },
    ],
    steps: [
      {
        instruction: 'Rinse the Tulsi leaves gently under running water. If using dried Tulsi, measure out 1 teaspoon.',
        source: { id: 'ayush', citation: 'AYUSH Protocol for Respiratory Health, Ministry of AYUSH, 2021' },
      },
      {
        instruction: 'Bring 1.5 cups of water to a boil. Add the Tulsi leaves and sliced ginger.',
        source: { id: 'ayush', citation: 'AYUSH Protocol for Respiratory Health, Ministry of AYUSH, 2021' },
      },
      {
        instruction: 'Reduce heat and let the infusion steep for 5-7 minutes. The liquid should take on a light greenish-brown colour.',
        source: { id: 'pubmed', citation: 'J Ayurveda Integr Med. 2014;5(4):251-259' },
      },
      {
        instruction: 'Strain into a cup and allow to cool to a comfortable drinking temperature. Add honey if desired once below 40°C.',
        source: { id: 'who', citation: 'WHO Monographs: Ocimum tenuiflorum' },
      },
    ],
    usage: 'Drink 1-2 cups daily for up to 7 days. Best consumed fresh.',
    precautions: [
      {
        text: 'Tulsi may have mild blood-thinning effects. Discontinue at least 2 weeks before any scheduled surgery.',
        source: { id: 'pubmed', citation: 'Evid Based Complement Alternat Med. 2017;2017:9217567' },
      },
      {
        text: 'Some studies suggest Tulsi may affect fertility. Individuals trying to conceive should consult their physician.',
        source: { id: 'pubmed', citation: 'J Ethnopharmacol. 2010;127(2):462-469' },
      },
      {
        text: 'If symptoms persist beyond 5-7 days or worsen, seek professional medical advice.',
        source: { id: 'who', citation: 'WHO Guidelines on Self-care Interventions, 2022' },
      },
    ],
    whoShouldAvoid: [
      {
        text: 'Pregnant or breastfeeding women (insufficient safety data)',
        source: { id: 'nccih', citation: 'NCCIH: Holy Basil Information, 2023' },
      },
      {
        text: 'Individuals on anticoagulant or antiplatelet medications',
        source: { id: 'pubmed', citation: 'Evid Based Complement Alternat Med. 2017;2017:9217567' },
      },
      {
        text: 'Individuals with hypothyroidism (Tulsi may affect thyroid function)',
        source: { id: 'pubmed', citation: 'Pharmacogn Rev. 2014;8(16):45-51' },
      },
    ],
  },
];

export const getRemedyById = (id) => remedies.find((r) => r.id === id);
