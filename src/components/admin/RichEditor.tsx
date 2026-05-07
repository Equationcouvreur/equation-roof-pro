import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const RichEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-4 max-w-full" } }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const t = toast.loading("Téléversement…");
      try {
        const url = await uploadImage(file, "articles");
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image insérée", { id: t });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        toast.error(msg, { id: t });
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("URL :");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const Btn = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <Button type="button" variant={active ? "default" : "ghost"} size="sm" onClick={onClick} title={title} className="h-8 w-8 p-0">
      {children}
    </Button>
  );

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre">
          <Heading2 className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Sous-titre">
          <Heading3 className="w-4 h-4" />
        </Btn>
        <div className="w-px h-6 bg-border mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras">
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique">
          <Italic className="w-4 h-4" />
        </Btn>
        <div className="w-px h-6 bg-border mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces">
          <List className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée">
          <ListOrdered className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citation">
          <Quote className="w-4 h-4" />
        </Btn>
        <div className="w-px h-6 bg-border mx-1" />
        <Btn onClick={addLink} active={editor.isActive("link")} title="Lien">
          <LinkIcon className="w-4 h-4" />
        </Btn>
        <Btn onClick={addImage} title="Image">
          <ImageIcon className="w-4 h-4" />
        </Btn>
        <div className="w-px h-6 bg-border mx-1" />
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Annuler">
          <Undo className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Rétablir">
          <Redo className="w-4 h-4" />
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichEditor;
