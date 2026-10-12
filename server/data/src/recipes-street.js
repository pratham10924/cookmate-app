const s = (en, hi, t) => (t ? { en, hi, t } : { en, hi });
const T = (en, hi, mr, gu, ta) => ({ en, hi, mr, gu, ta });
const lv = { easy: { en: "Easy", hi: "आसान" }, med: { en: "Medium", hi: "मध्यम" } };

module.exports = [
{ id:"bhel-puri", region:"street", art:"bowl", hue:"#d08a2c", time:10, serves:2, level:lv.easy, tags:["snack","street","quick","mumbai","evening"],
  alias:["bhel","bhel puri","bhelpuri","भेल","भेल पूरी","भेलपुरी"],
  title:T("Bhel Puri","भेल पूरी","भेळ","ભેળ","பேல் பூரி"),
  desc:{en:"Crunchy puffed rice tossed with chutneys, onion, tomato and sev. Mix just before eating.",hi:"चटनियों, प्याज़, टमाटर और सेव के साथ कुरकुरे मुरमुरे। खाने से ठीक पहले मिलाएं।"},
  ing:[["puffed_rice",3,"cup"],["potato",1,"pc"],["onion",1,"pc"],["tomato",1,"pc"],["green_chutney",2,"tbsp"],["tamarind_chutney",3,"tbsp"],["peanuts",2,"tbsp"],["chaat_masala",1,"tsp"],["lemon",1,"tbsp"],["sev",0.5,"cup"],["coriander",2,"tbsp"]],
  steps:[
   s("Boil and dice the potato. Finely chop the onion, tomato and coriander.","आलू उबालकर छोटे टुकड़े करें। प्याज़, टमाटर और धनिया बारीक काटें।"),
   s("In a large bowl, combine the puffed rice, potato, onion, tomato and peanuts.","बड़े कटोरे में मुरमुरे, आलू, प्याज़, टमाटर और मूंगफली मिलाएं।"),
   s("Add both chutneys, chaat masala and lemon juice. Toss quickly.","दोनों चटनियां, चाट मसाला और नींबू रस डालें। जल्दी से मिलाएं।"),
   s("Top with sev and coriander and serve immediately.","ऊपर सेव और धनिया डालें और तुरंत परोसें।")],
  tip:{en:"If the murmura isn't crisp, toast it in a dry pan for 2 minutes first.",hi:"मुरमुरे कुरकुरे न हों तो पहले सूखी कढ़ाही में 2 मिनट भून लें।"} },

{ id:"egg-bhurji", region:"street", art:"pan", hue:"#e0a82e", time:15, serves:2, level:lv.easy, tags:["breakfast","dinner","quick","protein","street"],
  alias:["egg bhurji","anda bhurji","scrambled eggs","masala scrambled eggs","अंडा भुर्जी","एग भुर्जी"],
  title:T("Egg Bhurji","अंडा भुर्जी","अंडा भुर्जी","એગ ભુર્જી","முட்டை புர்ஜி"),
  desc:{en:"Spicy Indian scrambled eggs with onion, tomato and green chilli. Great with pav or roti.",hi:"प्याज़, टमाटर और हरी मिर्च वाली मसालेदार अंडा भुर्जी। पाव या रोटी के साथ बढ़िया।"},
  ing:[["eggs",4,"pc"],["onion",1,"pc"],["tomato",1,"pc"],["green_chilli",2,"pc"],["turmeric",0.25,"tsp"],["chilli_powder",0.5,"tsp"],["butter",1.5,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Melt the butter and fry the chopped onion and green chilli until soft, about 3 minutes.","मक्खन पिघलाएं और कटा प्याज़ और हरी मिर्च नरम होने तक लगभग 3 मिनट भूनें।",180),
   s("Add the tomato, turmeric, chilli powder and salt and cook until the tomato softens.","टमाटर, हल्दी, लाल मिर्च और नमक डालें और टमाटर नरम होने तक पकाएं।",120),
   s("Lower the heat, crack in the eggs and stir continuously until softly set, about 2 minutes.","आंच धीमी करें, अंडे तोड़कर डालें और लगातार चलाते हुए हल्का जमने तक लगभग 2 मिनट पकाएं।",120),
   s("Stir in coriander and serve with buttered pav or roti.","धनिया मिलाएं और मक्खन लगे पाव या रोटी के साथ परोसें।")],
  tip:{en:"Take it off the heat while still a little moist; it keeps cooking on the plate.",hi:"थोड़ी नम रहते ही आंच से उतार लें; प्लेट में भी पकती रहती है।"} },

{ id:"bombay-sandwich", region:"street", art:"stack", hue:"#6f9a43", time:15, serves:2, level:lv.easy, tags:["breakfast","snack","street","mumbai","quick","kids"],
  alias:["bombay sandwich","veg sandwich","mumbai sandwich","sandwich","बॉम्बे सैंडविच","सैंडविच"],
  title:T("Bombay Veg Sandwich","बॉम्बे वेज सैंडविच","बॉम्बे सँडविच","બોમ્બે સેન્ડવીચ","பாம்பே சாண்ட்விச்"),
  desc:{en:"Layered sandwich with green chutney, potato, cucumber and tomato, dusted with chaat masala.",hi:"हरी चटनी, आलू, खीरा और टमाटर की परतों वाला सैंडविच, ऊपर चाट मसाला।"},
  ing:[["bread",4,"pc"],["butter",1,"tbsp"],["green_chutney",2,"tbsp"],["potato",1,"pc"],["cucumber",1,"pc"],["tomato",1,"pc"],["onion",1,"pc"],["chaat_masala",1,"tsp"],["cheese",2,"tbsp"]],
  steps:[
   s("Boil and thinly slice the potato. Slice the cucumber, tomato and onion into thin rounds.","आलू उबालकर पतला काटें। खीरा, टमाटर और प्याज़ के पतले गोल टुकड़े काटें।"),
   s("Spread butter and green chutney on all the bread slices.","सभी ब्रेड स्लाइस पर मक्खन और हरी चटनी लगाएं।"),
   s("Layer potato, cucumber, tomato and onion on two slices, sprinkling chaat masala between layers. Add grated cheese if you like.","दो स्लाइस पर आलू, खीरा, टमाटर और प्याज़ की परतें लगाएं, बीच-बीच में चाट मसाला छिड़कें। चाहें तो कद्दूकस चीज़ डालें।"),
   s("Cover with the remaining slices, press gently, and toast or grill until golden if you want it hot. Cut and serve.","बाकी स्लाइस से ढकें, हल्का दबाएं, और गरम चाहिए तो सुनहरा होने तक सेकें। काटकर परोसें।",240)],
  tip:{en:"Pat the tomato and cucumber dry so the bread doesn't get soggy.",hi:"टमाटर और खीरे को कपड़े से सुखा लें ताकि ब्रेड गीली न हो।"} },

{ id:"aloo-tikki", region:"street", art:"pan", hue:"#b9802d", time:30, serves:4, level:lv.easy, tags:["snack","street","evening","kids","party"],
  alias:["aloo tikki","alu tikki","potato patties","tikki","आलू टिक्की","टिक्की"],
  title:T("Aloo Tikki","आलू टिक्की","आलू टिक्की","આલુ ટિક્કી","ஆலு டிக்கி"),
  desc:{en:"Crisp, golden potato patties. Eat with chutneys or turn them into tikki chaat.",hi:"कुरकुरी सुनहरी आलू की टिक्की। चटनी के साथ खाएं या टिक्की चाट बनाएं।"},
  ing:[["potato",4,"pc"],["cornflour",2,"tbsp"],["green_chilli",2,"pc"],["ginger",1,"pc"],["coriander",3,"tbsp"],["chaat_masala",1,"tsp"],["chilli_powder",0.5,"tsp"],["salt",1,"taste"],["oil",3,"tbsp"],["green_chutney",3,"tbsp"]],
  steps:[
   s("Boil, peel and grate the potatoes. Let them cool completely.","आलू उबालें, छीलें और कद्दूकस करें। पूरी तरह ठंडा होने दें।"),
   s("Mix in the cornflour, chopped chilli, grated ginger, coriander, chaat masala, chilli powder and salt.","कॉर्नफ्लोर, कटी मिर्च, कद्दूकस अदरक, धनिया, चाट मसाला, लाल मिर्च और नमक मिलाएं।"),
   s("Shape into 8 flat patties with oiled hands.","तेल लगे हाथों से 8 चपटी टिक्कियां बनाएं।"),
   s("Shallow-fry on medium heat for about 4 minutes per side until deep golden and crisp.","मध्यम आंच पर हर तरफ़ लगभग 4 मिनट गहरी सुनहरी और कुरकुरी होने तक तलें।",480),
   s("Serve hot with green chutney.","हरी चटनी के साथ गरमागरम परोसें।")],
  tip:{en:"Don't flip too early; let a crust form first or the tikki breaks.",hi:"जल्दी न पलटें; पहले परत बनने दें वरना टिक्की टूट जाएगी।"} },

{ id:"masala-noodles", region:"street", art:"bowl", hue:"#d39a2a", time:15, serves:2, level:lv.easy, tags:["snack","quick","kids","noodles","dinner"],
  alias:["masala noodles","desi noodles","veg noodles","maggi masala","मसाला नूडल्स","नूडल्स"],
  title:T("Desi Masala Noodles","देसी मसाला नूडल्स","मसाला नूडल्स","મસાલા નૂડલ્સ","மசாலா நூடுல்ஸ்"),
  desc:{en:"Quick Indian-style noodles with vegetables, tomato and a little garam masala.",hi:"सब्ज़ियों, टमाटर और थोड़े गरम मसाले वाले झटपट देसी नूडल्स।"},
  ing:[["noodles",150,"g"],["onion",1,"pc"],["capsicum",1,"pc"],["tomato",1,"pc"],["veg",0.5,"cup"],["green_chilli",1,"pc"],["chilli_powder",0.5,"tsp"],["garam_masala",0.5,"tsp"],["turmeric",0.25,"tsp"],["ketchup",2,"tbsp"],["oil",1.5,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Boil the noodles until just tender, drain and toss with a few drops of oil.","नूडल्स को बस नरम होने तक उबालें, छानें और कुछ बूंद तेल मिला दें।",240),
   s("Heat oil and fry the onion, capsicum, green chilli and vegetables on high heat for 3 minutes.","तेल गरम करें और प्याज़, शिमला मिर्च, हरी मिर्च और सब्ज़ियां तेज़ आंच पर 3 मिनट भूनें।",180),
   s("Add the tomato, turmeric, chilli powder, garam masala and salt. Cook for 2 minutes.","टमाटर, हल्दी, लाल मिर्च, गरम मसाला और नमक डालें। 2 मिनट पकाएं।",120),
   s("Add the noodles and ketchup and toss well for 1 minute. Serve hot.","नूडल्स और केचप डालें और 1 मिनट अच्छी तरह मिलाएं। गरम परोसें।",60)],
  tip:{en:"Rinse boiled noodles in cold water to stop them sticking together.",hi:"उबले नूडल्स ठंडे पानी से धोएं ताकि आपस में चिपकें नहीं।"} },

{ id:"paneer-tikka", region:"street", art:"pan", hue:"#c4512a", time:40, serves:3, level:lv.med, tags:["snack","starter","party","protein","punjabi"],
  alias:["paneer tikka","tikka","paneer starter","पनीर टिक्का"],
  title:T("Paneer Tikka","पनीर टिक्का","पनीर टिक्का","પનીર ટિક્કા","பனீர் டிக்கா"),
  desc:{en:"Paneer and vegetables in a spiced yogurt marinade, charred on a pan, oven or grill.",hi:"मसालेदार दही में मैरीनेट पनीर और सब्ज़ियां, तवे, ओवन या ग्रिल पर सेकी हुई।"},
  ing:[["paneer",250,"g"],["capsicum",1,"pc"],["onion",1,"pc"],["curd",0.5,"cup"],["besan",1,"tbsp"],["ginger_garlic",1,"tbsp"],["chilli_powder",1.5,"tsp"],["garam_masala",1,"tsp"],["kasuri_methi",1,"tsp"],["lemon",1,"tbsp"],["oil",2,"tbsp"],["salt",1,"taste"],["chaat_masala",1,"tsp"]],
  steps:[
   s("Cut the paneer, capsicum and onion into large cubes.","पनीर, शिमला मिर्च और प्याज़ के बड़े टुकड़े काटें।"),
   s("Roast the besan in a dry pan for 1 minute, then mix it with curd, ginger-garlic paste, spices, kasuri methi, lemon juice, 1 tablespoon oil and salt.","बेसन को सूखी कढ़ाही में 1 मिनट भूनें, फिर दही, अदरक-लहसुन पेस्ट, मसाले, कसूरी मेथी, नींबू रस, 1 बड़ा चम्मच तेल और नमक मिलाएं।"),
   s("Coat the paneer and vegetables in the marinade and rest for 30 minutes.","पनीर और सब्ज़ियों पर मैरिनेड लगाएं और 30 मिनट रखें।",1800),
   s("Thread onto skewers, or place directly on a hot greased pan. Cook on high heat, turning, until charred in spots, about 8 minutes.","सीख में पिरोएं, या सीधे गरम तेल लगे तवे पर रखें। तेज़ आंच पर पलटते हुए जगह-जगह भुनने तक लगभग 8 मिनट सेकें।",480),
   s("Sprinkle chaat masala and lemon juice and serve with green chutney.","चाट मसाला और नींबू रस छिड़कें और हरी चटनी के साथ परोसें।")],
  tip:{en:"Roasted besan stops the marinade from sliding off and adds a smoky flavour.",hi:"भुना बेसन मैरिनेड को टिकाए रखता है और सोंधा स्वाद देता है।"} },

{ id:"masala-chaas", region:"street", art:"glass", hue:"#a7b88a", time:5, serves:3, level:lv.easy, tags:["drink","quick","summer","gujarati","healthy"],
  alias:["chaas","masala chaas","buttermilk","chhachh","mattha","majjige","छाछ","मसाला छाछ","मट्ठा"],
  title:T("Masala Chaas","मसाला छाछ","मसाला ताक","મસાલા છાશ","மசாலா மோர்"),
  desc:{en:"Cooling spiced buttermilk with roasted cumin, ginger and mint.",hi:"भुने जीरे, अदरक और पुदीने वाली ठंडी मसाला छाछ।"},
  ing:[["curd",1,"cup"],["water",2,"cup"],["cumin",1,"tsp"],["ginger",1,"pc"],["green_chilli",1,"pc"],["mint",1,"handful"],["coriander",1,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Dry-roast the cumin seeds for 30 seconds and crush them.","जीरे को 30 सेकंड सूखा भूनें और कूट लें।",30),
   s("Blend the curd, water, ginger, green chilli, mint, coriander and salt until frothy.","दही, पानी, अदरक, हरी मिर्च, पुदीना, धनिया और नमक को झागदार होने तक मिक्सी में चलाएं।"),
   s("Stir in the roasted cumin and serve chilled.","भुना जीरा मिलाएं और ठंडा परोसें।")],
  tip:{en:"A pinch of black salt (kala namak) gives the classic street-style taste.",hi:"चुटकी भर काला नमक डालने से ठेले वाली छाछ जैसा स्वाद आता है।"} }
];
