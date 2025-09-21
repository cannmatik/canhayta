"use client";
import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell as TTTableCell } from "@tiptap/extension-table-cell";
import { TableHeader as TTTableHeader } from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";
import Resizable from "tiptap-extension-resizable"; // Yeni: npm install tiptap-extension-resizable ile yükle

/* ---------------- Icons (MUI) ---------------- */
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TableChartIcon from "@mui/icons-material/TableChart";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HighlightIcon from "@mui/icons-material/Highlight";
import BrushIcon from "@mui/icons-material/Brush";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BorderTopIcon from "@mui/icons-material/BorderTop";
import BorderBottomIcon from "@mui/icons-material/BorderBottom";
import BorderLeftIcon from "@mui/icons-material/BorderLeft";
import BorderRightIcon from "@mui/icons-material/BorderRight";
import BorderOuterIcon from "@mui/icons-material/BorderOuter";
import BorderInnerIcon from "@mui/icons-material/BorderInner";

/* ---------- FontSize Extension (TextStyle üstüne) ---------- */
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => {
              const size = el.style.fontSize;
              return size ? parseInt(size.replace("px", ""), 10) : null;
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
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

/* ---------- CustomImage: width/height + border attr ---------- */
const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent(),
      width: {
        default: null,
        parseHTML: (el) => el.style.width || el.getAttribute("width"),
        renderHTML: (attrs) => (attrs.width ? { style: `width: ${attrs.width}`, width: attrs.width } : {}),
      },
      height: {
        default: null,
        parseHTML: (el) => el.style.height || el.getAttribute("height"),
        renderHTML: (attrs) => (attrs.height ? { style: `height: ${attrs.height}`, height: attrs.height } : {}),
      },
      borderColor: {
        default: null,
        parseHTML: (el) => el.style.borderColor || null,
        renderHTML: (attrs) => (attrs.borderColor ? { style: `border-color: ${attrs.borderColor}` } : {}),
      },
      borderWidth: {
        default: null,
        parseHTML: (el) => el.style.borderWidth || null,
        renderHTML: (attrs) => (attrs.borderWidth ? { style: `border-width: ${attrs.borderWidth}` } : {}),
      },
      borderStyle: {
        default: null,
        parseHTML: (el) => el.style.borderStyle || null,
        renderHTML: (attrs) => (attrs.borderStyle ? { style: `border-style: ${attrs.borderStyle}` } : {}),
      },
      borderRadius: {
        default: null,
        parseHTML: (el) => el.style.borderRadius || null,
        renderHTML: (attrs) => (attrs.borderRadius ? { style: `border-radius: ${attrs.borderRadius}` } : {}),
      },
    };
  },
});

/* ---------- TableCell / TableHeader: individual border attrs ---------- */
const TableCell = TTTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderTopColor: { default: null, parseHTML: (el) => el.style.borderTopColor || null, renderHTML: (attrs) => (attrs.borderTopColor ? { style: `border-top-color: ${attrs.borderTopColor}` } : {}) },
      borderTopWidth: { default: null, parseHTML: (el) => el.style.borderTopWidth || null, renderHTML: (attrs) => (attrs.borderTopWidth ? { style: `border-top-width: ${attrs.borderTopWidth}` } : {}) },
      borderTopStyle: { default: null, parseHTML: (el) => el.style.borderTopStyle || null, renderHTML: (attrs) => (attrs.borderTopStyle ? { style: `border-top-style: ${attrs.borderTopStyle}` } : {}) },
      borderBottomColor: { default: null, parseHTML: (el) => el.style.borderBottomColor || null, renderHTML: (attrs) => (attrs.borderBottomColor ? { style: `border-bottom-color: ${attrs.borderBottomColor}` } : {}) },
      borderBottomWidth: { default: null, parseHTML: (el) => el.style.borderBottomWidth || null, renderHTML: (attrs) => (attrs.borderBottomWidth ? { style: `border-bottom-width: ${attrs.borderBottomWidth}` } : {}) },
      borderBottomStyle: { default: null, parseHTML: (el) => el.style.borderBottomStyle || null, renderHTML: (attrs) => (attrs.borderBottomStyle ? { style: `border-bottom-style: ${attrs.borderBottomStyle}` } : {}) },
      borderLeftColor: { default: null, parseHTML: (el) => el.style.borderLeftColor || null, renderHTML: (attrs) => (attrs.borderLeftColor ? { style: `border-left-color: ${attrs.borderLeftColor}` } : {}) },
      borderLeftWidth: { default: null, parseHTML: (el) => el.style.borderLeftWidth || null, renderHTML: (attrs) => (attrs.borderLeftWidth ? { style: `border-left-width: ${attrs.borderLeftWidth}` } : {}) },
      borderLeftStyle: { default: null, parseHTML: (el) => el.style.borderLeftStyle || null, renderHTML: (attrs) => (attrs.borderLeftStyle ? { style: `border-left-style: ${attrs.borderLeftStyle}` } : {}) },
      borderRightColor: { default: null, parseHTML: (el) => el.style.borderRightColor || null, renderHTML: (attrs) => (attrs.borderRightColor ? { style: `border-right-color: ${attrs.borderRightColor}` } : {}) },
      borderRightWidth: { default: null, parseHTML: (el) => el.style.borderRightWidth || null, renderHTML: (attrs) => (attrs.borderRightWidth ? { style: `border-right-width: ${attrs.borderRightWidth}` } : {}) },
      borderRightStyle: { default: null, parseHTML: (el) => el.style.borderRightStyle || null, renderHTML: (attrs) => (attrs.borderRightStyle ? { style: `border-right-style: ${attrs.borderRightStyle}` } : {}) },
    };
  },
});

const TableHeader = TTTableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderTopColor: { default: null, parseHTML: (el) => el.style.borderTopColor || null, renderHTML: (attrs) => (attrs.borderTopColor ? { style: `border-top-color: ${attrs.borderTopColor}` } : {}) },
      borderTopWidth: { default: null, parseHTML: (el) => el.style.borderTopWidth || null, renderHTML: (attrs) => (attrs.borderTopWidth ? { style: `border-top-width: ${attrs.borderTopWidth}` } : {}) },
      borderTopStyle: { default: null, parseHTML: (el) => el.style.borderTopStyle || null, renderHTML: (attrs) => (attrs.borderTopStyle ? { style: `border-top-style: ${attrs.borderTopStyle}` } : {}) },
      borderBottomColor: { default: null, parseHTML: (el) => el.style.borderBottomColor || null, renderHTML: (attrs) => (attrs.borderBottomColor ? { style: `border-bottom-color: ${attrs.borderBottomColor}` } : {}) },
      borderBottomWidth: { default: null, parseHTML: (el) => el.style.borderBottomWidth || null, renderHTML: (attrs) => (attrs.borderBottomWidth ? { style: `border-bottom-width: ${attrs.borderBottomWidth}` } : {}) },
      borderBottomStyle: { default: null, parseHTML: (el) => el.style.borderBottomStyle || null, renderHTML: (attrs) => (attrs.borderBottomStyle ? { style: `border-bottom-style: ${attrs.borderBottomStyle}` } : {}) },
      borderLeftColor: { default: null, parseHTML: (el) => el.style.borderLeftColor || null, renderHTML: (attrs) => (attrs.borderLeftColor ? { style: `border-left-color: ${attrs.borderLeftColor}` } : {}) },
      borderLeftWidth: { default: null, parseHTML: (el) => el.style.borderLeftWidth || null, renderHTML: (attrs) => (attrs.borderLeftWidth ? { style: `border-left-width: ${attrs.borderLeftWidth}` } : {}) },
      borderLeftStyle: { default: null, parseHTML: (el) => el.style.borderLeftStyle || null, renderHTML: (attrs) => (attrs.borderLeftStyle ? { style: `border-left-style: ${attrs.borderLeftStyle}` } : {}) },
      borderRightColor: { default: null, parseHTML: (el) => el.style.borderRightColor || null, renderHTML: (attrs) => (attrs.borderRightColor ? { style: `border-right-color: ${attrs.borderRightColor}` } : {}) },
      borderRightWidth: { default: null, parseHTML: (el) => el.style.borderRightWidth || null, renderHTML: (attrs) => (attrs.borderRightWidth ? { style: `border-right-width: ${attrs.borderRightWidth}` } : {}) },
      borderRightStyle: { default: null, parseHTML: (el) => el.style.borderRightStyle || null, renderHTML: (attrs) => (attrs.borderRightStyle ? { style: `border-right-style: ${attrs.borderRightStyle}` } : {}) },
    };
  },
});

/* ---------- Başlık presetleri ---------- */
const headingPresetSizes = { 1: 32, 2: 28, 3: 24, 4: 20, 5: 18, 6: 16 };

/* ---------- Toolbar Button ---------- */
function ToolbarButton({ title, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded-md text-sm transition-colors mr-1 ${
        active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

/* ---------- Toolbar Group with Label ---------- */
function ToolbarGroup({ label, children, collapsible = false }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!collapsible) {
    return (
      <div className="flex flex-col mr-4">
        <span className="text-xs text-gray-500 mb-1">{label}</span>
        <div className="flex flex-wrap items-center gap-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mr-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-xs text-gray-500 mb-1 hover:text-gray-700"
      >
        {label}
        <ExpandMoreIcon className={`ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} fontSize="small" />
      </button>
      {isOpen && <div className="flex flex-wrap items-center gap-1">{children}</div>}
    </div>
  );
}

/* ---------------- Main Editor ---------------- */
export default function RichTextEditor({ initialHTML = "", onChange }) {
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState("");
  const [currentFontFamily, setCurrentFontFamily] = useState("");
  const [currentAlign, setCurrentAlign] = useState("");

  const [borderColor, setBorderColor] = useState("#D1D5DB"); // default gray-300
  const [borderWidth, setBorderWidth] = useState("1px");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderRadius, setBorderRadius] = useState("0px"); // Yeni: Köşe yuvarlama için
  const [borderSide, setBorderSide] = useState("all"); // Yeni: Kenarlık tarafı için

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "Buraya yazmaya başlayın..." }),
      CharacterCount,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      CustomImage.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Resizable.configure({
        types: ["image"], // Sadece resim için resizable
        handlerStyle: { width: "8px", height: "8px", background: "#07c160" },
        layerStyle: { border: "2px solid #07c160" },
      }), // Yeni: Resizable extension
    ],
    content: initialHTML || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[260px] p-4 focus:outline-none leading-relaxed text-black",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      // içerik değiştiğinde de toolbar'ı güncel tutalım
      updateToolbarState(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      // SEÇİM değişince font, family ve align değerlerini güncelle
      updateToolbarState(editor);
    },
    autofocus: false,
  });

  function updateToolbarState(ed) {
    // font size: textStyle.fontSize varsa onu, yoksa heading presetini göster
    const textStyleFontSize = ed.getAttributes("textStyle").fontSize ?? "";
    const headingLevel = ed.getAttributes("heading").level ?? null;
    const size = textStyleFontSize || (headingLevel ? headingPresetSizes[headingLevel] : "");
    setCurrentFontSize(size || "");

    const ff = ed.getAttributes("textStyle").fontFamily ?? "";
    setCurrentFontFamily(ff || "");

    // align: aktif bloktan oku
    const align = ["left", "center", "right", "justify"].find((a) =>
      ed.isActive({ textAlign: a })
    );
    setCurrentAlign(align || "");

    // Resim seçiliyse border değerlerini güncelle
    if (ed.isActive("image")) {
      const { borderColor: bc, borderWidth: bw, borderStyle: bs, borderRadius: br } = ed.getAttributes("image");
      setBorderColor(bc || "#D1D5DB");
      setBorderWidth(bw || "1px");
      setBorderStyle(bs || "solid");
      setBorderRadius(br || "0px");
    } else if (ed.isActive("tableCell") || ed.isActive("tableHeader")) {
      const attrs = ed.getAttributes("tableCell") || ed.getAttributes("tableHeader");
      // Tüm kenarlıklar aynıysa genel değerleri set et, yoksa varsayılan
      const topColor = attrs.borderTopColor || "#D1D5DB";
      setBorderColor(topColor); // Basitlik için top'u al
      setBorderWidth(attrs.borderTopWidth || "1px");
      setBorderStyle(attrs.borderTopStyle || "solid");
    }
  }

  useEffect(() => {
    setMounted(true);
    return () => editor?.destroy?.();
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-[200px] border rounded bg-gray-50 flex items-center justify-center text-gray-700">
        Editör yükleniyor...
      </div>
    );
  }
  if (!editor) return null;

  /* ---------- Image Helpers ---------- */
  const setImageWithDimensions = (src, initialWidth = "", initialHeight = "") => {
    const width = window.prompt("Resim genişliği (örn: 100%, 300px)", initialWidth);
    if (width === null) return;
    const height = window.prompt("Resim yüksekliği (örn: auto, 200px)", initialHeight);
    if (height === null) return;
    editor.chain().focus().setImage({ src, width: width || null, height: height || null }).run();
  };

  const insertImageByUrl = () => {
    const url = window.prompt("Resim URL'si[](https://...)");
    if (!url) return;
    setImageWithDimensions(url, "100%", "auto");
  };

  const insertImageFromFile = (file) => {
    if (!file || !/^image\//.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      setImageWithDimensions(src, "100%", "auto");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) insertImageFromFile(f);
    e.target.value = "";
  };

  const editImageDimensions = () => {
    if (editor.isActive("image")) {
      const { src, width, height } = editor.getAttributes("image");
      setImageWithDimensions(src, width || "", height || "");
    } else alert("Lütfen boyutunu değiştirmek istediğiniz resmi seçin.");
  };

  /* ---------- Image Border Commands ---------- */
  const applyImageBorders = () => {
    if (editor.isActive("image")) {
      editor.chain().focus().updateAttributes("image", {
        borderColor,
        borderWidth,
        borderStyle,
        borderRadius,
      }).run();
    }
  };

  const clearImageBorders = () => {
    if (editor.isActive("image")) {
      editor.chain().focus().updateAttributes("image", {
        borderColor: null,
        borderWidth: null,
        borderStyle: null,
        borderRadius: null,
      }).run();
    }
  };

  /* ---------- Table Commands (border dahil) ---------- */
  const tableCommands = {
    insertTable: () =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    addRowBefore: () => editor.chain().focus().addRowBefore().run(),
    addRowAfter: () => editor.chain().focus().addRowAfter().run(),
    deleteRow: () => editor.chain().focus().deleteRow().run(),
    addColumnBefore: () => editor.chain().focus().addColumnBefore().run(),
    addColumnAfter: () => editor.chain().focus().addColumnAfter().run(),
    deleteColumn: () => editor.chain().focus().deleteColumn().run(),
    deleteTable: () => editor.chain().focus().deleteTable().run(),
    applyBordersToSelection: (side = "all") => {
      const chain = editor.chain().focus();
      const attrs = {
        color: borderColor,
        width: borderWidth,
        style: borderStyle,
      };

      if (side === "all" || side === "outer" || side === "inner") {
        // Tüm kenarlıkları uygula, outer/inner için basit simülasyon
        ["Top", "Bottom", "Left", "Right"].forEach((s) => {
          chain.setCellAttribute(`border${s}Color`, attrs.color);
          chain.setCellAttribute(`border${s}Width`, attrs.width);
          chain.setCellAttribute(`border${s}Style`, attrs.style);
        });
      } else {
        const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
        chain.setCellAttribute(`border${capitalizedSide}Color`, attrs.color);
        chain.setCellAttribute(`border${capitalizedSide}Width`, attrs.width);
        chain.setCellAttribute(`border${capitalizedSide}Style`, attrs.style);
      }
      chain.run();
    },
    clearBordersOnSelection: (side = "all") => {
      const chain = editor.chain().focus();
      if (side === "all") {
        ["Top", "Bottom", "Left", "Right"].forEach((s) => {
          chain.setCellAttribute(`border${s}Color`, null);
          chain.setCellAttribute(`border${s}Width`, null);
          chain.setCellAttribute(`border${s}Style`, null);
        });
      } else {
        const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
        chain.setCellAttribute(`border${capitalizedSide}Color`, null);
        chain.setCellAttribute(`border${capitalizedSide}Width`, null);
        chain.setCellAttribute(`border${capitalizedSide}Style`, null);
      }
      chain.run();
    },
  };

  const canAlign = editor.isActive("paragraph") || editor.isActive("heading");
  const isImageActive = editor.isActive("image");
  const isTableActive = editor.isActive("table");

  return (
    <div className="w-full border rounded-md bg-white overflow-hidden relative">
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-10 border-b bg-gray-50 p-2 flex flex-wrap items-start gap-2">
        {/* Undo/Redo */}
        <ToolbarGroup label="Geri/İleri">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Geri al"
          >
            <UndoIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="İleri al"
          >
            <RedoIcon />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Format */}
        <ToolbarGroup label="Biçim">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Kalın"
          >
            <FormatBoldIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="İtalik"
          >
            <FormatItalicIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Altı çizili"
          >
            <FormatUnderlinedIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Üstü çizili"
          >
            <StrikethroughSIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code"
          >
            <CodeIcon />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Alignment – yalnızca paragraf/başlık içinde aktif */}
        <ToolbarGroup label="Hizalama">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            disabled={!canAlign}
            title="Sola hizala"
          >
            <FormatAlignLeftIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            disabled={!canAlign}
            title="Ortala"
          >
            <FormatAlignCenterIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            disabled={!canAlign}
            title="Sağa hizala"
          >
            <FormatAlignRightIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            disabled={!canAlign}
            title="İki yana yasla"
          >
            <FormatAlignJustifyIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetTextAlign().run()}
            disabled={!canAlign}
            title="Hizalamayı temizle"
          >
            <ClearIcon />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Lists */}
        <ToolbarGroup label="Listeler">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Madde listesi"
          >
            <FormatListBulletedIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numaralı liste"
          >
            <FormatListNumberedIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            title="Todo list"
          >
            <CheckBoxIcon />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Link */}
        <ToolbarGroup label="Bağlantı">
          <ToolbarButton
            onClick={() => {
              const previous = editor.getAttributes("link").href || "";
              const url = window.prompt("Bağlantı URL'si", previous);
              if (url === null) return;
              if (url === "") editor.chain().focus().unsetLink().run();
              else
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url, target: "_blank" })
                  .run();
            }}
            active={editor.isActive("link")}
            title="Bağlantı ekle/kaldır"
          >
            <LinkIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Bağlantıyı temizle">
            <LinkOffIcon />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Image */}
        <ToolbarGroup label="Resim">
          <ToolbarButton onClick={insertImageByUrl} title="Resmi URL ile ekle">
            <InsertPhotoIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Dosyadan yükle">
            <UploadFileIcon />
          </ToolbarButton>
          <ToolbarButton onClick={editImageDimensions} disabled={!isImageActive} title="Resim boyutunu prompt ile ayarla">
            <BrushIcon />
          </ToolbarButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </ToolbarGroup>

        {/* Image Borders (seçili resim için) - Yeni */}
        <ToolbarGroup label="Resim Kenarlıkları" collapsible={true}>
          <div className="flex items-center bg-white border rounded px-2 py-1 flex-wrap">
            <BorderAllIcon className="text-gray-600 mr-1" titleAccess="Resim kenarlığı" />
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              title="Kenar rengi"
              className="w-6 h-6 p-0 border-0 bg-transparent mr-1 cursor-pointer"
              disabled={!isImageActive}
            />
            <select
              value={borderWidth}
              onChange={(e) => setBorderWidth(e.target.value)}
              className="border rounded px-1 py-0.5 text-sm mr-1"
              title="Kenar kalınlığı"
              disabled={!isImageActive}
            >
              {["0px", "1px", "2px", "3px", "4px", "5px"].map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <select
              value={borderStyle}
              onChange={(e) => setBorderStyle(e.target.value)}
              className="border rounded px-1 py-0.5 text-sm mr-1"
              title="Kenar stili"
              disabled={!isImageActive}
            >
              {["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="border rounded px-1 py-0.5 text-sm mr-1"
              title="Köşe yuvarlama"
              disabled={!isImageActive}
            >
              {["0px", "2px", "4px", "8px", "12px", "16px", "24px", "50%"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ToolbarButton onClick={applyImageBorders} title="Kenarlığı uygula" disabled={!isImageActive}>
              <BorderStyleIcon />
            </ToolbarButton>
            <ToolbarButton onClick={clearImageBorders} title="Kenarlığı temizle" disabled={!isImageActive}>
              <ClearIcon />
            </ToolbarButton>
          </div>
        </ToolbarGroup>

        {/* Table */}
        <ToolbarGroup label="Tablo Araçları" collapsible={true}>
          <ToolbarButton onClick={tableCommands.insertTable} title="Tablo ekle" disabled={!isTableActive && editor.getJSON().content?.length > 0}>
            <TableChartIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.addRowBefore} title="Üste satır ekle" disabled={!isTableActive}>
            <AddBoxIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.addRowAfter} title="Alta satır ekle" disabled={!isTableActive}>
            <AddBoxIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.deleteRow} title="Satırı sil" disabled={!isTableActive}>
            <DeleteIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.addColumnBefore} title="Sola sütun ekle" disabled={!isTableActive}>
            <AddBoxIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.addColumnAfter} title="Sağa sütun ekle" disabled={!isTableActive}>
            <AddBoxIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.deleteColumn} title="Sütunu sil" disabled={!isTableActive}>
            <DeleteIcon />
          </ToolbarButton>
          <ToolbarButton onClick={tableCommands.deleteTable} title="Tabloyu sil" disabled={!isTableActive}>
            <DeleteIcon />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Table Borders (seçili hücreler) - Excel-like */}
        <ToolbarGroup label="Tablo Kenarlıkları" collapsible={true}>
          <div className="flex items-center bg-white border rounded px-2 py-1 flex-wrap">
            <BorderAllIcon className="text-gray-600 mr-1" titleAccess="Tablo/Hücre kenarlığı" />
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              title="Kenar rengi"
              className="w-6 h-6 p-0 border-0 bg-transparent mr-1 cursor-pointer"
              disabled={!isTableActive}
            />
            <select
              value={borderWidth}
              onChange={(e) => setBorderWidth(e.target.value)}
              className="border rounded px-1 py-0.5 text-sm mr-1"
              title="Kenar kalınlığı"
              disabled={!isTableActive}
            >
              {["0px", "1px", "2px", "3px", "4px", "5px"].map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <select
              value={borderStyle}
              onChange={(e) => setBorderStyle(e.target.value)}
              className="border rounded px-1 py-0.5 text-sm mr-1"
              title="Kenar stili"
              disabled={!isTableActive}
            >
              {["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={borderSide}
              onChange={(e) => setBorderSide(e.target.value)}
              className="border rounded px-1 py-0.5 text-sm mr-1"
              title="Kenarlık tarafı"
              disabled={!isTableActive}
            >
              <option value="all">Tümü</option>
              <option value="top">Üst</option>
              <option value="bottom">Alt</option>
              <option value="left">Sol</option>
              <option value="right">Sağ</option>
              <option value="outer">Dış</option>
              <option value="inner">İç</option>
            </select>
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection(borderSide)} title="Kenarlığı uygula" disabled={!isTableActive}>
              <BorderStyleIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => tableCommands.clearBordersOnSelection(borderSide)} title="Kenarlığı temizle" disabled={!isTableActive}>
              <ClearIcon />
            </ToolbarButton>
            {/* Ek butonlar için */}
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection("top")} disabled={!isTableActive} title="Üst kenarlık">
              <BorderTopIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection("bottom")} disabled={!isTableActive} title="Alt kenarlık">
              <BorderBottomIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection("left")} disabled={!isTableActive} title="Sol kenarlık">
              <BorderLeftIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection("right")} disabled={!isTableActive} title="Sağ kenarlık">
              <BorderRightIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection("outer")} disabled={!isTableActive} title="Dış kenarlık">
              <BorderOuterIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => tableCommands.applyBordersToSelection("inner")} disabled={!isTableActive} title="İç kenarlık">
              <BorderInnerIcon />
            </ToolbarButton>
          </div>
        </ToolbarGroup>

        {/* Colors */}
        <ToolbarGroup label="Renkler">
          {/* Metin rengi */}
          <div className="flex items-center bg-white border rounded px-2 py-1 mr-2">
            <ColorLensIcon className="text-gray-600 mr-1" titleAccess="Metin rengi" />
            <input
              type="color"
              title="Metin rengi"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
            />
          </div>

          {/* Vurgu rengi (highlight) */}
          <div className="flex items-center bg-white border rounded px-2 py-1">
            <HighlightIcon className="text-gray-600 mr-1" titleAccess="Vurgu rengi" />
            <input
              type="color"
              title="Vurgu rengi"
              onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
              className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetHighlight?.().run()}
              title="Vurguyu kaldır"
            >
              <ClearIcon />
            </ToolbarButton>
          </div>
        </ToolbarGroup>

        {/* Font size & family + durum göstergeleri */}
        <ToolbarGroup label="Yazı Tipi">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={currentFontSize}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) editor.chain().focus().unsetFontSize().run();
              else editor.chain().focus().setFontSize(Number(v)).run();
            }}
            title="Yazı boyutu"
          >
            <option value="">Boyut (varsayılan)</option>
            {[...Array(45)].map((_, i) => {
              const s = i + 8;
              return (
                <option key={s} value={s}>
                  {s}px
                </option>
              );
            })}
          </select>

          <select
            className="ml-2 border rounded px-2 py-1 text-sm"
            value={currentFontFamily}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) editor.chain().focus().unsetFontFamily?.().run();
              else editor.chain().focus().setFontFamily(v).run();
            }}
            title="Yazı tipi"
          >
            <option value="">Yazı tipi (varsayılan)</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="'Courier New'">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>

          {/* Mini durum etiketi */}
          <div className="text-xs text-gray-600 ml-2 mt-1">
            {currentAlign ? `Hizalama: ${currentAlign}` : "Hizalama: varsayılan"}
            {currentFontSize ? ` • Boyut: ${currentFontSize}px` : " • Boyut: varsayılan"}
            {currentFontFamily ? ` • Tip: ${currentFontFamily}` : " • Tip: varsayılan"}
          </div>
        </ToolbarGroup>
      </div>

      {/* Editor Content + DnD */}
      <div
        className="p-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer?.files?.[0];
          if (file && /^image\//.test(file.type)) insertImageFromFile(file);
        }}
      >
        {/* Kenarlıkların görünür olması için tabloda collapse ve varsayılan border ekle */}
        <style>{`
          .ProseMirror table { border-collapse: collapse; width: 100%; }
          .ProseMirror th, .ProseMirror td { border: 1px solid #E5E7EB; } /* varsayılan görünürlük */
          .ProseMirror img { max-width: 100%; } /* Resim için ekstra stil */
        `}</style>
        <EditorContent editor={editor} />
      </div>

      {/* Word/char count and custom button */}
      <div className="text-xs text-gray-600 p-2 flex justify-between items-center">
        <button
          className="px-3 py-1 bg-gray-200 text-black rounded text-sm font-medium
                     transition transform duration-200 ease-in-out
                     hover:bg-gray-300 hover:scale-105 hover:shadow-md"
          onClick={() => alert("Kendi hür irademle yaptığım el emeği göz nuru metin editörümü güle güle kullanın. ")}
          title="Text Editor by Can Matik"
        >
          Text Editor by Can Matik
        </button>
        {editor.storage.characterCount.words()} kelime • {editor.storage.characterCount.characters()} karakter
      </div>
    </div>
  );
}