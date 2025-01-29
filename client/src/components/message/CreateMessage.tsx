import { useMutation } from "@tanstack/react-query";
import { IoMdSend } from "react-icons/io";
import { createMessage } from "../../api";
import React, { useState } from "react";
import LoadSpinner from "../loaders/LoadSpinner";

const CreateMessage = ({ userId }: { userId: string }) => {
  const [content, setContent] = useState("");

  const createMessageMutation = useMutation({
    mutationKey: ["messages/create"],
    mutationFn: createMessage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    createMessageMutation.mutate({ content, receiverId: userId });

    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2">
      <input
        className="bg-gray-200 rounded-lg w-full outline-none py-2 px-4 dark:bg-gray-700 dark:text-gray-300 dark:placeholder:text-gray-300"
        placeholder="Mesaj göndər..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button disabled={!content} className="text-sky-400">
        {createMessageMutation.isPending ? (
          <LoadSpinner />
        ) : (
          <IoMdSend size={24} />
        )}
      </button>
    </form>
  );
};

export default CreateMessage;
