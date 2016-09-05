function include_keyword_replacement() {

    YouTubeLive.onChatLoaded(function (youtube) {
        var emote_map = {
            "ANELE": "👳",
            "AngelThump": "👼",
            "4Head": "😺",
            "BabyRage": "😨",
            "BudiRage": "😱",
            "BibleThump": "😭",
            "BrokeBack": "😝",
            "CedricSleeper": "💤",
            "CoolCat": "😎",
            "CryZer": "😿",
            "DatSheffy": "👮",
            "DansGame": "👿",
            "DansGino": "😾",
            "deIlluminati": "🔺",
            "EleGiggle": "😁",
            "FailColin": "😫",
            "FailFish": "😑",
            "FeelsAmazingMan": "😄",
            "FeelsAndreasMan": "🗿",
            "FeelsBadMan": "😖",
            "FeelsGoodMan": "🐸",
            "FrankerZ": "🐶",
            "GunnarRich": "💰",
            "haHAA": "😹",
            "HeyGuys": "🙋",
            "KAPOW": "💥",
            "KappaClaus": "🎅",
            "KappaNils": "😼",
            "KappaPride": "👬",
            "KappaRoss": "💂",
            "Keepo": "😏",
            "KKona": "👦",
            "Kreygasm": "😚",
            "Larsgasm": "😽",
            "LaserRage": "💢",
            "LUL": "😂",
            "MingLee": "🐯",
            "MrDestructoid": "📟",
            "MVGame": "😕",
            "NicenStein": "😸",
            "NotLikeGregor": "😵",
            "NotLikeThis": "🙈",
            "OhMyDog": "🐕",
            "OMGScoots": "📙",
            "OpieOP": "🍧",
            "panicBasket": "🔥",
            "PedoBear": "🐻",
            "PJSalt": "🍚",
            "PogChamp": "😯",
            "rbtv10": "💶",
            "rbtv50": "💷",
            "ZehnMarkFünfzig": "💶 💷",
            "rbtv64k": "💰",
            "rbtvApfelschorle": "🍺",
            "rbtvAvatar": "👤",
            "rbtvAwkward": "😅",
            "rbtvBastard": "🐵",
            "rbtvBohne": "🍆",
            "rbtvBudi": "😱",
            "rbtvChick": "🐥",
            "rbtvClown": "👺",
            "rbtvColin": "😫",
            "rbtvEddy": "💤",
            "rbtvFischkarte": "🐟",
            "rbtvGeier": "🐓",
            "rbtvGino": "😾",
            "rbtvGregor": "😵",
            "rbtvGunnar": "😅",
            "rbtvHannes": "😪",
            "rbtvHebel": "⤵",
            "rbtvHeMan": "👱",
            "rbtvKrogi": "😸",
            "rbtvKuchen": "🍰",
            "rbtvLars": "😽",
            "rbtvLaser": "💢",
            "rbtvLogo": "⬜",
            "rbtvMarco": "😿",
            "rbtvMTV": "⬛",
            "rbtvNils": "😼",
            "rbtvRoyalBudi": "😇",
            "rbtvRoyalEddy": "😣",
            "rbtvRoyalNils": "☺",
            "rbtvRoyalSimon": "😓",
            "rbtvSchroeck": "🎬",
            "rbtvSimon": "🙀",
            "rbtvSofia": "😮",
            "rbtvSupaa": "☝",
            "rbtvTim": "😙",
            "rbtvVogel": "🐦",
            "rbtvWombo": "🎉",
            "ResidentSleeper": "😴",
            "SchröckAction": "🎬",
            "SeemsGood": "👍",
            "SMOrc": "👹",
            "SMSkull": "💀",
            "SofiOh": "😮",
            "SoonerLater": "😶",
            "SwiftRage": "😠",
            "TTours": "📷",
            "TwitchRPG": "🔨",
            "VoHiYo": "💠",
            "VoteNay": "❌",
            "VoteYea": "⭕",
            "WutFace": "😧",
            "WutMon": "🙀"
        };

        var emotePattern = new RegExp(Object.keys(emote_map).join("|"));

        var textInput = youtube.getChatInputField();
        if (textInput) {
            textInput.addEventListener("keyup", function (event) {
                var replaced = false;
                var replacement = '';
                var whatWasReplaced = '';
                var theInnerHTML = textInput.innerHTML.replace(emotePattern, function (token) {
                    replaced = true;
                    whatWasReplaced = token;
                    replacement = emote_map[token];
                    return replacement;
                });
                if (replaced) {
                    var replacedPosition = textInput.innerText.indexOf(whatWasReplaced);
                    textInput.innerHTML = theInnerHTML;
                    setCaretPosition(textInput, replacedPosition + replacement.length);
                }
            });
        }
    });
}