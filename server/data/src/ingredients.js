// New ingredients (the original 49 live in base.json) + nutrition / allergen metadata for ALL ingredients.
//
// META[key] = [kcal per 100 g, protein g per 100 g, grams-per-unit overrides, flags]
//   flags: allergens  dairy nuts peanut gluten egg soy sesame fish mustard
//          ani  = animal product (not vegan)      meat = meat or fish (non-veg)
//          root = root vegetable / bulb (not Jain)
// Values are typical figures from standard food-composition tables (IFCT 2017 / USDA), rounded.

const EXTRA = {
  chickpeas:{en:"Kabuli chana (dried chickpeas)",hi:"काबुली चना",alias:["chickpeas","chickpea","chana","chole","kabuli chana","garbanzo","काबुली चना","छोले","चना"],sub:{en:"2 cans of boiled chickpeas (skip the soaking and pressure cooking)",hi:"2 डिब्बे उबले छोले (भिगोने और प्रेशर कुक करने की ज़रूरत नहीं)"}},
  rajma:{en:"Rajma (dried kidney beans)",hi:"राजमा",alias:["rajma","kidney beans","kidney bean","राजमा"],sub:{en:"Lobia (black-eyed peas) or canned kidney beans",hi:"लोबिया या डिब्बाबंद राजमा"}},
  atta:{en:"Whole-wheat flour (atta)",hi:"गेहूं का आटा",alias:["atta","wheat flour","whole wheat flour","gehun ka atta","गेहूं का आटा","गेहूँ का आटा"],sub:{en:"Multigrain atta, or half maida and half atta",hi:"मल्टीग्रेन आटा, या आधा मैदा आधा आटा"}},
  spinach:{en:"Spinach (palak)",hi:"पालक",alias:["spinach","palak","पालक"],sub:{en:"Methi leaves, or frozen spinach",hi:"मेथी के पत्ते, या फ्रोज़न पालक"}},
  besan:{en:"Besan (gram flour)",hi:"बेसन",alias:["besan","gram flour","chickpea flour","बेसन"],sub:{en:"Rice flour (texture will be lighter)",hi:"चावल का आटा (बनावट हल्की होगी)"}},
  curd:{en:"Curd (plain yogurt)",hi:"दही",alias:["curd","yogurt","yoghurt","dahi","dahee","दही"],sub:{en:"Thick buttermilk, or for a vegan version, coconut yogurt",hi:"गाढ़ी छाछ, या वीगन के लिए नारियल का दही"}},
  chicken:{en:"Chicken (boneless)",hi:"चिकन (बिना हड्डी)",alias:["chicken","murgh","murg","चिकन","मुर्गा","मुर्ग"],sub:{en:"Paneer or firm tofu cubes; reduce cooking time to 5 minutes",hi:"पनीर या टोफू के टुकड़े; पकाने का समय 5 मिनट करें"}},
  fish:{en:"Fish (firm, like rohu or surmai)",hi:"मछली (रोहू या सुरमई)",alias:["fish","machli","machhli","maach","rohu","surmai","pomfret","मछली","माछ"],sub:{en:"Prawns (cook 4 minutes), or paneer for a vegetarian version",hi:"झींगे (4 मिनट पकाएं), या शाकाहारी के लिए पनीर"}},
  cauliflower:{en:"Cauliflower",hi:"फूलगोभी",alias:["cauliflower","gobi","gobhi","phool gobi","फूलगोभी","गोभी"],sub:{en:"Broccoli or extra potatoes",hi:"ब्रोकली या ज़्यादा आलू"}},
  carrot:{en:"Carrots",hi:"गाजर",alias:["carrot","carrots","gajar","गाजर"],sub:{en:"Red pumpkin or beetroot (grated)",hi:"लाल कद्दू या चुकंदर (कद्दूकस किया हुआ)"}},
  sooji:{en:"Sooji / rava (semolina)",hi:"सूजी / रवा",alias:["sooji","suji","rava","semolina","सूजी","रवा"],sub:{en:"Broken wheat (dalia) or rice rava; add a little more water",hi:"दलिया या चावल का रवा; थोड़ा ज़्यादा पानी डालें"}},
  coconut:{en:"Grated coconut (fresh)",hi:"कद्दूकस नारियल (ताज़ा)",alias:["coconut","grated coconut","nariyal","naariyal","नारियल"],sub:{en:"Desiccated coconut soaked in warm water for 10 minutes",hi:"सूखा नारियल बुरादा 10 मिनट गुनगुने पानी में भिगोकर"}},
  coconut_milk:{en:"Coconut milk",hi:"नारियल का दूध",alias:["coconut milk","nariyal doodh","नारियल का दूध","नारियल दूध"],sub:{en:"1 cup grated coconut blended with 1 cup warm water and strained",hi:"1 कप कद्दूकस नारियल को 1 कप गुनगुने पानी के साथ पीसकर छान लें"}},
  tamarind:{en:"Tamarind pulp",hi:"इमली का गूदा",alias:["tamarind","imli","puli","इमली"],sub:{en:"1 tsp amchur or 1 tbsp lemon juice per tbsp of tamarind",hi:"हर बड़े चम्मच इमली की जगह 1 छोटा चम्मच अमचूर या 1 बड़ा चम्मच नींबू रस"}},
  sambar_powder:{en:"Sambar powder",hi:"सांभर मसाला",alias:["sambar powder","sambar masala","सांभर मसाला","सांबर मसाला"],sub:{en:"1 tsp coriander powder + ½ tsp chilli powder + ¼ tsp cumin + a pinch of methi seeds",hi:"1 छोटा चम्मच धनिया पाउडर + ½ लाल मिर्च + ¼ जीरा + चुटकी मेथी दाना"}},
  vermicelli:{en:"Vermicelli (semiya)",hi:"सेवई",alias:["vermicelli","semiya","seviyan","sevai","सेवई","सेवइयां"],sub:{en:"Broken thin rice noodles, or 3 tbsp rice for a kheer",hi:"पतले चावल के नूडल्स, या खीर के लिए 3 बड़े चम्मच चावल"}},
  coffee:{en:"Filter coffee powder",hi:"फ़िल्टर कॉफ़ी पाउडर",alias:["coffee","filter coffee","coffee powder","kaapi","कॉफी","कॉफ़ी"],sub:{en:"1½ tsp instant coffee per cup (skip brewing; mix into hot milk)",hi:"हर कप के लिए 1½ छोटा चम्मच इंस्टेंट कॉफ़ी (सीधे गरम दूध में मिलाएं)"}},
  pav:{en:"Pav (soft bread buns)",hi:"पाव",alias:["pav","pao","bun","buns","पाव"],sub:{en:"Burger buns or thick bread slices",hi:"बर्गर बन या मोटी ब्रेड स्लाइस"}},
  bread:{en:"Bread slices",hi:"ब्रेड स्लाइस",alias:["bread","bread slices","ब्रेड"],sub:{en:"Pav, or multigrain bread",hi:"पाव, या मल्टीग्रेन ब्रेड"}},
  sabudana:{en:"Sabudana (sago pearls)",hi:"साबूदाना",alias:["sabudana","sago","tapioca pearls","साबूदाना"],sub:{en:"Thick poha (rinse quickly, do not soak)",hi:"मोटा पोहा (जल्दी धोएं, भिगोएं नहीं)"}},
  eno:{en:"Fruit salt (Eno)",hi:"फ्रूट सॉल्ट (ईनो)",alias:["eno","fruit salt","ईनो"],sub:{en:"½ tsp baking soda + 1 tsp lemon juice",hi:"½ छोटा चम्मच बेकिंग सोडा + 1 छोटा चम्मच नींबू रस"}},
  methi_leaves:{en:"Fresh methi (fenugreek) leaves",hi:"हरी मेथी",alias:["methi leaves","fresh methi","fenugreek leaves","hari methi","हरी मेथी","मेथी के पत्ते"],sub:{en:"2 tbsp kasuri methi, or spinach",hi:"2 बड़े चम्मच कसूरी मेथी, या पालक"}},
  mustard_oil:{en:"Mustard oil",hi:"सरसों का तेल",alias:["mustard oil","sarson ka tel","सरसों का तेल","सरसों तेल"],sub:{en:"Any vegetable oil plus a pinch of mustard powder",hi:"कोई भी तेल और चुटकी भर सरसों पाउडर"}},
  poppy_seeds:{en:"Poppy seeds (posto / khus khus)",hi:"खसखस (पोस्तो)",alias:["poppy seeds","posto","khus khus","khaskhas","खसखस","पोस्तो"],sub:{en:"Cashews or melon seeds soaked and ground",hi:"भीगे काजू या मगज़ के बीज पीसकर"}},
  nigella:{en:"Nigella seeds (kalonji)",hi:"कलौंजी",alias:["nigella","kalonji","kalo jeere","कलौंजी"],sub:{en:"Cumin seeds",hi:"जीरा"}},
  yellow_peas:{en:"Dried yellow peas (matar)",hi:"सूखी सफ़ेद/पीली मटर",alias:["yellow peas","dried peas","white peas","safed matar","सूखी मटर","सफेद मटर"],sub:{en:"Kabuli chana or kala chana",hi:"काबुली चना या काला चना"}},
  cooked_rice:{en:"Cooked rice",hi:"पके हुए चावल",alias:["cooked rice","leftover rice","pake chawal","पके चावल","पका हुआ चावल","बचे चावल"],sub:{en:"Cooked millet or quinoa",hi:"पका हुआ मिलेट या क्विनोआ"}},
  noodles:{en:"Wheat noodles (hakka)",hi:"नूडल्स",alias:["noodles","hakka noodles","maggi","नूडल्स"],sub:{en:"Rice noodles (gluten-free) or spaghetti",hi:"राइस नूडल्स (ग्लूटेन-फ्री) या स्पेगेटी"}},
  soy_sauce:{en:"Soy sauce",hi:"सोया सॉस",alias:["soy sauce","soya sauce","सोया सॉस"],sub:{en:"Tamari (gluten-free), or salt with a few drops of vinegar",hi:"तमारी (ग्लूटेन-फ्री), या नमक और कुछ बूंद सिरका"}},
  vinegar:{en:"Vinegar",hi:"सिरका",alias:["vinegar","sirka","सिरका"],sub:{en:"Lemon juice",hi:"नींबू का रस"}},
  capsicum:{en:"Capsicum (bell pepper)",hi:"शिमला मिर्च",alias:["capsicum","bell pepper","shimla mirch","शिमला मिर्च"],sub:{en:"Green beans or zucchini",hi:"बीन्स या तोरी"}},
  cabbage:{en:"Cabbage",hi:"पत्ता गोभी",alias:["cabbage","patta gobhi","bandh gobi","पत्ता गोभी","बंद गोभी"],sub:{en:"Lettuce or bok choy",hi:"लेट्यूस या बोक चॉय"}},
  spring_onion:{en:"Spring onions",hi:"हरा प्याज़",alias:["spring onion","spring onions","green onion","scallion","hara pyaz","हरा प्याज","हरा प्याज़"],sub:{en:"Finely chopped onion plus coriander for colour",hi:"बारीक कटा प्याज़ और रंग के लिए धनिया"}},
  cornflour:{en:"Cornflour",hi:"कॉर्नफ्लोर",alias:["cornflour","corn flour","cornstarch","corn starch","कॉर्नफ्लोर"],sub:{en:"Arrowroot powder or rice flour",hi:"अरारोट या चावल का आटा"}},
  puffed_rice:{en:"Puffed rice (murmura)",hi:"मुरमुरे",alias:["puffed rice","murmura","kurmura","mamra","मुरमुरे","मुरमुरा"],sub:{en:"Cornflakes or roasted poha",hi:"कॉर्नफ्लेक्स या भुना पोहा"}},
  sev:{en:"Sev (crispy gram-flour noodles)",hi:"सेव",alias:["sev","nylon sev","सेव"],sub:{en:"Crushed papdi, nachos or roasted peanuts",hi:"कुटी पापड़ी, नाचोज़ या भुनी मूंगफली"}},
  green_chutney:{en:"Green chutney (coriander-mint)",hi:"हरी चटनी",alias:["green chutney","hari chutney","pudina chutney","हरी चटनी"],sub:{en:"Blend a handful of coriander, 1 green chilli, lemon juice and salt",hi:"मुट्ठी भर धनिया, 1 हरी मिर्च, नींबू और नमक पीस लें"}},
  tamarind_chutney:{en:"Sweet tamarind chutney",hi:"मीठी इमली की चटनी",alias:["tamarind chutney","imli chutney","saunth","meethi chutney","इमली की चटनी","मीठी चटनी"],sub:{en:"Tomato ketchup mixed with a pinch of chaat masala",hi:"टोमैटो केचप में चुटकी भर चाट मसाला"}},
  chaat_masala:{en:"Chaat masala",hi:"चाट मसाला",alias:["chaat masala","चाट मसाला"],sub:{en:"Amchur + black salt + roasted cumin powder",hi:"अमचूर + काला नमक + भुना जीरा पाउडर"}},
  cucumber:{en:"Cucumber",hi:"खीरा",alias:["cucumber","kheera","khira","खीरा"],sub:{en:"Grated carrot or thinly sliced radish",hi:"कद्दूकस गाजर या पतली कटी मूली"}},
  black_pepper:{en:"Black pepper (crushed)",hi:"काली मिर्च (कुटी)",alias:["black pepper","pepper","kali mirch","काली मिर्च"],sub:{en:"White pepper, or a pinch of red chilli powder",hi:"सफ़ेद मिर्च, या चुटकी भर लाल मिर्च"}},
  fennel:{en:"Fennel seeds (saunf)",hi:"सौंफ",alias:["fennel","saunf","sombu","सौंफ"],sub:{en:"Cumin seeds",hi:"जीरा"}},
  jaggery:{en:"Jaggery (gur)",hi:"गुड़",alias:["jaggery","gur","gud","गुड़","गुड"],sub:{en:"Brown sugar or regular sugar",hi:"ब्राउन शुगर या चीनी"}},
  raisins:{en:"Raisins",hi:"किशमिश",alias:["raisins","raisin","kishmish","किशमिश"],sub:{en:"Chopped dates, or skip",hi:"कटे खजूर, या छोड़ दें"}},
  roasted_chana:{en:"Roasted chana dal (pottukadalai)",hi:"भुना चना",alias:["roasted chana","pottukadalai","phutana","bhuna chana","भुना चना"],sub:{en:"2 tbsp roasted peanuts",hi:"2 बड़े चम्मच भुनी मूंगफली"}},
  pav_bhaji_masala:{en:"Pav bhaji masala",hi:"पाव भाजी मसाला",alias:["pav bhaji masala","पाव भाजी मसाला"],sub:{en:"Garam masala + a little amchur and chilli powder",hi:"गरम मसाला + थोड़ा अमचूर और लाल मिर्च"}},
  ajwain:{en:"Ajwain (carom seeds)",hi:"अजवाइन",alias:["ajwain","carom","carom seeds","ajowan","अजवाइन"],sub:{en:"Cumin seeds or dried oregano",hi:"जीरा या सूखा ऑरिगैनो"}},
  saffron:{en:"Saffron (kesar)",hi:"केसर",alias:["saffron","kesar","केसर"],sub:{en:"A pinch of cardamom powder (no colour, still fragrant)",hi:"चुटकी भर इलायची पाउडर (रंग नहीं, खुशबू मिलेगी)"}},
  mint:{en:"Mint leaves (pudina)",hi:"पुदीना",alias:["mint","pudina","पुदीना"],sub:{en:"Coriander leaves",hi:"हरा धनिया"}},
  ketchup:{en:"Tomato ketchup",hi:"टोमैटो केचप",alias:["ketchup","tomato ketchup","tomato sauce","केचप","सॉस"],sub:{en:"Tomato purée with a pinch of sugar",hi:"टमाटर प्यूरी और चुटकी भर चीनी"}},
  oats:{en:"Rolled oats",hi:"ओट्स",alias:["oats","rolled oats","oatmeal","ओट्स"],sub:{en:"Thin poha or broken wheat (dalia)",hi:"पतला पोहा या दलिया"}},
  banana:{en:"Ripe bananas",hi:"पके केले",alias:["banana","bananas","kela","केला","केले"],sub:{en:"Mango, chikoo or 2 soaked dates",hi:"आम, चीकू या 2 भीगे खजूर"}},
  tahini:{en:"Tahini (sesame paste)",hi:"ताहिनी (तिल का पेस्ट)",alias:["tahini","sesame paste","til paste","ताहिनी"],sub:{en:"Peanut butter, or 2 tbsp roasted sesame ground with oil",hi:"पीनट बटर, या 2 बड़े चम्मच भुने तिल तेल के साथ पीसकर"}},
  cinnamon_powder:{en:"Cinnamon powder",hi:"दालचीनी पाउडर",alias:["cinnamon powder","dalchini powder","दालचीनी पाउडर"],sub:{en:"Cardamom powder or nutmeg",hi:"इलायची पाउडर या जायफल"}}
};

const META = {
  // ---- original ingredients ----
  paneer:[265,18,{cup:150},"dairy ani"], butter:[717,0.9,{tbsp:14,tsp:5},"dairy ani"], cream:[250,2,{},"dairy ani"],
  tomato:[18,0.9,{pc:100},"" ], onion:[40,1.1,{pc:110},"root"], ginger_garlic:[80,2.5,{},"root"],
  kasuri_methi:[323,23,{tsp:1,tbsp:3},""], garam_masala:[380,14,{tsp:2.5},""], chilli_powder:[282,13,{tsp:2.5},""],
  sugar:[387,0,{tsp:4,tbsp:12,cup:200},""], cashew:[553,18,{pc:1.5,tbsp:9},"nuts"], salt:[0,0,{},""],
  oil:[884,0,{tbsp:14,tsp:4.5},""], ghee:[900,0,{tbsp:14,tsp:5},"dairy ani"], tea:[0,0,{tsp:2},""],
  milk:[62,3.2,{cup:245},"dairy ani"], water:[0,0,{},""], ginger:[80,1.8,{pc:10},"root"], cardamom:[311,11,{pc:0.2},""],
  rice:[360,7,{cup:185},""], veg:[50,3,{cup:130},"root"], cumin:[375,18,{tsp:2},""], bay:[313,8,{pc:0.3},""],
  whole_spices:[300,6,{pc:0.5},""], toor_dal:[343,22,{cup:200},""], turmeric:[312,10,{tsp:3},""], garlic:[149,6.4,{pc:4},"root"],
  green_chilli:[40,2,{pc:5},""], coriander:[23,2,{tbsp:2,handful:10},""], lemon:[22,0.4,{pc:40},""], poha:[350,6.6,{cup:90},""],
  mustard:[508,26,{tsp:3},"mustard"], curry_leaves:[108,6,{sprig:1},""], peanuts:[567,26,{tbsp:9,cup:145},"peanut"],
  eggs:[143,12.6,{pc:50},"egg ani"], potato:[77,2,{pc:150},"root"], pasta:[371,13,{},"gluten"], olive_oil:[884,0,{tbsp:14},""],
  basil:[23,3,{handful:5},""], chilli_flakes:[282,12,{tsp:1.5},""], cheese:[390,25,{tbsp:6,cup:100},"dairy ani"],
  flour:[364,10,{cup:125,tbsp:8},"gluten"], baking_powder:[53,0,{tsp:4},""], honey:[304,0.3,{tbsp:21,tsp:7},"ani"],
  vanilla:[288,0,{tsp:4},""], hing:[0,0,{},"gluten"], red_chilli:[282,12,{pc:0.5},""], coriander_powder:[298,12,{tsp:2},""],
  amchur:[330,2.5,{tsp:2},""],
  // ---- new ingredients ----
  chickpeas:[364,19,{cup:200},""], rajma:[333,24,{cup:185},""], atta:[340,13,{cup:120},"gluten"], spinach:[23,2.9,{cup:30,bunch:250},""],
  besan:[387,22,{cup:92,tbsp:7},""], curd:[61,3.5,{cup:245},"dairy ani"], chicken:[120,22,{},"meat ani"], fish:[100,19,{pc:80},"fish meat ani"],
  cauliflower:[25,1.9,{pc:500,cup:100},""], carrot:[41,0.9,{pc:60},"root"], sooji:[360,12.7,{cup:170},"gluten"],
  coconut:[354,3.3,{cup:80},""], coconut_milk:[197,2.2,{cup:240},""], tamarind:[239,2.8,{tbsp:15},""],
  sambar_powder:[320,12,{tsp:2.5,tbsp:7},""], vermicelli:[350,11,{cup:70},"gluten"], coffee:[2,0.1,{tsp:2.5,tbsp:7},""],
  pav:[270,9,{pc:40},"gluten"], bread:[265,9,{pc:28},"gluten"], sabudana:[351,0.2,{cup:160},""], eno:[0,0,{tsp:5},""],
  methi_leaves:[49,4.4,{cup:30},""], mustard_oil:[884,0,{tbsp:14},"mustard"], poppy_seeds:[525,18,{tbsp:9},""],
  nigella:[345,16,{tsp:2},""], yellow_peas:[341,24,{cup:200},""], cooked_rice:[130,2.7,{cup:160},""], noodles:[380,12,{},"gluten"],
  soy_sauce:[53,8,{tbsp:16,tsp:5},"soy gluten"], vinegar:[18,0,{},""], capsicum:[20,0.9,{pc:120},""], cabbage:[25,1.3,{cup:90},""],
  spring_onion:[32,1.8,{pc:15,cup:100},"root"], cornflour:[381,0.3,{tbsp:8},""], puffed_rice:[402,6,{cup:14},""],
  sev:[550,14,{cup:60,tbsp:6},""], green_chutney:[40,2,{},""], tamarind_chutney:[200,0.5,{tbsp:20},""], chaat_masala:[200,8,{tsp:2},""],
  cucumber:[15,0.7,{pc:200},""], black_pepper:[251,10,{tsp:2.5},""], fennel:[345,16,{tsp:2},""], jaggery:[383,0.4,{tbsp:15},""],
  raisins:[299,3,{tbsp:9},""], roasted_chana:[369,22,{tbsp:10},""], pav_bhaji_masala:[300,10,{tsp:2.5,tbsp:7},""],
  ajwain:[305,16,{tsp:2},""], saffron:[0,0,{},""], mint:[70,3.8,{handful:10},""], ketchup:[112,1.7,{tbsp:17},"root"],
  oats:[389,17,{cup:80},"gluten"], banana:[89,1.1,{pc:120},""], tahini:[595,17,{tbsp:15},"sesame"], cinnamon_powder:[247,4,{tsp:2.6},""]
};

// default grams per unit when an ingredient has no override
const DEFAULT_W = { g:1, kg:1000, ml:1, cup:240, tbsp:15, tsp:5, pinch:0.3, taste:1, sprig:1, handful:15, pc:50, bunch:250 };

module.exports = { EXTRA, META, DEFAULT_W };
