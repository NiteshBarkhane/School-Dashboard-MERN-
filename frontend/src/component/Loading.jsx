import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#00000059] fixed inset-0 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white shadow-inner border-solid absolute inset-0 m-auto"></div>
    </div>
  );
};

export default Loading