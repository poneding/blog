'use strict';

var obsidian = require('obsidian');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var commands$3 = {
	"Format Document": "Dokument formatieren"
};
var editorMenu$3 = {
	"Format Document": "Dokument formatieren"
};
var noticeMessages$3 = {
	"Document Formatted!": "",
	"Document is already formatted!": "",
	"No open document is found.": "",
	"You can only format in editing mode.": "",
	"Please enter a valid number.\nIt must be at least 0.": "",
	"Please enter a valid number.\nIt must be a whole number.": ""
};
var optionWarnings$3 = {
	"Gap value must be a whole number and it needs to be at least 0.": ""
};
var placeholders$3 = {
	"(Default)": ""
};
var optionSections$3 = {
	"Heading gaps": "",
	"Other gaps": "",
	"Format options": "",
	"Other options": ""
};
var headingGaps$3 = {
	"Before top level headings": "",
	"Decides gaps before top level headings.": "",
	"Before first sub heading": "",
	"Decides child heading gaps right before parent headings.": "",
	"Before sub headings": "",
	"Decides gaps before headings that are not in the top level.": ""
};
var otherGaps$3 = {
	"After properties": "",
	"Decides the gap after the property section.": "",
	"Before contents": "",
	"Decides gaps before content sections. (ex: Text before headings)": "",
	"Before contents after code blocks": "",
	"Decides gaps before 'contents that are after code blocks.'": "",
	"Before code blocks": "",
	"Decides gaps before code blocks.": "",
	"Before code blocks after headings": "",
	"Decides gaps before 'code blocks that are after headings.'": ""
};
var formatOptions$3 = {
	"Newline at the end of a document": "",
	"Inserts a newline at the end of a document.": ""
};
var otherOptions$3 = {
	"Notify when no change is needed": "",
	"Displays a different message when no change is needed.": "",
	"Show more detailed error messages": "",
	"Displays additional information when parsing fails.": ""
};
var wasm$4 = {
	parsing: {
		"Failed to parse the document. [Line: {LINE_NUMBER}]": "",
		"Failed to parse the document.": ""
	},
	formatting: {
		"Failed to read options. Some of them are possibly not positive number values.": ""
	}
};
var de = {
	commands: commands$3,
	editorMenu: editorMenu$3,
	noticeMessages: noticeMessages$3,
	optionWarnings: optionWarnings$3,
	placeholders: placeholders$3,
	optionSections: optionSections$3,
	headingGaps: headingGaps$3,
	otherGaps: otherGaps$3,
	formatOptions: formatOptions$3,
	otherOptions: otherOptions$3,
	wasm: wasm$4
};

var commands$2 = {
	"Format Document": "Format Document"
};
var editorMenu$2 = {
	"Format Document": "Format Document"
};
var noticeMessages$2 = {
	"Document Formatted!": "Document Formatted!",
	"Document is already formatted!": "Document is already formatted!",
	"No open document is found.": "No open document is found.",
	"You can only format in editing mode.": "You can only format in editing mode.",
	"Please enter a valid number.\nIt must be at least 0.": "Please enter a valid number.\nIt must be at least 0.",
	"Please enter a valid number.\nIt must be a whole number.": "Please enter a valid number.\nIt must be a whole number."
};
var optionWarnings$2 = {
	"Gap value must be a whole number and it needs to be at least 0.": "Gap value must be a whole number and it needs to be at least 0."
};
var placeholders$2 = {
	"(Default)": "(Default)"
};
var optionSections$2 = {
	"Heading gaps": "Heading gaps",
	"Other gaps": "Other gaps",
	"Format options": "Format options",
	"Other options": "Other options"
};
var headingGaps$2 = {
	"Before top level headings": "Before top level headings",
	"Decides gaps before top level headings.": "Decides gaps before top level headings.",
	"Before first sub heading": "Before first sub heading",
	"Decides child heading gaps right before parent headings.": "Decides child heading gaps right before parent headings.",
	"Before sub headings": "Before sub headings",
	"Decides gaps before headings that are not in the top level.": "Decides gaps before headings that are not in the top level."
};
var otherGaps$2 = {
	"After properties": "After properties",
	"Decides the gap after the property section.": "Decides the gap after the property section.",
	"Before contents": "Before contents",
	"Decides gaps before content sections. (ex: Text before headings)": "Decides gaps before content sections. (ex: Text before headings)",
	"Before contents after code blocks": "Before contents after code blocks",
	"Decides gaps before 'contents that are after code blocks.'": "Decides gaps before 'contents that are after code blocks.'",
	"Before code blocks": "Before code blocks",
	"Decides gaps before code blocks.": "Decides gaps before code blocks.",
	"Before code blocks after headings": "Before code blocks after headings",
	"Decides gaps before 'code blocks that are after headings.'": "Decides gaps before 'code blocks that are after headings.'"
};
var formatOptions$2 = {
	"Newline at the end of a document": "Newline at the end of a document",
	"Inserts a newline at the end of a document.": "Inserts a newline at the end of a document."
};
var otherOptions$2 = {
	"Notify when no change is needed": "Notify when no change is needed",
	"Displays a different message when no change is needed.": "Displays a different message when no change is needed.",
	"Show more detailed error messages": "Show more detailed error messages",
	"Displays additional information when parsing fails.": "Displays additional information when parsing fails."
};
var wasm$3 = {
	parsing: {
		"Failed to parse the document. [Line: {LINE_NUMBER}]": "Failed to parse the document. [Line: {LINE_NUMBER}]",
		"Failed to parse the document.": "Failed to parse the document."
	},
	formatting: {
		"Failed to read options. Some of them are possibly not positive number values.": "Failed to read options. Some of them are possibly not positive number values."
	}
};
var en = {
	commands: commands$2,
	editorMenu: editorMenu$2,
	noticeMessages: noticeMessages$2,
	optionWarnings: optionWarnings$2,
	placeholders: placeholders$2,
	optionSections: optionSections$2,
	headingGaps: headingGaps$2,
	otherGaps: otherGaps$2,
	formatOptions: formatOptions$2,
	otherOptions: otherOptions$2,
	wasm: wasm$3
};

var commands$1 = {
	"Format Document": "Dokumentum formázása"
};
var editorMenu$1 = {
	"Format Document": "Dokumentum formázása"
};
var noticeMessages$1 = {
	"Document Formatted!": "A dokumentum meg lett formázva!",
	"Document is already formatted!": "A dokumentum már meg van formázva!",
	"No open document is found.": "Nem található megnyitott dokumentum.",
	"You can only format in editing mode.": "A formázás csakis a szerkesztői módban lehetséges. ",
	"Please enter a valid number.\nIt must be at least 0.": "Kérlek egy megfelelő számot írjál be.\nLegalább 0 legyen.",
	"Please enter a valid number.\nIt must be a whole number.": "Kérlek egy megfelelő számot írjál be.\nEgész szám legyen."
};
var optionWarnings$1 = {
	"Gap value must be a whole number and it needs to be at least 0.": ""
};
var placeholders$1 = {
	"(Default)": "(Alapértelmezett)"
};
var optionSections$1 = {
	"Heading gaps": "Fejléc hézagok",
	"Other gaps": "Egyéb hézagok",
	"Format options": "Formázási opciók",
	"Other options": "Egyéb opciók"
};
var headingGaps$1 = {
	"Before top level headings": "Fő címsorok előtt",
	"Decides gaps before top level headings.": "Meghatározza a hézag nagyságát a fő címsorok előtt.",
	"Before first sub heading": "Az első alcím előtt",
	"Decides child heading gaps right before parent headings.": "Meghatározza a gyerekcím hézagát közvetlenül a szülőcím előtt.",
	"Before sub headings": "Alcímek előtt",
	"Decides gaps before headings that are not in the top level.": "Meghatározza a nem fő címsorok előtti részeket"
};
var otherGaps$1 = {
	"After properties": "Tulajdonságok után",
	"Decides the gap after the property section.": "Meghatározza a hézagot a tulajdonságok szekció után.",
	"Before contents": "Tartalmak előtt",
	"Decides gaps before content sections. (ex: Text before headings)": "Meghatározza a hézagot a tartalmak előtt. (pl.: Szövegrész a címsorok előtt)",
	"Before contents after code blocks": "Tartalmak előtti kód részek",
	"Decides gaps before 'contents that are after code blocks.'": "Meghatározza azon tartalmi hézagokat, melyek kód részek előtt vannak.",
	"Before code blocks": "Kód részek előtt",
	"Decides gaps before code blocks.": "Meghatározza a hézagot kód részek előtt.",
	"Before code blocks after headings": "Kód részek előtt, a címsorok előtt",
	"Decides gaps before 'code blocks that are after headings.'": "Meghatározza azon kód részi hézagokat, melyek címsorok után vannak."
};
var formatOptions$1 = {
	"Newline at the end of a document": "Új sor a dokumentum végére.",
	"Inserts a newline at the end of a document.": "Beszúr egy új sort a dokumentum végére."
};
var otherOptions$1 = {
	"Notify when no change is needed": "Értesítsen, hogyha nem szükséges változás",
	"Displays a different message when no change is needed.": "Eltérő üzenetet mutat, hogyha nem történt változás",
	"Show more detailed error messages": "Mutasson részletesebb hiba üzeneteket",
	"Displays additional information when parsing fails.": "Plusz információt mutat, amikor az átírás közben hiba történik."
};
var wasm$2 = {
	parsing: {
		"Failed to parse the document. [Line: {LINE_NUMBER}]": "",
		"Failed to parse the document.": ""
	},
	formatting: {
		"Failed to read options. Some of them are possibly not positive number values.": ""
	}
};
var hu = {
	commands: commands$1,
	editorMenu: editorMenu$1,
	noticeMessages: noticeMessages$1,
	optionWarnings: optionWarnings$1,
	placeholders: placeholders$1,
	optionSections: optionSections$1,
	headingGaps: headingGaps$1,
	otherGaps: otherGaps$1,
	formatOptions: formatOptions$1,
	otherOptions: otherOptions$1,
	wasm: wasm$2
};

var commands = {
	"Format Document": "문서 포맷하기"
};
var editorMenu = {
	"Format Document": "문서 포맷하기"
};
var noticeMessages = {
	"Document Formatted!": "포맷 완료!",
	"Document is already formatted!": "문서가 이미 포맷돼 있습니다.",
	"No open document is found.": "열려 있는 문서를 찾지 못했습니다.",
	"You can only format in editing mode.": "편집 모드에서만 포맷할수 있습니다.",
	"Please enter a valid number.\nIt must be at least 0.": "유효한 숫자를 입력해주세요.\n0 이상만 입력할수 있습니다.",
	"Please enter a valid number.\nIt must be a whole number.": "유효한 숫자를 입력해주세요.\n자연수만 입력할 수 있습니다."
};
var optionWarnings = {
	"Gap value must be a whole number and it needs to be at least 0.": "여백 옵션의 값은 반드시 자연수이고 0 이상이어야 합니다."
};
var placeholders = {
	"(Default)": "(기본값)"
};
var optionSections = {
	"Heading gaps": "제목 여백",
	"Other gaps": "기타 여백",
	"Format options": "포맷 옵션",
	"Other options": "기타 옵션"
};
var headingGaps = {
	"Before top level headings": "최상위 제목 앞",
	"Decides gaps before top level headings.": "최상위 제목 앞의 여백을 결정합니다.",
	"Before first sub heading": "첫 번째 하위 제목 앞",
	"Decides child heading gaps right before parent headings.": "부모 제목 바로 앞 자식 제목의 여백을 결정합니다.",
	"Before sub headings": "하위 제목 앞",
	"Decides gaps before headings that are not in the top level.": "최상위 제목이 아닌 제목 앞의 여백을 결정합니다."
};
var otherGaps = {
	"After properties": "프로퍼티 섹션 뒤",
	"Decides the gap after the property section.": "프로퍼티 뒤 여백을 결정합니다.",
	"Before contents": "콘텐츠 섹션 앞",
	"Decides gaps before content sections. (ex: Text before headings)": "콘텐츠 섹션 앞의 여백을 결정합니다. (예: 제목 앞 텍스트)",
	"Before contents after code blocks": "코드 블럭 뒤 콘텐츠 섹션의 앞",
	"Decides gaps before 'contents that are after code blocks.'": "'코드 블럭 뒤에 있는 콘텐츠 섹션' 앞의 여백을 결정합니다.",
	"Before code blocks": "코드 블럭 앞",
	"Decides gaps before code blocks.": "코드 블럭 앞의 여백을 결정합니다.",
	"Before code blocks after headings": "제목 뒤 코드 블럭의 앞",
	"Decides gaps before 'code blocks that are after headings.'": "'제목 뒤에 있는 코드 블럭' 앞의 줄 바꿈을 결정합니다."
};
var formatOptions = {
	"Newline at the end of a document": "문서 끝에 새 줄 추가하기",
	"Inserts a newline at the end of a document.": "문서 끝에 새 줄을 추가합니다."
};
var otherOptions = {
	"Notify when no change is needed": "변경할 사항이 없을 때 알려주기",
	"Displays a different message when no change is needed.": "변경할 사항이 없으면 다른 메세지를 표시합니다.",
	"Show more detailed error messages": "더 상세한 에러 메세지 표시하기",
	"Displays additional information when parsing fails.": "문서를 읽지 못했을 때 추가 정보를 표시합니다."
};
var wasm$1 = {
	parsing: {
		"Failed to parse the document. [Line: {LINE_NUMBER}]": "문서를 읽지 못했습니다. [줄: {LINE_NUMBER}]",
		"Failed to parse the document.": "문서를 읽지 못했습니다."
	},
	formatting: {
		"Failed to read options. Some of them are possibly not positive number values.": "설정을 읽지 못했습니다. 양수가 아닌 값이 있을수도 있습니다."
	}
};
var ko = {
	commands: commands,
	editorMenu: editorMenu,
	noticeMessages: noticeMessages,
	optionWarnings: optionWarnings,
	placeholders: placeholders,
	optionSections: optionSections,
	headingGaps: headingGaps,
	otherGaps: otherGaps,
	formatOptions: formatOptions,
	otherOptions: otherOptions,
	wasm: wasm$1
};

const detectedLanguage = window.localStorage.getItem("language");
const LOCALE_CATEGORY = {
    COMMANDS: "commands",
    EDITOR_MENU: "editorMenu",
    NOTICE_MESSAGES: "noticeMessages",
    OPTION_WARNINGS: "optionWarnings",
    PLACEHOLDERS: "placeholders",
    OPTION_SECTIONS: "optionSections",
    HEADING_GAPS: "headingGaps",
    OTHER_GAPS: "otherGaps",
    FORMAT_OPTIONS: "formatOptions",
    OTHER_OPTIONS: "otherOptions",
};
const locales = {
    en: en,
    de: de,
    hu: hu,
    ko: ko,
};
/** @example getLocale(LOCALE_CATEGORY.COMMANDS, "Format Document") */
const getLocale = (category, key) => {
    var _a;
    const usingLocale = (_a = locales[detectedLanguage]) !== null && _a !== void 0 ? _a : locales.en;
    const message = usingLocale[category][key];
    if (message === "") {
        const usingLocale = locales.en;
        return usingLocale[category][key];
    }
    return usingLocale[category][key];
};
/** Returns the "wasm" object in the locale file. */
const getWasmLocale = () => {
    var _a;
    const usingLocale = (_a = locales[detectedLanguage]) !== null && _a !== void 0 ? _a : locales.en;
    return usingLocale.wasm;
};

class FormattoCommands {
    constructor(plugin) {
        this.plugin = plugin;
    }
    registerCommands() {
        this.getCommandsArr().forEach((item) => {
            this.plugin.addCommand(item);
        });
    }
    getCommandsArr() {
        return [
            {
                id: "formatto-logo",
                name: getLocale(LOCALE_CATEGORY.COMMANDS, "Format Document"),
                icon: "formatto-logo",
                editorCallback: (editor) => {
                    this.plugin.utils.formatDocument(editor);
                },
            },
        ];
    }
}

class FormattoEditorMenu {
    constructor(plugin) {
        this.plugin = plugin;
    }
    registerEditorMenus() {
        this.getEventsArr().forEach((item) => {
            this.plugin.registerEvent(item);
        });
    }
    getEventsArr() {
        return [
            this.plugin.app.workspace.on("editor-menu", (menu, editor) => {
                menu.addItem((item) => item
                    .setTitle(getLocale(LOCALE_CATEGORY.EDITOR_MENU, "Format Document"))
                    .setIcon("formatto-logo")
                    .onClick(() => {
                    this.plugin.utils.formatDocument(editor);
                }));
            }),
        ];
    }
}

var formattoLogo = "<svg class=\"formatto__custom-icons\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"2\" y=\"2\" width=\"6.65444\" height=\"3.02\" rx=\"0.5\" />\n<rect x=\"2\" y=\"6.31047\" width=\"12.0693\" height=\"3.44838\" rx=\"0.5\" />\n<rect x=\"10.621\" y=\"2\" width=\"3.44838\" height=\"6.03466\" rx=\"0.5\" />\n<rect x=\"2.03467\" y=\"11\" width=\"6.98996\" height=\"3.01966\" rx=\"0.5\" />\n</svg>";

class FormattoIcons {
    constructor() {
        this.icons = [{ iconId: "formatto-logo", svg: formattoLogo }];
        this.registerIcons = () => {
            this.icons.forEach(({ iconId, svg }) => {
                obsidian.addIcon(iconId, svg);
            });
        };
    }
}

class FormattoRibbonIcons {
    constructor(plugin) {
        this.registerRibbonIcons = () => {
            this.plugin.addRibbonIcon("formatto-logo", "Format Document", () => {
                var _a;
                const editor = (_a = this.plugin.app.workspace.activeEditor) === null || _a === void 0 ? void 0 : _a.editor;
                const activeView = this.plugin.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                if (!editor) {
                    new obsidian.Notice(getLocale(LOCALE_CATEGORY.NOTICE_MESSAGES, "No open document is found."));
                    return;
                }
                if (activeView.getMode() !== "source") {
                    new obsidian.Notice(getLocale(LOCALE_CATEGORY.NOTICE_MESSAGES, "You can only format in editing mode."));
                    return;
                }
                this.plugin.utils.formatDocument(editor);
            });
        };
        this.plugin = plugin;
    }
}

let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
* This function will be called from the TypeScript side.
* @param {string} input
* @param {any} js_options
* @param {any} js_locales
* @returns {string}
*/
function format_document(input, js_options, js_locales) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.format_document(retptr, ptr0, len0, addHeapObject(js_options), addHeapObject(js_locales));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred2_0 = r0;
        deferred2_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_error_c068c147cb280910 = function(arg0, arg1) {
        console.error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = getObject(arg0) == getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_String_b9412f8799faab3e = function(arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getwithrefkey_edc2c8960f0f1191 = function(arg0, arg1) {
        const ret = getObject(arg0)[getObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_c20a40f15020d68a = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('formatto_wasm_bg.wasm', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('main.js', document.baseURI).href)));
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

/*
  Type Declarations
*/
/*
  Fallback Option Values
*/
const FALLBACK_HEADING_GAPS = {
    beforeTopLevelHeadings: "3",
    beforeFirstSubHeading: "1",
    beforeSubHeadings: "2",
};
const FALLBACK_OTHER_GAPS = {
    afterProperties: "2",
    beforeContents: "0",
    beforeContentsAfterCodeBlocks: "1",
    beforeCodeBlocks: "1",
    beforeCodeBlocksAfterHeadings: "0",
};
const FALLBACK_FORMAT_OPTIONS = {
    insertNewline: true,
};
const FALLBACK_OTHER_OPTIONS = {
    notifyWhenUnchanged: true,
    showMoreDetailedErrorMessages: false,
};
const FALLBACK_OPTIONS = {
    headingGaps: FALLBACK_HEADING_GAPS,
    otherGaps: FALLBACK_OTHER_GAPS,
    formatOptions: FALLBACK_FORMAT_OPTIONS,
    otherOptions: FALLBACK_OTHER_OPTIONS,
};
/*
  Default Option Values
*/
const EMPTY_HEADING_GAPS = {
    beforeTopLevelHeadings: "",
    beforeFirstSubHeading: "",
    beforeSubHeadings: "",
};
const EMPTY_OTHER_GAPS = {
    afterProperties: "",
    beforeContents: "",
    beforeContentsAfterCodeBlocks: "",
    beforeCodeBlocks: "",
    beforeCodeBlocksAfterHeadings: "",
};
const DEFAULT_OPTIONS = {
    headingGaps: EMPTY_HEADING_GAPS,
    otherGaps: EMPTY_OTHER_GAPS,
    formatOptions: FALLBACK_FORMAT_OPTIONS,
    otherOptions: FALLBACK_OTHER_OPTIONS,
};

class FormattoUtils {
    constructor(plugin) {
        this.plugin = plugin;
    }
    formatDocument(editor) {
        const copiedOptions = JSON.parse(JSON.stringify(this.plugin.settings));
        this.handleEmptyOptions(copiedOptions);
        this.cursorPosition = editor.getCursor();
        this.originalDocument = editor.getValue();
        try {
            this.formattedDocument = format_document(this.originalDocument, copiedOptions, JSON.stringify(getWasmLocale()));
            this.displayMessage();
        }
        catch (error) {
            new obsidian.Notice(error);
        }
        if (!this.formattedDocument)
            return;
        if (this.formattedDocument !== this.originalDocument) {
            editor.setValue(this.formattedDocument);
            editor.setSelection(this.cursorPosition, this.cursorPosition);
        }
        this.clearVariables();
    }
    displayMessage() {
        if (this.plugin.settings.otherOptions.notifyWhenUnchanged &&
            this.formattedDocument === this.originalDocument) {
            new obsidian.Notice(getLocale(LOCALE_CATEGORY.NOTICE_MESSAGES, "Document is already formatted!"));
        }
        else {
            new obsidian.Notice(getLocale(LOCALE_CATEGORY.NOTICE_MESSAGES, "Document Formatted!"));
        }
    }
    handleEmptyOptions(copiedOptions) {
        for (const sectionKey of Object.keys(copiedOptions)) {
            for (const optionKey of Object.keys(copiedOptions[sectionKey])) {
                if (copiedOptions[sectionKey][optionKey] === "") {
                    copiedOptions[sectionKey][optionKey] =
                        FALLBACK_OPTIONS[sectionKey][optionKey];
                }
            }
        }
    }
    clearVariables() {
        this.cursorPosition = undefined;
        this.originalDocument = undefined;
        this.formattedDocument = undefined;
    }
}

class FormattoOptionTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.noticeMessages = {
            invalidNumberMessage: getLocale(LOCALE_CATEGORY.NOTICE_MESSAGES, "Please enter a valid number.\nIt must be at least 0."),
            notWholeNumberMessage: getLocale(LOCALE_CATEGORY.NOTICE_MESSAGES, "Please enter a valid number.\nIt must be a whole number."),
        };
        this.plugin = plugin;
    }
    checkDecimal(value) {
        return value !== "0" && value !== "1" && parseFloat(value) % 1 !== 0;
    }
    putDefaultIndicator(value) {
        return `${value} ${getLocale(LOCALE_CATEGORY.PLACEHOLDERS, "(Default)")}`;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        const debounceMsg = obsidian.debounce((value) => {
            if (value !== "") {
                // Check if the value is a valid number
                if (isNaN(parseInt(value)) || parseInt(value) < 0) {
                    new obsidian.Notice(this.noticeMessages.invalidNumberMessage);
                    return;
                }
                // Check if the value is a whole number
                if (this.checkDecimal(value)) {
                    new obsidian.Notice(this.noticeMessages.notWholeNumberMessage);
                    return;
                }
            }
        }, 1000, true);
        containerEl.createDiv({}, (div) => {
            div.innerHTML = `<div style="color: var(--text-accent)">
                ${getLocale(LOCALE_CATEGORY.OPTION_WARNINGS, "Gap value must be a whole number and it needs to be at least 0.")}
            </div>`;
            div.className = "setting-item setting-item-description";
        });
        // Heading Gaps
        containerEl.createEl("h2", {
            text: getLocale(LOCALE_CATEGORY.OPTION_SECTIONS, "Heading gaps"),
        });
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.HEADING_GAPS, "Before top level headings"))
            .setDesc(getLocale(LOCALE_CATEGORY.HEADING_GAPS, "Decides gaps before top level headings."))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.headingGaps.beforeTopLevelHeadings))
            .setValue(this.plugin.settings.headingGaps.beforeTopLevelHeadings)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.headingGaps.beforeTopLevelHeadings =
                value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.HEADING_GAPS, "Before first sub heading"))
            .setDesc(getLocale(LOCALE_CATEGORY.HEADING_GAPS, "Decides child heading gaps right before parent headings."))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.headingGaps.beforeFirstSubHeading))
            .setValue(this.plugin.settings.headingGaps.beforeFirstSubHeading)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.headingGaps.beforeFirstSubHeading =
                value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.HEADING_GAPS, "Before sub headings"))
            .setDesc(getLocale(LOCALE_CATEGORY.HEADING_GAPS, "Decides gaps before headings that are not in the top level."))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.headingGaps.beforeSubHeadings))
            .setValue(this.plugin.settings.headingGaps.beforeSubHeadings)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.headingGaps.beforeSubHeadings =
                value;
            yield this.plugin.saveOptions();
        })));
        // Other Gaps
        containerEl.createEl("h2", {
            text: getLocale(LOCALE_CATEGORY.OPTION_SECTIONS, "Other gaps"),
        });
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "After properties"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Decides the gap after the property section."))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.otherGaps.afterProperties))
            .setValue(this.plugin.settings.otherGaps.afterProperties)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.otherGaps.afterProperties = value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Before contents"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Decides gaps before content sections. (ex: Text before headings)"))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.otherGaps.beforeContents))
            .setValue(this.plugin.settings.otherGaps.beforeContents)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.otherGaps.beforeContents = value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Before contents after code blocks"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Decides gaps before 'contents that are after code blocks.'"))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.otherGaps
            .beforeContentsAfterCodeBlocks))
            .setValue(this.plugin.settings.otherGaps
            .beforeContentsAfterCodeBlocks)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.otherGaps.beforeContentsAfterCodeBlocks =
                value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Before code blocks"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Decides gaps before code blocks."))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.otherGaps.beforeCodeBlocks))
            .setValue(this.plugin.settings.otherGaps.beforeCodeBlocks)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.otherGaps.beforeCodeBlocks = value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Before code blocks after headings"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_GAPS, "Decides gaps before 'code blocks that are after headings.'"))
            .addText((text) => text
            .setPlaceholder(this.putDefaultIndicator(FALLBACK_OPTIONS.otherGaps
            .beforeCodeBlocksAfterHeadings))
            .setValue(this.plugin.settings.otherGaps
            .beforeCodeBlocksAfterHeadings)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            debounceMsg(value);
            this.plugin.settings.otherGaps.beforeCodeBlocksAfterHeadings =
                value;
            yield this.plugin.saveOptions();
        })));
        // Format Options
        containerEl.createEl("h2", {
            text: getLocale(LOCALE_CATEGORY.OPTION_SECTIONS, "Format options"),
        });
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.FORMAT_OPTIONS, "Newline at the end of a document"))
            .setDesc(getLocale(LOCALE_CATEGORY.FORMAT_OPTIONS, "Inserts a newline at the end of a document."))
            .addToggle((text) => text
            .setValue(this.plugin.settings.formatOptions.insertNewline)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.formatOptions.insertNewline =
                value;
            yield this.plugin.saveOptions();
        })));
        // Other Options
        containerEl.createEl("h2", {
            text: getLocale(LOCALE_CATEGORY.OPTION_SECTIONS, "Other options"),
        });
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_OPTIONS, "Notify when no change is needed"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_OPTIONS, "Displays a different message when no change is needed."))
            .addToggle((text) => text
            .setValue(this.plugin.settings.otherOptions.notifyWhenUnchanged)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.otherOptions.notifyWhenUnchanged =
                value;
            yield this.plugin.saveOptions();
        })));
        new obsidian.Setting(containerEl)
            .setName(getLocale(LOCALE_CATEGORY.OTHER_OPTIONS, "Show more detailed error messages"))
            .setDesc(getLocale(LOCALE_CATEGORY.OTHER_OPTIONS, "Displays additional information when parsing fails."))
            .addToggle((text) => text
            .setValue(this.plugin.settings.otherOptions
            .showMoreDetailedErrorMessages)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.otherOptions.showMoreDetailedErrorMessages =
                value;
            yield this.plugin.saveOptions();
        })));
    }
}

function _loadWasmModule (sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

    if (imports) {
      return instantiateFunc(source, imports)
    } else {
      return compileFunc(source)
    }
  }

  
var buf = null;
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  
buf = Buffer.from(src, 'base64');

} else {
  
var raw = globalThis.atob(src);
var rawLength = raw.length;
buf = new Uint8Array(new ArrayBuffer(rawLength));
for(var i = 0; i < rawLength; i++) {
   buf[i] = raw.charCodeAt(i);
}

}


  {
    return _instantiateOrCompile(buf, imports, false)
  }
}

function formatto_wasm(imports){return _loadWasmModule(0, null, 'AGFzbQEAAAABwAEaYAJ/fwF/YAJ/fwBgA39/fwF/YAN/f38AYAF/AGABfwF/YAR/f39/AGAFf39/f38AYAR/f39/AX9gAAF/YAV/f39+fwBgBn9/f39/fwBgBX9/f39/AX9gBn9/f39/fwF/YAd/f39/f39/AGAAAGAJf39/f39/fn5+AGAHf39/f39/fwF/YAN+f38Bf2AEf39/fgBgBX9/fX9/AGAEf31/fwBgBX9/fn9/AGAEf35/fwBgBX9/fH9/AGAEf3x/fwAC7QUXA3diZxpfX3diaW5kZ2VuX29iamVjdF9kcm9wX3JlZgAEA3diZxdfX3diaW5kZ2VuX2lzX3VuZGVmaW5lZAAFA3diZw1fX3diaW5kZ2VuX2luAAADd2JnFl9fd2JpbmRnZW5fYm9vbGVhbl9nZXQABQN3YmcVX193YmluZGdlbl9zdHJpbmdfZ2V0AAEDd2JnFF9fd2JpbmRnZW5faXNfb2JqZWN0AAUDd2JnHF9fd2JnX2Vycm9yX2MwNjhjMTQ3Y2IyODA5MTAAAQN3YmcbX193YmluZGdlbl9vYmplY3RfY2xvbmVfcmVmAAUDd2JnGV9fd2JpbmRnZW5fanN2YWxfbG9vc2VfZXEAAAN3YmcVX193YmluZGdlbl9udW1iZXJfZ2V0AAEDd2JnHV9fd2JnX1N0cmluZ19iOTQxMmY4Nzk5ZmFhYjNlAAEDd2JnFF9fd2JpbmRnZW5fZXJyb3JfbmV3AAADd2JnFV9fd2JpbmRnZW5fc3RyaW5nX25ldwAAA3diZyRfX3diZ19nZXR3aXRocmVma2V5X2VkYzJjODk2MGYwZjExOTEAAAN3YmctX193YmdfaW5zdGFuY2VvZl9BcnJheUJ1ZmZlcl84MzY4MjViZTA3ZDRjOWQyAAUDd2JnHV9fd2JnX2J1ZmZlcl8xMmQwNzljYzIxZTE0YmRiAAUDd2JnGl9fd2JnX25ld182M2I5MmJjODY3MWVkNDY0AAUDd2JnGl9fd2JnX3NldF9hNDdiYWM3MDMwNmExOWE3AAMDd2JnHV9fd2JnX2xlbmd0aF9jMjBhNDBmMTUwMjBkNjhhAAUDd2JnLF9fd2JnX2luc3RhbmNlb2ZfVWludDhBcnJheV8yYjNiYmVjZDAzM2QxOWY2AAUDd2JnF19fd2JpbmRnZW5fZGVidWdf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AiAHai0AACIEQQlrIghBF0tBASAIdEGTgIAEcUVyDQIgASACQQFqIgI2AhQgAiAFRw0ACyAFIQILIANBBTYCWCADQRhqIAFBDGogBSACQQFqIgEgASAFSxsQdCADQdgAaiADKAIYIAMoAhwQkgEhASAAQQY6AAAgACABNgIEDAELAkACQAJAAkACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIARB5QBNBEAgBEEiRg0GIARBLUYNBSAEQdsARw0BIAEgAS0AGEEBayIEOgAYIARB/wFxDQcgA0EYNgJYIANBCGogBiAFIAJBAWoiASABIAVLGxB0IANB2ABqIAMoAgggAygCDBCSASEBIABBBjoAACAAIAE2AgQMFgsgBEHzAE0EQCAEQeYARg0EIARB7gBHDQEgASACQQFqNgIUIAFBgLLAAEEDEGAiAUUNAiAAQQY6AAAgACABNgIEDBYLIARB9ABGDQIgBEH7AEYNBwsgBEEwa0H/AXFBCkkNByADQQo2AlggAyAGIAUgAkEBaiICIAIgBUsbEHQgAyADQdgAaiADKAIAIAMoAgQQkgE2AiQMEQsgA0EAOgAgIAAgAykDIDcDACAAQQhqIANBKGopAwA3AwAgAEEQaiADQTBqKQMANwMADBMLIAEgAkEBajYCFCABQYOywABBAxBgIgEEQCAAQQY6AAAgACABNgIEDBMLIANBgQI7ASAgACADKQMgNwMAIABBCGogA0EoaikDADcDACAAQRBqIANBMGopAwA3AwAMEgsgASACQQFqNgIUIAFBhrLAAEEEEGAiAQRAIABBBjoAACAAIAE2AgQMEgsgA0EBOwEgIAAgAykDIDcDACAAQQhqIANBKGopAwA3AwAgAEEQaiADQTBqKQMANwMADBELIAEgAkEBajYCFCADQThqIAFBABAvIAMpAzhCA1ENBCADQSBqIANBOGoQbyADLQAgQQZHBEAgACADKQMgNwMAIABBEGogA0EwaikDADcDACAAQQhqIANBKGopAwA3AwAMEQsgAygCJCABEIoBIQEgAEEGOgAAIAAgATYCBAwQCyABQQA2AgggASACQQFqNgIUIANB2ABqIAYgARAxIAMoAlwhBCADKAJYIgVBAkYNBCADKAJgIQIgBUUEQCADQSBqIQUCQAJAAkACQCACRQRAQQEhBgwB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CyAJIARBtPLAABCBAQALIAYgBEGk8sAAEIEBAAsgDSAEQbTywAAQgQEAC70LAQR/IwBBMGsiAyQAIwBBIGsiBiQAIANBJGoiBAJ/IAAoAggiBSAAKAIETwRAIAZBBDYCFCAGQQhqIAAgBRB0IAQgBkEUaiAGKAIIIAYoAgwQkgE2AgRBAQwBCyAAIAVBAWo2AgggBCAAKAIAIAVqLQAAOgABQQALOgAAIAZBIGokAAJ/AkACQAJAAkACQAJAAkACQAJAIAMtACQNAAJAAkACQAJAAkACQAJAAkACQCADLQAlIgRB7QBNBEAgBEHhAE0EQCAEQSJGDQIgBEEvRg0EIARB3ABGDQMMEwsgBEHiAGsOBQQSEhIFEgsgBEHuAGsOCAUREREGEQcIEQsgAigCCCIAIAIoAgBGBH8gAiAAEI4BIAIoAggFIAALIAIoAgRqQSI6AAAgAiACKAIIQQFqNgIIQQAMEQsgAigCCCIAIAIoAgBGBH8gAiAAEI4BIAIoAggFIAALIAIoAgRqQdwAOgAAIAIgAigCCEEBajYCCEEADBALIAIoAggiACACKAIARgR/IAIgABCOASACKAIIBSAACyACKAIEakEvOgAAIAIgAigCCEEBajYCCEEADA8LIAIoAggiACACKAIARgR/IAIgABCOASACKAIIBSAACyACKAIEakEIOgAAIAIgAigCCEEBajYCCEEADA4LIAIoAggiACACKAIARgR/IAIgABCOASACKAIIBSAACyACKAIEakEMOgAAIAIgAigCCEEBajYCCEEADA0LIAIoAggiACACKAIARgR/IAIgABCOASACKAIIBSAACyACKAIEakEKOgAAIAIgAigCCEEBajYCCEEADAwLIAIoAggiACACKAIARgR/IAIgABCOASACKAIIBSAACyACKAIEakENOgAAIAIgAigCCEEBajYCCEEADAsLIAIoAggiACACKAIARgR/IAIgABCOASACKAIIBSAACyACKAIEakEJOgAAIAIgAigCCEEBajYCCEEADAoLIANBHGogABBOIAMvARwNBAJAAkAgAy8BHiIEQYD4A3EiBUGAsANHBEAgBUGAuANGBEAgAUUNAiADQRQ2AiQgACADQSRqEKABDA0LIARBgLC/f3NB/4+8f00NCAwKCyADQSRqIAAQfSADLQAkDQIgAy0AJUHcAEYN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AWsiADYCACAADQFB/IzBACgCACIABEADQCABQQFqIQEgACgCCCIADQALC0G0j8EAQf8fIAEgAUH/H00bNgIADwtBoI/BACABNgIAQZiPwQBBmI/BACgCACAAaiIANgIAIAEgAEEBcjYCBEGcj8EAKAIAIAFGBEBBlI/BAEEANgIAQZyPwQBBADYCAAsgAEGsj8EAKAIAIgNNDQBBoI/BACgCACICRQ0AQQAhAQJAQZiPwQAoAgAiBEEpSQ0AQfSMwQAhAANAIAIgACgCACIFTwRAIAUgACgCBGogAksNAgsgACgCCCIADQALC0H8jMEAKAIAIgAEQANAIAFBAWohASAAKAIIIgANAAsLQbSPwQBB/x8gASABQf8fTRs2AgAgAyAETw0AQayPwQBBfzYCAAsPCyAAQXhxQYSNwQBqIQICf0GMj8EAKAIAIgNBASAAQQN2dCIAcUUEQEGMj8EAIAAgA3I2AgAgAgwBCyACKAIICyEAIAIgATYCCCAAIAE2AgwgASACNgIMIAEgADYCCA8LQZyPwQAgATYCAEGUj8EAQZSPwQAoAgAgAGoiADYCACABIABBAXI2AgQgACABaiAANgIAC/4FAgF/AXwjAEEwayICJAACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAALQAAQQFrDhEBAgMEBQYHCAkKCwwNDg8QEQALIAIgAC0AAToACCACQQI2AhQgAkHwvcAANgIQIAJCATcCHCACQcMANgIsIAIgAkEoajYCGCACIAJBCGo2AiggASgCFCABKAIYIAJBEGoQJgwRCyACIAApAwg3AwggAkECNgIUIAJBjL7AADYCECACQgE3AhwgAkHEADYCLCACIAJBKGo2AhggAiACQQhqNgIoIAEoAhQgASgCGCACQRBqECYMEAsgAiAAKQMINwMIIAJBAjYCFCACQYy+wAA2AhAgAkIBNwIcIAJBxQA2AiwgAiACQShqNgIYIAIgAkEIajYCKCABKAIUIAEoAhggAkEQahAmDA8LIAArAwghAyACQQI2AhQgAkGsvsAANgIQIAJCATcCHCACQcYANgIMIAIgAzkDKCACIAJBCGo2AhggAiACQShqNgIIIAEoAhQgASgCGCACQRBqECYMDgsgAiAAKAIENgIIIAJBAjYCFCACQci+wAA2AhAgAkIBNwIcIAJBxwA2AiwgAiACQShqNgIYIAIgAkEIajYCKCABKAIUIAEoAhggAkEQahAmDA0LIAIgACkCBDcCCCACQQE2AhQgAkHgvsAANgIQIAJCATcCHCACQcgANgIsIAIgAkEoajYCGCACIAJBCGo2AiggASgCFCABKAIYIAJBEGoQJgwMCyABQei+wABBChDKAQwLCyABQfK+wABBChDKAQwKCyABQfy+wABBDBDKAQwJCyABQYi/wABBDhDKAQwICyABQZa/wABBCBDKAQwHCyABQZ6/wABBAxDKAQwGCyABQaG/wABBBBDKAQwFCyABQaW/wABBDBDKAQwECyABQbG/wABBDxDKAQwDCyABQcC/wABBDRDKAQwCCyABQc2/wABBDhDKAQwBCyABIAAoAgQgACgCCBDKAQsgAkEwaiQAC4AFAQd/IwBB0ABrIgIkAAJAIAEoAgAiBSgCFCIDIAUoAhAiBEkEQCAFQQxqIQcgBSgCDCEIA0ACQAJAAkACQAJAAkACQAJAIAMgCGotAAAiBkEMTQRAIAZBCWtBAkkNCAwBCyAGQR9NBEAgBkENRw0BDAgLIAZBIEYNByAGQSxGDQEgBkHdAEYNBAsgAS0ABA0BIAJBBzYCRCACQQhqIAcgBCADQQFqIgEgASAESxsQdCACQcQAaiACKAIIIAIoAgwQkgEhASAAQQc6AAAgACABNgIEDAkLIAEtAAQNACAFIANBAWoiAzYCFCADIARJBEADQCADIAhqLQAAIgZBCWsiAUEXS0EBIAF0QZOAgARxRXINAyAFIANBAWoiAzYCFCADIARHDQALIAQhAwsgAkEFNgJEIAJBIGogByAEIANBAWoiASABIARLGxB0IAJBxABqIAIoAiAgAigCJBCSASEDDAQLIAFBADoABAsgBkHdAEcNASACQRU2AkQgAkEQaiAHIAQgA0EBaiIBIAEgBEsbEHQgAkHEAGogAigCECACKAIUEJIBIQMMAgsgAEEGOgAADAULIAJBKGogBRAYIAItAChBBkcEQCAAIAIpAyg3AwAgAEEQaiACQThqKQMANwMAIABBCGogAkEwaikDADcDAAwFCyAAIAIoAiw2AgQgAEEHOgAADAQLIABBBzoAACAAIAM2AgQMAwsgBSADQQFqIgM2AhQgAyAERw0ACyAEIQMLIAJBAjYCRCACQRhqIAVBDGogBCADQQFqIgEgASAESxsQdCACQcQAaiACKAIYIAIoAhwQkgEhASAAQQc6AAAgACABNgIECyACQdAAaiQAC/wEAQp/IwBBMGsiAyQAIANBAzoALCADQSA2AhwgA0EANgIoIAMgATYCJCADIAA2AiAgA0EANgIUIANBADYCDAJ/AkACQAJAIAIoAhAiCkUEQCACKAIMIgBFDQEgAigCCCEBIABBA3QhBSAAQQFrQf////8BcUEBaiEHIAIoAgAhAANAIABBBGooAgAiBARAIAMoAiAgACgCACAEIAMoAiQoAgwRAgANBAsgASgCACADQQxqIAEoAgQRAAANAyABQQhqIQEgAEEIaiEAIAVBCGsiBQ0ACwwBCyACKAIUIgBFDQAgAEEFdCELIABBAWtB////P3FBAWohByACKAIIIQggAigCACEAA0AgAEEEaigCACIBBEAgAygCICAAKAIAIAEgAygCJCgCDBECAA0DCyADIAUgCmoiAUEQaigCADYCHCADIAFBHGotAAA6ACwgAyABQRhqKAIANgIoIAFBDGooAgAhBEEAIQlBACEGAkACQAJAIAFBCGooAgBBAWsOAgACAQsgBEEDdCAIaiIMKAIEQe4ARw0BIAwoAgAoAgAhBAtBASEGCyADIAQ2AhAgAyAGNgIMIAFBBGooAgAhBAJAAkACQCABKAIAQQFrDgIAAgELIARBA3QgCGoiBigCBEHuAEcNASAGKAIAKAIAIQQLQQEhCQsgAyAENgIYIAMgCTYCFCAIIAFBFGooAgBBA3RqIgEoAgAgA0EMaiABKAIEEQAADQIgAEEIaiEAIAsgBUEgaiIFRw0ACwsgByACKAIETw0BIAMoAiAgAigCACAHQQN0aiIAKAIAIAAoAgQgAygCJCgCDBECAEUNAQtBAQwBC0EACyADQTBqJAALwAUCB38BfCMAQZABayIDJAACQAJAAkAgACgCACIEQYEBEAhFBEBBAUECIAQQAyIFQQFGG0EAIAUbIghBAkYNAUEAIQUMAgsgA0EHOgBwIANB8ABqIAEgAhB+IQAMAgsgA0EoaiAEEAkgAygCKCEFIANBGGoiByADKwMwOQMIIAcgBUEAR603AwAgAykDGKdBAUcEQCADQRBqIAQQBAJ/AkAgAygCECIERQ0AIANBCGogBCADKAIUEJ0BIANB2ABqIAMoAggg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IAEoAgwhAiABKAIIIQMCQCABKAIEIgFFBEAgAgRAA0AgAygCmAMhAyACQQFrIgINAAsLQQAhAiAEQQA2AgggBCADNgIEDAELIAQgAzYCCCAEIAE2AgQLIAQgAjYCDCMAQRBrIgEkACABQQRqIARBBGoiAigCACACKAIEEIwBA0AgASgCBCICBEAgAUEEaiACIAEoAggQjAEMAQsLIAFBEGokAAsgAEEANgIADAELIAEgAkEBazYCIAJAIAEoAgAiBUUNACABKAIEDQAgASgCCCECIAEoAgwiAwRAA0AgAigCmAMhAiADQQFrIgMNAAsLIAFCADcCCCABIAI2AgQgAUEBNgIACyABQQRqQQAgBRsiBgRAIwBBMGsiAyQAIANBCGohBSMAQRBrIgckACAGKAIEIQgCQCAGKAIIIgkgBigCACIBLwGSA08EQANAIAdBBGogASAIEIwBIAcoAgQiAUUEQCAFQQA2AgAMAwsgBygCCCEIIAcoAgwiCSABLwGSA08NAAsLIAlBAWohCgJAIAhFBEAgASECDAELIAEgCkECdGpBmANqKAIAIQJBACEKIAhBAWsiC0UNAANAIAIoApgDIQIgC0EBayILDQALCyAFIAk2AhQgBSAINgIQIAUgATYCDCAFIAo2AgggBUEANgIEIAUgAjYCAAsgB0EQaiQAIAMoAghFBEBBtLzAABDoAQALIARBBGoiASADKQIUNwIAIANBKGogA0EQaigCACICNgIAIAFBCGogA0EcaigCADYCACADIAMpAggiDDcDICAGQQhqIAI2AgAgBiAMNwIAIANBMGokACAAQQhqIARBDGooAgA2AgAgACAEKQIENwIADAELQaS9wAAQ6AEACyAEQRBqJAAL3wEBBH8jAEEQayIBJAAgACgCDCECAkACQAJAAkACQAJAIAAoAgQOAgABAgsgAg0BQfiVwAAhAkEAIQAMAgsgAg0AIAAoAgAiAigCBCEAIAIoAgAhAgwBCyABQQRqIAAQOyABKAIMIQAgASgCCCEDDAELIAFBBGogABBxIAEoAgQEQCABKAIIIgBFDQIgACABKAIMEP0BAAsgASgCCCEEIAEoAgwiAyACIAAQhQIhAiABIAA2AgwgASACNgIIIAEgBDYCBAsgAyAAEAsgAUEEahDDASABQRBqJAAPCxCjAQALnAQBB38jAEEgayIE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CyADKAIAIAQgASACEMcBDAILCyABIAJFDQAaQaWLwQAtAAAaIAIgARDRAQsiAwRAIAAgAjYCCCAAIAM2AgQgAEEANgIADwsgACACNgIIIAAgATYCBAwCCyAAQQA2AgQMAQsgAEEANgIECyAAQQE2AgALigEBBX8jAEEQayIDJAACQCACQQhPBEAgA0EIakEuIAEgAhBGIAMoAghBAUYhBAwBCyACRQRADAELIAJBAWshBiABIQUDQCAFLQAAQS5GIgQNASAFQQFqIQUgBiIHQQFrIQYgBw0ACwsgACAEIAAtAARBAEdyOgAEIAAoAgAgASACEMoBIANBEGokAAuqAQEBfyMAQUBqIgIkACACQQA2AhQgAkKAgICAEDcCDCACQQM6ADggAkEgNgIoIAJBADYCNCACQcyQwAA2AjAgAkEANgIgIAJBADYCGCACIAJBDGo2AiwgASgCACACQRhqIAEoAgQoAhARAABFBEAgACACKQIMNwIAIABBCGogAkEUaigCADYCACACQUBrJAAPC0HkkMAAQTcgAkE/akGckcAAQfiRwAAQegALnwEBAX8jAEFAaiICJAAgAkIANwM4IAJBOGogACgCABAUIAIgAigCPCIANgI0IAIgAigCODYCMCACIAA2AiwgAkHOADYCKCACQQI2AhAgAkGMwcAANgIMIAJCATcCGCACIAJBLGo2AiQgAiACQSRqNgIUIAEoAhQgASgCGCACQQxqECYgAigCLCIBBEAgAigCMCABQQEQ4gELIAJBQGskAAumAQMCfwF8AX4jAEEgayICJAACQAJAAkACQCABKAIAQQFrDgIBAgALIAErAwgiBJlEAAAAAAAA8H9jBEAgAkEAOgAIIAJBCGoQdUECIQMLIAAgBDkDECAAQgI3AwggACADOgAADAILIABCADcDCCAAQQI6AAAgACABKQMINwMQDAELIABBAjoAACAAIAEpAwgiBTcDECAAIAVCP4g3AwgLIAJBIGokAAuPAQIDfwF+IwBBIGsiAiQAIAEoAgBBgICAgHhGBEAgASgCDCEDIAJBHGoiBEEANgIAIAJCgICAgBA3AhQgAkEUakGcwcAAIAMQJhogAkEQaiAEKAIAIgM2AgAgAiACKQIUIgU3AwggAUEIaiADNgIAIAEgBTcCAAsgAEGMysAANgIEIAAgATYCACACQSBqJAAL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QQxsakGMAmoiBCgCACIFBEAgBCgCBCAFQQEQ4gELIAIgA0EYbGoQWyABQQRqIAAQXSABKAIEIgINAAsLIAFBEGokAAvTAQEFfyMAQRBrIgIkACACIAE2AgQCQCACQQRqENMBRQRAIAJBCGohBCMAQRBrIgMkACADIAE2AghBASEFAkAgARADIgZBAU0EQCAEIAY6AAFBACEFDAELIAQgA0EIaiADQQ9qQdiDwAAQJzYCBAsgBCAFOgAAIAFBhAFPBEAgARAACyADQRBqJAAgAAJ/IAItAAhFBEAgACACLQAJOgABQQAMAQsgACACKAIMNgIEQQELOgAADAELIABBgAQ7AQAgAUGEAUkNACABEAALIAJBEGokAAtsAQF/IwBBMGsiAiQAIAJBGGogACgCABAKIAJBEGogAigCGCACKAIcENIBIAJBCGogAigCECACKAIUEJ0BIAJBJGoiACACKAIIIAIoAgwQxgEgAigCKCACKAIsIAEQgQIgABDDASACQTBqJAALfQEBfyMAQUBqIgUkACAFIAE2AgwgBSAANgIIIAUgAzYCFCAFIAI2AhAgBUE8akHwADYCACAFQQI2AhwgBUHw7MAANgIYIAVCAjcCJCAFQfEANgI0IAUgBUEwajYCICAFIAVBEGo2AjggBSAFQQhqNgIwIAVBGGogBBCeAQALfwEEfwJAAkACQCAAKAIAIgAoAgAOAgABAgsgACgCCCIBRQ0BIAAoAgQgAUEBEOIBDAELIAAtAARBA0cNACAAKAIIIgEoAgAiAyABKAIEIgIoAgARBAAgAigCBCIEBEAgAyAEIAIoAggQ4gELIAFBDEEEEOIBCyAAQRRBBBDiAQtsAQJ/IwBBEGsiAyQAIANBBGogAhBxAkAgAygCBARAIAMoAggiAEUNASAAIAMoAgwQ/QEACyADKAIIIQQgAygCDCABIAIQhQIhASAAIAI2AgggACABNgIEIAAgBDYCACADQRBqJAAPCxCjAQALawECfyMAQSBrIgIkACAAAn8gASgCCCIDIAEoAgRPBEAgAkEENgIUIAJBCGogASADEHQgACACQRRqIAIoAgggAigCDBCSATYCBEEBDAELIAAgASgCACADai0AADoAAUEACzoAACACQSBqJAALagEBfyMAQTBrIgMkACADIAI2AgQgAyABNgIAIANBLGpBJjYCACAD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ABDoAQALIAEgACgCDDYCDCABIAA2AgggASACNgIEIwBBEGsiACQAIAFBBGoiASgCACICKAIMIQMCQAJAAkACQCACKAIEDgIAAQILIAMNAUGcwcAAIQJBACEDDAILIAMNACACKAIAIgIoAgQhAyACKAIAIQIMAQsgACACNgIMIABBgICAgHg2AgAgAEHAysAAIAEoAgQiACgCCCABKAIIIAAtABAgAC0AERBhAAsgACADNgIEIAAgAjYCACAAQazKwAAgASgCBCIAKAIIIAEoAgggAC0AECAALQAREGEAC9t2Axt+JX8BfCABKAIcQQFxIR0gACsDACFCAkAgASgCCARAAn8gASErIAEoAgwhLkEAIQEjAEHwCGsiJSQAIEK9IQUCf0ECIEIgQmINABogBUL/////////B4MiAkKAgICAgICACIQgBUIBhkL+////////D4MgBUI0iKdB/w9xIgEbIgdCAYMhBCAFQoCAgICAgID4/wCDIQMCQAJAIAJQBEBBAyADQoCAgICAgID4/wBRDQMaIANQRQ0BQQQMAwsgA1ANAQtCgICAgICAgCAgB0IBhiAHQoCAgICAgIAIUSIAGyEHQgJCASAAGyEDQct3Qcx3IAAbIAFqIQEgBFAMAQsgAUGzCGshAUIBIQMgBFALIQAgJSABOwHoCCAlIAM3A+AIICVCATcD2AggJSAHNwPQCCAlIAA6AOoIAn8gAEECRgRAQdzQwAAhNUEADAELIB1FBEBB9+fAAEHc0MAAIAVCAFMbITUgBUI/iKcMAQtB9+fAAEH458AAIAVCAFMbITVBAQshLAJAAn8CQAJAAkACQAJAQQMgAEECa0H/AXEiACAAQQNPG0EBaw4DAQIDAAsgJUEDNgKYCCAlQfnnwAA2ApQIICVBAjsBkAhBASEAICVBkAhqDAQLICVBAzYCmAggJUH858AANgKUCCAlQQI7AZAIQQEhACAlQZAIagwDC0ECIQAgJUECOwGQCCAuRQ0BICVBoAhqIC42AgAgJUEAOwGcCCAlQQI2ApgIICVB9efAADYClAggJUGQCGoMAgtBdEEFIAHBIgBBAEgbIABsIgBBwP0ASQRAICVBkAhqIScgJUEQaiEoIABBBHZBFWohI0GAgH5BACAuayAuQYCAAk8bITECQAJAAn8CQAJAAkACQCAlQdAIaiIAKQMAIgJQ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wAA2AiQgJkECOwEgQQEhACAmQSBqDAELICZBAjsBIEEBIQAgJkEBNgIoICZB/+fAADYCJCAmQSBqCyEBICYgADYCXCAmIAE2AlggJiAtNgJUICYgPDYCUCAmQdAAahAoICZBgAFqJAAPCyAdQShBvIHBABDlAQALMQEBfyMAQRBrIgIkACACQQhqIAAgACgCCBB0IAEgAigCCCACKAIMEJIBIAJBEGokAAstAQF/IAAoAggiAQRAIAAoAgQhAANAIAAQwwEgAEEMaiEAIAFBAWsiAQ0ACwsLLgACQCADaUEBR0GAgICAeCADayABSXJFBEAgACABIAMgAhDHASIADQELAAsgAAs9AQF/IwBBIGsiACQAIABBATYCDCAAQdTOwAA2AgggAEIANwIUIABBoM7AADYCECAAQQhqQfjOwAAQngEACzkBAX9BASECAkAgACABEEINACABKAIUQYnqwABBAiABKAIYKAIMEQIADQAgAEEEaiABEEIhAgsgAgsyAQF/IAAoAhAiAUGEAU8EQCABEAALAkAgACgCAEUNACAAKAIEIgBBhAFJDQAgABAACwuYBAIGfwF+IwBBEGsiBSQAIAUgADYCDCAFQQxqIQcjAEEQayICJAAgAiABKAIUQeCLwABBBSABKAIYKAIMEQIAOgAMIAIgATYCCCACQQA6AA0gAkEANgIEIwBBQGoiACQAIAJBBGoiAygCACEEIAMCf0EBIAMtAAgNABogAygCBCIBKAIcIgZBBHFFBEBBASABKAIUQZztwABBo+3AACAEG0ECQQEgBBsgASgCGCgCDBECAA0BGiAHIAFB9IvAACgCABEAAAwBCyAERQRAQQEgASgCFEGk7cAAQQIgASgCGCgCDBECAA0BGiABKAIcIQYLIABBAToAGyAAIAEpAhQ3AgwgAEGA7cAANgI0IAAgAEEbajYCFCAAIAEpAgg3AiQgASkCACEIIAAgBjYCOCAAIAEoAhA2AiwgACABLQAgOgA8IAAgCDcCHCAAIABBDGo2AjBBASAHIABBHGpB9IvAACgCABEAAA0AGiAAKAIwQZ7twABBAiAAKAI0KAIMEQIACzoACCADIARBAWo2AgAgAEFAayQAAn8gAi0ADCIAQQBHIAMoAgAiAUUNABpBASAADQAaIAIoAgghAAJAIAFBAUcNACACLQANRQ0AIAAtABxB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CyAAIAIgAyAEIAUgASgCEBEMAAsfAQJ+IAApAwAiAiACQj+HIgOFIAN9IAJCAFkgARBDCyMAIABFBEBBxJfAAEEyEPkBAAsgACACIAMgBCABKAIQEQYACyMAIABFBEBBxJfAAEEyEPkBAAsgACACIAMgBCABKAIQERUACyMAIABFBEBBxJfAAEEyEPkBAAsgACACIAMgBCABKAIQEQgACyMAIABFBEBBxJfAAEEyEPkBAAsgACACIAMgBCABKAIQERcACyMAIABFBEBBxJfAAEEyEPkBAAsgACACIAMgBCABKAIQERkACyEAIAAgASgCDDYCBCAAIAEoAghBACABLQAAQQNGGzYCAAsaAQF/IAEgA08EfyACIAMgACADELsBBSAECwssACAAIAFBLkYgAC0ABEEAR3I6AAQgACgCACIAKAIUIAEgACgCGCgCEBEAAAsZAQF/IAEgA0YEfyAAIAIgARCCAkUFIAQLCygBAX8gACgCACIBQYCAgIB4ckGAgICAeEcEQCAAKAIEIAFBARDiAQsLJAAgASAALQAAQQJ0IgBBkIvBAGooAgAgAEH8isEAaigCABAdCyEAIABFBEBBxJfAAEEyEPkBAAsgACACIAMgASgCEBEDAAsdAQF/IAAoAgAiAQRAIAAoAgQgAUEMbEEEEOIBCwsiACAALQAARQRAIAFB3u/AAEEFEB0PCyABQePvwABBBBAdCx8AIABFBEBBxJfAAEEyEPkBAAsgACACIAEoAhARAAALswMCAX4Gf0Goi8EAKAIARQRAIwBBMGsiAiQAAn8CQCAABEAgACgCACAAQQA2AgANAQsgAkEQakG4lsAAKQMANwMAIAJBsJbAACkDADcDCEEADAELIAJBEGogAEEQaikCADcDACACIAApAgg3AwggACgCBAshAEGoi8EAKQIAIQFBrIvBACAANgIAQaiLwQBBATYCACACQShqQbiLwQApAgA3AwAgAkEgaiIAQbCLwQApAgA3AwBBsIvBACACKQMINwIAQbiLwQAgAkEQaikDADcCACACIAE3AxggAacEQAJAIAAoAgQiBUUNACAAKAIMIgYEQCAAKAIAIgNBCGohBCADKQMAQn+FQoCBgoSIkKDAgH+DIQEDQCABUARAA0AgA0HgAGshAyAEKQMAIARBCGohBEJ/hUKAgYKEiJCgwIB/gyIBUA0A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AAAAAAAAAAEAAAAMAAAACAAAAAAAAAABAAAADQAAAAgAAAAAAAAAAQAAAA4AAAAIAAAAAAAAAAEAAAAPAAAAYmVmb3JlVG9wTGV2ZWxIZWFkaW5nc2JlZm9yZUZpcnN0U3ViSGVhZGluZ2JlZm9yZVN1YkhlYWRpbmdzYWZ0ZXJQcm9wZXJ0aWVzYmVmb3JlQ29udGVudHNiZWZvcmVDb250ZW50c0FmdGVyQ29kZUJsb2Nrc2JlZm9yZUNvZGVCbG9ja3NiZWZvcmVDb2RlQmxvY2tzQWZ0ZXJIZWFkaW5nc2luc2VydE5ld2xpbmVub3RpZnlXaGVuVW5jaGFuZ2Vkc2hvd01vcmVEZXRhaWxlZEVycm9yTWVzc2FnZXNoZWFkaW5nR2Fwc290aGVyR2Fwc2Zvcm1hdE9wdGlvbnNvdGhlck9wdGlvbnMAAABzcmMvdG9vbHMvZm9ybWF0dGluZy5ycwpIAxAAAAAAAEgDEAAAAAAASAMQAAAAAABpbnRlcm5hbCBlcnJvcjogZW50ZXJlZCB1bnJlYWNoYWJsZSBjb2RlSAMQABcAAACvAAAAEQAAAEgDEAAAAAAARmFpbGVkIHRvIHJlYWQgb3B0aW9ucy4gU29tZSBvZiB0aGVtIGFyZSBwb3NzaWJseSBub3QgcG9zaXRpdmUgbnVtYmVyIHZhbHVlcy5zcmMvdG9vbHMvcGFyc2luZy9oZWFkaW5ncy5ycwAABQQQAB0AAABmAAAADAAAAGF0dGVtcHQgdG8gam9pbiBpbnRvIGNvbGxlY3Rpb24gd2l0aCBsZW4gPiB1c2l6ZTo6TUFYbWlkID4gbGVuAABpBBAACQAAAC9ydXN0Yy85YjAwOTU2ZTU2MDA5YmFiMmFhMTVkN2JmZjEwOTE2NTk5ZTNkNmQ2L2xpYnJhcnkvYWxsb2Mvc3JjL3N0ci5yc3wEEABIAAAAsgAAABYAAAB8BBAASAAAAJsAAAAKAAAAEgAAAAQAAAAEAAAAEwAAABIAAAAEAAAABAAAABQAAAATAAAA5AQQABUAAAAWAAAAFwAAABUAAAAYAAAAGQAAAAQAAAAEAAAAGgAAABkAAAAEAAAABAAAABsAAAAaAAAAIAUQABwAAAAdAAAAFwAAAB4AAAAYAAAAYHVud3JhcF90aHJvd2AgZmFpbGVkZGVzY3JpcHRpb24oKSBpcyBkZXByZWNhdGVkOyB1c2UgRGlzcGxheW1pc3NpbmcgZmllbGQgYGAAAACZBRAADwAAAKgFEAABAAAAZHVwbGljYXRlIGZpZWxkIGAAAAC8BRAAEQAAAKgFEAABAAAARXJyb3IAAAAfAAAABAAAAAQAAAAgAAAAc3JjL3Rvb2xzL3BhcnNpbmcvaGVhZGluZ3MucnMAAAD4BRAAHQAAAIAAAAAuAAAARmFpbGVkIHRvIHJlYWQgbG9jYWxlIGZpbGUucGFyc2luZ2Zvcm1hdHRpbmdiZWZvcmVUb3BMZXZlbEhlYWRpbmdzYmVmb3JlRmlyc3RTdWJIZWFkaW5nYmVmb3JlU3ViSGVhZGluZ3NUBhAAFgAAAGoGEAAVAAAAfwYQABEAAABzdHJ1Y3QgSGVhZGluZ0dhcHNhZnRlclByb3BlcnRpZXNiZWZvcmVDb250ZW50c2JlZm9yZUNvbnRlbnRzQWZ0ZXJDb2RlQmxvY2tzYmVmb3JlQ29kZUJsb2Nrc2JlZm9yZUNvZGVCbG9ja3NBZnRlckhlYWRpbmdzAAAAugYQAA8AAADJBhAADgAAANcGEAAdAAAA9AYQABAAAAAEBxAAHQAAAHN0cnVjdCBPdGhlckdhcHNpbnNlcnROZXdsaW5lAAAAXAcQAA0AAABzdHJ1Y3QgRm9ybWF0T3B0aW9uc25vdGlmeVdoZW5VbmNoYW5nZWRzaG93TW9yZURldGFpbGVkRXJyb3JNZXNzYWdlc4gHEAATAAAAmwcQAB0AAABzdHJ1Y3QgT3RoZXJPcHRpb25zUGx1Z2luT3B0aW9uc2hlYWRpbmdHYXBzb3RoZXJHYXBzZm9ybWF0T3B0aW9uc290aGVyT3B0aW9ucwAAAOgHEAALAAAA8wcQAAkAAAD8BxAADQAAAAkIEAAMAAAAc3RydWN0IFBsdWdpbk9wdGlvbnMhAAAADAAAAAQAAAAiAAAAIwAAAAUAAABhIERpc3BsYXkgaW1wbGVtZW50YXRpb24gcmV0dXJuZWQgYW4gZXJyb3IgdW5leHBlY3RlZGx5ACQAAAAAAAAAAQAAACUAAAAvcnVzdGMvOWIwMDk1NmU1NjAwOWJhYjJhYTE1ZDdiZmYxMDkxNjU5OWUzZDZkNi9saWJyYXJ5L2FsbG9jL3NyYy9zdHJpbmcucnMArAgQAEsAAAD6CQAADgAAAEVycm9yL3J1c3RjLzliMDA5NTZlNTYwMDliYWIyYWExNWQ3YmZmMTA5MTY1OTllM2Q2ZDYvbGlicmFyeS9jb3JlL3NyYy9zdHIvcGF0dGVybi5ycw0JEABPAAAAvwEAADcAAABgYGBzcmMvdG9vbHMvcGFyc2luZy9oZWFkaW5ncy5yc28JEAAdAAAAJgAAADsAAAAvcnVzdGMvOWIwMDk1NmU1NjAwOWJhYjJhYTE1ZDdiZmYxMDkxNjU5OWUzZDZkNi9saWJyYXJ5L2NvcmUvc3JjL3N0ci9wYXR0ZXJuLnJzAJwJEABPAAAAwwUAABQAAACcCRAATwAAAMMFAAAhAAAAnAkQAE8AAAC3BQAAIQAAAJwJEABPAAAARwQAACQAAAAjICMAnAkQAAAAAAAuChAAAQAAAGNhbm5vdCBhY2Nlc3MgYSBUaHJlYWQgTG9jYWwgU3RvcmFnZSB2YWx1ZSBkdXJpbmcgb3IgYWZ0ZXIgZGVzdHJ1Y3Rpb24AACkAAAAAAAAAAQAAACoAAAAvcnVzdGMvOWIwMDk1NmU1NjAwOWJhYjJhYTE1ZDdiZmYxMDkxNjU5OWUzZDZkNi9saWJyYXJ5L3N0ZC9zcmMvdGhyZWFkL2xvY2FsLnJzAJgKEABPAAAABAEAABoAAABpbnZhbGlkIHR5cGU6ICwgZXhwZWN0ZWQgAAAA+AoQAA4AAAAGCxAACwAAAAAAAAD//////////ygLEABBwJbAAAuRCPgKEAAAAAAAKwAAAC9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby02ZjE3ZDIyYmJhMTUwMDFmL3NlcmRlLXdhc20tYmluZGdlbi0wLjYuNS9zcmMvbGliLnJzAAAATAsQAGUAAAA1AAAADgAAAGNsb3N1cmUgaW52b2tlZCByZWN1cnNpdmVseSBvciBhZnRlciBiZWluZyBkcm9wcGVkAAA7AAAADAAAAAQAAAA8AAAAPQAAAAUAAABhIERpc3BsYXkgaW1wbGVtZW50YXRpb24gcmV0dXJuZWQgYW4gZXJyb3IgdW5leHBlY3RlZGx5AD4AAAAAAAAAAQAAAD8AAAAvcnVzdGMvOWIwMDk1NmU1NjAwOWJhYjJhYTE1ZDdiZmYxMDkxNjU5OWUzZDZkNi9saWJyYXJ5L2FsbG9jL3NyYy9zdHJpbmcucnMAWAwQAEsAAAD6CQAADgAAAEVycm9yRU9GIHdoaWxlIHBhcnNpbmcgYSBsaXN0RU9GIHdoaWxlIHBhcnNpbmcgYW4gb2JqZWN0RU9GIHdoaWxlIHBhcnNpbmcgYSBzdHJpbmdFT0Ygd2hpbGUgcGFyc2luZyBhIHZhbHVlZXhwZWN0ZWQgYDpgZXhwZWN0ZWQgYCxgIG9yIGBdYGV4cGVjdGVkIGAsYCBvciBgfWBleHBlY3RlZCBpZGVudGV4cGVjdGVkIHZhbHVlZXhwZWN0ZWQgYCJgaW52YWxpZCBlc2NhcGVpbnZhbGlkIG51bWJlcm51bWJlciBvdXQgb2YgcmFuZ2VpbnZhbGlkIHVuaWNvZGUgY29kZSBwb2ludGNvbnRyb2wgY2hhcmFjdGVyIChcdTAwMDAtXHUwMDFGKSBmb3VuZCB3aGlsZSBwYXJzaW5nIGEgc3RyaW5na2V5IG11c3QgYmUgYSBzdHJpbmdpbnZhbGlkIHZhbHVlOiBleHBlY3RlZCBrZXkgdG8gYmUgYSBudW1iZXIgaW4gcXVvdGVzZmxvYXQga2V5IG11c3QgYmUgZmluaXRlIChnb3QgTmFOIG9yICsvLWluZilsb25lIGxlYWRpbmcgc3Vycm9nYXRlIGluIGhleCBlc2NhcGV0cmFpbGluZyBjb21tYXRyYWlsaW5nIGNoYXJhY3RlcnN1bmV4cGVjdGVkIGVuZCBvZiBoZXggZXNjYXBlcmVjdXJzaW9uIGxpbWl0IGV4Y2VlZGVkIGF0IGxpbmUgIGNvbHVtbiAAALQMEAAAAAAA7Q4QAAkAAAD2DhAACAAAAEVycm9yKCwgbGluZTogLCBjb2x1bW46ICkAAAAYDxAABgAAAB4PEAAIAAAAJg8QAAoAAAAwDxAAAQBB3p7AAAusE/A/AAAAAAAAJEAAAAAAAABZQAAAAAAAQI9AAAAAAACIw0AAAAAAAGr4QAAAAACAhC5BAAAAANASY0EAAAAAhNeXQQAAAABlzc1BAAAAIF+gAkIAAADodkg3QgAAAKKUGm1CAABA5ZwwokIAAJAexLzWQgAANCb1awxDAIDgN3nDQUMAoNiFVzR2QwDITmdtwatDAD2RYORY4UNAjLV4Ha8VRFDv4tbkGktEktVNBs/wgET2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VHIEvZpsc9B0xyK24KFzBFJ5q+NY1nOGpleWHO8LdBTI9t1xdUF0GHp0Vc7SdXSemNHqgUerdGP/wjKxDOF0PL9zf91PFXULr1Df1KNKdWdtkgtlpoB1wAh3Tv7PtHXxyhTi/QPqddb+TK1+QiB2jD6gWB5TVHYvTsju5WeJdrthemrfwb92FX2MoivZ83ZanC+Lds8od3CD+y1UA193JjK9nBRik3ewfuzDmTrId1ye5zRASf53+cIQIcjtMni481QpOqlneKUwqrOIk514Z15KcDV80ngB9lzMQhsHeYIzdH8T4jx5MaCoL0wNcnk9yJI7n5CmeU16dwrHNNx5cKyKZvygEXqMVy2AOwlGem+tOGCKi3t6ZWwjfDY3sXp/RywbBIXlel5Z9yFF5hp725c6NevPUHvSPYkC5gOFe0aNK4PfRLp7TDj7sQtr8HtfBnqezoUkfPaHGEZCp1l8+lTPa4kIkHw4KsPGqwrEfMf0c7hWDfl8+PGQZqxQL307lxrAa5JjfQo9IbAGd5h9TIwpXMiUzn2w95k5/RwDfpx1AIg85Dd+A5MAqkvdbX7iW0BKT6qiftpy0BzjVNd+kI8E5BsqDX+62YJuUTpCfymQI8rlyHZ/M3SsPB97rH+gyOuF88zhf3VsbHJ1ZWFsc2UAQaiywAAL4wEvaG9tZS9ydW5uZXIvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9zZXJkZV9qc29uLTEuMC4xMTcvc3JjL3JlYWQucnMoGRAAYAAAAKMBAAAeAAAAKBkQAGAAAADIAQAAEwAAACgZEABgAAAA0QEAAD4AAAAoGRAAYAAAAM0BAAAzAAAAKBkQAGAAAADXAQAAOgAAACgZEABgAAAAQAIAACUAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAQBBxLTAAAsBAQBB6LXAAAuSHCgZEABgAAAAqAMAAC8AAAD///////////////////////////////////////////////////////////////8AAQIDBAUGBwgJ/////////woLDA0OD///////////////////////////////////CgsMDQ4P////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////L3J1c3RjLzliMDA5NTZlNTYwMDliYWIyYWExNWQ3YmZmMTA5MTY1OTllM2Q2ZDYvbGlicmFyeS9hbGxvYy9zcmMvY29sbGVjdGlvbnMvYnRyZWUvbWFwL2VudHJ5LnJz+BsQAGAAAABxAQAANgAAAGFzc2VydGlvbiBmYWlsZWQ6IGlkeCA8IENBUEFDSVRZL3J1c3RjLzliMDA5NTZlNTYwMDliYWIyYWExNWQ3YmZmMTA5MTY1OTllM2Q2ZDYvbGlicmFyeS9hbGxvYy9zcmMvY29sbGVjdGlvbnMvYnRyZWUvbm9kZS5yc2Fzc2VydGlvbiBmYWlsZWQ6IGVkZ2UuaGVpZ2h0ID09IHNlbGYuaGVpZ2h0IC0gMQCIHBAAWwAAAK8CAAAJAAAAiBwQAFsAAACzAgAACQAAAGFzc2VydGlvbiBmYWlsZWQ6IHNyYy5sZW4oKSA9PSBkc3QubGVuKCmIHBAAWwAAAC8HAAAFAAAAiBwQAFsAAACvBAAAIwAAAIgcEABbAAAA7wQAACQAAABhc3NlcnRpb24gZmFpbGVkOiBlZGdlLmhlaWdodCA9PSBzZWxmLm5vZGUuaGVpZ2h0IC0gMQAAAIgcEABbAAAA8AMAAAkAAAAvcnVzdGMvOWIwMDk1NmU1NjAwOWJhYjJhYTE1ZDdiZmYxMDkxNjU5OWUzZDZkNi9saWJyYXJ5L2FsbG9jL3NyYy9jb2xsZWN0aW9ucy9idHJlZS9uYXZpZ2F0ZS5ycwDUHRAAXwAAAFkCAAAwAAAAL3J1c3RjLzliMDA5NTZlNTYwMDliYWIyYWExNWQ3YmZmMTA5MTY1OTllM2Q2ZDYvbGlicmFyeS9hbGxvYy9zcmMvY29sbGVjdGlvbnMvYnRyZWUvbmF2aWdhdGUucnMARB4QAF8AAADHAAAAJwAAAEAAAAAMAAAABAAAAEEAAABCAAAABQAAAEoAAAAIAAAABAAAAEsAAABMAAAATQAAAGJvb2xlYW4gYGAAAOQeEAAJAAAA7R4QAAEAAABpbnRlZ2VyIGAAAAAAHxAACQAAAO0eEAABAAAAZmxvYXRpbmcgcG9pbnQgYBwfEAAQAAAA7R4QAAEAAABjaGFyYWN0ZXIgYAA8HxAACwAAAO0eEAABAAAAc3RyaW5nIABYHxAABwAAAGJ5dGUgYXJyYXl1bml0IHZhbHVlT3B0aW9uIHZhbHVlbmV3dHlwZSBzdHJ1Y3RzZXF1ZW5jZW1hcGVudW11bml0IHZhcmlhbnRuZXd0eXBlIHZhcmlhbnR0dXBsZSB2YXJpYW50c3RydWN0IHZhcmlhbnQAzB4QAAAAAAAuMGEgYm9vbGVhbmEgc3RyaW5nAFRyaWVkIHRvIHNocmluayB0byBhIGxhcmdlciBjYXBhY2l0efgfEAAkAAAAL3J1c3RjLzliMDA5NTZlNTYwMDliYWIyYWExNWQ3YmZmMTA5MTY1OTllM2Q2ZDYvbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5ycyQgEABMAAAA5wEAAAkAAABKc1ZhbHVlKCkAAACAIBAACAAAAIggEAABAAAAUwAAAAwAAAAEAAAAVAAAAFUAAABWAAAAL3J1c3QvZGVwcy9kbG1hbGxvYy0wLjIuNi9zcmMvZGxtYWxsb2MucnNhc3NlcnRpb24gZmFpbGVkOiBwc2l6ZSA+PSBzaXplICsgbWluX292ZXJoZWFkALQgEAApAAAAqAQAAAkAAABhc3NlcnRpb24gZmFpbGVkOiBwc2l6ZSA8PSBzaXplICsgbWF4X292ZXJoZWFkAAC0IBAAKQAAAK4EAAANAAAAQWNjZXNzRXJyb3IAnCAQAAAAAABlbnRpdHkgbm90IGZvdW5kcGVybWlzc2lvbiBkZW5pZWRjb25uZWN0aW9uIHJlZnVzZWRjb25uZWN0aW9uIHJlc2V0aG9zdCB1bnJlYWNoYWJsZW5ldHdvcmsgdW5yZWFjaGFibGVjb25uZWN0aW9uIGFib3J0ZWRub3QgY29ubmVjdGVkYWRkcmVzcyBpbiB1c2VhZGRyZXNzIG5vdCBhdmFpbGFibGVuZXR3b3JrIGRvd25icm9rZW4gcGlwZWVudGl0eSBhbHJlYWR5IGV4aXN0c29wZXJhdGlvbiB3b3VsZCBibG9ja25vdCBhIGRpcmVjdG9yeWlzIGEgZGlyZWN0b3J5ZGlyZWN0b3J5IG5vdCBlbXB0eXJlYWQtb25seSBmaWxlc3lzdGVtIG9yIHN0b3JhZ2UgbWVkaXVtZmlsZXN5c3RlbSBsb29wIG9yIGluZGlyZWN0aW9uIGxpbWl0IChlLmcuIHN5bWxpbmsgbG9vcClzdGFsZSBuZXR3b3JrIGZpbGUgaGFuZGxlaW52YWxpZCBpbnB1dCBwYXJhbWV0ZXJpbnZhbGlkIGRhdGF0aW1lZCBvdXR3cml0ZSB6ZXJvbm8gc3RvcmFnZSBzcGFjZXNlZWsgb24gdW5zZWVrYWJsZSBmaWxlZmlsZXN5c3RlbSBxdW90YSBleGNlZWRlZGZpbGUgdG9vIGxhcmdlcmVzb3VyY2UgYnVzeWV4ZWN1dGFibGUgZmlsZSBidXN5ZGVhZGxvY2tjcm9zcy1kZXZpY2UgbGluayBvciByZW5hbWV0b28gbWFueSBsaW5rc2ludmFsaWQgZmlsZW5hbWVhcmd1bWVudCBsaXN0IHRvbyBsb25nb3BlcmF0aW9uIGludGVycnVwdGVkdW5zdXBwb3J0ZWR1bmV4cGVjdGVkIGVuZCBvZiBmaWxlb3V0IG9mIG1lbW9yeW90aGVyIGVycm9ydW5jYXRlZ29yaXplZCBlcnJvciAob3MgZXJyb3IgKQAAAJwgEAAAAAAAXSQQAAsAAABoJBAAAQAAAG1lbW9yeSBhbGxvY2F0aW9uIG9mICBieXRlcyBmYWlsZWQAAIQkEAAVAAAAmSQQAA0AAABsaWJyYXJ5L3N0ZC9zcmMvYWxsb2MucnO4JBAAGAAAAGIBAAAJAAAAbGlicmFyeS9zdGQvc3JjL3Bhbmlja2luZy5yc+AkEAAcAAAAhAIAAB4AAABTAAAADAAAAAQAAABXAAAAWAAAAAgAAAAEAAAAWQAAAFgAAAAIAAAABAAAAFoAAABbAAAAXAAAABAAAAAEAAAAXQAAAF4AAABfAAAAAAAAAAEAAABgAAAAb3BlcmF0aW9uIHN1Y2Nlc3NmdWwQAAAAEQAAABIAAAAQAAAAEAAAABMAAAASAAAADQAAAA4AAAAVAAAADAAAAAsAAAAVAAAAFQAAAA8AAAAOAAAAEwAAACYAAAA4AAAAGQAAABcAAAAMAAAACQAAAAoAAAAQAAAAFwAAABkAAAAOAAAADQAAABQAAAAIAAAAGwAAAA4AAAAQAAAAFgAAABUAAAAL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cnNlIGludGVnZXIgZnJvbSBlbXB0eSBzdHJpbmdpbnZhbGlkIGRpZ2l0IGZvdW5kIGluIHN0cmluZ251bWJlciB0b28gbGFyZ2UgdG8gZml0IGluIHRhcmdldCB0eXBlbnVtYmVyIHRvbyBzbWFsbCB0byBmaXQgaW4gdGFyZ2V0IHR5cGVudW1iZXIgd291bGQgYmUgemVybyBmb3Igbm9uLXplcm8gdHlwZWxpYnJhcnkvY29yZS9zcmMvZm10L21vZC5ycykuLjAxMjM0NTY3ODlhYmNkZWZCb3Jyb3dNdXRFcnJvcmFscmVhZHkgYm9ycm93ZWQ6IAApNRAAEgAAAFwoEAAAAAAAY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZQB1AAAAAAAAAAEAAAB2AAAAaW5kZXggb3V0IG9mIGJvdW5kczogdGhlIGxlbiBpcyAgYnV0IHRoZSBpbmRleCBpcyAAAIg1EAAgAAAAqDUQABIAAAB3AAAABAAAAAQAAAB4AAAAPT0hPW1hdGNoZXNhc3NlcnRpb24gYGxlZnQgIHJpZ2h0YCBmYWlsZWQKICBsZWZ0OiAKIHJpZ2h0OiAA5zUQABAAAAD3NRAAFwAAAA42EAAJAAAAIHJpZ2h0YCBmYWlsZWQ6IAogIGxlZnQ6IAAAAOc1EAAQAAAAMDYQABAAAABANhAACQAAAA42EAAJAAAAOiAAAFwoEAAAAAAAbDYQAAIAAAB3AAAADAAAAAQAAAB5AAAAegAAAHsAAAAgICAgLCAsCn0gfSgoCixsaWJyYXJ5L2NvcmUvc3JjL2ZtdC9udW0ucnMAAKc2EAAbAAAAaQAAABcAAAAweDAwMDEwMjAzMDQwNTA2MDcwODA5MTAxMTEyMTMxNDE1MTYxNzE4MTkyMDIxMjIyMzI0MjUyNjI3MjgyOTMwMzEzMjMzMzQzNTM2MzczODM5NDA0MTQyNDM0NDQ1NDY0NzQ4NDk1MDUxNTI1MzU0NTU1NjU3NTg1OTYwNjE2MjYzNjQ2NTY2Njc2ODY5NzA3MTcyNzM3NDc1NzY3Nzc4Nzk4MDgxODI4Mzg0ODU4Njg3ODg4OTkwOTE5MjkzOTQ5NTk2OTc5ODk5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMGZhbHNldHJ1ZQDtNBAAGwAAAFwJAAAaAAAA7TQQABsAAABVCQAAIgAAAHJhbmdlIHN0YXJ0IGluZGV4ICBvdXQgb2YgcmFuZ2UgZm9yIHNsaWNlIG9mIGxlbmd0aCAIOBAAEgAAABo4EAAiAAAAcmFuZ2UgZW5kIGluZGV4IEw4EAAQAAAAGjgQACIAAABzbGljZSBpbmRleCBzdGFydHMgYXQgIGJ1dCBlbmRzIGF0IABsOBAAFgAAAII4EAANAAAAYXR0ZW1wdGVkIHRvIGluZGV4IHNsaWNlIHVwIHRvIG1heGltdW0gdXNpemWgOBAALAAAAGxpYnJhcnkvY29yZS9zcmMvc3RyL3BhdHRlcm4ucnMA1DgQAB8AAABSBQAAEgAAANQ4EAAfAAAAUgUAACgAAADUOBAAHwAAAEUGAAAVAAAA1DgQAB8AAABzBgAAFQAAANQ4EAAfAAAAdAYAABUAAABbLi4uXWJlZ2luIDw9IGVuZCAoIDw9ICkgd2hlbiBzbGljaW5nIGBgSTkQAA4AAABXORAABAAAAFs5EAAQAAAAazkQAAEAAABieXRlIGluZGV4ICBpcyBub3QgYSBjaGFyIGJvdW5kYXJ5OyBpdCBpcyBpbnNpZGUgIChieXRlcyApIG9mIGAAjDkQAAsAAACXORAAJgAAAL05EAAIAAAAxTkQAAYAAABrORAAAQAAACBpcyBvdXQgb2YgYm91bmRzIG9mIGAAAIw5EAALAAAA9DkQABYAAABrORAAAQAAAGxpYnJhcnkvY29yZS9zcmMvc3RyL21vZC5ycwAkOhAAGwAAAA0BAAAsAAAAbGlicmFyeS9jb3JlL3NyYy91bmljb2RlL3ByaW50YWJsZS5ycwAAAFA6EAAlAAAAGgAAADYAAABQOhAAJQAAAAoAAAArAAAAAAYBAQMBBAIFBwcCCAgJAgoFCwIOBBABEQISBRMRFAEVAhcCGQ0cBR0IHwEkAWoEawKvA7ECvALPAtEC1AzVCdYC1wLaAeAF4QLnBOgC7iDwBPgC+gP7AQwnOz5OT4+enp97i5OWorK6hrEGBwk2PT5W89DRBBQYNjdWV3+qrq+9NeASh4mOngQNDhESKTE0OkVGSUpOT2RlXLa3GxwHCAoLFBc2OTqoqdjZCTeQkagHCjs+ZmmPkhFvX7/u71pi9Pz/U1Samy4vJyhVnaCho6SnqK26vMQGCwwVHTo/RVGmp8zNoAcZGiIlPj/n7O//xcYEICMlJigzODpISkxQU1VWWFpcXmBjZWZrc3h9f4qkqq+wwNCur25vvpNeInsFAwQtA2YDAS8ugIIdAzEPHAQkCR4FKwVEBA4qgKoGJAQkBCgINAtOQ4E3CRYKCBg7RTkDYwgJMBYFIQMbBQFAOARLBS8ECgcJB0AgJwQMCTYDOgUaBwQMB1BJNzMNMwcuCAqBJlJLKwgqFhomHBQXCU4EJAlEDRkHCgZICCcJdQtCPioGOwUKBlEGAQUQAwWAi2IeSAgKgKZeIkULCgYNEzoGCjYsBBeAuTxkUwxICQpGRRtICFMNSQcKgPZGCh0DR0k3Aw4ICgY5BwqBNhkHOwMcVgEPMg2Dm2Z1C4DEikxjDYQwEBaPqoJHobmCOQcqBFwGJgpGCigFE4KwW2VLBDkHEUAFCwIOl/gIhNYqCaLngTMPAR0GDgQIgYyJBGsFDQMJBxCSYEcJdDyA9gpzCHAVRnoUDBQMVwkZgIeBRwOFQg8VhFAfBgaA1SsFPiEBcC0DGgQCgUAfEToFAYHQKoLmgPcpTAQKBAKDEURMPYDCPAYBBFUFGzQCgQ4sBGQMVgqArjgdDSwECQcCDgaAmoPYBBEDDQN3BF8GDAQBDwwEOAgKBigIIk6BVAwdAwkHNggOBAkHCQeAyyUKhAYAAQMFBQYGAgcGCAcJEQocCxkMGg0QDgwPBBADEhITCRYBFwQYARkDGgcbARwCHxYgAysDLQsuATADMQIyAacCqQKqBKsI+gL7Bf0C/gP/Ca14eYuNojBXWIuMkBzdDg9LTPv8Li8/XF1f4oSNjpGSqbG6u8XGycre5OX/AAQREikxNDc6Oz1JSl2EjpKpsbS6u8bKzs/k5QAEDQ4REikxNDo7RUZJSl5kZYSRm53Jzs8NESk6O0VJV1tcXl9kZY2RqbS6u8XJ3+Tl8A0RRUlkZYCEsry+v9XX8PGDhYukpr6/xcfP2ttImL3Nxs7PSU5PV1leX4mOj7G2t7/BxsfXERYXW1z29/7/gG1x3t8OH25vHB1ffX6ur3+7vBYXHh9GR05PWFpcXn5/tcXU1dzw8fVyc490dZYmLi+nr7e/x8/X35pAl5gwjx/S1M7/Tk9aWwcIDxAnL+7vbm83PT9CRZCRU2d1yMnQ0djZ5/7/ACBfIoLfBIJECBsEBhGBrA6AqwUfCYEbAxkIAQQvBDQEBwMBBwYHEQpQDxIHVQcDBBwKCQMIAwcDAgMDAwwEBQMLBgEOFQVOBxsHVwcCBhcMUARDAy0DAQQRBg8MOgQdJV8gbQRqJYDIBYKwAxoGgv0DWQcWCRgJFAwUDGoGCgYaBlkHKwVGCiwEDAQBAzELLAQaBgsDgKwGCgYvMU0DgKQIPAMPAzwHOAgrBYL/ERgILxEtAyEPIQ+AjASClxkLFYiUBS8FOwcCDhgJgL4idAyA1hoMBYD/BYDfDPKdAzcJgVwUgLgIgMsFChg7AwoGOAhGCAwGdAseA1oEWQmAgxgcChYJTASAigarpAwXBDGhBIHaJgcMBQWAphCB9QcBICoGTASAjQSAvgMbAw8NbGlicmFyeS9jb3JlL3NyYy91bmljb2RlL3VuaWNvZGVfZGF0YS5ycxRAEAAoAAAAUAAAACgAAAAUQBAAKAAAAFwAAAAWAAAAbGlicmFyeS9jb3JlL3NyYy9lc2NhcGUucnMAAFxAEAAaAAAAOAAAAAsAAABcdXsAXEAQABoAAABmAAAAIwAAAGxpYnJhcnkvY29yZS9zcmMvbnVtL2JpZ251bS5ycwAAnEAQAB4AAACsAQAAAQAAAGFzc2VydGlvbiBmYWlsZWQ6IG5vYm9ycm93YXNzZXJ0aW9uIGZhaWxlZDogZGlnaXRzIDwgNDBhc3NlcnRpb24gZmFpbGVkOiBvdGhlciA+IDAAAAADAACDBCAAkQVgAF0ToAASFyAfDCBgH+8soCsqMCAsb6bgLAKoYC0e+2AuAP4gNp7/YDb9AeE2AQohNyQN4TerDmE5LxihOTAcYUjzHqFMQDRhUPBqoVFPbyFSnbyhUgDPYVNl0aFTANohVADg4VWu4mFX7OQhWdDooVkgAO5Z8AF/WgBwAAcALQEBAQIBAgEBSAswFRABZQcCBgICAQQjAR4bWws6CQkBGAQBCQEDAQUrAzwIKhgBIDcBAQEECAQBAwcKAh0BOgEBAQIECAEJAQoCGgECAjkBBAIEAgIDAwEeAgMBCwI5AQQFAQIEARQCFgYBAToBAQIBBAgBBwMKAh4BOwEBAQwBCQEoAQMBNwEBAwUDAQQHAgsCHQE6AQIBAgEDAQUCBwILAhwCOQIBAQIECAEJAQoCHQFIAQQBAgMBAQgBUQECBwwIYgECCQsHSQIbAQEBAQE3DgEFAQIFCwEkCQFmBAEGAQICAhkCBAMQBA0BAgIGAQ8BAAMAAx0CHgIeAkACAQcIAQILCQEtAwEBdQIiAXYDBAIJAQYD2wICAToBAQcBAQEBAggGCgIBMB8xBDAHAQEFASgJDAIgBAICAQM4AQECAwEBAzoIAgKYAwENAQcEAQYBAwLGQAABwyEAA40BYCAABmkCAAQBCiACUAIAAQMBBAEZAgUBlwIaEg0BJggZCy4DMAECBAICJwFDBgICAgIMAQgBLwEzAQEDAgIFAgEBKgIIAe4BAgEEAQABABAQEAACAAHiAZUFAAMBAgUEKAMEAaUCAAQAAlADRgsxBHsBNg8pAQICCgMxBAICBwE9AyQFAQg+AQwCNAkKBAIBXwMCAQECBgECAZ0BAwgVAjkCAQEBARYBDgcDBcMIAgMBARcBUQECBgEBAgEBAgEC6wECBAYCAQIbAlUIAgEBAmoBAQECBgEBZQMCBAEFAAkBAvUBCgIBAQQBkAQCAgQBIAooBgIECAEJBgIDLg0BAgAHAQYBAVIWAgcBAgECegYDAQECAQcBAUgCAwEBAQACCwI0BQUBAQEAAQYPAAU7BwABPwRRAQACAC4CFwABAQMEBQgIAgceBJQDADcEMggBDgEWBQEPAAcBEQIHAQIBBWQBoAcAAT0EAAQAB20HAGCA8AACAgICAgICAgIDAwEBAQBBm4nBAAsQAQAAAAAAAAACAgAAAAAAAgBB2onBAAsBAgBBgIrBAAsBAQBBm4rBAAsBAQBB/IrBAAsnJgAAAB0AAAAmAAAAJgAAACYAAAA4NBAAXjQQAHs0EAChNBAAxzQQAHsJcHJvZHVjZXJzAghsYW5ndWFnZQEEUnVzdAAMcHJvY2Vzc2VkLWJ5AwVydXN0Yx0xLjc4LjAgKDliMDA5NTZlNSAyMDI0LTA0LTI5KQZ3YWxydXMGMC4yMC4zDHdhc20tYmluZGdlbhIwLjIuOTIgKDJhNGE0OTM2MikALA90YXJnZXRfZmVhdHVyZXMCKw9tdXRhYmxlLWdsb2JhbHMrCHNpZ24tZXh0', imports)}

/** Entry Point. */
class FormattoPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.utils = new FormattoUtils(this);
        this.icons = new FormattoIcons();
        this.ribbonIcons = new FormattoRibbonIcons(this);
        this.editorMenus = new FormattoEditorMenu(this);
        this.commands = new FormattoCommands(this);
    }
    /** Load and Save Options */
    loadOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_OPTIONS, yield this.loadData());
        });
    }
    saveOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    /** Runs whenever the user starts using the plugin in Obsidian. */
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadOptions();
            // Initialize WebAssembly
            yield (() => __awaiter(this, void 0, void 0, function* () {
                // @ts-expect-error: formatto_wasm should be called.
                yield __wbg_init(yield formatto_wasm());
            }))();
            this.addSettingTab(new FormattoOptionTab(this.app, this));
            this.icons.registerIcons();
            this.ribbonIcons.registerRibbonIcons();
            this.editorMenus.registerEditorMenus();
            this.commands.registerCommands();
            console.log("Plugin Loaded: Formatto\n(Some error details are going to be displayed here.)");
        });
    }
    /** Runs when the plugin is disabled. */
    onunload() {
        console.log("Plugin Unloaded: Formatto");
    }
}

module.exports = FormattoPlugin;
