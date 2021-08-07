
(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {

        var sudogen = require('sudoku-gen');
        const easyGen = sudogen.getSudoku("easy")
        const mediumGen = sudogen.getSudoku("medium")
        const hardGen = sudogen.getSudoku("hard")
        const expertGen = sudogen.getSudoku("expert")

        const easy = [
            Object.values(easyGen)[0],
            Object.values(easyGen)[1]
        ];
        const medium = [
            Object.values(mediumGen)[0],
            Object.values(mediumGen)[1]
        ];
        const hard = [
            Object.values(hardGen)[0],
            Object.values(hardGen)[1]
        ];
        const expert = [
            Object.values(expertGen)[0],
            Object.values(expertGen)[1]
        ];


        var timer;
        var timeRemaining;
        var selectedTile;
        var disableSelect;
        var selectedNum;

        window.onload = function () {
            //Run startgame function when button is clicked
            id("start-button").addEventListener("click", startGame);
            //Add event listener to each number in the number container
            for (let i = 0; i < id("number-container").children.length; i++) {
                id("number-container").children[i].addEventListener("click", function () {
                    if (!disableSelect) {
                        if (this.classList.contains("selected")) {
                            this.classList.remove("selected");
                            selectedNum = null;

                        } else {
                            for (let i = 0; i < 9; i++) {
                                id("number-container").children[i].classList.remove("selected");
                            }
                            this.classList.add("selected");
                            selectedNum = this;
                            updateMove();

                        }

                    }
                })
            }
        }

        function startGame() {
            //Choose board difficulty
            let board;
            //Uncomment the temp variables if you want the solution at the start of the game
            //let temp;
            if (id("diff-1").checked) {
                board = easy[0];
                //temp = easy[1];
            } else if (id("diff-2").checked) {
                board = medium[0];
                //temp= medium[1];
            } else if (id("diff-3").checked) {
                board = hard[0];
                //temp =hard[1];
            } else {
                board = expert[0];
                //temp= expert[1];
            }
            //Creates board based on difficulty
            disableSelect = false;
            generateBoard(board);
           // alert(temp);
            startTimer();

            if (id("theme-1").checked) {
                qs("body").classList.remove("dark");

            } else {
                qs("body").classList.add("dark");

            }
            id("number-container").classList.remove("hidden");
        }
        function startTimer() {
            //Sets time 
            timeRemaining = 0;
            id("timer").textContent = timeConversion(timeRemaining);
            timer = setInterval(function () {
                timeRemaining++;
                id("timer").textContent = timeConversion(timeRemaining);
            }, 1000)
        }


        function timeConversion(time) {
            //Seconds to MM::SS string
            let minutes = Math.floor(time / 60);
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            let seconds = time % 60;
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return minutes + ":" + seconds
        }

        function generateBoard(board) {
            //Clear previous boards
            clearPrevious();
            id("message").textContent = "";
            //Create 81 tiles
            let idCount = 0;
            for (let i = 0; i < 81; i++) {
                let tile = document.createElement("p");
                if (board.charAt(i) != "-") {
                    tile.textContent = board.charAt(i);
                } else {
                    //Add click event listener to tile
                    tile.addEventListener("click", function () {
                        if (!disableSelect) {
                            if(tile.classList.contains("selected")){
                                tile.classList.remove("selected");
                                selectedTile=null;
                            }else{
                                for(let i=0; i<81; i++){
                                    qsa(".tile")[i].classList.remove("selected");
                                }
                                tile.classList.add("selected");
                                selectedTile=tile;
                                updateMove();
                            }
                        }

                    })
                }
                tile.id = idCount;
                idCount++;
                tile.classList.add("tile");
                if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
                    tile.classList.add("bottomBorder");
                }
                if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
                    tile.classList.add("rightBorder");
                }

                id("board").appendChild(tile);

            }

        }
        function updateMove(){
            if(selectedTile && selectedNum){
                selectedTile.textContent = selectedNum.textContent;
            }
            let tiles = qsa(".tile");
            selectedNum.classList.remove("selected");

            selectedNum= null;
            
            
            if(correctPuzzleCheck(tiles)){
                endgame();
            }


        }

        function endgame(){
            console.log("Endo");
            disableSelect = true;
            let finishedTime = timer.textContent;
            clearTimeout(timer);
            id("message").textContent= "Complete!";
            id("timer").textContent="Time taken: " + finishedTime;

        }
    
        function correctPuzzleCheck(tile){
            let solution;
            if (id("diff-1").checked) {
                solution = easy[1];
            } else if (id("diff-2").checked) {
                solution = medium[1];
            } else if (id("diff-3").checked) {
                solution = hard[1];
            } else {
                solution = expert[1];
            }
            let idCount = 0;
            let s ="";
            for (let i = 0; i < 81; i++) {
                s+= tile[i].textContent;
                
            
            }
            console.log(s.split(" ").join(""));
            console.log("\n");
            console.log(solution);
            s= s.split(" ").join("");
            if(s === solution){
                //VICTORY
                alert("victory");
                console.log("VICTORY");
                return true;
            }else{
                return false;
            }

        }

        function clearPrevious() {
            //Access all of the tiles
            let tiles = qsa(".tile");
            //Remove each tile
            for (let i = 0; i < tiles.length; i++) {
                tiles[i].remove();
            }
            //If there is a timer, then clear
            if (timer) {
                clearTimeout(timer);
            }
            //Deselect any numbers
            for (let i = 0; i < id("number-container").children.length; i++) {
                id("number-container").children[i].classList.remove("selected");
            }
            //Clear selected variables
            selectedTile = null;
            selectedNum = null;
        }

        function qs(selector) {
            return document.querySelector(selector);
        }

        function qsa(selector) {
            return document.querySelectorAll(selector);
        }
        function id(id) {
            return document.getElementById(id);
        }
    }, { "sudoku-gen": 5 }], 2: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.BASE_LAYOUT = void 0;
        exports.BASE_LAYOUT = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [9, 10, 11, 12, 13, 14, 15, 16, 17],
            [18, 19, 20, 21, 22, 23, 24, 25, 26],
            [27, 28, 29, 30, 31, 32, 33, 34, 35],
            [36, 37, 38, 39, 40, 41, 42, 43, 44],
            [45, 46, 47, 48, 49, 50, 51, 52, 53],
            [54, 55, 56, 57, 58, 59, 60, 61, 62],
            [63, 64, 65, 66, 67, 68, 69, 70, 71],
            [72, 73, 74, 75, 76, 77, 78, 79, 80],
        ];

    }, {}], 3: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.DIFFICULTY_LEVELS = void 0;
        const DIFFICULTY_RECORD = {
            easy: undefined,
            medium: undefined,
            hard: undefined,
            expert: undefined,
        };
        exports.DIFFICULTY_LEVELS = Object.keys(DIFFICULTY_RECORD);

    }, {}], 4: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.SEEDS = void 0;
        exports.SEEDS = [
            {
                puzzle: 'g--d--caf---g----ii-f--hg-bb-iaedhgc--afcg--d-g-b-----f-d--abc---b------c--h-bfia',
                solution: 'gbhdiecafacegbfdhiidfcahgebbfiaedhgcehafcgibddgcbhiafefidegabchhabifcedgceghdbfia',
                difficulty: 'easy',
            },
            {
                puzzle: 'bf-hiac-g-gi------a-hf-g---g-a-fi--ddef---i-b--b-a-g-ff---gbh--hac---------e-cfd-',
                solution: 'bfdhiacegegicbdafhachfegdbighabfiecddefgchiabcibdaeghffdeagbhichacidfbgeibgehcfda',
                difficulty: 'easy',
            },
            {
                puzzle: 'hgad-e--b-cbf-ge---df-aih-----i-------d-ecai-g---fa----igadf----fe-i-----h-eg-fd-',
                solution: 'hgadceifbicbfhgeadedfbaihcgcahibdgeffbdgecaihgeihfadbcbigadfchedfecihbgaahcegbfdi',
                difficulty: 'easy',
            },
            {
                puzzle: '-fbe-c----e-----a---g-ihb--gb-fhdc-eid-g-eahbch-----f-----ef-ga-g----e-i--hi-----',
                solution: 'afbegcidhheidfbgacdcgaihbefgbafhdcieidfgceahbchebaidfgbidcefhgafgchdaebieahibgfcd',
                difficulty: 'easy',
            },
            {
                puzzle: 'c--d-fgeb---g--i-hg-ih--da-a-g-b-cde-edc--a--b--------i-e-cd-ha-fb-h-e-ch--e-----',
                solution: 'cahdifgebedfgabichgbihecdafahgfbicdefedcghabibicadehfgigebcdfhadfbihaegchcaefgbid',
                difficulty: 'easy',
            },
            {
                puzzle: 'bi---ec--eg--h-fbdf--------i-hba-dfe----ehbig--bf-d-h--f-e-a-c-----g-e--cde--f--a',
                solution: 'bidgfecahegcahifbdfhadcbgeiichbagdfedafcehbiggebfidahchfgedaicbabihgcedfcdeibfhga',
                difficulty: 'easy',
            },
            {
                puzzle: '-----ef-ha--bf--ecfe-gc---a----gbch--a--df-b--bi----f-h-af-gidbdf----g--i--c--ha-',
                solution: 'bicdaefghahgbfidecfedgchbiaedfagbchicahidfebggbiehcafdhcafegidbdfbhiagceigecbdhaf',
                difficulty: 'easy',
            },
            {
                puzzle: '--fg--hec-ebc-------h-dfgabb--h-a-fg-g-df-i--f-a---b--hf----ad---if----hc-ea---bi',
                solution: 'dafgbihecgebcahdifichedfgabbidhcaefgegcdfbihafhaigebcdhfgbicadeabifedcghcdeahgfbi',
                difficulty: 'easy',
            },
            {
                puzzle: '-----b-f-e-aih----bi----a----e---i---g-bf--a-----cihg-ic-fdhg-a--h---f-cgef-iad-b',
                solution: 'dhcgabefiefaihcbdgbigdefachcaehgdibfhgibfecadfbdacihgeicbfdhgeaadhebgficgefciadhb',
                difficulty: 'easy',
            },
            {
                puzzle: 'e--f-b-------eid-f--h----b-ge-c-fadhab-ihgfe-hc--d----d-g---cf---eg--h-bf---i----',
                solution: 'edcfgbihabgaheidcfifhdcaebggeicbfadhabdihgfechcfadebgidigbahcfecaegfdhibfhbeicgad',
                difficulty: 'easy',
            },
            {
                puzzle: 'g-hedcf---i-f--a--e--a-----c--i-deh-i-------g--g--e---a----f--c-cf-e-gi-b-------e',
                solution: 'gahedcfbidicfbgaehefbaihcgdcbaigdehfihebfadcgfdghceiabaeighfbdchcfdebgiabgdcaihfe',
                difficulty: 'medium',
            },
            {
                puzzle: '-di--ac---b-cid-h---h--b-d-----f----h-d----fca---c-i--d----i-e-bh---cd-g-g---fac-',
                solution: 'fdighacbeebgcidfhacahfebgdigecifhbadhidabgefcafbdceighdcabgihefbhfeacdigigehdfacb',
                difficulty: 'medium',
            },
            {
                puzzle: '--ac-i------ah-d---e----i---a-e-bc----g--f--ad---gae--ig-fa------hd-e-g-c-d-b----',
                solution: 'hdaceigfbbifahgdcegecbfdiahfaiedbchgehgicfbdadcbhgaeifigefachbdabhdiefgccfdgbhaei',
                difficulty: 'medium',
            },
            {
                puzzle: 'fg----i---h--f-e--e-bd--afh-f--hg--ic------b----f-c-----c-------eiac-gdf-b-----e-',
                solution: 'fgaebhicdihdcfaegbecbdgiafhdfebhgcaicahidefbgbigfacdhegdchefbiaheiacbgdfabfgidhec',
                difficulty: 'medium',
            },
            {
                puzzle: '--d-g-fi---e-ci-d-a----eg-----i---f---bg--ec-e--d--haig----f----ha--------ch-g-e-',
                solution: 'cbdaghfiehgefciadbaifbdeghcdahiecbfgifbghaecdecgdfbhaigeicafdbhbhaeidcgffdchbgiea',
                difficulty: 'medium',
            },
            {
                puzzle: '----d-a---a-ie---di------h-d-e--cg-b-b-e--i----c-i--dh--h-gf--c------b-g--i-ce-a-',
                solution: 'ehfcdgabicabiehfgdigdfbachediehacgfbhbgefdicaafcgibedhbehagfdicfcadhibeggdibcehaf',
                difficulty: 'medium',
            },
            {
                puzzle: '---cfa-ibf---i-------g---f--i--h-cd-gdf--------cd--fb-------bc--gb---dhi---he--g-',
                solution: 'dhecfagibfbgeidhaccaigbhefdbiafhecdggdfbaciehhecdgifbaafhidgbceegbacfdhiicdhebagf',
                difficulty: 'medium',
            },
            {
                puzzle: 'a------g-b--di-a-f--e--ahi----a------bae--------ichbaei---de------c-igd-d-h----ci',
                solution: 'aidhefcgbbhgdicaeffcebgahidheiabgdfccbaefdihggdfichbaeiacgdefbhefbchigdadghfabeci',
                difficulty: 'medium',
            },
            {
                puzzle: '----g-------ci--bg-i-de-af-------beh-----fgdi---eb-f----ah--ig---hg-d---cd--a----',
                solution: 'hacfgbdieefdciahbggibdehafcagfidcbehbceahfgdidhiebgfcafbahceigdiehgfdcabcdgbaiehf',
                difficulty: 'medium',
            },
            {
                puzzle: 'gfbc---dh-a-------d--a--fi--daifc--ech------f-------c-f---e--b---d-----i--igh-d--',
                solution: 'gfbcieadhiahbdfcegdceaghfibbdaifcghechgebdiafeifhagbcdfgcdeihbahbdfcaegiaeighbdfc',
                difficulty: 'medium',
            },
            {
                puzzle: '-e-fh--a-g----ed---a--b-f---ih----dc--------a----g----b---i---dhc-gf-----g------e',
                solution: 'debfhciagghfiaedcbcaidbgfehaihbefgdcfbgcdiehaedchgabifbfaeihcgdhcegfdabiigdacbhfe',
                difficulty: 'hard',
            },
            {
                puzzle: '----i-b---fc--a-h-eb----i-fcieg--ad---hd-e----d--a----f---b-e-i-------b--h--e----',
                solution: 'hageifbcdifcbdagheebdchgiafciegfbadhaghdcefibbdfiahcegfcahbdegideifgchbaghbaeidfc',
                difficulty: 'hard',
            },
            {
                puzzle: '-------hg-----h-d-a-g---ei--ce--dg--dbf---------bfid--hg---f----d--h---c--a-eg---',
                solution: 'bedfiachgficeghbdaahgdbceificehadgfbdbfgceiahgahbfidcehgbcdfaeiediahbfgccfaieghbd',
                difficulty: 'hard',
            },
            {
                puzzle: 'h---f------------i--e---a-h-dhe---a---fh-b----i--c---gf-ga-di--a-i---d-bce------a',
                solution: 'hgcifabdedabgehfciifebdcaghbdheigcafgcfhabeideiadcfhbgfbgahdiecahicgedfbcedfbigha',
                difficulty: 'hard',
            },
            {
                puzzle: 'f----dha----b------a------dic---h------c--egb-----------a-----ed--f-ec-g-fg------',
                solution: 'febigdhachdcbfageigaiehcbfdicegbhadfahfcdiegbbgdaefichcbadigfhedihfaecbgefghcbdia',
                difficulty: 'hard',
            },
            {
                puzzle: 'c-a---i---b--c--ede----g--c-e---dga--c---b--i--gf-----b-----ei------a-cg--ie----a',
                solution: 'cfahdeigbgbhacifedeidbfgahchebcidgafacfgebhdiidgfahcbebacdgfeihfheibadcgdgiehcbfa',
                difficulty: 'hard',
            },
            {
                puzzle: '--a-i---cc-g-------h--e--a--a---ib---d--f--h-----------i---d-f------g-c-dg---b--h',
                solution: 'beagifhdccfghdaibeihdbecfaghafcgibedgdbafechiecidbhagfaihecdgfbfbeihgdcadgcfabeih',
                difficulty: 'hard',
            },
            {
                puzzle: 'i--f--ec------a-fbg-b-i---h-d---ihg-----b---fe---a------d-----i---ie-b-------g---',
                solution: 'iahfdbecgdcehgaifbgfbeicdahbdacfihgechgdbeaifeifgahcbdhbdacfgeifgciedbhaaeibhgfdc',
                difficulty: 'hard',
            },
            {
                puzzle: '--e---c------i--g-------d-hbaf--------cfhe--ie------f-h-d-c-----f-h----c---i-ga--',
                solution: 'fdegbhciaacheidfgbibgcfadehbafdgihcedgcfhebaiehibacgfdhidacfebggfahebidccebidgahf',
                difficulty: 'hard',
            },
            {
                puzzle: '--f-d-i---g--b-a-d--c-a-----c-i---e---eh--g---------ac---------b---i-e----gf--d--',
                solution: 'abfcdhigehgiebfacddecgaibhfgcdifahebfaehcbgdiihbdegfacefabgdcihbdhaicefgcigfhedba',
                difficulty: 'hard',
            },
            {
                puzzle: '-ica------------bh----g--f--g---a---i-e----c-a---f------d--bg------c---e-fg----id',
                solution: 'ficabhdeggeaidfcbhdhbegcifabgfceahdiidebhgacfachdfiegbeadfibghchbigcdfaecfghaebid',
                difficulty: 'expert',
            },
            {
                puzzle: '-h-i------i---------f--bh--b---a--ed-ca------i--f---h--------c----he--f-ab--df---',
                solution: 'ehbicdgafdigafhcbecafegbhdibghcaifedfcadheigbiedfbgahchfebiadcggdihecbfaabcgdfeih',
                difficulty: 'expert',
            },
            {
                puzzle: '-h--c-f-ice-------b--ia--------g-h------e---ff--h---i----b---eh----------ga--f--c',
                solution: 'ahgdcefbiceigfbahdbfdiahcgediefgchabgbhaeidcffachbdeigicfbdagehedbchgifahgaeifbdc',
                difficulty: 'expert',
            },
            {
                puzzle: 'a----db---g-c----f--e-f--i---------i----h-f-d--g---ch---b--e-c-ca------h-d-------',
                solution: 'afchidbegigdcebhafhbegfadicfehdgcabibcaehifgddigbafcheghbfdeicacafibgedhediachgfb',
                difficulty: 'expert',
            },
            {
                puzzle: '------c--g-b--a---------g-h---e----gb--id-----i-f---eb----i---c-he-f-d--a------h-',
                solution: 'edhbgicfagfbchaeidicadefgbhhafebcidgbegidhacfdicfaghebfgdhiebaccheafbdgiabigcdfhe',
                difficulty: 'expert',
            },
            {
                puzzle: '---bf-i-------hc-aa----------g------h--c-e----i----bh----f---g--f-----e---hig-a--',
                solution: 'chebfaidgfgdeihcbaabidcgefhbeghdifachafcbegiddicgafbheicafedhgbgfbahcdeiedhigbacf',
                difficulty: 'expert',
            },
            {
                puzzle: '--c-----d---g-i--h-i----b--ace------d--bh----b--f---------e---------bea--d--a--c-',
                solution: 'gecabhifdfbagdicehhidefcbgaaceigdhbfdgfbheaicbhifcagdeiagcefdhbcfhdibeagedbhagfci',
                difficulty: 'expert',
            },
            {
                puzzle: '-----d-h--h-----a-gb------i-----a--g----eh-c--i--d-----ge---a--d----f-----ab--i--',
                solution: 'iacefdghbehdgibcafgbfhacedicehfbadigfdgiehbcaaibcdgfehbgedhiafcdciagfhbehfabceigd',
                difficulty: 'expert',
            },
            {
                puzzle: '-bi-------c----e---------af---eba-----a-i-g------c--i----h-e--d-e------gc-b--f---',
                solution: 'fbiaegdhcachdfbegiedgchibafgicebafdhbhafidgcedfegchaibiafhgecbdhedbacifgcgbidfhea',
                difficulty: 'expert',
            },
            {
                puzzle: '---i--h-bc----b----g----a----gd-----e--h-f------b---ac-c------ha-----id--i--gd---',
                solution: 'deficahgbchagfbdeibgiedhacffagdicbheebchafgididhbegfacgcdabiefhafbcheidghiefgdcba',
                difficulty: 'expert',
            },
        ];

    }, {}], 5: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getSudoku = void 0;
        var get_sudoku_util_1 = require("./utils/get-sudoku.util");
        Object.defineProperty(exports, "getSudoku", { enumerable: true, get: function () { return get_sudoku_util_1.getSudoku; } });

    }, { "./utils/get-sudoku.util": 6 }], 6: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getSudoku = void 0;
        const base_layout_constant_1 = require("../constants/base-layout.constant");
        const difficulty_levels_constant_1 = require("../constants/difficulty-levels.constant");
        const get_layout_util_1 = require("./layout/get-layout.util");
        const get_seed_util_1 = require("./seed/get-seed.util");
        const get_sequence_util_1 = require("./helper/get-sequence.util");
        const get_token_map_util_1 = require("./token/get-token-map.util");
        const seeds_constant_1 = require("../constants/seeds.constant");
        const validate_difficulty_util_1 = require("./validate/validate-difficulty.util");
        const getSudoku = (difficulty) => {
            if (difficulty && !validate_difficulty_util_1.validateDifficulty(difficulty)) {
                throw new Error(`Invalid difficulty, expected one of: ${difficulty_levels_constant_1.DIFFICULTY_LEVELS.join(', ')}`);
            }
            const seed = get_seed_util_1.getSeed(seeds_constant_1.SEEDS, difficulty);
            const layout = get_layout_util_1.getLayout(base_layout_constant_1.BASE_LAYOUT);
            const tokenMap = get_token_map_util_1.getTokenMap();
            const puzzle = get_sequence_util_1.getSequence(layout, seed.puzzle, tokenMap);
            const solution = get_sequence_util_1.getSequence(layout, seed.solution, tokenMap);
            return {
                puzzle,
                solution,
                difficulty: seed.difficulty,
            };
        };
        exports.getSudoku = getSudoku;

    }, { "../constants/base-layout.constant": 2, "../constants/difficulty-levels.constant": 3, "../constants/seeds.constant": 4, "./helper/get-sequence.util": 9, "./layout/get-layout.util": 13, "./seed/get-seed.util": 25, "./token/get-token-map.util": 27, "./validate/validate-difficulty.util": 28 }], 7: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.boardToSequence = void 0;
        const boardToSequence = (board) => board.map((row) => row.join('')).join('');
        exports.boardToSequence = boardToSequence;

    }, {}], 8: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getRandomItem = void 0;
        const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
        exports.getRandomItem = getRandomItem;

    }, {}], 9: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getSequence = void 0;
        const board_to_sequence_util_1 = require("./board-to-sequence.util");
        const populate_layout_util_1 = require("../layout/populate-layout.util");
        const replace_tokens_util_1 = require("./replace-tokens.util");
        const getSequence = (layout, seedSequence, tokenMap) => board_to_sequence_util_1.boardToSequence(populate_layout_util_1.populateLayout(layout, replace_tokens_util_1.replaceTokens(seedSequence, tokenMap)));
        exports.getSequence = getSequence;

    }, { "../layout/populate-layout.util": 14, "./board-to-sequence.util": 7, "./replace-tokens.util": 10 }], 10: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.replaceTokens = void 0;
        const replaceTokens = (sequence, tokenMap) => sequence
            .split('')
            .map((token) => tokenMap[token] || token)
            .join('');
        exports.replaceTokens = replaceTokens;

    }, {}], 11: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.sortRandom = void 0;
        const sortRandom = () => (Math.random() < 0.5 ? 1 : -1);
        exports.sortRandom = sortRandom;

    }, {}], 12: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getLayoutBands = void 0;
        const getLayoutBands = (layout) => [
            [layout[0], layout[1], layout[2]],
            [layout[3], layout[4], layout[5]],
            [layout[6], layout[7], layout[8]],
        ];
        exports.getLayoutBands = getLayoutBands;

    }, {}], 13: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getLayout = void 0;
        const rotate_layout_util_1 = require("./rotate-layout.util");
        const shuffle_layout_util_1 = require("./shuffle-layout.util");
        const getLayout = (baseLayout) => shuffle_layout_util_1.shuffleLayout(rotate_layout_util_1.rotateLayout(baseLayout));
        exports.getLayout = getLayout;

    }, { "./rotate-layout.util": 19, "./shuffle-layout.util": 24 }], 14: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.populateLayout = void 0;
        const populateLayout = (layout, sequence) => layout.map((row) => row.map((cell) => sequence[cell]));
        exports.populateLayout = populateLayout;

    }, {}], 15: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.rotateLayout0 = void 0;
        const rotateLayout0 = (layout) => layout;
        exports.rotateLayout0 = rotateLayout0;

    }, {}], 16: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.rotateLayout180 = void 0;
        const rotateLayout180 = (layout) => layout.map((row) => [...row].reverse()).reverse();
        exports.rotateLayout180 = rotateLayout180;

    }, {}], 17: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.rotateLayout270 = void 0;
        const rotateLayout270 = (layout) => layout[0].map((_row, index) => layout.map((row) => [...row].reverse()[index]));
        exports.rotateLayout270 = rotateLayout270;

    }, {}], 18: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.rotateLayout90 = void 0;
        const rotateLayout90 = (layout) => layout[0].map((_row, index) => layout.map((row) => row[index]).reverse());
        exports.rotateLayout90 = rotateLayout90;

    }, {}], 19: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.rotateLayout = void 0;
        const get_random_item_util_1 = require("../helper/get-random-item.util");
        const rotate_layout_0_util_1 = require("./rotate-layout-0.util");
        const rotate_layout_180_util_1 = require("./rotate-layout-180.util");
        const rotate_layout_270_util_1 = require("./rotate-layout-270.util");
        const rotate_layout_90_util_1 = require("./rotate-layout-90.util");
        const rotateLayout = (layout) => get_random_item_util_1.getRandomItem([rotate_layout_0_util_1.rotateLayout0, rotate_layout_90_util_1.rotateLayout90, rotate_layout_180_util_1.rotateLayout180, rotate_layout_270_util_1.rotateLayout270])(layout);
        exports.rotateLayout = rotateLayout;

    }, { "../helper/get-random-item.util": 8, "./rotate-layout-0.util": 15, "./rotate-layout-180.util": 16, "./rotate-layout-270.util": 17, "./rotate-layout-90.util": 18 }], 20: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.shuffleLayoutBands = void 0;
        const get_layout_bands_util_1 = require("./get-layout-bands.util");
        const sort_random_util_1 = require("../helper/sort-random.util");
        const shuffleLayoutBands = (layout) => get_layout_bands_util_1.getLayoutBands(layout).sort(sort_random_util_1.sortRandom).flat();
        exports.shuffleLayoutBands = shuffleLayoutBands;

    }, { "../helper/sort-random.util": 11, "./get-layout-bands.util": 12 }], 21: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.shuffleLayoutColumns = void 0;
        const rotate_layout_270_util_1 = require("./rotate-layout-270.util");
        const rotate_layout_90_util_1 = require("./rotate-layout-90.util");
        const shuffle_layout_rows_util_1 = require("./shuffle-layout-rows.util");
        const shuffleLayoutColumns = (layout) => rotate_layout_270_util_1.rotateLayout270(shuffle_layout_rows_util_1.shuffleLayoutRows(rotate_layout_90_util_1.rotateLayout90(layout)));
        exports.shuffleLayoutColumns = shuffleLayoutColumns;

    }, { "./rotate-layout-270.util": 17, "./rotate-layout-90.util": 18, "./shuffle-layout-rows.util": 22 }], 22: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.shuffleLayoutRows = void 0;
        const get_layout_bands_util_1 = require("./get-layout-bands.util");
        const sort_random_util_1 = require("../helper/sort-random.util");
        const shuffleLayoutRows = (layout) => get_layout_bands_util_1.getLayoutBands(layout)
            .map((rows) => rows.sort(sort_random_util_1.sortRandom))
            .flat();
        exports.shuffleLayoutRows = shuffleLayoutRows;

    }, { "../helper/sort-random.util": 11, "./get-layout-bands.util": 12 }], 23: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.shuffleLayoutStacks = void 0;
        const rotate_layout_270_util_1 = require("./rotate-layout-270.util");
        const rotate_layout_90_util_1 = require("./rotate-layout-90.util");
        const shuffle_layout_bands_util_1 = require("./shuffle-layout-bands.util");
        const shuffleLayoutStacks = (layout) => rotate_layout_270_util_1.rotateLayout270(shuffle_layout_bands_util_1.shuffleLayoutBands(rotate_layout_90_util_1.rotateLayout90(layout)));
        exports.shuffleLayoutStacks = shuffleLayoutStacks;

    }, { "./rotate-layout-270.util": 17, "./rotate-layout-90.util": 18, "./shuffle-layout-bands.util": 20 }], 24: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.shuffleLayout = void 0;
        const shuffle_layout_bands_util_1 = require("./shuffle-layout-bands.util");
        const shuffle_layout_columns_util_1 = require("./shuffle-layout-columns.util");
        const shuffle_layout_rows_util_1 = require("./shuffle-layout-rows.util");
        const shuffle_layout_stacks_util_1 = require("./shuffle-layout-stacks.util");
        const shuffleLayout = (layout) => shuffle_layout_columns_util_1.shuffleLayoutColumns(shuffle_layout_rows_util_1.shuffleLayoutRows(shuffle_layout_stacks_util_1.shuffleLayoutStacks(shuffle_layout_bands_util_1.shuffleLayoutBands(layout))));
        exports.shuffleLayout = shuffleLayout;

    }, { "./shuffle-layout-bands.util": 20, "./shuffle-layout-columns.util": 21, "./shuffle-layout-rows.util": 22, "./shuffle-layout-stacks.util": 23 }], 25: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getSeed = void 0;
        const get_random_item_util_1 = require("../helper/get-random-item.util");
        const get_seeds_by_difficulty_util_1 = require("./get-seeds-by-difficulty.util");
        const getSeed = (seeds, difficulty) => get_random_item_util_1.getRandomItem(get_seeds_by_difficulty_util_1.getSeedsByDifficulty(seeds, difficulty));
        exports.getSeed = getSeed;

    }, { "../helper/get-random-item.util": 8, "./get-seeds-by-difficulty.util": 26 }], 26: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getSeedsByDifficulty = void 0;
        const getSeedsByDifficulty = (seeds, difficulty) => seeds.filter((seed) => !difficulty || seed.difficulty === difficulty);
        exports.getSeedsByDifficulty = getSeedsByDifficulty;

    }, {}], 27: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getTokenMap = void 0;
        const sort_random_util_1 = require("../helper/sort-random.util");
        const getTokenMap = () => 'abcdefghi'
            .split('')
            .sort(sort_random_util_1.sortRandom)
            .reduce((acc, token, index) => ({
                ...acc,
                [token]: String(index + 1),
            }), {});
        exports.getTokenMap = getTokenMap;

    }, { "../helper/sort-random.util": 11 }], 28: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.validateDifficulty = void 0;
        const difficulty_levels_constant_1 = require("../../constants/difficulty-levels.constant");
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        const validateDifficulty = (difficulty) => difficulty_levels_constant_1.DIFFICULTY_LEVELS.includes(difficulty);
        exports.validateDifficulty = validateDifficulty;

    }, { "../../constants/difficulty-levels.constant": 3 }]
}, {}, [1]);
