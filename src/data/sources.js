export const sources = [
  {
    id: 'who',
    name: 'World Health Organization',
    shortName: 'WHO',
    monogram: 'WHO',
    description:
      'The WHO Traditional Medicine Strategy supports the integration of traditional and complementary medicine into national health systems through evidence-based policies and regulation.',
    sourceType: 'International Health Authority',
    url: 'https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine',
    color: '#0093D5',
    verified: true,
  },
  {
    id: 'nccih',
    name: 'National Center for Complementary and Integrative Health',
    shortName: 'NCCIH',
    monogram: 'NC',
    description:
      'A division of the U.S. National Institutes of Health (NIH) that conducts and funds research on complementary health approaches, including natural products and mind-body practices.',
    sourceType: 'U.S. Federal Research Agency',
    url: 'https://www.nccih.nih.gov/',
    color: '#1B5E20',
    verified: true,
  },
  {
    id: 'ayush',
    name: 'Ministry of AYUSH, Government of India',
    shortName: 'AYUSH',
    monogram: 'AY',
    description:
      'The Ministry of Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy promotes traditional Indian medicine systems through education, research, and standardisation.',
    sourceType: 'Government Ministry',
    url: 'https://www.ayush.gov.in/',
    color: '#E65100',
    verified: true,
  },
  {
    id: 'pubmed',
    name: 'PubMed / National Library of Medicine',
    shortName: 'PubMed',
    monogram: 'PM',
    description:
      'A free, full-text archive of biomedical and life sciences journal literature maintained by the U.S. National Library of Medicine at the NIH, containing over 36 million citations.',
    sourceType: 'Biomedical Literature Database',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    color: '#1565C0',
    verified: true,
  },
  {
    id: 'mayo',
    name: 'Mayo Clinic',
    shortName: 'Mayo Clinic',
    monogram: 'MC',
    description:
      'A nonprofit academic medical centre focused on integrated health care, education, and research, providing peer-reviewed information on diseases, conditions, and natural remedies.',
    sourceType: 'Academic Medical Centre',
    url: 'https://www.mayoclinic.org/',
    color: '#0D47A1',
    verified: true,
  },
];

export const getSourceById = (id) => sources.find((s) => s.id === id);
