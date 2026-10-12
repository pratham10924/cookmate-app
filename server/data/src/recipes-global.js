const s = (en, hi, t) => (t ? { en, hi, t } : { en, hi });
const T = (en, hi, mr, gu, ta) => ({ en, hi, mr, gu, ta });
const lv = { easy: { en: "Easy", hi: "आसान" }, med: { en: "Medium", hi: "मध्यम" } };

module.exports = [
{ id:"veg-fried-rice", region:"global", art:"bowl", hue:"#8a9a3a", time:20, serves:2, level:lv.easy, tags:["lunch","dinner","quick","rice","indo-chinese","leftover"],
  alias:["fried rice","veg fried rice","vegetable fried rice","chinese rice","फ्राइड राइस","वेज फ्राइड राइस"],
  title:T("Veg Fried Rice","वेज फ्राइड राइस","व्हेज फ्राइड राइस","વેજ ફ્રાઈડ રાઈસ","வெஜ் ஃப்ரைடு ரைஸ்"),
  desc:{en:"Indo-Chinese fried rice with crunchy vegetables, garlic and soy sauce. Best with day-old rice.",hi:"कुरकुरी सब्ज़ियों, लहसुन और सोया सॉस वाला इंडो-चाइनीज़ फ्राइड राइस। एक दिन पुराने चावल से सबसे अच्छा।"},
  ing:[["cooked_rice",3,"cup"],["veg",1,"cup"],["cabbage",0.5,"cup"],["capsicum",1,"pc"],["spring_onion",3,"pc"],["garlic",5,"pc"],["soy_sauce",1.5,"tbsp"],["vinegar",1,"tsp"],["black_pepper",0.5,"tsp"],["oil",2,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Finely chop the garlic and all the vegetables. Separate the white and green parts of the spring onion.","लहसुन और सारी सब्ज़ियां बारीक काटें। हरे प्याज़ का सफ़ेद और हरा हिस्सा अलग करें।"),
   s("Heat oil on the highest heat, add garlic and the spring onion whites and fry for 30 seconds.","सबसे तेज़ आंच पर तेल गरम करें, लहसुन और हरे प्याज़ का सफ़ेद हिस्सा डालकर 30 सेकंड भूनें।",30),
   s("Add the vegetables and toss for 2 to 3 minutes so they stay crunchy.","सब्ज़ियां डालें और 2-3 मिनट उछालते हुए भूनें ताकि कुरकुरी रहें।",150),
   s("Add the rice, soy sauce, vinegar, pepper and salt and toss for 2 minutes.","चावल, सोया सॉस, सिरका, काली मिर्च और नमक डालें और 2 मिनट मिलाते हुए भूनें।",120),
   s("Finish with the spring onion greens and serve hot.","हरे प्याज़ की पत्तियां डालें और गरम परोसें।")],
  tip:{en:"Cold, day-old rice fries best; fresh rice turns mushy.",hi:"ठंडे, एक दिन पुराने चावल सबसे अच्छे बनते हैं; ताज़े चावल गीले हो जाते हैं।"} },

{ id:"chilli-paneer", region:"global", art:"pan", hue:"#a8321e", time:30, serves:3, level:lv.med, tags:["dinner","starter","indo-chinese","party","spicy"],
  alias:["chilli paneer","chili paneer","paneer chilli","चिली पनीर"],
  title:T("Chilli Paneer","चिली पनीर","चिली पनीर","ચિલી પનીર","சில்லி பனீர்"),
  desc:{en:"Crisp paneer tossed with peppers and onion in a spicy, tangy soy-chilli sauce.",hi:"कुरकुरा पनीर, शिमला मिर्च और प्याज़ के साथ तीखी-खट्टी सोया-चिली सॉस में।"},
  ing:[["paneer",250,"g"],["cornflour",3,"tbsp"],["capsicum",1,"pc"],["onion",1,"pc"],["garlic",5,"pc"],["ginger",1,"pc"],["green_chilli",3,"pc"],["soy_sauce",1.5,"tbsp"],["vinegar",1,"tbsp"],["ketchup",2,"tbsp"],["black_pepper",0.5,"tsp"],["spring_onion",2,"pc"],["oil",3,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Toss the paneer cubes with 2 tablespoons cornflour, salt and pepper.","पनीर के टुकड़ों पर 2 बड़े चम्मच कॉर्नफ्लोर, नमक और काली मिर्च लपेटें।"),
   s("Shallow-fry the paneer in hot oil until golden and crisp on all sides. Remove.","पनीर को गरम तेल में चारों तरफ़ से सुनहरा और कुरकुरा होने तक तलें। निकाल लें।",300),
   s("In 1 tablespoon oil on high heat, fry chopped garlic, ginger and green chillies for 30 seconds. Add cubed onion and capsicum and toss for 2 minutes.","1 बड़ा चम्मच तेल तेज़ आंच पर गरम करें, कटा लहसुन, अदरक और हरी मिर्च 30 सेकंड भूनें। प्याज़ और शिमला मिर्च के टुकड़े डालकर 2 मिनट भूनें।",150),
   s("Add soy sauce, vinegar and ketchup. Mix the remaining cornflour with ¼ cup water and pour in; stir until glossy.","सोया सॉस, सिरका और केचप डालें। बचे कॉर्नफ्लोर को ¼ कप पानी में घोलकर डालें; चमकदार होने तक चलाएं।",60),
   s("Add the paneer, toss to coat, and garnish with spring onion.","पनीर डालें, सॉस में लपेटें और हरे प्याज़ से सजाएं।")],
  tip:{en:"For a dry starter skip the cornflour slurry; for gravy add ½ cup water instead.",hi:"सूखे स्टार्टर के लिए कॉर्नफ्लोर का घोल न डालें; ग्रेवी के लिए ½ कप पानी डालें।"} },

{ id:"tomato-soup", region:"global", art:"cup", hue:"#c9342a", time:30, serves:3, level:lv.easy, tags:["dinner","soup","kids","winter","light"],
  alias:["tomato soup","cream of tomato","tamatar soup","टमाटर सूप","टोमैटो सूप"],
  title:T("Creamy Tomato Soup","टमाटर सूप","टोमॅटो सूप","ટામેટા સૂપ","தக்காளி சூப்"),
  desc:{en:"Velvety tomato soup with garlic and black pepper, finished with a swirl of cream.",hi:"लहसुन और काली मिर्च वाला मखमली टमाटर सूप, ऊपर क्रीम।"},
  ing:[["tomato",6,"pc"],["onion",1,"pc"],["garlic",4,"pc"],["butter",1.5,"tbsp"],["bay",1,"pc"],["sugar",1,"tsp"],["black_pepper",0.5,"tsp"],["water",2,"cup"],["cream",2,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Melt the butter, add the bay leaf, chopped onion and garlic, and cook until soft, about 4 minutes.","मक्खन पिघलाएं, तेज पत्ता, कटा प्याज़ और लहसुन डालकर नरम होने तक लगभग 4 मिनट पकाएं।",240),
   s("Add the chopped tomatoes, salt and water. Cover and simmer for 15 minutes.","कटे टमाटर, नमक और पानी डालें। ढककर 15 मिनट पकाएं।",900),
   s("Remove the bay leaf, cool slightly and blend until smooth. Strain for an extra-silky soup.","तेज पत्ता निकालें, थोड़ा ठंडा करके चिकना पीस लें। ज़्यादा मुलायम सूप के लिए छान लें।"),
   s("Return to the pot, add sugar and pepper and simmer for 3 minutes.","वापस बर्तन में डालें, चीनी और काली मिर्च डालकर 3 मिनट पकाएं।",180),
   s("Serve hot with a swirl of cream and toast or croutons.","ऊपर क्रीम डालकर टोस्ट या क्रूटॉन के साथ गरम परोसें।")],
  tip:{en:"The pinch of sugar balances sour tomatoes; taste first and adjust.",hi:"चुटकी भर चीनी खट्टे टमाटरों को संतुलित करती है; पहले चखकर देखें।"} },

{ id:"overnight-oats", region:"global", art:"glass", hue:"#b08a5a", time:5, serves:1, level:lv.easy, tags:["breakfast","healthy","no-cook","quick","protein"],
  alias:["overnight oats","oats","soaked oats","ओवरनाइट ओट्स","ओट्स"],
  title:T("Overnight Oats","ओवरनाइट ओट्स","ओव्हरनाइट ओट्स","ઓવરનાઈટ ઓટ્સ","ஓவர்நைட் ஓட்ஸ்"),
  desc:{en:"No-cook breakfast: oats soaked overnight in milk and curd with banana and honey.",hi:"बिना पकाए नाश्ता: दूध और दही में रात भर भीगे ओट्स, केले और शहद के साथ।"},
  ing:[["oats",0.5,"cup"],["milk",0.5,"cup"],["curd",0.25,"cup"],["honey",1,"tbsp"],["banana",1,"pc"],["cinnamon_powder",0.25,"tsp"],["peanuts",1,"tbsp"]],
  steps:[
   s("In a jar, mix the oats, milk, curd, honey and cinnamon.","एक जार में ओट्स, दूध, दही, शहद और दालचीनी मिलाएं।"),
   s("Close the lid and refrigerate overnight, or at least 4 hours.","ढक्कन बंद करके रात भर, या कम से कम 4 घंटे फ्रिज में रखें।"),
   s("In the morning, stir, add a splash of milk if thick, and top with sliced banana and crushed peanuts.","सुबह मिलाएं, गाढ़ा हो तो थोड़ा दूध डालें, ऊपर कटा केला और कुटी मूंगफली डालें।")],
  tip:{en:"Keeps for 3 days in the fridge; make a few jars on Sunday.",hi:"फ्रिज में 3 दिन चलता है; रविवार को कुछ जार बना लें।"} },

{ id:"french-toast", region:"global", art:"stack", hue:"#c7893a", time:15, serves:2, level:lv.easy, tags:["breakfast","sweet","kids","quick"],
  alias:["french toast","sweet toast","eggy bread","फ्रेंच टोस्ट"],
  title:T("French Toast","फ्रेंच टोस्ट","फ्रेंच टोस्ट","ફ્રેન્ચ ટોસ્ટ","ஃபிரெஞ்ச் டோஸ்ட்"),
  desc:{en:"Bread soaked in a cinnamon-vanilla egg custard and pan-fried in butter.",hi:"दालचीनी-वनीला वाले अंडे के घोल में डुबोकर मक्खन में सेकी ब्रेड।"},
  ing:[["bread",4,"pc"],["eggs",2,"pc"],["milk",0.33,"cup"],["sugar",1,"tbsp"],["cinnamon_powder",0.5,"tsp"],["vanilla",0.5,"tsp"],["butter",2,"tbsp"],["honey",2,"tbsp"]],
  steps:[
   s("Whisk the eggs, milk, sugar, cinnamon and vanilla in a shallow dish.","चौड़े बर्तन में अंडे, दूध, चीनी, दालचीनी और वनीला फेंटें।"),
   s("Dip each bread slice for a few seconds per side so it soaks but doesn't fall apart.","हर ब्रेड स्लाइस को दोनों तरफ़ कुछ सेकंड डुबोएं ताकि घोल सोख ले पर टूटे नहीं।"),
   s("Cook in butter on medium heat until golden, about 2 minutes per side.","मक्खन में मध्यम आंच पर सुनहरा होने तक, हर तरफ़ लगभग 2 मिनट सेकें।",240),
   s("Serve warm with honey and fruit.","शहद और फलों के साथ गरम परोसें।")],
  tip:{en:"Slightly stale bread soaks up more custard without going soggy.",hi:"थोड़ी बासी ब्रेड ज़्यादा घोल सोखती है और गीली नहीं होती।"} },

{ id:"banana-smoothie", region:"global", art:"glass", hue:"#e2c35a", time:5, serves:2, level:lv.easy, tags:["drink","breakfast","quick","healthy","kids"],
  alias:["banana smoothie","banana shake","kela shake","बनाना शेक","केला शेक","स्मूदी"],
  title:T("Banana Oat Smoothie","बनाना ओट स्मूदी","केळ्याची स्मूदी","કેળાની સ્મૂધી","வாழைப்பழ ஸ்மூத்தி"),
  desc:{en:"Thick, filling smoothie of banana, oats, milk and honey. Breakfast in a glass.",hi:"केला, ओट्स, दूध और शहद की गाढ़ी स्मूदी। गिलास में पूरा नाश्ता।"},
  ing:[["banana",2,"pc"],["oats",3,"tbsp"],["milk",1.5,"cup"],["honey",1,"tbsp"],["cinnamon_powder",0.25,"tsp"]],
  steps:[
   s("Peel and slice the bananas. Frozen banana makes it extra thick.","केले छीलकर काटें। जमा हुआ केला स्मूदी को और गाढ़ा बनाता है।"),
   s("Blend the bananas, oats, milk, honey and cinnamon until completely smooth, about 1 minute.","केले, ओट्स, दूध, शहद और दालचीनी को पूरी तरह चिकना होने तक लगभग 1 मिनट मिक्सी में चलाएं।",60),
   s("Pour into glasses and drink right away.","गिलासों में डालें और तुरंत पिएं।")],
  tip:{en:"For a vegan smoothie use oat or almond milk and replace honey with dates.",hi:"वीगन स्मूदी के लिए ओट या बादाम का दूध लें और शहद की जगह खजूर।"} },

{ id:"hummus", region:"global", art:"bowl", hue:"#c8b07a", time:15, serves:4, level:lv.easy, tags:["snack","dip","healthy","protein","party","no-cook"],
  alias:["hummus","houmous","chickpea dip","हम्मस","हमस"],
  title:T("Hummus","हम्मस","हम्मस","હમસ","ஹம்மஸ்"),
  desc:{en:"Smooth chickpea and tahini dip with lemon and garlic. Use boiled or canned chickpeas.",hi:"नींबू और लहसुन वाला चिकना काबुली चना और ताहिनी का डिप। उबले या डिब्बाबंद छोले लें।"},
  ing:[["chickpeas",0.75,"cup"],["tahini",3,"tbsp"],["lemon",3,"tbsp"],["garlic",2,"pc"],["olive_oil",3,"tbsp"],["cumin",0.5,"tsp"],["water",0.25,"cup"],["salt",1,"taste"],["chilli_powder",0.25,"tsp"]],
  steps:[
   s("Boil the soaked chickpeas until very soft (or rinse canned ones). Keep a little cooking water.","भीगे छोलों को बहुत नरम होने तक उबालें (या डिब्बाबंद धो लें)। थोड़ा पकाने का पानी रख लें।"),
   s("Blend the tahini and lemon juice for 1 minute until creamy.","ताहिनी और नींबू रस को 1 मिनट मलाईदार होने तक पीसें।",60),
   s("Add the chickpeas, garlic, cumin, salt and 2 tablespoons of olive oil. Blend, adding cold water a spoon at a time, until very smooth.","छोले, लहसुन, जीरा, नमक और 2 बड़े चम्मच ऑलिव ऑयल डालें। एक-एक चम्मच ठंडा पानी डालते हुए बहुत चिकना होने तक पीसें।",120),
   s("Spread in a bowl, drizzle the remaining oil and dust with chilli powder. Serve with pita, veggies or chips.","कटोरे में फैलाएं, ऊपर बचा तेल डालें और लाल मिर्च छिड़कें। पीटा, सब्ज़ियों या चिप्स के साथ परोसें।")],
  tip:{en:"Ice-cold water while blending makes hummus fluffier.",hi:"पीसते समय बर्फ़ जैसा ठंडा पानी डालने से हम्मस हल्का और फूला बनता है।"} }
];
