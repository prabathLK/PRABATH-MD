class Bard {
    static JSON = "json";
    static MD = "markdown";

    // ID derived from Cookie
    SNlM0e;

    // HTTPS Headers
    #headers;

    // Resolution status of initialization call
    #initPromise;

    #bardURL = "https://bard.google.com";

    // Wether or not to log events to console
    #verbose = false;

    // Fetch function
    #fetch = fetch;

    constructor(cookie, config) {
        // Register some settings
        if (config?.verbose == true) this.#verbose = true;
        if (config?.fetch) this.#fetch = config.fetch;

        // If a Cookie is provided, initialize
        if (cookie) {
            this.#initPromise = this.#init(cookie);
        } else {
            throw new Error("Please provide a Cookie when initializing Bard.");
        }
        this.cookie = cookie;
    }

    // You can also choose to initialize manually
    async #init(cookie) {
        this.#verbose && console.log("🚀 Starting intialization");

        // Assign headers
        this.#headers = {
            Host: "bard.google.com",
            "X-Same-Domain": "1",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            Origin: this.#bardURL,
            Referer: this.#bardURL,
            Cookie: (typeof cookie === "object") ? (Object.entries(cookie).map(([key, val]) => `${key}=${val};`).join("")) : ("__Secure-1PSID=" + cookie),
        };

        let responseText;
        // Attempt to retrieve SNlM0e
        try {
            this.#verbose &&
                console.log("🔒 Authenticating your Google account");
            responseText = await this.#fetch(this.#bardURL, {
                method: "GET",
                headers: this.#headers,
                credentials: "include",
            })
                .then((response) => response.text())
        } catch (e) {
            // Failure to get server
            throw new Error(
                "Could not fetch Google Bard. You may be disconnected from internet: " +
                e
            );
        }

        try {
            const SNlM0e = responseText.match(/SNlM0e":"(.*?)"/)[1];
            // Assign SNlM0e and return it
            this.SNlM0e = SNlM0e;
            this.#verbose && console.log("✅ Initialization finished\n");
            return SNlM0e;
        } catch {
            throw new Error(
                "Could not use your Cookie. Make sure that you copied correctly the Cookie with name __Secure-1PSID exactly. If you are sure your cookie is correct, you may also have reached your rate limit."
            );
        }
    }

    async #uploadImage(name, buffer) {
        this.#verbose && console.log("🖼️ Starting image processing");
        let size = buffer.byteLength;
        let formBody = [
            `${encodeURIComponent("File name")}=${encodeURIComponent([name])}`,
        ];

        try {
            this.#verbose &&
                console.log("💻 Finding Google server destination");
            let response = await this.#fetch(
                "https://content-push.googleapis.com/upload/",
                {
                    method: "POST",
                    headers: {
                        "X-Goog-Upload-Command": "start",
                        "X-Goog-Upload-Protocol": "resumable",
                        "X-Goog-Upload-Header-Content-Length": size,
                        "X-Tenant-Id": "bard-storage",
                        "Push-Id": "feeds/mcudyrk2a4khkz",
                    },
                    body: formBody,
                    credentials: "include",
                }
            );

            const uploadUrl = response.headers.get("X-Goog-Upload-URL");
            this.#verbose && console.log("📤 Sending your image");
            response = await this.#fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "X-Goog-Upload-Command": "upload, finalize",
                    "X-Goog-Upload-Offset": 0,
                    "X-Tenant-Id": "bard-storage",
                },
                body: buffer,
                credentials: "include",
            });

            const imageFileLocation = await response.text();

            this.#verbose && console.log("✅ Image finished working\n");
            return imageFileLocation;
        } catch (e) {
            throw new Error(
                "Could not fetch Google Bard. You may be disconnected from internet: " +
                e
            );
        }
    }

    // Query Bard
    async #query(message, config) {
        let formatMarkdown = (text, images) => {
            if (!images) return text;

            for (let imageData of images) {
                const formattedTag = `!${imageData.tag}(${imageData.url})`;
                text = text.replace(
                    new RegExp(`(?!\\!)\\[${imageData.tag.slice(1, -1)}\\]`),
                    formattedTag
                );
            }

            return text;
        }

        let { ids, imageBuffer } = config;

        // Wait until after init
        await this.#initPromise;

        this.#verbose && console.log("🔎 Starting Bard Query");

        // If user has not run init
        if (!this.SNlM0e) {
            throw new Error(
                "Please initialize Bard first. If you haven't passed in your Cookie into the class, run Bard.init(cookie)."
            );
        }

        this.#verbose && console.log("🏗️ Building Request");
        // HTTPS parameters
        const params = {
            bl: "boq_assistant-bard-web-server_20230711.08_p0",
            _reqID: ids?._reqID ?? "0",
            rt: "c",
        };

        // If IDs are provided, but doesn't have every one of the expected IDs, error
        const messageStruct = [
            [message],
            null,
            [null, null, null],
        ];

        if (imageBuffer) {
            let imageLocation = await this.#uploadImage(
                `bard-ai_upload`,
                imageBuffer
            );
            messageStruct[0].push(0, null, [
                [[imageLocation, 1], "bard-ai_upload"],
            ]);
        }

        if (ids) {
            const { conversationID, responseID, choiceID } = ids;
            messageStruct[2] = [conversationID, responseID, choiceID];
        }

        // HTTPs data
        const data = {
            "f.req": JSON.stringify([null, JSON.stringify(messageStruct)]),
            at: this.SNlM0e,
        };

        // URL that we are submitting to
        const url = new URL(
            "/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",
            this.#bardURL
        );

        // Append parameters to the URL
        for (const key in params) {
            url.searchParams.append(key, params[key]);
        }

        // Encode the data
        const formBody = Object.entries(data)
            .map(
                ([property, value]) =>
                    `${encodeURIComponent(property)}=${encodeURIComponent(
                        value
                    )}`
            )
            .join("&");

        this.#verbose && console.log("💭 Sending message to Bard");
        // Send the fetch request
        const chatData = await this.#fetch(url.toString(), {
            method: "POST",
            headers: this.#headers,
            body: formBody,
            credentials: "include",
        })
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                return JSON.parse(text.split("\n")[3])[0][2];
            })
            .then((rawData) => JSON.parse(rawData));

        this.#verbose && console.log("🧩 Parsing output");
        // Get first Bard-recommended answer
        const answer = chatData[4][0];

        // Text of that answer
        const text = answer[1][0];

        // Get data about images in that answer
        const images =
            answer[4]?.map((x) => ({
                tag: x[2],
                url: x[3][0][0],
                info: {
                    raw: x[0][0][0],
                    source: x[1][0][0],
                    alt: x[0][4],
                    website: x[1][1],
                    favicon: x[1][3],
                },
            })) ?? [];

        this.#verbose && console.log("✅ All done!\n");
        // Put everything together and return
        return {
            content: formatMarkdown(text, images),
            images: images,
            ids: {
                conversationID: chatData[1][0],
                responseID: chatData[1][1],
                choiceID: answer[0],
                _reqID: String(parseInt(ids?._reqID ?? 0) + 100000),
            },
        };
    }

    async #parseConfig(config) {
        let result = {
            useJSON: false,
            imageBuffer: undefined, // Returns as {extension, filename}
            ids: undefined,
        };

        // Verify that format is one of the two types
        if (config?.format) {
            switch (config.format) {
                case Bard.JSON:
                    result.useJSON = true;
                    break;
                case Bard.MD:
                    result.useJSON = false;
                    break;
                default:
                    throw new Error(
                        "Format can obly be Bard.JSON for JSON output or Bard.MD for Markdown output."
                    );
            }
        }

        // Verify that the image passed in is either a path to a jpeg, jpg, png, or webp, or that it is a Buffer
        if (config?.image) {
            if (
                config.image instanceof ArrayBuffer
            ) {
                result.imageBuffer = config.image;
            } else if (
                typeof config.image === "string" &&
                /\.(jpeg|jpg|png|webp)$/.test(config.image)
            ) {
                let fs;

                try {
                    fs = await import("fs")
                } catch {
                    throw new Error(
                        "Loading from an image file path is not supported in a browser environment.",
                    );
                }

                result.imageBuffer = fs.readFileSync(
                    config.image,
                ).buffer;
            } else {
                throw new Error(
                    "Provide your image as a file path to a .jpeg, .jpg, .png, or .webp, or a Buffer."
                );
            }
        }

        // Verify that all values in IDs exist
        if (config?.ids) {
            if (config.ids.conversationID && config.ids.responseID && config.ids.choiceID && config.ids._reqID) {
                result.ids = config.ids;
            } else {
                throw new Error(
                    "Please provide the IDs exported exactly as given."
                );
            }
        }
        return result;
    }

    // Ask Bard a question!
    async ask(message, config) {
        let { useJSON, imageBuffer, ids } = await this.#parseConfig(config);
        let response = await this.#query(message, { imageBuffer, ids });
        return useJSON ? response : response.content;
    }

    createChat(ids) {
        let bard = this;
        class Chat {
            ids = ids;

            async ask(message, config) {
                let { useJSON, imageBuffer } = await bard.#parseConfig(config);
                let response = await bard.#query(message, {
                    imageBuffer,
                    ids: this.ids,
                });
                this.ids = response.ids;
                return useJSON ? response : response.content;
            }

            export() {
                return this.ids;
            }
        }

        return new Chat();
    }
}

export default Bard;
