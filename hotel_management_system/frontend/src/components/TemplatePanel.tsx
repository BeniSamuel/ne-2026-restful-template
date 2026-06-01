import type { ReactNode } from "react";

type TemplatePanelProps = {
  children?: ReactNode;
  title: string;
};

const TemplatePanel = ({ children, title }: TemplatePanelProps) => (
  <section className="max-w-3xl rounded-[40px] bg-[#f8f7f6] p-8">
    <h2 className="text-2xl font-bold text-black">{title}</h2>
    <p className="mt-4 max-w-xl text-base font-medium text-black/45">
      Replace this content with the entity fields from your exam scenario.
    </p>
    {children}
  </section>
);

export default TemplatePanel;
 