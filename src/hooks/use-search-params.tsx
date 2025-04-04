import { parseAsString, createLoader } from "nuqs/server";

export const pageSearchParams = {
  searchTerm: parseAsString.withDefault(""),
};

export const loadPageSearchParams = createLoader(pageSearchParams);
