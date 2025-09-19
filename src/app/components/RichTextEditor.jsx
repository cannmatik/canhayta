"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

// v3: TextStyle, Color, FontFamily -> named export
import { TextStyle, Color, FontFamily } from "@tiptap/extension-text-style";

// Tiptap Core: kendi FontSize eklentimizi yazacağız
import { Extension } from "@tiptap/core";

/** ---- FontSize: TextStyle üzerine global attribute ekler ---- */
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const v = element.style.fontSize;
              return v ? parseInt(v.replace("px", ""), 10) : null;
            },
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}px` };
            },
          },
        },
      },
    ];
  },
});

export default function RichTextEditor({ initialHTML = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      // Stil işaretleri ve özellikleri
      TextStyle,
      FontSize,
      FontFamily,
      Color, // setColor / unsetColor komutları
      Underline,
      Highlight,
      Subscript,
      Superscript,

      // Hizalama
      TextAlign.configure({ types: ["heading", "paragraph"] }),

      // Link
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),

      // Placeholder & Karakter sayacı
      Placeholder.configure({
        placeholder: "Buraya yazmaya başlayın…",
      }),
      CharacterCount,
    ],
    content: initialHTML || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] w-full p-3 focus:outline-none leading-7 prose prose-sm max-w-none text-black",
      },
    },
    // Next.js ile SSR sorunlarını engelle
    immediatelyRender: false, // v3 Next.js rehberi tavsiyesi
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  // Toolbar’ı seçim/transaction’larda tazeleyelim
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => {
    if (!editor) return;
    const rerender = () => forceUpdate((x) => x + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    editor.on("update", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
      editor.off("update", rerender);
    };
  }, [editor]);

  if (!editor) return null;

  // Aktif text style’ları oku
  const ts = editor.getAttributes("textStyle") || {};
  const currentFontSize =
    Number.isFinite(ts.fontSize) && ts.fontSize > 0 ? ts.fontSize : null;
  const currentFontFamily = ts.fontFamily || "";
  const currentColor = ts.color || "#000000";

  const btn =
    "px-2 py-1 border rounded text-sm bg-white hover:bg-gray-200 active:scale-[.98] text-black font-medium disabled:bg-gray-100 disabled:text-gray-400";

  const changeFontSize = (delta) => {
    const base = currentFontSize ?? 16;
    const next = Math.max(1, base + delta);
    editor.chain().focus().setMark("textStyle", { fontSize: next }).run();
  };

  const setFontSize = (value) => {
    const n = parseInt(value, 10);
    if (!value) {
      editor.chain().focus().setMark("textStyle", { fontSize: null }).run();
      return;
    }
    if (Number.isFinite(n) && n > 0) {
      editor.chain().focus().setMark("textStyle", { fontSize: n }).run();
    }
  };

  const setFont = (family) => {
    if (!family) {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(family).run();
    }
  };

  const applyColor = (color) => {
    if (!color) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  const setHeading = (level) => {
    if (level === 0) return editor.chain().focus().setParagraph().run();
    return editor.chain().focus().toggleHeading({ level }).run();
  };

  const setLinkPrompt = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Bağlantı URL", prev);
    if (url === null) return; // iptal
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();
  };

  return (
    <div className="w-full space-y-2">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Undo / Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={btn}
          disabled={!editor.can().undo()}
          title="Geri Al"
        >
          ↶
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={btn}
          disabled={!editor.can().redo()}
          title="İleri Al"
        >
          ↷
        </button>

        {/* Bold / Italic / Underline / Strike / Code */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          title="Kalın"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          title="İtalik"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${btn} ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
          title="Altı Çizili"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btn} ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
          title="Üstü Çizili"
        >
          S
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${btn} ${editor.isActive("code") ? "bg-gray-200" : ""}`}
          title="Inline Code"
        >
          {"</>"}
        </button>

        {/* Sub/Sup */}
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`${btn} ${editor.isActive("subscript") ? "bg-gray-200" : ""}`}
          title="Alt Simge"
        >
          x<sub>2</sub>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`${btn} ${editor.isActive("superscript") ? "bg-gray-200" : ""}`}
          title="Üst Simge"
        >
          x<sup>2</sup>
        </button>

        {/* Başlık */}
        <select
          className={btn}
          onChange={(e) => setHeading(parseInt(e.target.value, 10))}
          value={
            [1, 2, 3, 4, 5, 6].find((l) => editor.isActive("heading", { level: l })) ?? 0
          }
          title="Başlık"
        >
          <option value={0}>Paragraf</option>
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
          <option value={6}>H6</option>
        </select>

        {/* Font Family */}
        <select
          className={btn}
          onChange={(e) => setFont(e.target.value)}
          value={currentFontFamily || ""}
          title="Yazı Tipi"
        >
          <option value="">(Varsayılan)</option>
          <option value="Inter">Inter (Modern)</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Playfair Display">Playfair Display</option>
        </select>

        {/* Font Size */}
        <div className="flex items-center gap-1">
          <button
            className={btn}
            onClick={() => changeFontSize(-1)}
            title="Yazı Boyutunu Azalt"
          >
            −
          </button>
          <input
            className={`${btn} w-20 text-center`}
            type="number"
            min={1}
            placeholder="16"
            value={currentFontSize ?? ""}
            onChange={(e) => setFontSize(e.target.value)}
            title="Yazı Boyutu (px)"
          />
          <button
            className={btn}
            onClick={() => changeFontSize(1)}
            title="Yazı Boyutunu Artır"
          >
            +
          </button>
          <span className="text-xs text-gray-500 ml-1">px</span>
        </div>

        {/* Renk & Vurgu */}
        <input
          type="color"
          className="w-8 h-8 border rounded cursor-pointer"
          value={currentColor}
          onChange={(e) => applyColor(e.target.value)}
          title="Metin Rengi"
        />
        <button
          className={btn}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Vurgu"
        >
          Vurgu
        </button>

        {/* Hizalama */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${btn} ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
          title="Sola Hizala"
        >
          ←
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${btn} ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
          title="Ortala"
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${btn} ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
          title="Sağa Hizala"
        >
          →
        </button>

        {/* Listeler */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btn} ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
          title="Madde İşaretli Liste"
        >
          • Liste
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btn} ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
          title="Numaralı Liste"
        >
          1. Liste
        </button>
        <button
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          className={btn}
          title="Girinti Artır (Liste)"
        >
          →|
        </button>
        <button
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          className={btn}
          title="Girinti Azalt (Liste)"
        >
          |←
        </button>

        {/* Alıntı / Kod Bloğu / Çizgi */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btn} ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
          title="Alıntı"
        >
          “Alıntı”
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${btn} ${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
          title="Kod Bloğu"
        >
          {"</> Block"}
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btn}
          title="Yatay Çizgi"
        >
          Çizgi
        </button>

        {/* Link */}
        <button onClick={setLinkPrompt} className={btn} title="Bağlantı Ekle/Düzenle">
          Link
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={btn}
          title="Bağlantıyı Kaldır"
        >
          Unlink
        </button>

        {/* Temizle */}
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className={btn}
          title="Tüm Biçimlendirmeyi Temizle"
        >
          Temizle
        </button>
      </div>

      {/* EDITOR */}
      <div className="rounded border bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* FOOTER */}
      <div className="text-xs text-gray-500">
        {editor.storage.characterCount.characters()} karakter
      </div>
    </div>
  );
}
