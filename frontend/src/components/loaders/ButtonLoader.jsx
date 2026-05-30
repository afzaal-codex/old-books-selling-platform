import React from "react";

const ButtonLoader = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-0.5">
      <div className="flex items-center justify-center gap-1.5 h-3">
        <span className="w-2 h-2 rounded-full bg-current opacity-80 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.8s" }} />
        <span className="w-2 h-2 rounded-full bg-current opacity-80 animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.8s" }} />
        <span className="w-2 h-2 rounded-full bg-current opacity-80 animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.8s" }} />
      </div>
      {label && <span className="ml-1 text-xs font-bold uppercase tracking-wider">{label}</span>}
    </div>
  );
};

export default ButtonLoader;
