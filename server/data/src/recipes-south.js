const s = (en, hi, t) => (t ? { en, hi, t } : { en, hi });
const T = (en, hi, mr, gu, ta) => ({ en, hi, mr, gu, ta });
const lv = { easy: { en: "Easy", hi: "आसान" }, med: { en: "Medium", hi: "मध्यम" } };

module.exports = [
{ id:"rava-upma", region:"south", art:"bowl", hue:"#c8a24a", time:20, serves:3, level:lv.easy, tags:["breakfast","quick","light"],
  alias:["upma","rava upma","sooji upma","uppittu","उपमा","रवा उपमा"],
  title:T("Rava Upma","रवा उपमा","रवा उपमा","રવા ઉપમા","ரவா உப்புமா"),
  desc:{en:"Soft, savoury semolina cooked with mustard, curry leaves and vegetables.",hi:"राई, कड़ी पत्ते और सब्ज़ियों के साथ बना नरम, नमकीन सूजी का उपमा।"},
  ing:[["sooji",1,"cup"],["onion",1,"pc"],["green_chilli",2,"pc"],["ginger",1,"pc"],["veg",0.5,"cup"],["mustard",1,"tsp"],["curry_leaves",1,"sprig"],["water",2.5,"cup"],["oil",2,"tbsp"],["ghee",1,"tbsp"],["salt",1,"taste"],["lemon",1,"tbsp"]],
  steps:[
   s("Dry-roast the sooji on low heat until it smells nutty but stays pale, about 5 minutes. Set aside.","सूजी को धीमी आंच पर बिना तेल के 5 मिनट भूनें, खुशबू आए पर रंग हल्का रहे। अलग रखें।",300),
   s("Heat oil, add mustard seeds. When they pop, add curry leaves, chopped onion, green chilli and grated ginger. Fry 2 minutes.","तेल गरम करें, राई डालें। चटकने पर कड़ी पत्ता, कटा प्याज़, हरी मिर्च और कद्दूकस अदरक डालकर 2 मिनट भूनें।",120),
   s("Add the vegetables, water and salt. Bring to a rolling boil.","सब्ज़ियां, पानी और नमक डालें। तेज़ उबाल आने दें।",240),
   s("Lower the heat and pour in the sooji slowly with one hand while stirring with the other, so no lumps form.","आंच धीमी करें और एक हाथ से सूजी धीरे-धीरे डालें, दूसरे से चलाते रहें ताकि गुठलियां न बनें।"),
   s("Cover and cook on low for 3 minutes. Add ghee and lemon juice, fluff and serve.","ढककर धीमी आंच पर 3 मिनट पकाएं। घी और नींबू रस डालें, हल्का मिलाएं और परोसें।",180)],
  tip:{en:"Water ratio 1:2.5 gives soft upma; use 1:2 if you like it crumbly.",hi:"1:2.5 पानी से नरम उपमा बनता है; खिला-खिला चाहिए तो 1:2 लें।"} },

{ id:"sambar", region:"south", art:"pot", hue:"#b5532a", time:45, serves:4, level:lv.med, tags:["lunch","dinner","curry","protein","healthy"],
  alias:["sambar","sambhar","sambar dal","सांभर","सांबर"],
  title:T("Sambar","सांभर","सांबार","સાંભાર","சாம்பார்"),
  desc:{en:"Toor dal and vegetable stew with tamarind and sambar powder, for rice, idli or dosa.",hi:"इमली और सांभर मसाले के साथ अरहर दाल और सब्ज़ियों का सांभर, चावल, इडली या डोसे के लिए।"},
  ing:[["toor_dal",0.5,"cup"],["veg",1.5,"cup"],["onion",1,"pc"],["tomato",1,"pc"],["tamarind",1,"tbsp"],["sambar_powder",2,"tbsp"],["turmeric",0.5,"tsp"],["mustard",1,"tsp"],["curry_leaves",1,"sprig"],["red_chilli",2,"pc"],["hing",1,"pinch"],["oil",2,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Pressure cook the dal with turmeric and 2 cups of water for 4 whistles. Mash well.","दाल को हल्दी और 2 कप पानी के साथ 4 सीटी तक पकाएं। अच्छी तरह मसल लें।",900),
   s("Boil the vegetables, onion and tomato in 1½ cups of water with salt until just tender, about 8 minutes.","सब्ज़ियां, प्याज़ और टमाटर 1½ कप पानी और नमक में लगभग 8 मिनट नरम होने तक उबालें।",480),
   s("Add tamarind pulp and sambar powder and simmer for 5 minutes until the raw smell goes.","इमली का गूदा और सांभर मसाला डालें और कच्ची खुशबू जाने तक 5 मिनट पकाएं।",300),
   s("Stir in the mashed dal and simmer for 5 more minutes, adding water if it's too thick.","मसली दाल मिलाएं और 5 मिनट और पकाएं, गाढ़ा हो तो पानी डालें।",300),
   s("For tempering, heat oil, add mustard, dry red chillies, curry leaves and hing. Pour over the sambar and add coriander.","तड़के के लिए तेल गरम करें, राई, साबुत लाल मिर्च, कड़ी पत्ता और हींग डालें। सांभर पर डालें और धनिया डालें।")],
  tip:{en:"Drumsticks, brinjal, pumpkin and okra are the classic sambar vegetables.",hi:"सहजन, बैंगन, कद्दू और भिंडी सांभर की पारंपरिक सब्ज़ियां हैं।"} },

{ id:"coconut-chutney", region:"south", art:"bowl", hue:"#9db48a", time:10, serves:4, level:lv.easy, tags:["side","quick","breakfast"],
  alias:["coconut chutney","nariyal chutney","thengai chutney","नारियल चटनी","नारियल की चटनी"],
  title:T("Coconut Chutney","नारियल चटनी","नारळाची चटणी","નાળિયેરની ચટણી","தேங்காய் சட்னி"),
  desc:{en:"Fresh coconut ground with roasted chana and green chilli, tempered with mustard and curry leaves.",hi:"ताज़ा नारियल, भुना चना और हरी मिर्च पीसकर, राई और कड़ी पत्ते का तड़का।"},
  ing:[["coconut",1,"cup"],["roasted_chana",2,"tbsp"],["green_chilli",2,"pc"],["ginger",1,"pc"],["salt",1,"taste"],["water",0.5,"cup"],["oil",1,"tsp"],["mustard",0.5,"tsp"],["curry_leaves",1,"sprig"]],
  steps:[
   s("Blend the coconut, roasted chana, green chillies, ginger and salt with water into a coarse paste.","नारियल, भुना चना, हरी मिर्च, अदरक और नमक को पानी के साथ दरदरा पीस लें।"),
   s("Transfer to a bowl and adjust the consistency with a little more water.","कटोरी में निकालें और थोड़ा पानी डालकर गाढ़ापन ठीक करें।"),
   s("Heat oil, add mustard and curry leaves, let them splutter and pour over the chutney.","तेल गरम करें, राई और कड़ी पत्ता डालकर चटकने दें और चटनी पर डालें।")],
  tip:{en:"Coconut chutney spoils fast; refrigerate and use within a day.",hi:"नारियल चटनी जल्दी खराब होती है; फ्रिज में रखें और एक दिन में खत्म करें।"} },

{ id:"lemon-rice", region:"south", art:"bowl", hue:"#d6b31e", time:15, serves:2, level:lv.easy, tags:["lunch","quick","rice","tiffin","leftover"],
  alias:["lemon rice","chitranna","elumichai sadam","nimbu chawal","लेमन राइस","नींबू चावल"],
  title:T("Lemon Rice","लेमन राइस","लिंबू भात","લીંબુ ભાત","எலுமிச்சை சாதம்"),
  desc:{en:"Leftover rice tossed with lemon, turmeric, peanuts and a crackling tempering.",hi:"बचे चावल में नींबू, हल्दी, मूंगफली और चटपटा तड़का।"},
  ing:[["cooked_rice",2,"cup"],["lemon",2,"tbsp"],["peanuts",2,"tbsp"],["mustard",1,"tsp"],["curry_leaves",1,"sprig"],["green_chilli",2,"pc"],["turmeric",0.25,"tsp"],["hing",1,"pinch"],["oil",2,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Spread the cooked rice on a plate so the grains separate and cool.","पके चावल को थाली में फैला दें ताकि दाने अलग हों और ठंडे हो जाएं।"),
   s("Heat oil, fry the peanuts until crunchy, then add mustard, curry leaves, slit green chillies and hing.","तेल गरम करें, मूंगफली कुरकुरी होने तक भूनें, फिर राई, कड़ी पत्ता, चीरी हरी मिर्च और हींग डालें।",120),
   s("Turn off the heat and add turmeric so it doesn't burn.","आंच बंद करें और हल्दी डालें ताकि जले नहीं।"),
   s("Add the rice, salt and lemon juice. Mix gently and serve.","चावल, नमक और नींबू रस डालें। हल्के हाथ से मिलाएं और परोसें।")],
  tip:{en:"Add lemon juice off the heat; cooking it makes the rice bitter.",hi:"नींबू रस आंच बंद करके डालें; पकाने से चावल कड़वा हो जाता है।"} },

{ id:"curd-rice", region:"south", art:"bowl", hue:"#cfc6b0", time:15, serves:2, level:lv.easy, tags:["lunch","quick","rice","summer","comfort","leftover"],
  alias:["curd rice","thayir sadam","dahi chawal","dahi bhaat","दही चावल","कर्ड राइस"],
  title:T("Curd Rice","दही चावल","दही भात","દહીં ભાત","தயிர் சாதம்"),
  desc:{en:"Cooling mashed rice and curd with a mustard and curry-leaf tempering.",hi:"राई और कड़ी पत्ते के तड़के वाला ठंडक देने वाला दही चावल।"},
  ing:[["cooked_rice",2,"cup"],["curd",1,"cup"],["milk",0.25,"cup"],["mustard",0.5,"tsp"],["curry_leaves",1,"sprig"],["green_chilli",1,"pc"],["ginger",1,"pc"],["hing",1,"pinch"],["oil",1,"tsp"],["salt",1,"taste"],["coriander",1,"tbsp"]],
  steps:[
   s("Mash the warm rice lightly with a spoon.","गुनगुने चावल को चम्मच से हल्का मसल लें।"),
   s("Mix in the curd, milk and salt.","दही, दूध और नमक मिलाएं।"),
   s("Heat oil, add mustard, curry leaves, chopped green chilli, grated ginger and hing. Pour over the rice.","तेल गरम करें, राई, कड़ी पत्ता, कटी हरी मिर्च, कद्दूकस अदरक और हींग डालें। चावल पर डालें।"),
   s("Stir, garnish with coriander and serve cool.","मिलाएं, धनिया डालें और ठंडा परोसें।")],
  tip:{en:"The splash of milk stops the curd rice turning sour if you pack it for later.",hi:"थोड़ा दूध डालने से टिफ़िन में रखा दही चावल खट्टा नहीं होता।"} },

{ id:"rasam", region:"south", art:"cup", hue:"#b8432f", time:25, serves:4, level:lv.easy, tags:["lunch","dinner","soup","light","healthy"],
  alias:["rasam","tomato rasam","pepper rasam","saaru","रसम"],
  title:T("Tomato Rasam","टमाटर रसम","टोमॅटो रसम","ટામેટા રસમ","தக்காளி ரசம்"),
  desc:{en:"Thin, peppery tomato and tamarind broth. Drink it hot or pour over rice.",hi:"पतला, काली मिर्च वाला टमाटर-इमली का रसम। गरम पिएं या चावल पर डालें।"},
  ing:[["tomato",2,"pc"],["tamarind",1,"tbsp"],["black_pepper",1,"tsp"],["cumin",1,"tsp"],["garlic",4,"pc"],["turmeric",0.25,"tsp"],["mustard",0.5,"tsp"],["curry_leaves",1,"sprig"],["hing",1,"pinch"],["ghee",1,"tbsp"],["water",3,"cup"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Crush the pepper, cumin and garlic coarsely.","काली मिर्च, जीरा और लहसुन को दरदरा कूट लें।"),
   s("Squash the chopped tomatoes with tamarind, turmeric, salt and water in a pot. Boil for 8 minutes.","कटे टमाटर को इमली, हल्दी, नमक और पानी के साथ बर्तन में मसलें। 8 मिनट उबालें।",480),
   s("Add the crushed pepper mixture and simmer for 3 minutes. Don't let it boil hard.","कुटा काली मिर्च मसाला डालें और 3 मिनट धीमी आंच पर पकाएं। तेज़ उबाल न आने दें।",180),
   s("Heat ghee, add mustard, curry leaves and hing, and pour into the rasam. Add coriander and serve.","घी गरम करें, राई, कड़ी पत्ता और हींग डालें और रसम में डालें। धनिया डालकर परोसें।")],
  tip:{en:"Turn off the heat as soon as the rasam froths up; boiling makes it bitter.",hi:"रसम में झाग आते ही आंच बंद करें; ज़्यादा उबालने से कड़वा हो जाता है।"} },

{ id:"kerala-veg-stew", region:"south", art:"pot", hue:"#d9c79a", time:30, serves:3, level:lv.easy, tags:["breakfast","dinner","curry","kerala","mild"],
  alias:["kerala stew","vegetable stew","ishtu","veg stew","केरला स्टू","वेज स्टू"],
  title:T("Kerala Vegetable Stew","केरला वेज स्टू","केरळ व्हेज स्ट्यू","કેરળ વેજ સ્ટ્યૂ","கேரளா காய்கறி ஸ்டூ"),
  desc:{en:"Mild, fragrant vegetables in coconut milk with whole spices. Lovely with appam.",hi:"नारियल के दूध और खड़े मसालों में हल्की, खुशबूदार सब्ज़ियां। अप्पम के साथ बढ़िया।"},
  ing:[["veg",1.5,"cup"],["potato",1,"pc"],["onion",1,"pc"],["ginger",1,"pc"],["green_chilli",3,"pc"],["whole_spices",4,"pc"],["curry_leaves",1,"sprig"],["coconut_milk",1.5,"cup"],["black_pepper",0.5,"tsp"],["oil",2,"tbsp"],["salt",1,"taste"],["water",1,"cup"]],
  steps:[
   s("Heat oil, add whole spices and curry leaves, then sliced onion, ginger and slit green chillies. Cook until soft but not brown.","तेल गरम करें, खड़े मसाले और कड़ी पत्ता डालें, फिर कटा प्याज़, अदरक और चीरी हरी मिर्च। नरम होने तक पकाएं, भूरा न होने दें।",240),
   s("Add the cubed potato and vegetables with water and salt. Cover and cook until tender, about 10 minutes.","आलू और सब्ज़ियों के टुकड़े पानी और नमक के साथ डालें। ढककर नरम होने तक लगभग 10 मिनट पकाएं।",600),
   s("Lower the heat and pour in the coconut milk and pepper. Warm through for 3 minutes without boiling.","आंच धीमी करें, नारियल का दूध और काली मिर्च डालें। बिना उबाले 3 मिनट गरम करें।",180),
   s("Serve with appam, idiyappam or bread.","अप्पम, इडियप्पम या ब्रेड के साथ परोसें।")],
  tip:{en:"Never boil after adding coconut milk, or it will split.",hi:"नारियल का दूध डालने के बाद उबालें नहीं, वरना फट जाएगा।"} },

{ id:"chettinad-chicken", region:"south", art:"pot", hue:"#7a2f1d", time:45, serves:4, level:lv.med, tags:["lunch","dinner","curry","spicy","protein","tamil"],
  alias:["chettinad chicken","chicken chettinad","chettinad curry","चेट्टिनाड चिकन"],
  title:T("Chettinad Chicken","चेट्टिनाड चिकन","चेट्टिनाड चिकन","ચેટ્ટીનાડ ચિકન","செட்டிநாடு சிக்கன்"),
  desc:{en:"Fiery Tamil chicken curry with roasted coconut, black pepper and fennel.",hi:"भुने नारियल, काली मिर्च और सौंफ के साथ तीखी तमिल चिकन करी।"},
  ing:[["chicken",500,"g"],["coconut",0.5,"cup"],["black_pepper",1.5,"tsp"],["fennel",1,"tsp"],["red_chilli",4,"pc"],["coriander_powder",2,"tsp"],["onion",2,"pc"],["tomato",2,"pc"],["ginger_garlic",1,"tbsp"],["turmeric",0.5,"tsp"],["curry_leaves",2,"sprig"],["oil",3,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Dry-roast the coconut, pepper, fennel and dry red chillies until the coconut is golden. Cool and grind to a paste with a little water.","नारियल, काली मिर्च, सौंफ और साबुत लाल मिर्च सुनहरा होने तक सूखा भूनें। ठंडा करके थोड़े पानी के साथ पेस्ट बना लें।",300),
   s("Heat oil, add curry leaves and chopped onion. Fry until golden, then add ginger-garlic paste.","तेल गरम करें, कड़ी पत्ता और कटा प्याज़ डालें। सुनहरा होने पर अदरक-लहसुन पेस्ट डालें।",420),
   s("Add tomatoes, turmeric, coriander powder and salt. Cook until mushy.","टमाटर, हल्दी, धनिया पाउडर और नमक डालें। गलने तक पकाएं।",300),
   s("Add the chicken and sear for 5 minutes, then stir in the ground paste and 1 cup water.","चिकन डालकर 5 मिनट भूनें, फिर पिसा मसाला और 1 कप पानी मिलाएं।",300),
   s("Cover and simmer for 15 minutes until the chicken is cooked through and the gravy is thick.","ढककर 15 मिनट धीमी आंच पर पकाएं जब तक चिकन पूरी तरह पक जाए और ग्रेवी गाढ़ी हो जाए।",900)],
  tip:{en:"Freshly roasted and ground pepper is what makes Chettinad taste like Chettinad.",hi:"ताज़ी भुनी और पिसी काली मिर्च ही चेट्टिनाड का असली स्वाद है।"} },

{ id:"semiya-payasam", region:"south", art:"bowl", hue:"#c9a46c", time:25, serves:4, level:lv.easy, tags:["sweet","dessert","festive"],
  alias:["semiya payasam","vermicelli payasam","seviyan kheer","sevai kheer","payasam","सेवई खीर","सेवइयां","पायसम"],
  title:T("Semiya Payasam","सेवई पायसम","शेवयांची खीर","સેવૈયાની ખીર","சேமியா பாயசம்"),
  desc:{en:"Vermicelli simmered in sweet milk with ghee-roasted cashews and raisins.",hi:"मीठे दूध में पकी सेवई, घी में भुने काजू और किशमिश के साथ।"},
  ing:[["vermicelli",0.5,"cup"],["milk",3,"cup"],["sugar",0.33,"cup"],["ghee",2,"tbsp"],["cashew",10,"pc"],["raisins",1,"tbsp"],["cardamom",3,"pc"]],
  steps:[
   s("Fry the cashews and raisins in ghee until golden. Remove.","काजू और किशमिश को घी में सुनहरा भूनकर निकाल लें।",120),
   s("In the same ghee, roast the vermicelli until golden brown.","उसी घी में सेवई को सुनहरा भूरा होने तक भूनें।",180),
   s("Pour in the milk and bring to a boil, then simmer until the vermicelli is soft, about 8 minutes.","दूध डालकर उबाल आने दें, फिर सेवई नरम होने तक लगभग 8 मिनट पकाएं।",480),
   s("Add sugar and crushed cardamom and cook 3 more minutes.","चीनी और कुटी इलायची डालकर 3 मिनट और पकाएं।",180),
   s("Stir in the nuts and raisins. Serve warm or chilled; it thickens as it cools.","मेवे और किशमिश मिलाएं। गरम या ठंडा परोसें; ठंडा होने पर गाढ़ा हो जाता है।")],
  tip:{en:"Add sugar only after the vermicelli is soft; sugar stops it from cooking.",hi:"सेवई नरम होने के बाद ही चीनी डालें; चीनी से सेवई पकना रुक जाती है।"} },

{ id:"filter-coffee", region:"south", art:"cup", hue:"#5b3a24", time:15, serves:2, level:lv.easy, tags:["drink","breakfast","tamil"],
  alias:["filter coffee","south indian coffee","kaapi","madras coffee","फ़िल्टर कॉफ़ी","कॉफ़ी","कॉफी"],
  title:T("Filter Coffee","फ़िल्टर कॉफ़ी","फिल्टर कॉफी","ફિલ્ટર કોફી","ஃபில்டர் காபி"),
  desc:{en:"Strong South Indian decoction mixed with frothy hot milk.",hi:"झागदार गरम दूध के साथ कड़क दक्षिण भारतीय कॉफ़ी।"},
  ing:[["coffee",3,"tbsp"],["water",0.75,"cup"],["milk",1.5,"cup"],["sugar",3,"tsp"]],
  steps:[
   s("Put the coffee powder in the upper chamber of the filter and press lightly.","फ़िल्टर के ऊपरी हिस्से में कॉफ़ी पाउडर डालें और हल्का दबाएं।"),
   s("Pour boiling water over it, close the lid and let the decoction drip for 10 minutes.","ऊपर से उबलता पानी डालें, ढक्कन बंद करें और 10 मिनट तक डिकॉक्शन टपकने दें।",600),
   s("Boil the milk. Put sugar and a quarter cup of decoction into each tumbler.","दूध उबालें। हर गिलास में चीनी और चौथाई कप डिकॉक्शन डालें।"),
   s("Add the hot milk and pour back and forth between tumbler and davara to froth it up. Serve right away.","गरम दूध डालें और गिलास-कटोरी में ऊंचाई से उलट-पलट करके झाग बनाएं। तुरंत परोसें।")],
  tip:{en:"Coffee-chicory blends (80:20) give the classic thick, dark decoction.",hi:"कॉफ़ी-चिकोरी मिश्रण (80:20) से गाढ़ा, गहरा डिकॉक्शन बनता है।"} }
];
