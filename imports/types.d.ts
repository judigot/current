import React from "react";

export {};

declare global {
  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
        lat: string;
        lng: string;
      };
    };
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
  }
  interface Recipient {
    id: string;
    label: string;
    inputRef: React.useRef;
    filteredUsers: User[] | null;
    selectedUsers: number[];
    allUsers: User[];
    onChange: Function;
    onSelectUser: Function;
    handleRemoveUser: Function;
    actions: React.JSX;
  }

  interface UserRanks {
    rank: number;
    user: User;
  }

  enum RecipientTypes {
    to = "to",
    cc = "cc",
    bcc = "bcc",
  }
}
