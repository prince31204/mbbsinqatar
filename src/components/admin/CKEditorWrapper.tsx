"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  Paragraph,
  Link,
  List,
  TodoList,
  ListProperties,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  TableColumnResize,
  TableCaption,
  Image,
  ImageInsert,
  ImageToolbar,
  ImageStyle,
  ImageCaption,
  ImageResize,
  ImageUpload,
  SimpleUploadAdapter,
  WordCount,
  SourceEditing,
  Undo,
  Font,
  Alignment,
  Heading,
  Indent,
  IndentBlock,
  HorizontalLine,
  RemoveFormat,
  BlockQuote,
  CodeBlock,
  FindAndReplace,
  Highlight,
  PageBreak,
  SpecialCharacters,
  SpecialCharactersEssentials,
  MediaEmbed,
  HtmlEmbed,
  ShowBlocks,
  Autoformat,
  PasteFromOffice,
  TextTransformation,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CKEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  toolbarSelector?: string;
  onEditorReady?: (editor: any) => void;
  fullScreen?: boolean;
  onWordCountUpdate?: (stats: { words: number; characters: number }) => void;
}

export default function CKEditorWrapper({
  value,
  onChange,
  placeholder,
  toolbarSelector,
  onEditorReady,
  fullScreen,
  onWordCountUpdate,
}: CKEditorWrapperProps) {
  return (
    <div
      className={`ckeditor-container z-0 relative ${fullScreen ? "ckeditor-fullscreen" : ""}`}
    >
      <style jsx global>{`
        /* Document/Word Layout Styles */
        .ckeditor-container .ck-editor {
          background-color: #FAF8F7; /* Subtle soft grey background */
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 1px 3px 0 rgb(0 0 0 / 0.1),
            0 1px 2px -1px rgb(0 0 0 / 0.1);
        }

        .ckeditor-container .ck.ck-toolbar {
          border: none;
          border-bottom: 1px solid #E5E7EB;
          background-color: #ffffff;
          padding: 6px 10px;
        }

        .ckeditor-container .ck.ck-toolbar__items {
          flex-wrap: wrap;
          gap: 2px;
        }

        /* Ribbon-style separators */
        .ck.ck-toolbar .ck-toolbar__separator {
          background: #E5E7EB;
          margin: 4px 6px;
          width: 1px;
        }

        /* Creates an A4 paper effect for the editor canvas */
        .ck-editor__editable_inline {
          min-height: 500px;
          background-color: white !important;
          margin: 24px auto !important;
          max-width: 850px; /* roughly A4 width */
          box-shadow:
            0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1),
            0 0 1px rgba(0, 0, 0, 0.1);
          border: 1px solid #E5E7EB !important;
          padding: 50px 70px !important; /* Professional margins */
          border-radius: 2px;
          transition: box-shadow 0.2s ease-in-out;
          font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif !important;
          line-height: 1.6;
        }

        .ck-editor__editable_inline:focus {
          box-shadow:
            0 20px 25px -5px rgb(0 0 0 / 0.1),
            0 8px 10px -6px rgb(0 0 0 / 0.1),
            0 0 0 2px rgba(59, 130, 246, 0.1);
          outline: none !important;
        }

        /* Ruler visualization */
        .ck-editor__main {
          position: relative;
        }

        .ck-editor__main::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            #E5E7EB 10%,
            #E5E7EB 90%,
            transparent
          );
          z-index: 10;
        }

        /* Full screen adjustments */
        .ckeditor-fullscreen .ck-editor {
          height: calc(100vh - 50px);
        }

        .ckeditor-fullscreen .ck-editor__main {
          flex-grow: 1;
          overflow-y: auto;
          background-color: #FAF8F7;
        }

        .ckeditor-fullscreen .ck-editor__editable_inline {
          min-height: 100%;
        }

        .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
          outline: none;
          box-shadow:
            0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          border-color: #E5E7EB !important;
        }

        /* Ensure lists are indented and visible in the editor */
        .ck-content ul,
        .ck-content ol {
          padding-left: 2.5rem !important;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .ck-content li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .ck-content ul ul,
        .ck-content ol ol,
        .ck-content ul ol,
        .ck-content ol ul {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        /* Make long dropdowns (like Font Size) scrollable */
        .ck.ck-dropdown__panel {
          max-height: 300px !important;
          overflow-y: auto !important;
        }

        .ck.ck-list {
          display: flex;
          flex-direction: column;
        }

        /* Ensure dropdown labels (like in the font size list) are consistent in size */
        .ck.ck-list__item .ck-button .ck-button__label {
          font-size: 13px !important;
          line-height: 1.2 !important;
        }

        /* Heading styles for the editor content area */
        .ck-content h1 {
          font-size: 2.5em !important;
          font-weight: 800 !important;
          margin-bottom: 0.9em;
          color: #1F2937;
        }
        .ck-content h2 {
          font-size: 1.8em !important;
          font-weight: 700 !important;
          margin-top: 1.8em;
          margin-bottom: 0.8em;
          color: #1F2937;
        }
        .ck-content h3 {
          font-size: 1.5em !important;
          font-weight: 700 !important;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
          color: #1F2937;
        }
        .ck-content h4 {
          font-size: 1.25em !important;
          font-weight: 600 !important;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #1F2937;
        }
        .ck-content h5 {
          font-size: 1.1em !important;
          font-weight: 600 !important;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #4B5563;
        }
        .ck-content h6 {
          font-size: 1em !important;
          font-weight: 600 !important;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #4B5563;
        }

        .ck-content p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }

        /* Link styles for the editor content area */
        .ck-content a,
        .ck-editor__editable_inline a {
          color: #5B0F26 !important;
          text-decoration: underline !important;
          text-underline-offset: 2px;
          font-weight: 500;
        }

        .ck-content a:hover,
        .ck-editor__editable_inline a:hover {
          color: #5B0F26 !important;
        }
      `}</style>

      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        onReady={(editor) => {
          if (onEditorReady) {
            onEditorReady(editor);
          }
        }}
        config={{
          licenseKey: "GPL",
          placeholder: placeholder || "Start typing...",
          plugins: [
            Essentials,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            Paragraph,
            Link,
            List,
            TodoList,
            ListProperties,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            TableColumnResize,
            TableCaption,
            Image,
            ImageInsert,
            ImageToolbar,
            ImageStyle,
            ImageCaption,
            ImageResize,
            ImageUpload,
            SimpleUploadAdapter,
            WordCount,
            SourceEditing,
            Undo,
            Font,
            Alignment,
            Heading,
            Indent,
            IndentBlock,
            HorizontalLine,
            RemoveFormat,
            BlockQuote,
            CodeBlock,
            FindAndReplace,
            Highlight,
            PageBreak,
            SpecialCharacters,
            SpecialCharactersEssentials,
            MediaEmbed,
            HtmlEmbed,
            ShowBlocks,
            Autoformat,
            PasteFromOffice,
            TextTransformation,
          ],
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "findAndReplace",
              "sourceEditing",
              "showBlocks",
              "|",
              "heading",
              "fontFamily",
              "fontSize",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "subscript",
              "superscript",
              "|",
              "highlight",
              "fontColor",
              "fontBackgroundColor",
              "removeFormat",
              "|",
              "-", // Forces the line break for two rows
              "alignment",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "|",
              "outdent",
              "indent",
              "|",
              "link",
              "insertImage",
              "mediaEmbed",
              "htmlEmbed",
              "insertTable",
              "blockQuote",
              "codeBlock",
              "|",
              "horizontalLine",
              "pageBreak",
              "specialCharacters",
            ],
            shouldNotGroupWhenFull: true,
          },
          simpleUpload: {
            uploadUrl: "/api/upload?folder=editor",
            withCredentials: true,
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
          wordCount: {
            onUpdate: (stats: any) => {
              if (onWordCountUpdate) {
                onWordCountUpdate({
                  words: stats.words,
                  characters: stats.characters,
                });
              }
            },
          },
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
          link: {
            decorators: {
              addTargetToExternalLinks: {
                mode: "automatic",
                callback: (url: string | null) =>
                  !!url && /^(https?:)?\/\//.test(url),
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
              openInNewTab: {
                mode: "manual",
                label: "Open in a new tab",
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
            },
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
            ],
          },
          fontSize: {
            options: [
              2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34,
              36, 38, 40, 42, 44, 46, 48, 50,
            ],
            supportAllValues: true,
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
              "toggleTableCaption",
            ],
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
