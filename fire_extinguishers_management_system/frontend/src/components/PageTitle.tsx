type PageTitleProps = {
  subtitle?: string;
  title: string;
};

const PageTitle = ({ subtitle, title }: PageTitleProps) => (
  <div className="mb-7">
    <h1 className="text-3xl font-bold text-black">{title}</h1>
    {subtitle ? <p className="mt-2 text-sm font-medium text-black/45">{subtitle}</p> : null}
  </div>
);

export default PageTitle;
