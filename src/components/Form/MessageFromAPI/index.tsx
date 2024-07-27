import React from "react";

const MessageFromAPI = ({ message }: any) => {
  return (
    <>
      {message && (
        <div className="overlay absolute px-2 py-1 rounded top-1/2 left-1/2 translate-y-1/2 -translate-x-1/2 bg-black bg-opacity-50">
          <small className="text-white">{message}</small>
        </div>
      )}
    </>
  );
};

export default MessageFromAPI;
