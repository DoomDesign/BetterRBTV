// Non Chrome browsers: if sync is not available, redirect to local storage
if (!chrome.storage.sync) {
    chrome.storage.sync = chrome.storage.local;
}

// localization
$("*[data-i18n]").each(function (idx, elem) {
    elem.innerText = chrome.i18n.getMessage(elem.getAttribute("data-i18n"));
});

$("#select-pack").attr("value", chrome.i18n.getMessage("Opt_EmotePackButton"));
// END localization

// Saves options to chrome.storage.sync.
function save_options() {
    chrome.storage.sync.set({
        twitchKeywordReplacement: document.getElementById('keywords').checked,
        faceEmotes: document.getElementById('face-emotes').checked,
        suggestUser: document.getElementById('user-suggest').checked,
        suggestEmote: document.getElementById('emote-suggest').checked,
        recentEmotes: document.getElementById('recent-emotes').checked,
        hideAvatars: document.getElementById('hide-avatars').checked,
        coloredNames: document.getElementById('colored-names').checked,
        betterMentionHighlight: document.getElementById('better-mention-highlight').checked,
        pinnableMentions: document.getElementById('pinnable-mentions').checked,
        pushNotifications: document.getElementById('push-notifications').checked,
        soundNotifications: document.getElementById('sound-notifications').checked,
        lessVipHighlight: document.getElementById('less-vip-highlight').checked,
        betterSeperateMessages: document.getElementById('better-seperate-messages').checked,
        noGreenMemberAccent: document.getElementById('no-green-member-accent').checked,
        saveSpace: document.getElementById('save-space').checked,
        showTimestamp: document.getElementById('show-timestamp').checked,
        blockedTerms: {
            termString: document.getElementById('blocked-terms').value.trim(),
            isRegex: document.getElementById('blocked-terms-is-regex').checked
        }
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = chrome.i18n.getMessage("optionsSaved");
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(default_settings, function (items) {
        document.getElementById('keywords').checked = items.twitchKeywordReplacement;
        document.getElementById('face-emotes').checked = items.faceEmotes;
        document.getElementById('user-suggest').checked = items.suggestUser;
        document.getElementById('emote-suggest').checked = items.suggestEmote;
        document.getElementById('recent-emotes').checked = items.recentEmotes;
        document.getElementById('hide-avatars').checked = items.hideAvatars;
        document.getElementById('save-space').checked = items.saveSpace;
        document.getElementById('colored-names').checked = items.coloredNames;
        document.getElementById('better-mention-highlight').checked = items.betterMentionHighlight;
        document.getElementById('pinnable-mentions').checked = items.pinnableMentions;
        document.getElementById('push-notifications').checked = items.pushNotifications;
        document.getElementById('sound-notifications').checked = items.soundNotifications;
        document.getElementById('less-vip-highlight').checked = items.lessVipHighlight;
        document.getElementById('better-seperate-messages').checked = items.betterSeperateMessages;
        document.getElementById('no-green-member-accent').checked = items.noGreenMemberAccent;
        document.getElementById('show-timestamp').checked = items.showTimestamp;
        document.getElementById('blocked-terms').value = items.blockedTerms.termString;
        document.getElementById('blocked-terms-is-regex').checked = items.blockedTerms.isRegex;

        listFilteredUsers(items.ignoredUsers, "ignoredUsers", $("#no-muted-users"), $("#muted-users"));
        listFilteredUsers(items.highlightedUsers, "highlightedUsers", $("#no-highlighted-users"), $("#highlighted-users"));
        var jCustomHighlightInput = $("#add-custom-highlight-id");
        var customHighlightButton = $("#add-custom-highlight-button");

        customHighlightButton.click(function (e) {
            var theId = jCustomHighlightInput.val().trim();
            if (theId) {
                customHighlightButton.prop("disabled", true);
                chrome.storage.sync.get({highlightedUsers: []}, function (items) {
                    var updatedHighlightedUsers = items.highlightedUsers;
                    updatedHighlightedUsers.push({
                        name: "custom-added",
                        id: theId,
                        addedTime: Date.now()
                    });
                    chrome.storage.sync.set({highlightedUsers: updatedHighlightedUsers}, function () {

                        jCustomHighlightInput.val("");
                        customHighlightButton.prop("disabled", false);
                        listFilteredUsers(updatedHighlightedUsers, "highlightedUsers", $("#no-highlighted-users"), $("#highlighted-users"));
                    });
                });
            }
        });
    });
    showStoredEmotePack();
}

function listFilteredUsers(filteredUsersArray, storageKey, jNoUsersFiltered, jFilteredUsers) {
    if (filteredUsersArray.length) {
        jNoUsersFiltered.addClass("hid");
        jFilteredUsers.removeClass("hid");
        jFilteredUsers.empty();


        for (let i = 0; i < filteredUsersArray.length; i++) {
            let filteredUser = filteredUsersArray[i];
            let li = $("<li>");
            li.text(filteredUser.name + " (" + filteredUser.id + ") ");
            li.attr('data-yt-user-id', filteredUser.id);
            let btn = $('<button class="remove-user-button"></button>');
            btn.text(chrome.i18n.getMessage("filterListRemove"));
            btn.click(function (e) {
                let query = {};
                query[storageKey] = [];
                console.log(query);
                chrome.storage.sync.get(query, function (items) {
                    var updatedFilteredUsers = items[storageKey].filter(u => u.id != filteredUser.id);
                    let query = {};
                    query[storageKey] = updatedFilteredUsers;
                    chrome.storage.sync.set(query,
                        function () {
                            jFilteredUsers.find("li[data-yt-user-id='" + filteredUser.id + "']").remove();
                            if (!updatedFilteredUsers.length) {
                                jNoUsersFiltered.removeClass("hid");
                            }
                        }
                    );
                });
            });
            li.append(btn);
            jFilteredUsers.append(li);
        }
    }
}

function showStoredEmotePack() {
    chrome.storage.local.get('emotePack', function (items) {
        var pack = items.emotePack;
        var jEmotePackPreview = $('#emote-pack-preview');
        jEmotePackPreview.empty();
        if (pack == null) {
            document.getElementById('emote-pack-name').textContent = chrome.i18n.getMessage("noEmotePackInstalled");
        } else {
            for (let i = 0; i < pack.images.length; i++) {
                let img = pack.images[i];
                let emote = $('<span></span>');
                emote.addClass("emote-preview-unicode");
                emote.text(img.emote);
                jEmotePackPreview.append(emote).append(" = ");
                let jImg = $('<img>', {"width": img.width, "height": img.height, "src": "data:image/png;base64,"+img.base64});
                jEmotePackPreview.append(jImg).append(" ");
                if (i + 1 < pack.images.length) jEmotePackPreview.append(", ");
                //if (i % 4 == 3) preview += "<br/>";
            }
            $('#emote-pack-name').text(pack.name).append("<br>");
        }
    });
}

function readPending() {
    document.getElementById('file-error').textContent = '';
    document.getElementById('file-success').textContent = '';
    document.getElementById('select-pack').disabled = true;
}

function readError(error) {
    document.getElementById('file-error').textContent = error;
    console.error(error);
    loading_complete();
}

function readSuccess(msg) {
    document.getElementById('file-success').textContent = msg;
    loading_complete();
}

function saveImages(name, emoticons, images, image_dimensions) {
    var pack = {};
    pack.name = name;
    pack.images = [];
    for (var i = 0; i < images.length; i++) {
        pack.images.push({
            "emote": emoticons[i],
            "base64": images[i],
            "width": image_dimensions[i][0],
            "height": image_dimensions[i][1]
        });
    }
    chrome.storage.local.set({"emotePack": pack}, function () {
        showStoredEmotePack();
        readSuccess(chrome.i18n.getMessage("emotePackInstalled"));
    });
}

var untrustedChars = new RegExp("[\"'<>\\$\\(\\)&/\\?\\^\\*]|expression|url");

function loadEmotePack(fileName, fileContents) {
    JSZip.loadAsync(fileContents).then(function (zip) {
            var mapFile = zip.file("map.txt");

            if (mapFile == null) {
                readError(chrome.i18n.getMessage("emotePackNoMapTxt"));
                return;
            }

            mapFile.async("string").then(
                function (contents) {
                    var promises = [];
                    var emoticons = [];

                    var lines = contents.split('\n');
                    for (var i = 0; i < lines.length; i++) {
                        var parts = lines[i].trim().split(':');
                        if (parts.length != 2 || untrustedChars.test(parts[0])) {
                            readError(chrome.i18n.getMessage("emotePackMapTxtErrorInLine") + (i + 1));
                            return;
                        }


                        var emoticon = parts[0].trim();
                        var imageFileName = parts[1].trim();
                        if (!imageFileName.endsWith('.png')) {
                            readError(chrome.i18n.getMessage("emotePackNoSupport", imageFileName));
                            return;
                        }
                        emoticons.push(emoticon);
                        var zipFileImage = zip.file(imageFileName);
                        if (!zipFileImage) {
                            readError(chrome.i18n.getMessage("emotePackCantRead", imageFileName));
                            return;
                        }
                        promises.push(zipFileImage.async('base64'));
                    }


                    Promise.all(promises).then(
                        function (encoded_images) {
                            var images_dimension_promises = [];
                            for (var i = 0; i < encoded_images.length; i++) {
                                // get image dimensions
                                var img = new Image;
                                // boilerplate code to capture i and img at this moment
                                (function (i, img) {
                                    images_dimension_promises.push(new Promise(function (resolve, reject) {
                                        img.onload = function () {
                                            resolve([img.width, img.height])
                                        };
                                        img.src = "data:image;base64," + encoded_images[i];
                                    }));
                                })(i, img);
                            }

                            Promise.all(images_dimension_promises).then(
                                function (image_dimensions) {
                                    saveImages(fileName, emoticons, encoded_images, image_dimensions);
                                }
                            );
                        }, function (error_string) {
                            readError(error_string);
                            return;
                        })
                },
                function () {
                    readError(chrome.i18n.getMessage("emotePackCantReadMapTxt"));
                });
        },
        function () {
            readError(chrome.i18n.getMessage("emotePackCantUnzip"));
        });
}

function loading_complete() {
    document.getElementById('select-pack').disabled = false;
}
function choose_emote_pack(evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var file = evt.target.files[0];
        readPending();
        var reader = new FileReader();
        reader.onloadend = function () {
            if (reader.error != null) {
                readError(chrome.i18n.getMessage("emotePackErrorLoading") + reader.error);
            } else {
                loadEmotePack(file.name, reader.result);
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        document.getElementById('loading-spinner').textContent = chrome.i18n.getMessage("emotePackCantReadFile");
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('select-pack').addEventListener('change',
    choose_emote_pack);

$("#tabs").tabs();