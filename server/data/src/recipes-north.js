const s = (en, hi, t) => (t ? { en, hi, t } : { en, hi });
const T = (en, hi, mr, gu, ta) => ({ en, hi, mr, gu, ta });
const lv = { easy: { en: "Easy", hi: "आसान" }, med: { en: "Medium", hi: "मध्यम" }, hard: { en: "Involved", hi: "मेहनत वाला" } };

module.exports = [
{ id:"chole", region:"north", art:"pot", hue:"#9c5a22", time:50, serves:4, level:lv.med, tags:["lunch","dinner","curry","punjabi","protein","party"],
  alias:["chole","chhole","chana masala","punjabi chole","chole masala","छोले","चना मसाला"],
  title:T("Punjabi Chole","पंजाबी छोले","पंजाबी छोले","પંજાબી છોલે","பஞ்சாபி சோலே"),
  desc:{en:"Dark, tangy chickpea curry from Punjab. Soak the chickpeas overnight first.",hi:"पंजाब की गहरे रंग की चटपटी छोलों की करी। छोले रात भर पहले से भिगो लें।"},
  ing:[["chickpeas",1,"cup"],["tea",1,"tsp"],["onion",2,"pc"],["tomato",2,"pc"],["ginger_garlic",1,"tbsp"],["green_chilli",2,"pc"],["chilli_powder",1,"tsp"],["coriander_powder",2,"tsp"],["garam_masala",1,"tsp"],["amchur",1,"tsp"],["bay",1,"pc"],["oil",3,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Drain the soaked chickpeas. Tie the tea leaves in a small cloth or use a tea bag.","भीगे छोलों का पानी निकाल दें। चाय पत्ती को छोटे कपड़े में बांधें या टी-बैग लें।"),
   s("Pressure cook the chickpeas with the tea bag, salt and 3 cups of water for 5 whistles, then let the pressure drop.","छोलों को टी-बैग, नमक और 3 कप पानी के साथ 5 सीटी तक प्रेशर कुक करें, फिर प्रेशर अपने आप निकलने दें।",1200),
   s("Heat oil, add the bay leaf and chopped onion. Fry until deep golden, about 8 minutes.","तेल गरम करें, तेज पत्ता और कटा प्याज़ डालें। गहरा सुनहरा होने तक लगभग 8 मिनट भूनें।",480),
   s("Add ginger-garlic paste and green chillies, cook 1 minute. Add chopped tomatoes and all the powdered spices except garam masala. Cook until oil separates.","अदरक-लहसुन पेस्ट और हरी मिर्च डालकर 1 मिनट पकाएं। कटे टमाटर और गरम मसाला छोड़कर सारे मसाले डालें। तेल छूटने तक पकाएं।",360),
   s("Remove the tea bag. Add the chickpeas with their water, mash a few, and simmer for 10 minutes.","टी-बैग निकाल दें। छोले पानी समेत डालें, कुछ छोले मसल दें और 10 मिनट धीमी आंच पर पकाएं।",600),
   s("Stir in garam masala, garnish with coriander and serve with bhature, kulcha or rice.","गरम मसाला मिलाएं, धनिया डालें और भटूरे, कुलचे या चावल के साथ परोसें।")],
  tip:{en:"The tea bag gives chole its dark colour without changing the taste.",hi:"टी-बैग से छोलों का रंग गहरा आता है, स्वाद नहीं बदलता।"} },

{ id:"rajma", region:"north", art:"pot", hue:"#8e2f25", time:55, serves:4, level:lv.med, tags:["lunch","dinner","curry","punjabi","protein","comfort"],
  alias:["rajma","rajma chawal","rajma masala","kidney bean curry","राजमा","राजमा चावल"],
  title:T("Rajma Masala","राजमा मसाला","राजमा मसाला","રાજમા મસાલા","ராஜ்மா மசாலா"),
  desc:{en:"Creamy kidney beans in an onion-tomato gravy, best with steamed rice. Soak the rajma overnight.",hi:"प्याज़-टमाटर की ग्रेवी में मलाईदार राजमा, चावल के साथ सबसे अच्छा। राजमा रात भर भिगोएं।"},
  ing:[["rajma",1,"cup"],["onion",2,"pc"],["tomato",3,"pc"],["ginger_garlic",1,"tbsp"],["cumin",1,"tsp"],["turmeric",0.5,"tsp"],["chilli_powder",1,"tsp"],["coriander_powder",1.5,"tsp"],["garam_masala",1,"tsp"],["ghee",2,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Drain the soaked rajma and pressure cook with 3 cups of water and salt for 6 to 7 whistles, until very soft.","भीगे राजमा का पानी निकालकर 3 कप पानी और नमक के साथ 6-7 सीटी तक बिल्कुल नरम होने तक पकाएं।",1500),
   s("Heat ghee, add cumin. When it splutters, add finely chopped onion and fry until golden.","घी गरम करें, जीरा डालें। चटकने पर बारीक कटा प्याज़ डालकर सुनहरा होने तक भूनें।",420),
   s("Add ginger-garlic paste, then the puréed tomatoes, turmeric, chilli and coriander powder. Cook until thick and the oil separates.","अदरक-लहसुन पेस्ट डालें, फिर टमाटर प्यूरी, हल्दी, लाल मिर्च और धनिया पाउडर। गाढ़ा होने और तेल छूटने तक पकाएं।",480),
   s("Add the rajma with its cooking water. Mash a spoonful against the side of the pot and simmer for 15 minutes.","राजमा पानी समेत डालें। एक चम्मच राजमा किनारे पर मसल दें और 15 मिनट धीमी आंच पर पकाएं।",900),
   s("Add garam masala and coriander. Serve hot with rice.","गरम मसाला और धनिया डालें। चावल के साथ गरमागरम परोसें।")],
  tip:{en:"Rajma must be fully soft before adding to the masala; undercooked beans never soften in the gravy.",hi:"मसाले में डालने से पहले राजमा पूरी तरह नरम होना चाहिए; ग्रेवी में कच्चे राजमा नरम नहीं होते।"} },

{ id:"aloo-paratha", region:"north", art:"flat", hue:"#b7791f", time:40, serves:3, level:lv.med, tags:["breakfast","lunch","punjabi","flatbread","comfort"],
  alias:["aloo paratha","alu paratha","potato paratha","stuffed paratha","paratha","आलू पराठा","पराठा"],
  title:T("Aloo Paratha","आलू पराठा","आलू पराठा","આલુ પરાઠા","ஆலு பராத்தா"),
  desc:{en:"Whole-wheat flatbreads stuffed with spiced mashed potato and roasted in ghee.",hi:"मसालेदार आलू भरकर घी में सेके गेहूं के पराठे।"},
  ing:[["atta",2,"cup"],["potato",3,"pc"],["green_chilli",2,"pc"],["coriander",3,"tbsp"],["amchur",0.5,"tsp"],["chilli_powder",0.5,"tsp"],["ajwain",0.5,"tsp"],["ghee",4,"tbsp"],["salt",1,"taste"],["water",0.75,"cup"]],
  steps:[
   s("Knead the atta with a pinch of salt and water into a soft dough. Cover and rest for 15 minutes.","आटे में चुटकी भर नमक और पानी डालकर नरम आटा गूंध लें। ढककर 15 मिनट रखें।",900),
   s("Boil, peel and mash the potatoes. Mix in chopped green chilli, coriander, amchur, chilli powder, ajwain and salt.","आलू उबालकर छीलें और मसलें। कटी हरी मिर्च, धनिया, अमचूर, लाल मिर्च, अजवाइन और नमक मिलाएं।"),
   s("Roll a dough ball into a small circle, place a ball of filling in the centre, pinch the edges closed and flatten.","आटे की लोई को छोटा बेलें, बीच में आलू की भरावन रखें, किनारे बंद करके चपटा करें।"),
   s("Dust with flour and roll gently into a 7-inch paratha without pressing hard.","सूखा आटा लगाकर हल्के हाथ से 7 इंच का पराठा बेलें, ज़्यादा दबाएं नहीं।"),
   s("Cook on a hot tawa for 1 minute, flip, spread ghee on both sides and roast until golden spots appear.","गरम तवे पर 1 मिनट सेकें, पलटें, दोनों तरफ़ घी लगाएं और सुनहरे धब्बे आने तक सेकें।",120),
   s("Serve hot with curd, butter or pickle.","दही, मक्खन या अचार के साथ गरमागरम परोसें।")],
  tip:{en:"Let the potatoes cool completely; warm filling makes the paratha tear.",hi:"आलू पूरी तरह ठंडे होने दें; गरम भरावन से पराठा फटता है।"} },

{ id:"palak-paneer", region:"north", art:"pot", hue:"#3f6b33", time:35, serves:3, level:lv.med, tags:["lunch","dinner","curry","punjabi","healthy","protein"],
  alias:["palak paneer","saag paneer","spinach paneer","पालक पनीर"],
  title:T("Palak Paneer","पालक पनीर","पालक पनीर","પાલક પનીર","பாலக் பனீர்"),
  desc:{en:"Paneer cubes in a smooth, bright-green spinach gravy.",hi:"चिकनी, हरी पालक की ग्रेवी में पनीर के टुकड़े।"},
  ing:[["spinach",1,"bunch"],["paneer",200,"g"],["onion",1,"pc"],["tomato",1,"pc"],["ginger_garlic",1,"tbsp"],["green_chilli",2,"pc"],["cumin",1,"tsp"],["garam_masala",0.5,"tsp"],["cream",2,"tbsp"],["oil",2,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Wash the spinach well. Blanch it in boiling water for 2 minutes, then plunge into cold water.","पालक अच्छी तरह धो लें। उबलते पानी में 2 मिनट रखें, फिर तुरंत ठंडे पानी में डालें।",120),
   s("Blend the spinach with the green chillies into a smooth purée.","पालक को हरी मिर्च के साथ पीसकर चिकनी प्यूरी बना लें।"),
   s("Heat oil, add cumin, then chopped onion. Fry until light golden, add ginger-garlic paste and chopped tomato, and cook until soft.","तेल गरम करें, जीरा डालें, फिर कटा प्याज़। हल्का सुनहरा होने पर अदरक-लहसुन पेस्ट और कटा टमाटर डालकर नरम होने तक पकाएं।",420),
   s("Pour in the spinach purée and salt. Simmer for 4 minutes; don't cook longer or it loses its colour.","पालक प्यूरी और नमक डालें। 4 मिनट पकाएं; ज़्यादा पकाने से रंग चला जाता है।",240),
   s("Add paneer cubes and garam masala, cook 2 minutes, then swirl in the cream and serve.","पनीर के टुकड़े और गरम मसाला डालें, 2 मिनट पकाएं, फिर क्रीम मिलाकर परोसें।",120)],
  tip:{en:"The ice-water dip after blanching keeps the gravy bright green.",hi:"उबालने के बाद ठंडे पानी में डालने से ग्रेवी हरी-भरी रहती है।"} },

{ id:"punjabi-kadhi", region:"north", art:"pot", hue:"#c9a227", time:40, serves:4, level:lv.easy, tags:["lunch","dinner","curry","punjabi","comfort"],
  alias:["kadhi","punjabi kadhi","kadhi chawal","कढ़ी","पंजाबी कढ़ी","कढ़ी चावल"],
  title:T("Punjabi Kadhi","पंजाबी कढ़ी","पंजाबी कढी","પંજાબી કઢી","பஞ்சாபி கடி"),
  desc:{en:"Tangy yogurt and gram-flour curry, slow-simmered and finished with a spiced tadka.",hi:"खट्टे दही और बेसन की धीमी आंच पर पकी कढ़ी, ऊपर से मसालेदार तड़का।"},
  ing:[["curd",1.5,"cup"],["besan",4,"tbsp"],["water",3,"cup"],["turmeric",0.5,"tsp"],["onion",1,"pc"],["ginger",1,"pc"],["cumin",1,"tsp"],["hing",1,"pinch"],["red_chilli",2,"pc"],["chilli_powder",0.5,"tsp"],["oil",2,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Whisk the curd, besan, turmeric, salt and water until there are no lumps.","दही, बेसन, हल्दी, नमक और पानी को फेंट लें ताकि गुठलियां न रहें।"),
   s("Heat 1 tablespoon oil, add cumin, sliced onion and grated ginger. Cook for 2 minutes.","1 बड़ा चम्मच तेल गरम करें, जीरा, कटा प्याज़ और कद्दूकस अदरक डालकर 2 मिनट पकाएं।",120),
   s("Pour in the curd mixture and keep stirring until it comes to a boil, so it doesn't split.","दही का घोल डालें और उबाल आने तक लगातार चलाते रहें, ताकि फटे नहीं।",300),
   s("Lower the heat and simmer for 20 minutes, stirring now and then, until it thickens.","आंच धीमी करें और 20 मिनट बीच-बीच में चलाते हुए गाढ़ा होने तक पकाएं।",1200),
   s("For the tadka, heat the remaining oil, add hing, dry red chillies and chilli powder, and pour over the kadhi. Garnish with coriander.","तड़के के लिए बचा तेल गरम करें, हींग, साबुत लाल मिर्च और लाल मिर्च पाउडर डालें और कढ़ी पर डालें। धनिया से सजाएं।")],
  tip:{en:"Sour, day-old curd makes the tastiest kadhi.",hi:"एक दिन पुराना खट्टा दही सबसे स्वादिष्ट कढ़ी बनाता है।"} },

{ id:"butter-chicken", region:"north", art:"pot", hue:"#c0502d", time:50, serves:4, level:lv.med, tags:["dinner","curry","punjabi","party","protein"],
  alias:["butter chicken","murgh makhani","chicken makhani","बटर चिकन","मुर्ग मखनी"],
  title:T("Butter Chicken","बटर चिकन","बटर चिकन","બટર ચિકન","பட்டர் சிக்கன்"),
  desc:{en:"Marinated chicken simmered in a buttery, mildly spiced tomato-cashew sauce.",hi:"मैरीनेट किया चिकन, मक्खन वाली हल्की मसालेदार टमाटर-काजू ग्रेवी में।"},
  ing:[["chicken",500,"g"],["curd",0.5,"cup"],["ginger_garlic",1.5,"tbsp"],["chilli_powder",2,"tsp"],["garam_masala",1,"tsp"],["tomato",5,"pc"],["cashew",15,"pc"],["butter",4,"tbsp"],["kasuri_methi",1,"tsp"],["sugar",1,"tsp"],["cream",4,"tbsp"],["salt",1,"taste"]],
  steps:[
   s("Mix the chicken with curd, half the ginger-garlic paste, 1 teaspoon chilli powder and salt. Marinate for at least 30 minutes.","चिकन में दही, आधा अदरक-लहसुन पेस्ट, 1 छोटा चम्मच लाल मिर्च और नमक मिलाएं। कम से कम 30 मिनट मैरीनेट करें।",1800),
   s("Sear the chicken in 1 tablespoon butter on high heat until browned on all sides, about 6 minutes. Set aside.","1 बड़ा चम्मच मक्खन में तेज़ आंच पर चिकन को चारों तरफ़ से भूरा होने तक, लगभग 6 मिनट सेकें। अलग रख दें।",360),
   s("Simmer the chopped tomatoes and cashews with ½ cup water for 10 minutes, then blend until smooth.","कटे टमाटर और काजू को ½ कप पानी के साथ 10 मिनट पकाएं, फिर चिकना पीस लें।",600),
   s("Melt the remaining butter, add the rest of the ginger-garlic paste and chilli powder, then pour in the purée. Simmer 5 minutes.","बचा मक्खन पिघलाएं, बाकी अदरक-लहसुन पेस्ट और लाल मिर्च डालें, फिर प्यूरी डालकर 5 मिनट पकाएं।",300),
   s("Add the chicken, sugar, garam masala and crushed kasuri methi. Cook covered for 10 minutes until the chicken is cooked through.","चिकन, चीनी, गरम मसाला और मसली कसूरी मेथी डालें। ढककर 10 मिनट पकाएं जब तक चिकन पूरी तरह पक न जाए।",600),
   s("Turn off the heat, stir in the cream and serve with naan or jeera rice.","आंच बंद करें, क्रीम मिलाएं और नान या जीरा राइस के साथ परोसें।")],
  tip:{en:"Cut into the thickest piece: chicken is done when there's no pink inside and the juices run clear.",hi:"सबसे मोटा टुकड़ा काटकर देखें: अंदर गुलाबी न हो और रस साफ़ निकले तो चिकन पक गया।"} },

{ id:"aloo-gobi", region:"north", art:"pan", hue:"#c78a1e", time:30, serves:3, level:lv.easy, tags:["lunch","dinner","dry sabzi","quick"],
  alias:["aloo gobi","alu gobi","aloo gobhi","potato cauliflower","आलू गोभी"],
  title:T("Aloo Gobi","आलू गोभी","आलू गोबी","આલુ ગોબી","ஆலு கோபி"),
  desc:{en:"Dry-cooked potatoes and cauliflower with turmeric, cumin and ginger.",hi:"हल्दी, जीरे और अदरक के साथ सूखी आलू-गोभी की सब्ज़ी।"},
  ing:[["cauliflower",1,"pc"],["potato",2,"pc"],["onion",1,"pc"],["tomato",1,"pc"],["ginger",1,"pc"],["green_chilli",1,"pc"],["cumin",1,"tsp"],["turmeric",0.5,"tsp"],["coriander_powder",1.5,"tsp"],["garam_masala",0.5,"tsp"],["oil",3,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Cut the cauliflower into florets and the potatoes into cubes. Soak the florets in warm salted water for 5 minutes and drain.","गोभी के फूल और आलू के टुकड़े काटें। गोभी को 5 मिनट गुनगुने नमक के पानी में रखकर निकाल लें।",300),
   s("Heat oil, add cumin, then the onion, grated ginger and green chilli. Fry for 2 minutes.","तेल गरम करें, जीरा डालें, फिर प्याज़, कद्दूकस अदरक और हरी मिर्च। 2 मिनट भूनें।",120),
   s("Add potatoes, turmeric and salt. Cover and cook for 5 minutes.","आलू, हल्दी और नमक डालें। ढककर 5 मिनट पकाएं।",300),
   s("Add cauliflower, chopped tomato and coriander powder. Cover and cook on low heat for 12 minutes, stirring gently twice.","गोभी, कटा टमाटर और धनिया पाउडर डालें। ढककर धीमी आंच पर 12 मिनट पकाएं, दो बार धीरे से चलाएं।",720),
   s("Uncover, sprinkle garam masala and coriander, and roast for 2 more minutes.","ढक्कन हटाएं, गरम मसाला और धनिया डालें और 2 मिनट और भूनें।",120)],
  tip:{en:"Don't add water; the vegetables steam in their own moisture and stay firm.",hi:"पानी न डालें; सब्ज़ियां अपनी भाप में पकती हैं और कड़क रहती हैं।"} },

{ id:"gajar-halwa", region:"north", art:"bowl", hue:"#d9622b", time:60, serves:4, level:lv.easy, tags:["sweet","dessert","winter","festive"],
  alias:["gajar halwa","gajar ka halwa","carrot halwa","गाजर का हलवा","गाजर हलवा"],
  title:T("Gajar ka Halwa","गाजर का हलवा","गाजराचा हलवा","ગાજરનો હલવો","கேரட் அல்வா"),
  desc:{en:"Grated carrots slow-cooked in milk and ghee with cardamom and nuts.",hi:"कद्दूकस गाजर, दूध और घी में धीरे-धीरे पकाई, इलायची और मेवे के साथ।"},
  ing:[["carrot",8,"pc"],["milk",3,"cup"],["sugar",0.5,"cup"],["ghee",3,"tbsp"],["cardamom",4,"pc"],["cashew",10,"pc"],["raisins",1,"tbsp"]],
  steps:[
   s("Peel and grate the carrots.","गाजर छीलकर कद्दूकस कर लें।"),
   s("Cook the carrots with milk in a heavy pan on medium heat, stirring often, until all the milk is absorbed. About 35 minutes.","भारी कढ़ाही में गाजर और दूध मध्यम आंच पर बार-बार चलाते हुए पकाएं जब तक सारा दूध सूख न जाए। लगभग 35 मिनट।",2100),
   s("Add sugar. It will melt and turn runny; keep cooking until it dries again, about 8 minutes.","चीनी डालें। यह पिघलकर पतली हो जाएगी; फिर से सूखने तक लगभग 8 मिनट पकाएं।",480),
   s("Add ghee and crushed cardamom and roast for 5 minutes until glossy.","घी और कुटी इलायची डालें और चमकदार होने तक 5 मिनट भूनें।",300),
   s("Fold in the cashews and raisins. Serve warm.","काजू और किशमिश मिलाएं। गुनगुना परोसें।")],
  tip:{en:"Red winter Delhi carrots give the deepest colour and sweetness.",hi:"सर्दियों की लाल दिल्ली वाली गाजर से रंग और मिठास सबसे अच्छी आती है।"} },

{ id:"sweet-lassi", region:"north", art:"glass", hue:"#d8b98a", time:5, serves:2, level:lv.easy, tags:["drink","quick","summer","punjabi"],
  alias:["lassi","sweet lassi","meethi lassi","punjabi lassi","लस्सी","मीठी लस्सी"],
  title:T("Sweet Lassi","मीठी लस्सी","गोड लस्सी","મીઠી લસ્સી","இனிப்பு லஸ்ஸி"),
  desc:{en:"Thick, chilled yogurt drink, frothy and lightly scented with cardamom.",hi:"गाढ़ा, ठंडा और झागदार दही का पेय, हल्की इलायची की खुशबू के साथ।"},
  ing:[["curd",2,"cup"],["sugar",3,"tbsp"],["milk",0.25,"cup"],["cardamom",2,"pc"]],
  steps:[
   s("Put the chilled curd, sugar, milk and crushed cardamom in a jug.","ठंडा दही, चीनी, दूध और कुटी इलायची एक जग में डालें।"),
   s("Whisk hard or blend for 1 minute until frothy and the sugar dissolves.","झागदार होने और चीनी घुलने तक 1 मिनट ज़ोर से फेंटें या मिक्सी चलाएं।",60),
   s("Pour into glasses and serve cold, topped with a spoon of malai if you like.","गिलासों में डालें और ठंडा परोसें, चाहें तो ऊपर एक चम्मच मलाई डालें।")],
  tip:{en:"Use thick, fresh curd; sour curd makes it tangy.",hi:"गाढ़ा, ताज़ा दही लें; खट्टे दही से लस्सी खट्टी बनेगी।"} }
];
