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
    recipientType: RecipientTypes;
    label: string;
    inputRef: React.useRef;
    filteredUsers: User[] | null;
    selectedUsers: string[];
    allUsers: User[];
    onChange: Function;
    onSelectUser: Function;
    handleRemoveUser: Function;
    handleAddEmail: Function;
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
