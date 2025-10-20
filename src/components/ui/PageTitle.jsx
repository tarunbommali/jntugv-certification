const PageTitle = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};

export default PageTitle;
