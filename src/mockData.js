export const mockData = {
  user: { name: "Guest User", plan: "Standard" },
  folders: [
    { id: 1, name: "Work" },
    { id: 2, name: "Personal" },
  ],
  files: [
    {
      id: 101,
      name: "document.pdf",
      size: "2.5 MB",
      type: "pdf",
      folderId: 1,
      content: "",
    },
    {
      id: 102,
      name: "spreadsheet.csv",
      size: "100 KB",
      type: "csv",
      folderId: 1,
      content: "",
    },
    {
      id: 103,
      name: "family_photo.jpg",
      size: "4 MB",
      type: "jpg",
      folderId: 2,
      content: "",
    },
    {
      id: 104,
      name: "root_file.txt",
      size: "12 KB",
      type: "txt",
      folderId: null,
      content: "This is a sample text file. You can edit this content!",
    },
  ],
};
