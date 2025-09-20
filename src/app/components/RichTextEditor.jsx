"use client";

import React, { useEffect, useState } from "react";
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
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Unlink,
  Quote,
  List,
  ListOrdered,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Palette,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  RemoveFormatting,
  Pilcrow,
} from "lucide-react";

/**
 * Font size extension with commands
 */
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
              const size = element.style.fontSize;
              return size ? parseInt(size.replace("px", ""), 10) : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          if (!size || isNaN(Number(size))) return true;
          return chain().setMark("textStyle", { fontSize: Number(size) }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// Default heading sizes
const headingSizes = {
  1: 32,
  2: 28,
  3: 24,
};

export default function RichTextEditor({ initialHTML = "", onChange }) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      Placeholder.configure({ placeholder: "Buraya yazmaya başlayın…" }),
      CharacterCount,
    ],
    content: initialHTML || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[300px] p-4 focus:outline-none leading-relaxed text-black",
        style: [
          "--tw-prose-body: #000",
          "--tw-prose-headings: #000",
          "--tw-prose-lead: #000",
          "--tw-prose-links: #1d4ed8", // linkler mavi kalsın
          "--tw-prose-bold: #000",
          "--tw-prose-counters: #000",
          "--tw-prose-bullets: #000",
          "--tw-prose-quotes: #000",
          "--tw-prose-quote-borders: #000",
          "--tw-prose-captions: #000",
          "--tw-prose-code: #000",
          "--tw-prose-pre-code: #000",
          "--tw-prose-th-borders: #000",
          "--tw-prose-td-borders: #000",
        ].join("; "),
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="w-full min-h-[300px] border rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Editör yükleniyor...</div>
      </div>
    );
  }
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  };

  const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  const ToolbarSeparator = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  const handleHeading = (level) => {
    const wasActive = editor.isActive("heading", { level });
    editor.chain().focus().toggleHeading({ level }).run();
    if (!wasActive) {
      editor.chain().focus().setFontSize(headingSizes[level]).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
  };

  const currentFontSize = editor.getAttributes("textStyle").fontSize ?? "";

  return (
    <div className="w-full border rounded-lg bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo/Redo */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri al">
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="İleri al">
            <Redo size={18} />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Paragraph */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().unsetFontSize().run()}
            isActive={editor.isActive("paragraph")}
            title="Paragraf"
          >
            <Pilcrow size={18} />
          </ToolbarButton>

          {/* Headings */}
          {[1, 2, 3].map((level) => (
            <ToolbarButton key={level} onClick={() => handleHeading(level)} isActive={editor.isActive("heading", { level })} title={`Başlık ${level}`}>
              {level === 1 ? <Heading1 size={18} /> : level === 2 ? <Heading2 size={18} /> : <Heading3 size={18} />}
            </ToolbarButton>
          ))}

          <ToolbarSeparator />

          {/* Text formatting */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Kalın">
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="İtalik">
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Altı çizili">
            <UnderlineIcon size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Üstü çizili">
            <Strikethrough size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} title="Kod">
            <Code size={18} />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Sub/Superscript */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive("subscript")} title="Alt simge">
            <SubscriptIcon size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive("superscript")} title="Üst simge">
            <SuperscriptIcon size={18} />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Lists */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Madde işaretli liste">
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numaralı liste">
            <ListOrdered size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Alıntı">
            <Quote size={18} />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Alignment */}
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Sola hizala">
            <AlignLeft size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Ortala">
            <AlignCenter size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Sağa hizala">
            <AlignRight size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editor.isActive({ textAlign: "justify" })} title="İki yana yasla">
            <AlignJustify size={18} />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Link */}
          <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title="Bağlantı ekle">
            <LinkIcon size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Bağlantıyı kaldır">
            <Unlink size={18} />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Color & Highlight */}
          <ToolbarButton
            onClick={() => {
              const color = window.prompt("Renk kodu (ör: #ff0000)");
              if (color) editor.chain().focus().setColor(color).run();
            }}
            title="Metin rengi"
          >
            <Palette size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const color = window.prompt("Vurgu rengi (ör: #ffff00)");
              if (color) editor.chain().focus().toggleHighlight({ color }).run();
            }}
            title="Vurgu rengi"
          >
            <Highlighter size={18} />
          </ToolbarButton>
            
          <ToolbarSeparator />

{/* Font size */}
<select
  className="border rounded p-1 text-sm text-black" // buraya text-black ekledik
  value={currentFontSize}
  onChange={(e) => {
    const v = e.target.value;
    if (v === "") {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(Number(v)).run();
    }
  }}
  title="Yazı boyutu"
>
  <option value="" className="text-black">Boyut (temizle)</option>
  {[...Array(55)].map((_, i) => {
    const size = i + 6; // 6px - 60px
    return (
      <option key={size} value={size} className="text-black">
        {size}px
      </option>
    );
  })}
</select>

{/* Font family */}
<select
  className="border rounded p-1 text-sm ml-1 text-black" // buraya text-black ekledik
  value={editor.getAttributes("textStyle").fontFamily || ""}
  onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
  title="Yazı tipi"
>
  <option value="" className="text-black">Varsayılan</option>
  <option value="Arial" className="text-black">Arial</option>
  <option value="Helvetica" className="text-black">Helvetica</option>
  <option value='"Times New Roman"' className="text-black">Times New Roman</option>
  <option value='"Courier New"' className="text-black">Courier New</option>
  <option value="Verdana" className="text-black">Verdana</option>
</select>


          <ToolbarSeparator />

          {/* Clear formatting & Horizontal line */}
          <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Biçimlendirmeyi temizle">
            <RemoveFormatting size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay çizgi ekle">
            <Minus size={18} />
          </ToolbarButton>
<div className="ml-auto">
  <button
    className="px-3 py-1 bg-gray-200 text-black rounded text-sm font-medium
               transition transform duration-200 ease-in-out
               hover:bg-gray-300 hover:scale-105 hover:shadow-md"
    onClick={() => alert("Kendi hür irademle yaptığım el emeği göz nuru metin editörümü güle güle kullanın. ")}
    title="Text Editor by Can Matik"
  >
    Text Editor by Can Matik
  </button>
</div>
        </div>
      </div>

      {/* Editor content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-4 py-2 text-sm text-gray-500 flex gap-4">
        <span>{editor.storage.characterCount.words()} kelime</span>
        <span>{editor.storage.characterCount.characters()} karakter</span>
      </div>
    </div>
  );
}
