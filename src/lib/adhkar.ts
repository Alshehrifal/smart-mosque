// Collection of adhkar and duas for the mosque display

export interface Dhikr {
  id: string;
  text: string;
  source?: string;
  category: 'between-adhan-iqama' | 'after-prayer' | 'general';
}

export const betweenAdhanIqama: Dhikr[] = [
  {
    id: '1',
    text: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ القَائِمَةِ، آتِ مُحَمَّدًا الوَسِيلَةَ وَالفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    source: 'دعاء بعد الأذان - رواه البخاري',
    category: 'between-adhan-iqama',
  },
  {
    id: '2',
    text: 'الدعاء بين الأذان والإقامة لا يُردّ',
    source: 'رواه أبو داود والترمذي',
    category: 'between-adhan-iqama',
  },
  {
    id: '3',
    text: 'من قال حين يسمع النداء: اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ... حَلَّتْ لَهُ شَفَاعَتِي يَوْمَ القِيَامَةِ',
    source: 'رواه البخاري',
    category: 'between-adhan-iqama',
  },
  {
    id: '4',
    text: 'أقرب ما يكون العبد من ربه وهو ساجد، فأكثروا الدعاء',
    source: 'رواه مسلم',
    category: 'between-adhan-iqama',
  },
  {
    id: '5',
    text: 'صلاة الجماعة أفضل من صلاة الفذّ بسبع وعشرين درجة',
    source: 'متفق عليه',
    category: 'between-adhan-iqama',
  },
];

export const afterPrayerAdhkar: Dhikr[] = [
  {
    id: 'a1',
    text: 'أَسْتَغْفِرُ اللَّهَ (ثلاثًا)\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الجَلَالِ وَالإِكْرَامِ',
    source: 'رواه مسلم',
    category: 'after-prayer',
  },
  {
    id: 'a2',
    text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    source: 'متفق عليه',
    category: 'after-prayer',
  },
  {
    id: 'a3',
    text: 'سُبْحَانَ اللَّهِ (33) الحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (33)\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    source: 'رواه مسلم',
    category: 'after-prayer',
  },
  {
    id: 'a4',
    text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    source: 'رواه أبو داود والنسائي',
    category: 'after-prayer',
  },
  {
    id: 'a5',
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الجُبْنِ، وَأَعُوذُ بِكَ مِنَ البُخْلِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ العُمُرِ',
    source: 'رواه البخاري',
    category: 'after-prayer',
  },
];

export const fajrSpecial: Dhikr[] = [
  {
    id: 'f1',
    text: 'ركعتا الفجر خير من الدنيا وما فيها',
    source: 'رواه مسلم',
    category: 'general',
  },
  {
    id: 'f2',
    text: 'من صلى الصبح في جماعة فهو في ذمة الله',
    source: 'رواه مسلم',
    category: 'general',
  },
];

export function getRandomDhikr(category: Dhikr['category']): Dhikr {
  const collection = category === 'between-adhan-iqama' 
    ? betweenAdhanIqama 
    : category === 'after-prayer'
    ? afterPrayerAdhkar
    : [...betweenAdhanIqama, ...afterPrayerAdhkar];
  
  return collection[Math.floor(Math.random() * collection.length)];
}

export function getAdhkarForPrayer(prayerName: string, category: Dhikr['category']): Dhikr[] {
  if (prayerName === 'الفجر' && category === 'between-adhan-iqama') {
    return [...betweenAdhanIqama, ...fajrSpecial];
  }
  
  return category === 'between-adhan-iqama' ? betweenAdhanIqama : afterPrayerAdhkar;
}
