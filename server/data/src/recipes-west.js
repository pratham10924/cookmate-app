const s = (en, hi, t) => (t ? { en, hi, t } : { en, hi });
const T = (en, hi, mr, gu, ta) => ({ en, hi, mr, gu, ta });
const lv = { easy: { en: "Easy", hi: "आसान" }, med: { en: "Medium", hi: "मध्यम" } };

module.exports = [
{ id:"pav-bhaji", region:"west", art:"pan", hue:"#c4421f", time:40, serves:4, level:lv.med, tags:["dinner","street","mumbai","maharashtrian","party","kids"],
  alias:["pav bhaji","paav bhaji","bhaji pav","पाव भाजी"],
  title:T("Pav Bhaji","पाव भाजी","पाव भाजी","પાઉં ભાજી","பாவ் பாஜி"),
  desc:{en:"Mumbai's buttery mashed-vegetable curry, served with toasted pav.",hi:"मुंबई की मक्खन वाली मसली सब्ज़ियों की भाजी, सिके पाव के साथ।"},
  ing:[["potato",3,"pc"],["cauliflower",1,"cup"],["veg",1,"cup"],["capsicum",1,"pc"],["onion",2,"pc"],["tomato",4,"pc"],["ginger_garlic",1,"tbsp"],["pav_bhaji_masala",2,"tbsp"],["chilli_powder",1,"tsp"],["butter",5,"tbsp"],["lemon",1,"tbsp"],["salt",1,"taste"],["coriander",3,"tbsp"],["pav",8,"pc"]],
  steps:[
   s("Pressure cook the potatoes, cauliflower and mixed vegetables with a cup of water for 3 whistles. Mash well.","आलू, गोभी और मिक्स सब्ज़ियों को एक कप पानी के साथ 3 सीटी तक पकाएं। अच्छी तरह मसल लें।",600),
   s("Melt 3 tablespoons butter on a wide pan. Fry one chopped onion and the capsicum for 3 minutes, then add ginger-garlic paste.","चौड़े तवे पर 3 बड़े चम्मच मक्खन पिघलाएं। एक कटा प्याज़ और शिमला मिर्च 3 मिनट भूनें, फिर अदरक-लहसुन पेस्ट डालें।",180),
   s("Add the tomatoes, pav bhaji masala, chilli powder and salt. Cook until the tomatoes turn mushy.","टमाटर, पाव भाजी मसाला, लाल मिर्च और नमक डालें। टमाटर गलने तक पकाएं।",360),
   s("Add the mashed vegetables and a little water. Mash everything together with a masher and simmer for 8 minutes.","मसली सब्ज़ियां और थोड़ा पानी डालें। मैशर से सब मसलें और 8 मिनट पकाएं।",480),
   s("Slit the pav, spread butter and toast on the pan until crisp.","पाव बीच से काटें, मक्खन लगाएं और तवे पर कुरकुरा सेकें।",120),
   s("Top the bhaji with butter, coriander and lemon juice. Serve with the pav and chopped raw onion.","भाजी पर मक्खन, धनिया और नींबू रस डालें। पाव और कटे कच्चे प्याज़ के साथ परोसें।")],
  tip:{en:"A spoon of the bhaji masala on the toasting pav makes it taste like the street stalls.",hi:"पाव सेकते समय उस पर थोड़ा भाजी मसाला लगाने से ठेले जैसा स्वाद आता है।"} },

{ id:"sabudana-khichdi", region:"west", art:"bowl", hue:"#d7c58f", time:20, serves:2, level:lv.easy, tags:["breakfast","fasting","maharashtrian","quick"],
  alias:["sabudana khichdi","sabudana","sago khichdi","sabudana khichadi","साबूदाना खिचड़ी","साबूदाना"],
  title:T("Sabudana Khichdi","साबूदाना खिचड़ी","साबुदाणा खिचडी","સાબુદાણા ખીચડી","ஜவ்வரிசி கிச்சடி"),
  desc:{en:"Soft, chewy sago pearls with potato and crushed peanuts. A favourite fasting dish. Soak the sabudana for 4 hours first.",hi:"आलू और कुटी मूंगफली के साथ नरम साबूदाना। व्रत का पसंदीदा नाश्ता। साबूदाना 4 घंटे पहले भिगो लें।"},
  ing:[["sabudana",1,"cup"],["potato",1,"pc"],["peanuts",0.33,"cup"],["cumin",1,"tsp"],["green_chilli",2,"pc"],["ghee",2,"tbsp"],["sugar",1,"tsp"],["lemon",1,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Rinse the sabudana and soak it in just enough water to cover for 4 hours, until a pearl crushes easily between your fingers.","साबूदाना धोकर उतने ही पानी में 4 घंटे भिगोएं जितने में डूब जाए, जब तक दाना उंगलियों में आसानी से न दबे।"),
   s("Dry-roast the peanuts, cool, and crush coarsely. Mix with the drained sabudana, salt and sugar.","मूंगफली भूनें, ठंडी करके दरदरी कूटें। छने साबूदाने में नमक और चीनी के साथ मिलाएं।"),
   s("Heat ghee, add cumin and green chillies, then the diced boiled potato. Fry for 2 minutes.","घी गरम करें, जीरा और हरी मिर्च डालें, फिर उबले आलू के टुकड़े। 2 मिनट भूनें।",120),
   s("Add the sabudana mix and stir gently on low heat until the pearls turn translucent, about 5 minutes.","साबूदाना मिश्रण डालें और धीमी आंच पर हल्के हाथ से चलाएं जब तक दाने पारदर्शी न हो जाएं, लगभग 5 मिनट।",300),
   s("Finish with lemon juice and coriander and serve hot.","नींबू रस और धनिया डालकर गरमागरम परोसें।")],
  tip:{en:"Too much soaking water makes it mushy; the pearls should look separate after soaking.",hi:"ज़्यादा पानी से साबूदाना चिपचिपा होता है; भीगने के बाद दाने अलग-अलग दिखने चाहिए।"} },

{ id:"khaman-dhokla", region:"west", art:"stack", hue:"#e0b92f", time:30, serves:4, level:lv.med, tags:["breakfast","snack","gujarati","steamed","healthy"],
  alias:["dhokla","khaman","khaman dhokla","ढोकला","खमण","खमन ढोकला"],
  title:T("Khaman Dhokla","खमण ढोकला","खमण ढोकळा","ખમણ ઢોકળા","காமன் டோக்ளா"),
  desc:{en:"Spongy steamed gram-flour cake from Gujarat, soaked in a sweet-sour tempering.",hi:"गुजरात का स्पंजी, भाप में पका बेसन का ढोकला, खट्टे-मीठे तड़के के साथ।"},
  ing:[["besan",1.5,"cup"],["sugar",1,"tbsp"],["lemon",2,"tbsp"],["turmeric",0.25,"tsp"],["ginger",1,"pc"],["green_chilli",3,"pc"],["eno",1,"tsp"],["water",1,"cup"],["oil",2,"tbsp"],["mustard",1,"tsp"],["curry_leaves",1,"sprig"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Start heating water in a steamer and grease a round tin.","स्टीमर में पानी गरम करना शुरू करें और एक गोल डिब्बे में तेल लगाएं।"),
   s("Whisk the besan with ¾ cup water, sugar, half the lemon juice, turmeric, grated ginger, 1 chopped green chilli, 1 tbsp oil and salt into a smooth batter.","बेसन में ¾ कप पानी, चीनी, आधा नींबू रस, हल्दी, कद्दूकस अदरक, 1 कटी हरी मिर्च, 1 बड़ा चम्मच तेल और नमक मिलाकर चिकना घोल बनाएं।"),
   s("Add the Eno, stir quickly in one direction, and pour into the tin right away.","ईनो डालें, एक ही दिशा में जल्दी मिलाएं और तुरंत डिब्बे में डालें।"),
   s("Steam on medium heat for 15 minutes, until a toothpick comes out clean.","मध्यम आंच पर 15 मिनट भाप में पकाएं, जब तक टूथपिक साफ़ न निकले।",900),
   s("Heat the remaining oil, add mustard, curry leaves and slit chillies. Add ¼ cup water, the rest of the lemon juice and a pinch of sugar, then pour over the cut dhokla.","बचा तेल गरम करें, राई, कड़ी पत्ता और चीरी मिर्च डालें। ¼ कप पानी, बचा नींबू रस और चुटकी चीनी डालें, फिर कटे ढोकले पर डालें।"),
   s("Garnish with coriander and serve with green chutney.","धनिया से सजाएं और हरी चटनी के साथ परोसें।")],
  tip:{en:"Don't open the steamer for the first 12 minutes or the dhokla will sink.",hi:"पहले 12 मिनट स्टीमर न खोलें वरना ढोकला बैठ जाएगा।"} },

{ id:"methi-thepla", region:"west", art:"flat", hue:"#6e8b3d", time:35, serves:4, level:lv.med, tags:["breakfast","travel","gujarati","flatbread","healthy"],
  alias:["thepla","methi thepla","methi paratha","थेपला","मेथी थेपला"],
  title:T("Methi Thepla","मेथी थेपला","मेथी थेपला","મેથીના થેપલા","வெந்தய தேப்லா"),
  desc:{en:"Soft Gujarati flatbreads with fresh fenugreek and spices. They keep well for travel.",hi:"हरी मेथी और मसालों वाले नरम गुजराती थेपले, सफ़र के लिए बढ़िया।"},
  ing:[["atta",2,"cup"],["methi_leaves",1,"cup"],["besan",2,"tbsp"],["curd",0.33,"cup"],["turmeric",0.5,"tsp"],["chilli_powder",1,"tsp"],["ajwain",0.5,"tsp"],["sugar",1,"tsp"],["oil",4,"tbsp"],["salt",1,"taste"],["water",0.25,"cup"]],
  steps:[
   s("Wash and finely chop the methi leaves.","मेथी के पत्ते धोकर बारीक काट लें।"),
   s("Mix atta, besan, methi, curd, spices, sugar, salt and 1 tablespoon oil. Knead into a soft dough with a little water and rest 10 minutes.","आटा, बेसन, मेथी, दही, मसाले, चीनी, नमक और 1 बड़ा चम्मच तेल मिलाएं। थोड़े पानी से नरम आटा गूंधें और 10 मिनट रखें।",600),
   s("Roll small balls into thin 6-inch rounds.","छोटी लोइयों को 6 इंच की पतली रोटी जैसा बेलें।"),
   s("Cook on a hot tawa with a little oil on both sides until golden spots appear, about 1 minute per side.","गरम तवे पर दोनों तरफ़ थोड़ा तेल लगाकर सुनहरे धब्बे आने तक सेकें, हर तरफ़ लगभग 1 मिनट।",120),
   s("Stack in a cloth to keep soft. Serve with curd, pickle or chai.","नरम रखने के लिए कपड़े में रखें। दही, अचार या चाय के साथ परोसें।")],
  tip:{en:"Kneading with curd instead of water keeps theplas soft for 2 to 3 days.",hi:"पानी की जगह दही से गूंधने पर थेपले 2-3 दिन तक नरम रहते हैं।"} },

{ id:"goan-fish-curry", region:"west", art:"pot", hue:"#c95f1b", time:35, serves:4, level:lv.med, tags:["lunch","dinner","curry","goan","coastal","protein"],
  alias:["goan fish curry","fish curry","goan curry","xitt kodi","गोवा फिश करी","फिश करी","मछली करी"],
  title:T("Goan Fish Curry","गोवा फिश करी","गोवन फिश करी","ગોવા ફિશ કરી","கோவா மீன் குழம்பு"),
  desc:{en:"Tangy coconut curry with Kashmiri chillies and tamarind, the way it's made along the Konkan coast.",hi:"कश्मीरी मिर्च और इमली वाली खट्टी नारियल करी, कोंकण तट के अंदाज़ में।"},
  ing:[["fish",500,"g"],["coconut",1,"cup"],["red_chilli",6,"pc"],["coriander_powder",2,"tsp"],["cumin",1,"tsp"],["turmeric",0.5,"tsp"],["garlic",4,"pc"],["tamarind",1,"tbsp"],["onion",1,"pc"],["green_chilli",2,"pc"],["oil",2,"tbsp"],["salt",1,"taste"],["water",1.5,"cup"]],
  steps:[
   s("Rub the fish pieces with turmeric and salt and set aside for 10 minutes.","मछली के टुकड़ों पर हल्दी और नमक लगाकर 10 मिनट रखें।",600),
   s("Grind the coconut, dry red chillies, coriander powder, cumin, garlic and tamarind with water into a smooth paste.","नारियल, साबुत लाल मिर्च, धनिया पाउडर, जीरा, लहसुन और इमली को पानी के साथ चिकना पीस लें।"),
   s("Heat oil, fry the sliced onion until soft, then add the paste and slit green chillies. Cook for 5 minutes.","तेल गरम करें, कटा प्याज़ नरम होने तक भूनें, फिर पेस्ट और चीरी हरी मिर्च डालें। 5 मिनट पकाएं।",300),
   s("Add the remaining water and salt and bring to a gentle boil.","बचा पानी और नमक डालें और हल्का उबाल आने दें।",180),
   s("Slide in the fish and simmer for 6 to 8 minutes without stirring, just shake the pan. Serve with rice.","मछली डालें और 6-8 मिनट धीमी आंच पर पकाएं, चलाएं नहीं, सिर्फ़ बर्तन हिलाएं। चावल के साथ परोसें।",420)],
  tip:{en:"Fish is cooked when it turns opaque and flakes easily with a fork.",hi:"मछली अपारदर्शी हो जाए और कांटे से आसानी से टूटे, तो पक गई।"} },

{ id:"sooji-sheera", region:"west", art:"bowl", hue:"#dca43a", time:20, serves:3, level:lv.easy, tags:["sweet","dessert","festive","quick","maharashtrian"],
  alias:["sheera","sooji halwa","suji halwa","rava sheera","kesari","शीरा","सूजी का हलवा","हलवा"],
  title:T("Sooji Sheera","सूजी का हलवा","रव्याचा शिरा","સોજીનો શીરો","ரவா கேசரி"),
  desc:{en:"Ghee-roasted semolina pudding with milk, cardamom and nuts, ready in 20 minutes.",hi:"घी में भुनी सूजी, दूध, इलायची और मेवों वाला हलवा, 20 मिनट में तैयार।"},
  ing:[["sooji",0.5,"cup"],["ghee",4,"tbsp"],["sugar",0.5,"cup"],["milk",1,"cup"],["water",0.5,"cup"],["cardamom",3,"pc"],["cashew",8,"pc"],["raisins",1,"tbsp"],["saffron",1,"pinch"]],
  steps:[
   s("Heat the milk and water together with saffron and keep it hot.","दूध और पानी को केसर के साथ गरम करें और गरम ही रखें।"),
   s("Fry the cashews and raisins in ghee and remove. Add sooji to the ghee and roast on low heat until golden and fragrant, about 7 minutes.","काजू-किशमिश घी में भूनकर निकाल लें। उसी घी में सूजी धीमी आंच पर सुनहरी और खुशबूदार होने तक लगभग 7 मिनट भूनें।",420),
   s("Carefully pour in the hot milk while stirring; it will splutter. Cook until absorbed.","सावधानी से गरम दूध डालें और चलाते रहें; छींटे आएंगे। सोखने तक पकाएं।",120),
   s("Add sugar and cardamom and stir until the sheera leaves the sides of the pan.","चीनी और इलायची डालें और कढ़ाही छोड़ने तक चलाएं।",180),
   s("Mix in the nuts and serve warm.","मेवे मिलाएं और गरम परोसें।")],
  tip:{en:"The milk must be hot when it goes in; cold milk makes lumps.",hi:"दूध गरम होना चाहिए; ठंडे दूध से गुठलियां बनती हैं।"} },

{ id:"shrikhand", region:"west", art:"bowl", hue:"#e7c25b", time:15, serves:4, level:lv.easy, tags:["sweet","dessert","festive","gujarati","maharashtrian","summer"],
  alias:["shrikhand","kesar shrikhand","elaichi shrikhand","श्रीखंड"],
  title:T("Kesar Shrikhand","केसर श्रीखंड","केशर श्रीखंड","કેસર શ્રીખંડ","கேசர் ஸ்ரீகண்ட்"),
  desc:{en:"Thick strained yogurt sweetened with sugar, saffron and cardamom. Hang the curd for 6 hours first.",hi:"चीनी, केसर और इलायची वाला गाढ़ा छना दही। दही 6 घंटे पहले टांग दें।"},
  ing:[["curd",3,"cup"],["sugar",0.5,"cup"],["saffron",1,"pinch"],["milk",1,"tbsp"],["cardamom",4,"pc"],["cashew",6,"pc"]],
  steps:[
   s("Tie the curd in a muslin cloth and hang it in the fridge for 6 hours, until thick like cream cheese.","दही को मलमल के कपड़े में बांधकर फ्रिज में 6 घंटे टांगें, जब तक क्रीम चीज़ जैसा गाढ़ा न हो जाए।"),
   s("Soak the saffron in warm milk for 10 minutes.","केसर को गुनगुने दूध में 10 मिनट भिगोएं।",600),
   s("Whisk the hung curd with sugar until smooth and the sugar dissolves.","टंगे दही को चीनी के साथ चिकना होने और चीनी घुलने तक फेंटें।"),
   s("Mix in the saffron milk and cardamom powder, top with chopped cashews and chill before serving.","केसर वाला दूध और इलायची पाउडर मिलाएं, ऊपर कटे काजू डालें और ठंडा करके परोसें।")],
  tip:{en:"Use powdered sugar for the smoothest texture.",hi:"सबसे चिकनी बनावट के लिए पिसी चीनी लें।"} }
];
