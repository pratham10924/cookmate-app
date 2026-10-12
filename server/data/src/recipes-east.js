const s = (en, hi, t) => (t ? { en, hi, t } : { en, hi });
const T = (en, hi, mr, gu, ta) => ({ en, hi, mr, gu, ta });
const lv = { easy: { en: "Easy", hi: "आसान" }, med: { en: "Medium", hi: "मध्यम" } };

module.exports = [
{ id:"macher-jhol", region:"east", art:"pot", hue:"#c26a1c", time:35, serves:4, level:lv.med, tags:["lunch","dinner","curry","bengali","protein","light"],
  alias:["macher jhol","maacher jhol","bengali fish curry","fish jhol","माछेर झोल","बंगाली फिश करी"],
  title:T("Macher Jhol","माछेर झोल","माछेर झोल","માછેર ઝોલ","மாச்சர் ஜோல்"),
  desc:{en:"Light Bengali fish and potato curry flavoured with mustard oil, cumin and ginger.",hi:"सरसों तेल, जीरे और अदरक वाली हल्की बंगाली मछली-आलू की करी।"},
  ing:[["fish",500,"g"],["potato",2,"pc"],["tomato",1,"pc"],["mustard_oil",4,"tbsp"],["nigella",0.5,"tsp"],["ginger",1,"pc"],["cumin",1,"tsp"],["turmeric",1,"tsp"],["chilli_powder",1,"tsp"],["green_chilli",3,"pc"],["water",2,"cup"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Rub the fish with half the turmeric and salt. Heat mustard oil until it smokes lightly, then fry the fish 2 minutes per side. Set aside.","मछली पर आधी हल्दी और नमक लगाएं। सरसों तेल हल्का धुआं आने तक गरम करें, मछली हर तरफ़ 2 मिनट तलें। अलग रखें।",240),
   s("In the same oil, fry the potato wedges until golden. Remove.","उसी तेल में आलू के टुकड़े सुनहरे होने तक तलें। निकाल लें।",300),
   s("Add nigella seeds and slit green chillies, then a paste of ginger, cumin, remaining turmeric and chilli powder. Fry for 2 minutes.","कलौंजी और चीरी हरी मिर्च डालें, फिर अदरक, जीरा, बाकी हल्दी और लाल मिर्च का पेस्ट। 2 मिनट भूनें।",120),
   s("Add chopped tomato and cook until soft. Add the potatoes, water and salt. Simmer until the potatoes are tender, about 10 minutes.","कटा टमाटर डालकर नरम करें। आलू, पानी और नमक डालें। आलू नरम होने तक लगभग 10 मिनट पकाएं।",600),
   s("Slide in the fish and simmer for 5 minutes. Garnish with coriander and serve with steamed rice.","मछली डालें और 5 मिनट धीमी आंच पर पकाएं। धनिया डालें और चावल के साथ परोसें।",300)],
  tip:{en:"Heat mustard oil until it just smokes; it mellows the sharpness.",hi:"सरसों तेल को हल्का धुआं आने तक गरम करें; इससे इसकी तेज़ी कम होती है।"} },

{ id:"aloo-posto", region:"east", art:"pan", hue:"#cdb98a", time:30, serves:3, level:lv.easy, tags:["lunch","bengali","dry sabzi"],
  alias:["aloo posto","alu posto","posto","potato poppy seed","आलू पोस्तो"],
  title:T("Aloo Posto","आलू पोस्तो","आलू पोस्तो","આલુ પોસ્તો","ஆலு போஸ்தோ"),
  desc:{en:"Potatoes in a creamy poppy-seed paste with green chilli and mustard oil. Simple Bengali comfort food.",hi:"खसखस के मलाईदार पेस्ट, हरी मिर्च और सरसों तेल में आलू। सादा बंगाली खाना।"},
  ing:[["potato",3,"pc"],["poppy_seeds",4,"tbsp"],["green_chilli",3,"pc"],["nigella",0.5,"tsp"],["mustard_oil",2,"tbsp"],["turmeric",0.25,"tsp"],["water",0.5,"cup"],["salt",1,"taste"]],
  steps:[
   s("Soak the poppy seeds in hot water for 20 minutes, then grind with 2 green chillies into a smooth paste.","खसखस को 20 मिनट गरम पानी में भिगोएं, फिर 2 हरी मिर्च के साथ चिकना पीस लें।",1200),
   s("Heat mustard oil, add nigella and the remaining slit chilli, then the potato cubes with turmeric and salt. Fry for 3 minutes.","सरसों तेल गरम करें, कलौंजी और बची चीरी मिर्च डालें, फिर आलू के टुकड़े, हल्दी और नमक। 3 मिनट भूनें।",180),
   s("Add half a cup of water, cover and cook until the potatoes are just soft, about 10 minutes.","आधा कप पानी डालें, ढककर आलू नरम होने तक लगभग 10 मिनट पकाएं।",600),
   s("Stir in the poppy paste and cook uncovered for 3 to 4 minutes until it coats the potatoes. Drizzle a little raw mustard oil on top.","खसखस का पेस्ट मिलाएं और बिना ढके 3-4 मिनट पकाएं जब तक आलू पर लिपट न जाए। ऊपर थोड़ा कच्चा सरसों तेल डालें।",210)],
  tip:{en:"Eat aloo posto with plain rice and dal; it's meant to be mild.",hi:"आलू पोस्तो सादे चावल और दाल के साथ खाएं; यह हल्का ही होता है।"} },

{ id:"ghugni", region:"east", art:"bowl", hue:"#b78a3c", time:45, serves:4, level:lv.easy, tags:["snack","breakfast","street","bengali","protein"],
  alias:["ghugni","ghughni","matar ghugni","घुघनी","घुगनी"],
  title:T("Ghugni","घुगनी","घुगनी","ઘુગની","குக்னி"),
  desc:{en:"Dried yellow peas simmered with potato and spices, topped with onion and tamarind. Soak the peas overnight.",hi:"आलू और मसालों के साथ पकी सूखी मटर, ऊपर प्याज़ और इमली। मटर रात भर भिगोएं।"},
  ing:[["yellow_peas",1,"cup"],["potato",1,"pc"],["onion",2,"pc"],["tomato",1,"pc"],["ginger_garlic",1,"tbsp"],["cumin",1,"tsp"],["turmeric",0.5,"tsp"],["chilli_powder",1,"tsp"],["garam_masala",0.5,"tsp"],["tamarind_chutney",2,"tbsp"],["oil",2,"tbsp"],["salt",1,"taste"],["coriander",2,"tbsp"]],
  steps:[
   s("Pressure cook the soaked peas with the potato cubes, turmeric, salt and 3 cups of water for 3 whistles.","भीगी मटर को आलू के टुकड़ों, हल्दी, नमक और 3 कप पानी के साथ 3 सीटी तक पकाएं।",600),
   s("Heat oil, add cumin, then one chopped onion. Fry until golden and add ginger-garlic paste.","तेल गरम करें, जीरा डालें, फिर एक कटा प्याज़। सुनहरा होने पर अदरक-लहसुन पेस्ट डालें।",360),
   s("Add tomato and chilli powder and cook until soft.","टमाटर और लाल मिर्च डालकर नरम होने तक पकाएं।",240),
   s("Add the peas with their liquid and simmer for 10 minutes until thick. Stir in garam masala.","मटर पानी समेत डालें और गाढ़ा होने तक 10 मिनट पकाएं। गरम मसाला मिलाएं।",600),
   s("Serve topped with the remaining chopped onion, tamarind chutney and coriander.","ऊपर बचा कटा प्याज़, इमली की चटनी और धनिया डालकर परोसें।")],
  tip:{en:"Mash a few peas into the gravy to make it thick and creamy.",hi:"कुछ मटर ग्रेवी में मसल दें, गाढ़ी और मलाईदार बनेगी।"} },

{ id:"payesh", region:"east", art:"bowl", hue:"#e2cfa5", time:50, serves:4, level:lv.easy, tags:["sweet","dessert","festive","bengali"],
  alias:["payesh","payas","rice kheer","chawal ki kheer","kheer","पायेश","खीर","चावल की खीर"],
  title:T("Payesh (Rice Kheer)","पायेश (चावल की खीर)","तांदळाची खीर","ચોખાની ખીર","அரிசி பாயசம்"),
  desc:{en:"Bengali rice pudding slow-cooked in milk, sweetened with jaggery or sugar.",hi:"दूध में धीमी आंच पर पकी बंगाली चावल की खीर, गुड़ या चीनी से मीठी।"},
  ing:[["rice",0.25,"cup"],["milk",4,"cup"],["jaggery",0.33,"cup"],["cardamom",3,"pc"],["bay",1,"pc"],["ghee",1,"tsp"],["cashew",8,"pc"],["raisins",1,"tbsp"]],
  steps:[
   s("Wash the rice and rub it with the ghee.","चावल धोकर उस पर घी लगा दें।"),
   s("Bring the milk to a boil with the bay leaf and cardamom in a heavy pot.","भारी बर्तन में दूध को तेज पत्ते और इलायची के साथ उबालें।",420),
   s("Add the rice and simmer on low heat, stirring often, until the rice is soft and the milk thickens, about 35 minutes.","चावल डालें और धीमी आंच पर बार-बार चलाते हुए पकाएं जब तक चावल नरम और दूध गाढ़ा न हो जाए, लगभग 35 मिनट।",2100),
   s("Turn off the heat and let it cool for 5 minutes, then stir in the jaggery so the milk doesn't curdle.","आंच बंद करें और 5 मिनट ठंडा होने दें, फिर गुड़ मिलाएं ताकि दूध न फटे।",300),
   s("Add cashews and raisins. Serve warm or chilled.","काजू और किशमिश डालें। गरम या ठंडा परोसें।")],
  tip:{en:"Always add jaggery off the heat; it can split hot milk.",hi:"गुड़ हमेशा आंच बंद करके डालें; गरम दूध में यह फट सकता है।"} },

{ id:"veg-momos", region:"east", art:"stack", hue:"#c9b9a0", time:50, serves:4, level:lv.med, tags:["snack","street","steamed","northeast","party"],
  alias:["momos","momo","veg momos","dumplings","steamed momos","मोमो","मोमोज़","मोमोस"],
  title:T("Veg Momos","वेज मोमोज़","व्हेज मोमोज","વેજ મોમોઝ","வெஜ் மோமோஸ்"),
  desc:{en:"Steamed dumplings with a juicy cabbage-carrot filling, as made across the North-East and the hills.",hi:"पत्ता गोभी-गाजर की रसीली भरावन वाले भाप में पके मोमोज़, जैसे पूर्वोत्तर और पहाड़ों में बनते हैं।"},
  ing:[["flour",2,"cup"],["cabbage",2,"cup"],["carrot",1,"pc"],["onion",1,"pc"],["garlic",4,"pc"],["ginger",1,"pc"],["spring_onion",3,"pc"],["soy_sauce",1,"tbsp"],["black_pepper",0.5,"tsp"],["oil",2,"tbsp"],["salt",1,"taste"],["water",0.6,"cup"]],
  steps:[
   s("Knead the flour with a pinch of salt, 1 teaspoon oil and water into a firm, smooth dough. Cover and rest for 20 minutes.","मैदे में चुटकी नमक, 1 छोटा चम्मच तेल और पानी डालकर सख्त, चिकना आटा गूंधें। ढककर 20 मिनट रखें।",1200),
   s("Finely chop the cabbage, carrot, onion, garlic, ginger and spring onions. Squeeze excess water from the cabbage.","पत्ता गोभी, गाजर, प्याज़, लहसुन, अदरक और हरा प्याज़ बारीक काटें। गोभी का पानी निचोड़ दें।"),
   s("Stir-fry the garlic and ginger in oil for 30 seconds, add the vegetables and cook on high heat for 3 minutes. Season with soy sauce, pepper and salt, then cool.","तेल में लहसुन-अदरक 30 सेकंड भूनें, सब्ज़ियां डालकर तेज़ आंच पर 3 मिनट पकाएं। सोया सॉस, काली मिर्च और नमक डालें, फिर ठंडा करें।",210),
   s("Roll small dough balls into thin 3-inch circles, place a spoon of filling in the centre and pleat the edges closed.","छोटी लोइयों को 3 इंच की पतली पूरी बेलें, बीच में एक चम्मच भरावन रखें और किनारे चुन्नट बनाकर बंद करें।"),
   s("Steam on a greased tray for 10 to 12 minutes until the wrappers look translucent. Serve with red chilli chutney.","तेल लगी ट्रे पर 10-12 मिनट भाप दें जब तक ऊपरी परत पारदर्शी न दिखे। लाल मिर्च की चटनी के साथ परोसें।",660)],
  tip:{en:"Keep the dough covered while you shape; dry wrappers crack.",hi:"मोमो बनाते समय आटा ढककर रखें; सूखा आटा फटता है।"} },

{ id:"thukpa", region:"east", art:"bowl", hue:"#a5602e", time:30, serves:3, level:lv.easy, tags:["dinner","soup","noodles","northeast","comfort","winter"],
  alias:["thukpa","noodle soup","tibetan noodle soup","थुकपा"],
  title:T("Veg Thukpa","वेज थुकपा","व्हेज थुकपा","વેજ થુકપા","வெஜ் துக்பா"),
  desc:{en:"Warming Himalayan noodle soup with vegetables, garlic and ginger.",hi:"सब्ज़ियों, लहसुन और अदरक वाला गरमाहट देने वाला हिमालयी नूडल सूप।"},
  ing:[["noodles",150,"g"],["cabbage",1,"cup"],["carrot",1,"pc"],["capsicum",1,"pc"],["onion",1,"pc"],["tomato",1,"pc"],["garlic",4,"pc"],["ginger",1,"pc"],["green_chilli",1,"pc"],["soy_sauce",1,"tbsp"],["water",5,"cup"],["oil",1,"tbsp"],["salt",1,"taste"],["spring_onion",2,"pc"]],
  steps:[
   s("Boil the noodles until just cooked, drain and rinse in cold water.","नूडल्स को बस पकने तक उबालें, छानें और ठंडे पानी से धो लें।",300),
   s("Heat oil, add chopped garlic, ginger, green chilli and sliced onion. Fry for 2 minutes.","तेल गरम करें, कटा लहसुन, अदरक, हरी मिर्च और कटा प्याज़ डालें। 2 मिनट भूनें।",120),
   s("Add the tomato, carrot, cabbage and capsicum and stir-fry for 3 minutes.","टमाटर, गाजर, पत्ता गोभी और शिमला मिर्च डालकर 3 मिनट तेज़ आंच पर भूनें।",180),
   s("Pour in the water, soy sauce and salt. Simmer for 8 minutes.","पानी, सोया सॉस और नमक डालें। 8 मिनट पकाएं।",480),
   s("Divide the noodles into bowls, ladle the hot soup over and top with spring onions.","नूडल्स को कटोरियों में डालें, ऊपर गरम सूप डालें और हरा प्याज़ छिड़कें।")],
  tip:{en:"Keep noodles and soup separate until serving so the noodles don't go soggy.",hi:"परोसने तक नूडल्स और सूप अलग रखें ताकि नूडल्स गल न जाएं।"} }
];
