"use client";

import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/photos/search?searchTerm=${encodeURIComponent(term)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "") {
      handleSearch("");
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-3.5 size-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search photos"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-12 w-[200px] rounded-full border-none bg-sidebar/90 pl-10 outline-none ring-0 placeholder:text-lg focus:bg-white focus:shadow-lg focus-visible:ring-1 md:w-[400px] lg:w-[500px]"
      />
    </div>
  );
}
