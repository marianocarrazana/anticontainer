(function() {
    try {
        var ogI = responseText.match(/<meta property="og:image" content="(.+?)"/i),
            type = responseText.match(/<meta property="og:type" content="(?:.+?:)?(.+?)"/i)[1],
            obj = responseText.match(/<script.*?type="application\/ld\+json">(.+?)<\/script>/i),
            url = null,
            name = null;
        if(!!obj && !!obj[1]) {
            obj = JSON.parse(obj[1]);
            var obT = typeof obj.image;
            if(obT === "string") {
                queueDownload(obj.image);
            }
            else if(obT === "object") {
                for(var i of obj.image["@list"])
                    queueDownload(i);
            }
            if(type === "video") {
                name = "tumblr_" + ogI[1].match(/\/tumblr_([a-zA-Z0-9]+)_frame/)[1];
                url = "https://www.tumblr.com/video_file/" + baseURL.match(/\/post\/([0-9]+)/)[1] + "/" + name;
                name = name + ".mp4";
            }
            else {
                throw new Error("Media not located in object.");
            }
        }
        else if(!!ogI && !!ogI[1]) {
            url = ogI[1];
        }
        else {
            throw new Error("Media not located in page.");
        }
        setURL(url, name);
    }
    catch (e) { log(e.message); }
    finally { finish(); }
})();