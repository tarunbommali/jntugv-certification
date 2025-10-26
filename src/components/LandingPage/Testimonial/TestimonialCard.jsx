const TestimonialCard = ({ item, idx }) => {
  return (
    <li
      className="relative w-[380px] border border-[#cdcdcd] max-w-full shrink-0 rounded-3xl  px-6 py-6 shadow-lg transition-all duration-300 hover:scale-105  group "
      key={`${item.name}-${idx}`}
    >
      {/* Card Content */}
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mt-auto  ">
          {/* Image */}
          <div className="relative">
            <div className="relative z-10 w-12 h-12">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full rounded-full object-cover shadow-md"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/30 rounded-xl opacity-20" />
            </div>
          </div>

          {/* Details */}
          <div className="flex justify-between items-center min-w-0">
            <div>
              <h4 className="text-sm font-bold text-foreground truncate">
                {item.name}
              </h4>
              <p className="text-primary font-medium text-xs truncate">
                {item.title}
              </p>
            </div>
          </div>
        </div>
        {/* Quote Content */}
        <blockquote className="text-base font-semibold leading-relaxed mb-4 py-4 flex-1 select-none cursor-default">
          "{item.quote}"
        </blockquote>
        <a target="_blank" rel="noopener noreferrer" href={item.source}>
          <item.sourceIcon className="absolute top-4 right-4 h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-300" />
        </a>
      </div>
    </li>
  );
};

export default TestimonialCard;
